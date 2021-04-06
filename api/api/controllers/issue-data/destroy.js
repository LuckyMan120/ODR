

module.exports = {

  friendlyName: 'Destroy',

  description: 'Destroy issue data.',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id}) {
    const where = {id, user: this.req.session.userId};
    const issueData = await IssueData.findOne(where).select(['issue']);
    if (!issueData) throw 'notFound';
    await Issue.updatePartiesState(issueData.issue,
      null, this.req.session.userId);
    return await IssueData.destroy(id);
  }

};
