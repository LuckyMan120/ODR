

module.exports = {

  friendlyName: 'Create mediation',

  description: '',

  inputs: {
    name: {type: 'string', required: true},
    pathway: {type: 'number', required: true}
  },

  fn: async function({name, pathway}) {
    return await sails
      .getDatastore()
      .transaction(async tx => {
        const {name: orgName} = await Org
          .findOne({id: this.req.session.orgId})
          .select(['name'])
          .usingConnection(tx);

        const issue = await Issue
          .create({
            name,
            pathway,
            type: 'mediation',
            org: this.req.session.orgId
          })
          .usingConnection(tx)
          .fetch();

        const party = await IssueParty
          .create({
            name: orgName,
            initiator: true,
            issue: issue.id,
            type: 'participant'
          })
          .usingConnection(tx)
          .fetch();

        await IssueUser
          .create({
            issue: issue.id,
            party: party.id,
            user: this.req.session.userId,
            initiator: true,
            role: 'participant'
          })
          .usingConnection(tx);

        return issue;
      });
  }

};
