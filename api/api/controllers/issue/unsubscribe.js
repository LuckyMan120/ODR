

module.exports = {

  friendlyName: 'Unsubscribe from signed-in user',

  description: 'Unsubscribe user from updates.',

  fn: async function() {
    await User
      .unsubscribe(this.req, [this.req.session.userId]);
    return;
  }

};

module.exports = {

  friendlyName: 'Unsubscribe from issue',

  description: 'Unsubscribe user from issue.',

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

    await Issue.unsubscribe(this.req, [id]);

    return;
  }

};
