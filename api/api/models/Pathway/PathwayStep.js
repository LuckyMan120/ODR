/**
 * PathwayStep.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const {dataTypes} = require('../../enum/data-types.js');

const getDatumValue = (data, typeName, partyId = 0) => {
  const datum = _.find(data, (d) => {
    if (partyId > 0) {
      return d.type.name === typeName && d.party === partyId;
    } else {
      return d.type.name === typeName;
    }
  });

  if (datum) {
    return datum.value;
  } else {
    return false;
  }

};

const getAllPartiesAgreed = (data, typeName, numOfParties) => {
  const items = _.filter(data, (d) => {
    return (d.type.name === typeName && d.value === '1');
  });
  return items && (items.length === numOfParties);
};

const getPartyDataOfType = (data, typeName, partyId = 0) => {
  const items = _.filter(data, (d) => {
    if (partyId > 0) {
      return d.type.name === typeName && d.value && d.party === partyId;
    } else {
      return d.type.name === typeName && d.value;
    }

  });
  return items;
};

const getPartyDataOfTypeCount = (data, typeName, partyId = 0) => {
  const items = getPartyDataOfType(data, typeName, partyId);
  if (items) {
    return items.length;
  } else {
    return 0;
  }
};

// const stepCompletedByParty = async (issueId, stepId, party) => {
//   return await IssuePartyStep.find({
//     step: stepId,
//     party: party.id,
//     issue: issueId
//   });
// };

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝
    name: {type: 'string', required: true},
    linkTo: {type: 'string'},
    sortOrder: {type: 'number', defaultsTo: 0},
    options: {type: 'json'},
    component: {type: 'string'},

    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝
    pathway: {model: 'pathway', required: true},
    parent: {model: 'pathwayStep'}

    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

  customToJSON() {
    const {
      createdAt,
      updatedAt,
      ...data
    } = this;
    sails.log.silly('Sanitizing', {
      createdAt,
      updatedAt
    });
    return data;
  },

  async beforeCreate(pathwayStep, next) {
    if (!pathwayStep.sortOrder) {
      const where = {
        pathway: pathwayStep.pathway,
        parent: null
      };
      if (pathwayStep.parent) where.parent = pathwayStep.parent;
      const pathwaySteps = await PathwayStep
        .find(where)
        .sort('sortOrder DESC')
        .select('sortOrder');
      if (pathwaySteps.length) {
        pathwayStep.sortOrder = pathwaySteps[0].sortOrder + 1;
      } else {
        pathwayStep.sortOrder = 1;
      }
    }

    next();
  },

  async checkStepConditions(
    pathwayStep,
    issue,
    issueData,
    party,
    totalParties,
    tx
  ) {

    let stepWasAlreadyCompleted = false;

    const set = {
      enabled: false,
      show: false,
      completed: false
    };

    const issuePartyStep = await IssuePartyStep
      .findOne({
        step: pathwayStep.id,
        party: party.id,
        issue: issue.Id
      })
      .usingConnection(tx);

    if (issuePartyStep && issuePartyStep.completed) {
      stepWasAlreadyCompleted = true;
    }

    const disputeType = issue.type;
    const allAgreedToMediate = getAllPartiesAgreed(
      issueData, 'agreedToMediate', totalParties
    );

    const showComplaintSteps = disputeType === 'complaint';
    let showMediationSteps = disputeType === 'mediation';
    if (disputeType === 'complaint' && allAgreedToMediate) {
      showMediationSteps = true;
    }

    if (showMediationSteps || showComplaintSteps) {

      switch (pathwayStep.name) {
        case 'info': {
          const resolutionConfirmed = issueData.filter(
            issueData => issueData.type.id === dataTypes.resolutionConfirmed
          );
          set.enabled = resolutionConfirmed.length < totalParties;
          set.show = (
            showComplaintSteps && party.type === 'participant'
          );
          set.completed = (
            getPartyDataOfType(issueData, 'issueCategory') &&
            getPartyDataOfTypeCount(issueData, 'issueSubCategory') > 0 &&
            getPartyDataOfTypeCount(issueData, 'whatHappened') > 0 &&
            getPartyDataOfTypeCount(issueData, 'expectations') > 0 &&
            issue.submittedAt > 0
          );
          break;
        }

        case 'complaintDetailsResponder': {
          const resolutionConfirmed = issueData.filter(
            issueData => issueData.type.id === dataTypes.resolutionConfirmed
          );
          set.enabled = resolutionConfirmed.length < totalParties;
          set.show = (
            showComplaintSteps && party.type === 'responder'
          );
          set.completed = (
            getDatumValue(issueData, 'issueCategory') &&
            getPartyDataOfTypeCount(issueData, 'issueSubCategory') > 0 &&
            getPartyDataOfTypeCount(issueData, 'whatHappened') > 0 &&
            getPartyDataOfTypeCount(issueData, 'expectations') > 0
          );
          break;
        }

        case 'conversation': {
          const resolutionConfirmed = issueData.filter(
            issueData => issueData.type.id === dataTypes.resolutionConfirmed
          );
          set.enabled = (
            issue.submittedAt > 0 &&
            resolutionConfirmed.length < totalParties
          );

          set.show = true;
          set.completed = issueData.some(item =>
            item.statuses.length && item.statuses.every(
              status => status.value === 'accepted'
            )
          );
          break;
        }

        // this should show IF conversation started
        case 'resolution': {
          set.enabled = issueData.some(item =>
            item.statuses.length && item.statuses.every(
              status => status.value === 'accepted'
            )
          );
          set.show = showComplaintSteps;
          set.completed = (
            getDatumValue(issueData, 'resolution') &&
            getAllPartiesAgreed(
              issueData,
              'resolutionConfirmed',
              totalParties
            )
          );
          break;
        }
        case 'mediationIntro': {
          set.show = showMediationSteps;
          // current party agreed to mediate
          // or it is a mediation
          break;
        }
        case 'mediationOverview': {
          set.show = showMediationSteps;
          // current party agreed to mediate
          break;
        }
        case 'groundRules': {
          set.show = showMediationSteps;
          break;
        }
        case 'tell': {
          set.show = showMediationSteps;
          break;
        }
        case 'issues': {
          set.show = showMediationSteps;
          break;
        }
        case 'interests': {
          set.show = showMediationSteps;
          break;
        }
        case 'perspective': {
          set.show = showMediationSteps;
          break;
        }
        case 'alternatives': {
          set.show = showMediationSteps;
          break;
        }
        case 'share': {
          set.show = showMediationSteps;
          break;
        }
        case 'listen': {
          set.show = showMediationSteps;
          break;
        }
        case 'othersInfo': {
          set.show = showMediationSteps;
          break;
        }
        case 'communicate': {
          set.show = showMediationSteps;
          break;
        }
        case 'options': {
          set.show = showMediationSteps;
          break;
        }
        case 'decide': {
          set.show = showMediationSteps;
          break;
        }
        case 'download': {
          set.show = showMediationSteps;
          break;
        }
        case 'mediatorSummary': {
          set.show = showMediationSteps;
          break;
        }
        case 'mediatorNegotiate': {
          set.show = showMediationSteps;
          break;
        }
        case 'mediatorDownload': {
          set.show = showMediationSteps;
          break;
        }
      }
    }

    if (!stepWasAlreadyCompleted && set.completed) {
      set.completedAt = new Date().getTime();
    }

    if (!issuePartyStep) {
      await IssuePartyStep
        .create({
          ...set,
          issue: issue.id,
          stepName: pathwayStep.name,
          party: party.id,
          step: pathwayStep.id,
          startedAt: new Date().getTime()
        })
        .usingConnection(tx);
    } else {
      await IssuePartyStep
        .updateOne(issuePartyStep.id)
        .set(set)
        .usingConnection(tx);
    }
  }
};
