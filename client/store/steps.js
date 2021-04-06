

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

  async fetch({state, commit}) {
    const {count} = await this.$axios.$get('/pathwayStep/count', {
      params: state.where
    });
    commit('count', count);
    commit('data', await this.$axios.$get('/pathwayStep', {
      params: {
        where: state.where,
        skip: state.limit * (state.currentPage - 1),
        limit: state.limit
      }
    }));
  },

  async destroy({dispatch}, {id}) {
    await this.$axios.$delete(`/pathwayStep/${id}`);
    await dispatch('fetch');
  }
};
