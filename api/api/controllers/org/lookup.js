

module.exports = {

  friendlyName: 'Lookup',

  description: 'Lookup org.',

  inputs: {
    abn: {
      type: 'number',
      custom: abn => sails.helpers.validate.abn(abn)
    },
    name: {type: 'string', defaultsTo: ''}
  },

  fn: async function({abn, name}) {
    const result = [];

    if (abn) {
      const orgs = await Org
        .find({abn})
        .select(['abn', 'name'])
        .limit(5);
      if (orgs.length) {
        orgs.forEach(({abn, name}) => result.push({abn, name}));
      } else {
        const abnOrg = await sails.helpers.abr.abnLookup(abn);
        result.push({abn: +abnOrg.Abn, name: abnOrg.EntityName});
      }
    }

    if (name) {
      const nameOrgs = await sails.helpers.abr.nameLookup(name);
      nameOrgs.Names.forEach(({Abn, Name}) => {
        result.push({abn: +Abn, name: Name});
      });
    }

    return result;
  }

};
