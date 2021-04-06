

module.exports = {

  friendlyName: 'Subscribe to issue',

  description: 'Subscribe user to updates from issue.',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id}) {
    const issueUser = await IssueUser.findOne({
      issue: id,
      user: this.req.session.userId
    }).select(['id', 'party']);
    if (!issueUser) throw 'notFound';

    await Issue.subscribe(this.req, [id]);

    return;
  }

};
