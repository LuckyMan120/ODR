

import {
  mixinState,
  mixinGetters,
  mixinMutations,
  mixinActions
} from '@/store/pagination.js';

export const state = () => ({
  ...mixinState(),

  issueId: null,
  issueDataId: null
});

export const getters = {
  ...mixinGetters(),
  issueId: state => state.issueId,
  issueDataId: state => state.issueDataId
};

export const mutations = {
  ...mixinMutations(),
  issueId: (state, issueId) => state.issueId = issueId,
  issueDataId: (state, issueDataId) => {
    state.issueDataId = issueDataId;
    state.limit = 10;
    state.currentPage = 1;
    state.count = 0;
  }
};

export const actions = {
  ...mixinActions(),

  async fetch({commit, dispatch, state}) {
    if (state.issueDataId) {
      const count = await dispatch('count');
      commit('count', count);
      commit(
        'data',
        await this.$axios.$get(`/issue-data/${state.issueDataId}/comments`, {
          params: {
            skip: state.limit * (state.currentPage - 1),
            limit: state.limit
          }
        })
      );
    }
  },

  async count({state}) {
    const {count} = await this.$axios.$get(
      `/issue-data/${state.issueDataId}/comments/count`
    );
    return count;
  },

  'create-comment': async function({state, dispatch}, data) {
    await this.$axios.$post(
      `/issue-data/${state.issueDataId}/comment`,
      data
    );
    await dispatch('fetch');
    if (state.issueId) {
      await dispatch(
        'issue/fetchIssueData',
        null,
        {root: true}
      );
    }
  }
};
