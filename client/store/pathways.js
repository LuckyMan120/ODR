

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
  ...mixinMutations()
};

export const actions = {
  ...mixinActions(),

  async fetch({commit, state}) {
    const {count} = await this.$axios.$get('/pathway/count', {
      params: state.where
    });
    commit('count', count);
    commit('data', await this.$axios.$get('/pathway', {
      params: {
        where: state.where,
        skip: state.limit * (state.currentPage - 1),
        limit: state.limit,
        sort: state.sort
      }
    }));
  },

  async destroy({dispatch}, {id}) {
    await this.$axios.$delete(`/pathway/${id}`);
    await dispatch('fetch');
  }
};
