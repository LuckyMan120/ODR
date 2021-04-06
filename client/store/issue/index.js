

import {dataTypes} from '@/constants/data-types.js';

export const state = () => ({
  id: null,
  issue: null,
  steps: [],
  currentStep: null,
  issueData: [],
  party: {},

  modified: {}
});

export const mutations = {
  id: (state, id) => state.id = id,
  issue: (state, issue) => state.issue = issue,

  steps: (state, steps) => state.steps = steps
    .filter(step => step.state.show)
    .map(step => ({
      ...step,
      steps: step.steps.filter(step => step.state.show)
    })),
  currentStep: (state, step) => state.currentStep = step,
  issueData: (state, issueData) => {
    state.modified = {};
    for (const stateData of state.issueData) {
      for (const newData of issueData) {
        if (
          stateData.type.id === dataTypes.agreementItem &&
          newData.type.id === dataTypes.agreementItem &&
          stateData.id === newData.id &&
          JSON.stringify(stateData) !== JSON.stringify(newData)
        ) {
          state.modified[newData.id] = true;
        }
      }
    }
    state.issueData = issueData;
  },
  party: (state, party) => state.party = party,

  initStep: state => {
    if (!state.issue.responderEngagedAt && state.party.type === 'responder') {
      const setSteps = state.steps.filter(step => step.state.enabled);
      state.currentStep = setSteps[0];
    } else {
      const setSteps = state.steps.filter(
        step => step.state.enabled && !step.state.completed
      );
      state.currentStep = setSteps[setSteps.length - 1];
    }
  },

  setModified: (state, {id, value = false}) => state.modified[id] = value
};

export const getters = {
  id: state => state.id,
  issue: state => state.issue,

  steps: state => state.steps,
  currentStep: state => state.currentStep || {},
  issueData: state => state.issueData,
  party: state => state.party || {},

  issueCategory: state => state.issueData
    .find(issueData => issueData.type.id === dataTypes.issueCategory),
  issueSubCategory: state => state.issueData
    .find(issueData => issueData.type.id === dataTypes.issueSubCategory),

  modified: state => state.modified
};

export const actions = {
  async fetch({state, commit, dispatch}) {
    const id = state.id;
    let party;
    try {
      party = await this.$axios.$get(`/issue/${id}/party`);
    } catch (err) {
      if (err.response.status === 404) {
        await dispatch('join');
        party = await this.$axios.$get(`/issue/${id}/party`);
      } else {
        this.$toast.error(
          `${this.i18n.t('error')}: ${this.i18n.t('forbidden')}`
        );
      }
    }
    commit('party', party);
    commit('issue', await this.$axios.$get(`/issue/${id}`));
    await dispatch('fetchIssueSteps');
    await dispatch('fetchIssueData');
  },

  async fetchIssueData({commit, state}) {
    commit('issueData', await this.$axios.$get(`/issue/${state.id}/data`));
  },

  async fetchIssueSteps({commit, state}) {
    commit('steps', await this.$axios.$get(`/issue/${state.id}/steps`));
  },

  async fetchIssueDataStatus(ctx, {issueDataId}) {
    await this.$axios.$get(`/issue-data/${issueDataId}/status`);
  },

  async createIssueData({dispatch, state}, data) {
    const issueData = await this.$axios
      .$post(`/issue/${state.id}/data`, data);
    if (data.type === dataTypes.agreementItem) {
      await dispatch('fetchIssueDataStatus', {
        issueDataId: issueData.id
      });
    }
    await dispatch('fetch');
  },

  async join({state}) {
    await this.$axios.$post(`/issue/${state.id}/join`);
  },

  async updateIssueData({dispatch}, {issueDataId, data}) {
    await this.$axios.$put(`/issue-data/${issueDataId}`, data);
    await dispatch('fetch');
  },

  async deleteIssueData({dispatch}, {issueDataId}) {
    await this.$axios.$delete(`/issue-data/${issueDataId}`);
    await dispatch('fetch');
  },

  async updateIssueDataStatus({dispatch}, {issueDataId, value}) {
    await this.$axios.$put(
      `/issue-data/${issueDataId}/status`,
      {value}
    );
    await dispatch('fetchIssueData');
    await dispatch('fetchIssueSteps');
  },

  async withdraw({dispatch, state}, {
    note,
    status = 'withdraw'
  }) {
    try {
      await this.$axios.$put(`/issue/${state.id}/withdraw`, {note, status});
      await dispatch('fetch');
    } catch (err) {
      console.error(err);
    }
  },

  async createIssueDataRevision({dispatch}, {issueDataId, value}) {
    await this.$axios
      .$post(`/issue-data/${issueDataId}/revision`, {value});
    await dispatch('fetchIssueData');
    await dispatch('fetchIssueSteps');
  }
};
