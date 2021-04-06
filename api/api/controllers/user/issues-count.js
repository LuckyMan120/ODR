

module.exports = {

  friendlyName: 'Issues count',

  fn: async function() {
    const issueUsers = await IssueUser.find({
      user: this.req.session.userId
    });
    return {
      count: await Issue.count({
        id: issueUsers.map(issueUser => issueUser.issue)
      })
    };
  }

};
