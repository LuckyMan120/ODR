

import {
  mixinState,
  mixinGetters,
  mixinMutations,
  mixinActions
} from '@/store/pagination.js';

export const state = () => ({
  ...mixinState(),

  where: {
    orgRole: [1, 2, 3]
  }
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
    const {count} = await this.$axios.$get('/org/users/count', {
      params: state.where
    });
    commit('count', count);
    commit('data', await this.$axios.$get('/org/users', {
      params: {
        where: state.where,
        skip: state.limit * (state.currentPage - 1),
        limit: state.limit,
        sort: state.sort
      }
    }));
  }
};
