

module.exports = {

  friendlyName: 'Create complaint issue',

  description: 'Create issue with type complaint',

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  inputs: {
    pathway: {type: 'number', defaultsTo: 1},
    abn: {
      type: 'number',
      required: true,
      custom: abn => sails.helpers.validate.abn(abn)
    }
  },

  fn: async function({pathway, abn}) {
    return await sails
      .getDatastore()
      .transaction(async tx => {
        const user = await User
          .findOne(this.req.session.userId)
          .usingConnection(tx);

        const name = user.company || `${user.firstName} ${user.lastName}`;

        let org = await Org
          .findOne({abn})
          .usingConnection(tx);

        if (!org) {
          const {Abn, EntityName} = await sails.helpers.abr.abnLookup(abn);
          if (!Abn) throw 'notFound';
          org = await Org
            .create({
              name: EntityName,
              slug: sails.helpers.dashCase(EntityName),
              abn: Abn,
              active: false
            })
            .usingConnection(tx)
            .fetch();
        }

        const issue = await Issue
          .create({
            name,
            pathway,
            type: 'complaint',
            org: org.id
          })
          .usingConnection(tx)
          .fetch();

        const party = await IssueParty
          .create({
            name,
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

        await IssueParty
          .create({
            name: org.name,
            issue: issue.id,
            type: 'responder'
          })
          .usingConnection(tx);

        await Issue
          .updatePartiesState(issue.id, tx);

        return issue;
      });
  }
};
