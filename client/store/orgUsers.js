

import {
  mixinState,
  mixinGetters,
  mixinMutations,
  mixinActions
} from '@/store/pagination.js';

import {userRole} from '@/constants/index';

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
    const {count} = await this.$axios.$get('/orgUser/count', {
      params: state.where
    });
    commit('count', count);
    commit('data', await this.$axios.$get('/orgUser', {
      params: {
        where: state.where,
        skip: state.limit * (state.currentPage - 1),
        limit: state.limit,
        sort: state.sort
      }
    }));
  },

  async create({dispatch}, {data}) {
    await this.$axios.$post('/orgUser', data);
    await dispatch('fetch');
  },

  async destroy({dispatch}, {id}) {
    await this.$axios.$delete(`/orgUser/${id}`);
    await dispatch('fetch');
  },

  async update({rootGetters}, {id, user, role}) {
    const userRoleStore = rootGetters['user/role'];
    if (userRoleStore.name === userRole.admin
        || userRoleStore.name === userRole.superadmin
    ) {
      await this.$axios.$put(`/orgUser/${id}`, {role});
    } else {
      await this.$axios.$put(`/org/user/${user}`, {role});
    }
  }
};
