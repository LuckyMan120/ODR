

module.exports = {

  friendlyName: 'Party',

  description: 'Party issue.',

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
    }).select(['party']);
    if (!issueUser) throw 'notFound';
    return await IssueParty.findOne(issueUser.party);
  }

};
