// api/helpers/case/create-case-activity.js

module.exports = {

  friendlyName: 'Create a CaseActivity record',

  description: '`Calculate relevant message and save',

  inputs: {

    caseId: {
      type: 'number',
      description: 'Case ID',
      required: true
    },
    activityType: {
      type: 'number',
      description: 'Activity Type ID',
      required: true
    },
    dataType: {
      type: 'number',
      description: 'CaseData Type ID (for descriptions)'
    },
    shared: {
      type: 'boolean',
      description: 'Shared',
      defaultsTo: false
    },
    dataBefore: {
      type: 'ref',
      defaultsTo: '{}'
    },
    dataAfter: {
      type: 'ref',
      defaultsTo: '{}'
    }

  },

  fn: async function(inputs) {

    const caseUser = await CaseUser.findOne({
      user: this.req.session.userId,
      case: inputs.caseId
    }).populate('user');

    //@todo throw forbidden if no caseUser

    let message; let shared;

    // handle when this is triggered by caseData change
    if (inputs.activityType === 1) {
      // get the desc from the relevant caseDataType
      const dataType = await DataType.findOne(inputs.dataType);
      message = dataType.activityDesc;
      shared = dataType.shared;
    } else {
      // get the message from the activityType
      const caseActivityType = await CaseActivityType.findOne(
        inputs.activityType
      );
      message = caseActivityType.desc;
      shared = inputs.shared;
    }

    const activity = {
      user: this.req.session.userId,
      caseActivityType,
      case: inputs.caseId,
      dataBefore: inputs.dataBefore,
      dataAfter: inputs.dataAfter,
      shared,
      message,
      caseUser: caseUser.id,
      caseParty: caseUser.caseParty,
      userName: caseUser.user.firstName + ' ' + caseUser.user.lastName
    };

    return CaseActivity.create(activity);

  }
};

