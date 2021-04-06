const {userRole} = require('../../enum/role');

module.exports = {

  friendlyName: 'Update org',

  description: 'Update org in session.',

  inputs: {
    id: {type: 'number', required: true},
    abn: {type: 'string'},
    active: {type: 'boolean'},
    name: {type: 'string'},
    slug: {type: 'string'}
  },

  fn: async function({
    id,
    abn,
    active,
    name,
    slug
  }) {
    const set = {name};

    if (
      this.req.session.userRole === userRole.admin ||
      this.req.session.userRole === userRole.superadmin
    ) {
      set.active = active;
    }

    if (
      this.req.session.userRole === userRole.superadmin
    ) {
      set.abn = abn;
      set.slug = slug;
    }

    return await Org.updateOne(id).set(set);
  }

};
