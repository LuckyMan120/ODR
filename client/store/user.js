

const defaultRole = {name: 'user'};

export const state = () => ({
  user: null,
  role: null,
  org: null,
  orgRole: null,

  orgs: []
});

export const mutations = {
  user: (state, user) => state.user = user,
  role: (state, role) => state.role = role,
  org: (state, org) => state.org = org,
  orgRole: (state, orgRole) => state.orgRole = orgRole,

  orgs: (state, orgs) => state.orgs = orgs,

  session: (state, {
    user,
    role,
    org,
    orgRole
  }) => {
    state.user = user;
    state.role = role;
    state.org = org;
    state.orgRole = orgRole;
  },

  reset: (state) => {
    state.user = null;
    state.role = null;
    state.org = null;
    state.orgRole = null;
  }
};

export const getters = {
  user: state => state.user,
  role: state => state.role || defaultRole,
  org: state => state.org,
  orgRole: state => state.orgRole || defaultRole,

  orgs: state => state.orgs
};

export const actions = {
  async me({commit, dispatch}) {
    const data = await this.$axios.$get('/user/me');
    commit('session', data);
    await dispatch('orgs');
  },

  'sign-in': async function({dispatch}, {email, password, slug, captcha}) {
    const data = {email, password, captcha};
    if (slug) data.slug = slug;
    const res = await this.$axios.post('/user/sign-in', data);
    if (res.status === 200) {
      await dispatch('me');
    }
    return res.status === 200;
  },

  'sign-out': async function({commit}) {
    const res = await this.$axios.post('/user/sign-out');
    if (res.status === 200) commit('reset');
  },

  async register(ctx, data) {
    const res = await this.$axios.post('/user/register', data);
    return res.data.token;
  },

  'set-org': async function({dispatch}, data = {org: null}) {
    try {
      await this.$axios.put('/user/org', data);
      await dispatch('me');
    } catch (err) {
      console.log(err);
    }
  },

  async orgs({commit}) {
    const orgs = await this.$axios.$get('/user/orgs');
    commit('orgs', orgs);
  }
};
