

module.exports = {

  friendlyName: 'Status',

  description: 'Status issue data.',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id}) {
    return await sails
      .getDatastore()
      .transaction(async tx => {
        const issueData = await IssueData
          .findOne(id)
          .select(['issue'])
          .usingConnection(tx);

        const issueUser = await IssueUser
          .findOne({
            user: this.req.session.userId,
            issue: issueData.issue
          })
          .usingConnection(tx);
        if (!issueUser) throw 'notFound';

        const parties = await IssueParty
          .find({
            issue: issueData.issue
          })
          .select(['id'])
          .usingConnection(tx);

        const statuses = [];

        for (let i = 0; i < parties.length; i++) {
          const party = parties[i];
          const data = {
            issueData: issueData.id,
            party: party.id
          };

          const status = await IssueDataStatus
            .findOrCreate(data, data)
            .usingConnection(tx);

          statuses.push(status);
        }

        for (let i = 0; i < statuses.length; i++) {
          const status = statuses[i];
          status.party = await IssueParty.findOne(status.party);
        }

        return statuses;
      });

  }

};
