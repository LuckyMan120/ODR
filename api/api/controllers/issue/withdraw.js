

const statuses = [
  'closedWithdrawn',
  'closedEscalatedMediation',
  'closedEscalatedOmbudsman'
];

module.exports = {

  friendlyName: 'Withdraw',

  description: 'Withdraw issue.',

  inputs: {
    id: {type: 'number', required: true},
    status: {
      type: 'string',
      isIn: statuses,
      defaultsTo: 'closedWithdrawn'
    },
    note: {type: 'string', defaultsTo: ''}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    },
    badRequest: {
      responseType: 'badRequest'
    }
  },

  fn: async function({id, status, note}) {
    const issueUser = await IssueUser.findOne({
      user: this.req.session.userId,
      issue: id
    }).select(['id']);
    if (!issueUser) throw 'notFound';

    const issue = await Issue.findOne({
      id,
      status: statuses
    });
    if (issue) throw {badRequest: {
      message: sails.__('This issue was withdrawn/escalated already')
    }};

    return await Issue.updateOne(id).set({
      closedAt: new Date().getTime(),
      status,
      note
    });
  }

};
