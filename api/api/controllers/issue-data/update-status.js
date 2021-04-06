

module.exports = {

  friendlyName: 'Update status',

  description: '',

  inputs: {
    id: {type: 'number', required: true},
    value: {
      type: 'string',
      isIn: [
        'none',
        'maybe',
        'accepted',
        'rejected'
      ],
      required: true
    }
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id, value}) {
    const issueData = await IssueData
      .findOne(id)
      .select(['issue']);

    const issueUser = await IssueUser
      .findOne({
        user: this.req.session.userId,
        issue: issueData.issue
      })
      .select(['party']);
    if (!issueUser) throw 'notFound';

    const data = {
      issueData: issueData.id,
      party: issueUser.party
    };
    const issueDataStatus = await IssueDataStatus
      .findOrCreate(data, data);

    const updatedIssueDataStatus = await IssueDataStatus.updateOne({
      id: issueDataStatus.id
    }).set({value});

    await Issue.updatePartiesState(issueData.issue,
      null, this.req.session.userId);

    return updatedIssueDataStatus;
  }

};
