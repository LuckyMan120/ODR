

import {
  mixinState,
  mixinGetters,
  mixinMutations,
  mixinActions
} from '@/store/pagination.js';

export const state = () => ({
  ...mixinState(),
  limit: 12
});

export const getters = {
  ...mixinGetters(),

  orgRole: state => state.where.orgRole
};

export const mutations = {
  ...mixinMutations(),

  orgRole: (state, orgRole) => state.where.orgRole = orgRole
};

export const actions = {
  ...mixinActions(),

  async fetch({commit, state}) {
    const {count} = await this.$axios.$get('/user/issues/count', {
      params: state.where
    });
    commit('count', count);
    commit('data', await this.$axios.$get('/user/issues', {
      params: {
        skip: state.limit * (state.currentPage - 1),
        limit: state.limit
      }
    }));
  }
};
