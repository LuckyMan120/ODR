

module.exports = {

  friendlyName: 'Get issues',

  description: 'Get org issues.',

  inputs: {
    search: {type: 'string', defaultsTo: ''},
    skip: {type: 'number', defaultsTo: 0},
    limit: {type: 'number', defaultsTo: 30},
    sort: {type: 'string', defaultsTo: 'id'}
  },

  fn: async function({search, skip, limit, sort}) {
    const where = {
      org: this.req.session.orgId,
      submittedAt: {'!=': 0}
    };
    if (search) {
      where.or = [];
      where.or.push({name: {contains: search}});

      const users = await User.find({
        or: [
          {firstName: {contains: search}},
          {lastName: {contains: search}},
          {email: {contains: search}}
        ]
      }).select(['id']);
      const issueUsers = await IssueUser.find({
        user: users.map(user => user.id)
      }).select(['issue']);
      where.or.push({
        id: [...new Set(issueUsers.map(issueUser => issueUser.issue))]
      });
    }

    return await Issue
      .find(where)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .populate('users', {
        id: this.req.session.userId
      });
  }

};
