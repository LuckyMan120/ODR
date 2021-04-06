/**
 * Issue/Issue.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const {dataTypes} = require('../../enum/data-types.js');

async function processTx(tx, callback) {
  if (tx) return await callback(tx);
  await sails
    .getDatastore()
    .transaction(async tx => await callback(tx));
}

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {type: 'string', required: true},

    resolvedAt: {type: 'number'},
    agreedAt: {type: 'number'},
    closedAt: {type: 'number'},
    submittedAt: {type: 'number'},
    responderEngagedAt: {type: 'number'},

    status: {
      type: 'string',
      isIn: [
        'created',
        'submitted',
        'engaged',
        'closedAgreement',
        'closedWithdrawn',
        'closedEscalatedMediation',
        'closedEscalatedOmbudsman',
        'closedOldAge'
      ],
      defaultsTo: 'created'
    },

    note: {type: 'string'},

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    pathway: {model: 'pathway'},
    org: {model: 'org'},
    type: {
      type: 'string',
      required: true,
      isIn: ['complaint', 'mediation']
    },

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    users: {collection: 'user', via: 'issue', through: 'issueUser'},
    data: {
      collection: 'issueData',
      via: 'issue'
    }

  },

  async updatePartiesState(issueId, tx, userId) {
    let issue;
    let submittedIssueData = null;

    await processTx(tx, async tx => {
      issue = await Issue
        .findOne(issueId)
        .usingConnection(tx);
      if (!issue) throw 'notFound';

      const issueParties = await IssueParty
        .find({
          issue: issueId
        })
        .usingConnection(tx);

      // intentionally doing this to get type name
      const issueData = await IssueData
        .find({
          issue: issueId
        })
        .populate('type')
        .populate('statuses')
        .usingConnection(tx);

      const set = {};

      // handle actions on specific dataTypes
      if (issue.type === 'complaint') {

        if (!issue.submittedAt) {
          const expectations = issueData.find(
            issueData => issueData.type.id === dataTypes.expectations
          );
          if (expectations) {
            set.submittedAt = expectations.createdAt;
            set.status = 'submitted';
            submittedIssueData = expectations;
          }
        }

        // @todo check if we still need those two below
        if (!issue.resolvedAt) {
          const resolution = issueData.find(
            issueData => issueData.type.id === dataTypes.resolution
          );
          if (resolution) set.resolvedAt = resolution.createdAt;
        }

        if (!issue.responderEngagedAt) {
          const responderParty = await IssueParty
            .findOne({
              issue: issueId,
              type: 'responder'
            })
            .usingConnection(tx);

          if (responderParty) {
            const responderIssueData = issueData.filter(
              issueData => issueData.party === responderParty.id
            ) || [];
            const responderIssueDataComments = await IssueDataComment.find({
              party: responderParty.id,
              issueData: issueData.map(issueData => issueData.id)
            });

            if (
              responderIssueData.length ||
              responderIssueDataComments.length
            ) {
              set.responderEngagedAt = new Date().getTime();
              set.status = 'engaged';
            }

          }

        }

        if (!issue.agreedAt) {
          const clientAgreed = issueData.find(
            issueData => issueData.type.id === dataTypes.resolutionConfirmed
          );
          if (clientAgreed) {
            set.closedAt = clientAgreed.createdAt;
            set.agreedAt = clientAgreed.createdAt;
            set.status = 'closedAgreement';
          }
        }

      }

      issue = await Issue
        .updateOne(issueId)
        .set(set)
        .usingConnection(tx);

      // top level steps
      const steps = await PathwayStep
        .find({pathway: issue.pathway})
        .usingConnection(tx);
      for (const step of steps) {
        for (const party of issueParties) {
          await PathwayStep.checkStepConditions(
            step,
            issue,
            issueData,
            party,
            issueParties.length,
            tx
          );
        }
      }

    });

    // this is here because we want transaction to be
    // committed before sending notifications
    // if transaction fails notification will be already
    // sent
    if (issue && submittedIssueData) {
      const org = await Org.findOne(issue.org);

      const orgUsers = await OrgUser
        .find({org: org.id, role: 1})
        .populate('user');

      const user = await User
        .findOne(submittedIssueData.user)
        .select(['id', 'firstName', 'lastName']);

      for (const orgUser of orgUsers) {
        if (orgUser.id !== user.id) {
          await Notification
            .create({
              text: sails.__(
                '%s submitted an issue',
                `${user.firstName} ${user.lastName}`
              ),
              user: orgUser.user.id
            })
            .fetch();

          await sails.helpers.email.send(
            'createComplaint',
            {
              clientURL: sails.config.custom.clientURL,
              userName: orgUser.company ||
                `${orgUser.firstName} ${orgUser.lastName}`,
              orgName: org.name,
              issueId: issue.id
            },
            {
              to: orgUser.user.email,
              subject: sails.__('A new complaint was submitted')
            }
          );
        }
      }

      await Org.publish([issue.org], {
        verb: 'added',
        model: 'issue',
        data: issue
      });
    }

    if (issue && userId) {
      await Issue.publish([issue.id], {
        verb: 'updated',
        id: issue.id,
        data: issue,
        userId
      });
    }

  }

};
