

export const state = () => ({
  data: []
});

export const mutations = {
  data: (state, plans) => state.data = plans
    .filter(
      plan => plan.nickname &&
        plan.metadata.slug &&
        plan.metadata.desc
    )
    .sort(
      (a, b) => (a.amount > b.amount) ? 1 : -1
    )
};

export const getters = {
  data: state => state.data,
  indexed: state => state.data.reduce((acc, cur) => {
    acc[cur.metadata.slug] = cur;
    return acc;
  }, {})
};

export const actions = {
  async fetch({commit}) {
    commit('data', await this.$axios.$get('/stripe/plans'));
  }
};
