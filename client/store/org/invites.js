

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
    const {count} = await this.$axios.$get('/org/invites/count');
    commit('count', count);
    commit('data', await this.$axios.$get('/org/invites', {
      params: {
        skip: state.limit * (state.currentPage - 1),
        limit: state.limit
      }
    }));
  },

  'resend-invite': async function({dispatch}, {id}) {
    await this.$axios.post(`/org/invite/${id}/resend`);
    this.$toast.success(
      `${this.$i18n.t('inviteSent')}`
    );
    await dispatch('fetch');
  },

  'destroy-invite': async function({dispatch}, {id}) {
    await this.$axios.delete(`/org/invite/${id}`);
    await dispatch('fetch');
  }
};
