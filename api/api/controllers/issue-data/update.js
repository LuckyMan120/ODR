

module.exports = {

  friendlyName: 'Update',

  description: 'Update issue data.',

  inputs: {
    id: {type: 'number', required: true},
    value: {type: 'string', required: true},
    category: {type: 'string', required: false}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id, value, category}) {
    const where = {id, user: this.req.session.userId};

    const issueData = await IssueData
      .findOne(where)
      .select(['id', 'issue']);
    if (!issueData) throw 'notFound';

    await sails
      .getDatastore()
      .transaction(async tx => {
        await IssueData
          .update(where)
          .set({value, category})
          .usingConnection(tx);

        const statuses = await IssueDataStatus.find({
          issueData: issueData.id
        });
        for (const status of statuses) {
          await IssueDataStatus
            .updateOne(status.id)
            .set({value: 'none'})
            .usingConnection(tx);
        }

        await Issue
          .updateOne({id: issueData.issue})
          .set({updatedAt: new Date().getTime()})
          .usingConnection(tx);

        await Issue.updatePartiesState(
          issueData.issue,
          tx,
          this.req.session.userId
        );
      });

    return await IssueData.findOne(where);
  }
};
