

module.exports = {

  friendlyName: 'Get data',

  description: '',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id: issue}) {
    const issueUser = await IssueUser.findOne({
      user: this.req.session.userId,
      issue
    }).select(['party']);
    if (!issueUser) throw 'notFound';
    const issueData = await IssueData
      .find({issue})
      .populate('type');
    for (let i = 0; i < issueData.length; i++) {
      const data = issueData[i];
      data.statuses = await IssueDataStatus.find({
        issueData: data.id
      }).populate('party');
      data.commentsCount = await IssueDataComment.count({
        issueData: data.id
      });
      data.revisions = await IssueDataRevision.find({
        issueData: data.id
      }).populate('party');

      if (data.revisions && data.revisions.length > 0) {
        const party = await IssueParty.findOne({id: data.party});
        data.originalData = {
          value: data.value,
          createdAt: data.createdAt,
          party
        };
        data.value = data.revisions[data.revisions.length - 1].value;
      }
    }
    return issueData.filter(data => (
      !!data.type.shared || data.party === issueUser.party
    ));
  }

};
