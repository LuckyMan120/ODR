

module.exports = {

  friendlyName: 'Issues',

  description: 'All issues created by logged in user.',

  inputs: {
    skip: {type: 'number', defaultsTo: 0},
    limit: {type: 'number', defaultsTo: 30}
  },

  fn: async function({skip, limit}) {

    const issueUsers = await IssueUser
      .find({
        user: this.req.session.userId,
        role: 'participant'
      })
      .skip(skip)
      .limit(limit)
      .select(['issue']);

    const issues = await Issue
      .find({
        id: issueUsers.map(issueUser => issueUser.issue)
      })
      .sort('createdAt DESC');

    for (const issue of issues) {
      issue.parties = await IssueParty.find({
        issue: issue.id
      });
    }

    return issues;
  }

};
