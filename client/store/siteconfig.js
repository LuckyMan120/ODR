

import {
  mixinState,
  mixinGetters,
  mixinMutations,
  mixinActions
} from '@/store/pagination.js';

export const state = () => ({
  ...mixinState(),
  siteConfig: []
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
    const {count} = await this.$axios.$get('/siteconfig/count', {
      params: state.where
    });
    commit('count', count);
    commit('data', await this.$axios.$get('/siteconfig', {
      params: {
        where: state.where,
        skip: state.limit * (state.currentPage - 1),
        limit: state.limit,
        sort: state.sort
      }
    }));
  }
};
