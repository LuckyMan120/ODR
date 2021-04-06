module.exports = {

  friendlyName: 'Count comments',

  description: '',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id}) {
    const issueData = await IssueData
      .findOne(id)
      .select(['issue']);
    const issueUser = await IssueUser
      .findOne({
        user: this.req.session.userId,
        issue: issueData.issue
      });
    if (!issueUser) throw 'notFound';
    return {
      count: await IssueDataComment.count({
        issueData: id
      })
    };
  }

};
