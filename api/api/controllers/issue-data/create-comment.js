module.exports = {

  friendlyName: 'Create comment',

  description: '',

  inputs: {
    id: {type: 'number', required: true},
    text: {type: 'string', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id, text}) {
    const issueData = await IssueData
      .findOne(id)
      .select(['issue']);
    const issueUser = await IssueUser
      .findOne({
        user: this.req.session.userId,
        issue: issueData.issue
      });
    if (!issueUser) throw 'notFound';
    const comment = await IssueDataComment.create({
      text,
      issueData: id,
      party: issueUser.party,
      user: this.req.session.userId
    }).fetch();
    await Issue.updatePartiesState(issueData.issue,
      null, this.req.session.userId);
    return comment;
  }

};
