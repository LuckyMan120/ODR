module.exports = {

  friendlyName: 'Create revision',

  description: '',

  inputs: {
    id: {type: 'number', required: true},
    value: {type: 'string', required: true}
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
      });
    if (!issueUser) throw 'notFound';

    const revision = await IssueDataRevision.create({
      value,
      issueData: id,
      party: issueUser.party,
      user: this.req.session.userId
    }).fetch();

    await IssueDataStatus
      .update({issueData: id})
      .set({
        value: 'none'
      });

    await Issue.updatePartiesState(issueData.issue,
      null, this.req.session.userId);

    return revision;
  }

};
