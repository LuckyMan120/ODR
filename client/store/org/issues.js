

import {
  mixinState,
  mixinGetters,
  mixinMutations,
  mixinActions
} from '@/store/pagination.js';

export const state = () => ({
  ...mixinState()
});

export const getters = {
  ...mixinGetters()
};

export const mutations = {
  ...mixinMutations(),
  search: (state, {search}) => state.search = search
};

export const actions = {
  ...mixinActions(),

  async fetch({commit, state}) {
    const params = {};
    if (state.search) params.search = state.search;
    const {count} = await this.$axios.$get('/org/issues/count', {params});
    commit('count', count);
    params.skip = state.limit * (state.currentPage - 1);
    params.limit = state.limit;
    params.sort = state.sort;
    commit('data', await this.$axios.$get('/org/issues', {params}));
  },

  join({dispatch}, {id}) {
    this.$axios.$post(`/issue/${id}/join`);
    dispatch('fetch');
  }
};
