

const axios = require('axios');
const moment = require('moment');
const {dataTypes} = require('../../enum/data-types.js');

module.exports = {

  friendlyName: 'Summary pdf',

  description: '',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id}, exits) {
    let isOrgIssue = false;

    if (this.req.session.orgId) {
      const orgUser = await OrgUser.findOne({
        user: this.req.session.userId,
        org: this.req.session.orgId,
        role: [1, 2]
      }).select(['id']);
      const issue = await Issue.findOne({
        id,
        org: this.req.session.orgId
      }).select(['id']);
      isOrgIssue = !!orgUser && !!issue;
    }

    const issueUser = await IssueUser
      .findOne({
        issue: id,
        user: this.req.session.userId
      })
      .select(['id', 'party']);
    canView = !!issueUser || isOrgIssue;

    if (!canView) return exits.notFound();

    const template = await sails.renderView(
      'pdfTemplates/issueSummary/html',
      {
        layout: '../layout',

        moment,

        issue: await Issue.findOne(id),

        responder: await IssueParty
          .findOne({issue: id, type: 'responder'})
          .select(['name']),
        participant: await IssueParty
          .findOne({issue: id, type: 'participant'})
          .select(['name']),
        issueSector: await IssueData
          .findOne({issue: id, type: dataTypes.issueSector})
          .select(['value']),
        issueCategory: await IssueData
          .findOne({issue: id, type: dataTypes.issueCategory})
          .select(['value']),
        subCategories: await IssueData
          .findOne({issue: id, type: dataTypes.issueSubCategory})
          .select(['value']),
        whatHappened: await IssueData
          .findOne({issue: id, type: dataTypes.whatHappened})
          .select(['value']),
        expectations: await IssueData
          .findOne({issue: id, type: dataTypes.expectations})
          .select(['value']),

        systemicProblems: await IssueData
          .findOne({
            issue: id,
            type: dataTypes.systemicProblems,
            party: issueUser.party
          })
          .select(['value']),
        underlyingCauses: await IssueData
          .findOne({
            issue: id,
            type: dataTypes.underlyingCauses,
            party: issueUser.party
          })
          .select(['value']),
        improvementRecom: await IssueData
          .findOne({
            issue: id,
            type: dataTypes.improvementRecom,
            party: issueUser.party
          })
          .select(['value']),
        resolutionCost: await IssueData
          .findOne({
            issue: id,
            type: dataTypes.resolutionCost,
            party: issueUser.party
          })
          .select(['value']),

        agreementItems: (
          await IssueData
            .find({
              issue: id,
              type: dataTypes.agreementItem
            })
            .select(['value'])
            .populate('statuses')
        ).filter(
          issueData => issueData.statuses
            .map(status => status.value)
            .every(value => value === 'accepted')
        ) || [],
        parties: await IssueParty
          .find({
            issue: id
          })
          .select(['id', 'name']) || [],
        resolutionConfirmed: await IssueData
          .find({issue: id, type: dataTypes.resolutionConfirmed})
          .populate('party')
          .select(['party', 'value', 'createdAt']) || []
      }
    );

    const url = await sails.helpers.htmlToPdf(
      template,
      `Issue_${id}_${Date.now()}`
    );

    const pdf = await axios({
      url,
      method: 'get',
      responseType: 'stream'
    });

    this.res.set('Content-Type', 'application/pdf');

    pdf.data.pipe(this.res);
  }

};
