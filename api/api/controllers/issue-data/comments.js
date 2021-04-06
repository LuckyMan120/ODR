

module.exports = {

  friendlyName: 'Comments',

  description: 'Comments issue data.',

  inputs: {
    id: {type: 'number', required: true},
    limit: {type: 'number', defaultsTo: 30},
    skip: {type: 'number', defaultsTo: 0}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id, limit, skip}) {
    const issueData = await IssueData
      .findOne(id)
      .select(['issue']);

    const issueUser = await IssueUser
      .findOne({
        user: this.req.session.userId,
        issue: issueData.issue
      });
    if (!issueUser) throw 'notFound';

    const comments = await IssueDataComment
      .find({
        issueData: id
      })
      .limit(limit)
      .skip(skip)
      .sort('id DESC')
      .select(['text', 'createdAt', 'user', 'party']);

    for (let i = 0; i < comments.length; i++) {
      const comment = comments[i];
      comment.user = await User
        .findOne(comment.user)
        .select(['firstName', 'lastName']);
      comment.party = await IssueParty
        .findOne(comment.party)
        .select(['name', 'type']);
    }

    return comments;
  }

};
