

module.exports = {

  friendlyName: 'Join',

  description: 'Join issue.',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    },
    forbidden: {
      responseType: 'forbidden'
    }
  },

  fn: async function({id}) {
    const issue = await Issue.findOne(id).select(['org']);
    if (!issue) throw 'notFound';

    const orgUser = await OrgUser.findOne({
      org: issue.org,
      user: this.req.session.userId,
      role: [1, 2]
    });
    if (!orgUser) throw 'forbidden';

    const issueParty = await IssueParty.findOne({
      issue: issue.id,
      type: 'responder'
    }).select(['id']);
    if (!issueParty) throw 'notFound';

    const issueUserData = {
      issue: issue.id,
      user: this.req.session.userId,
      party: issueParty.id,
      role: 'responder'
    };

    return await IssueUser
      .findOrCreate(issueUserData, issueUserData);
  }

};
