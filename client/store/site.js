

function findConfig(state, type) {
  const config = state.config.find(config => config.key === type);
  if (!config) return null;
  return config.value;
}

export const state = () => ({
  config: []
});

export const mutations = {
  config: (state, config) => state.config = config
};

export const getters = {
  config: state => state.config,
  type: state => findConfig(state, 'siteTypes'),
  name: state => findConfig(state, 'siteName')
};

export const actions = {
  async fetchConfig({commit}) {
    commit('config', await this.$axios.$get('/siteconfig/client'));
  }
};
