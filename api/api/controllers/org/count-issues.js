

module.exports = {

  friendlyName: 'Issue count',

  description: 'Count issues in an org',

  inputs: {
    search: {type: 'string', defaultsTo: ''}
  },

  fn: async function({search}) {
    const where = {
      org: this.req.session.orgId,
      submittedAt: {'!=': 0}
    };

    if (search) {
      where.name = {contains: search};

      const users = await User.find({
        or: [
          {firstName: {contains: search}},
          {lastName: {contains: search}},
          {email: {contains: search}}
        ]
      }).select(['id']);
      const issueUsers = await IssueUser.find({
        user: users.map(user => user.id),
        org: this.req.session.orgId
      }).select(['issue']);
      where.id = [...new Set(issueUsers.map(issueUser => issueUser.issue))];
    }

    return {
      count: await Issue.count(where)
    };
  }

};
