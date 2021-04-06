

import {
  mixinState,
  mixinGetters,
  mixinMutations,
  mixinActions
} from '@/store/pagination.js';

export const state = () => ({
  ...mixinState(),
  limit: 5,

  unreadCount: 0
});

export const getters = {
  ...mixinGetters(),
  unreadCount: state => state.unreadCount
};

export const mutations = {
  ...mixinMutations(),
  unreadCount: (state, unreadCount) => state.unreadCount = unreadCount
};

export const actions = {
  ...mixinActions(),

  async fetch({commit, state, dispatch}) {
    const {count} = await this.$axios.$get('/user/notifications/count');
    commit('count', count);
    commit('data', await this.$axios.$get('/user/notifications', {
      params: {
        skip: state.limit * (state.currentPage - 1),
        limit: state.limit
      }
    }));
    await dispatch('fetchUnreadCount');
  },

  async fetchUnreadCount({commit}) {
    const {count} = await this.$axios.$get('/user/notifications/count', {
      params: {readAt: 0}
    });
    commit('unreadCount', count);
  },

  async read({dispatch}, id) {
    await this.$axios.$put(`/notification/${id}/read`);
    await dispatch('fetch');
  },

  async dismiss({dispatch}, id) {
    await this.$axios.$put(`/notification/${id}/dismiss`);
    await dispatch('fetch');
  },

  'dismiss-all-notifications': async function({dispatch}) {
    await this.$axios.$put('/user/notifications/dismiss-all');
    await dispatch('fetch');
  }
};
