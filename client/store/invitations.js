const DUMMY_INVITATIONS = [{
  id: '1',
  email: 'bruce@wayneindustries.com',
  sentAt: 1605986486238,
  invitedBy: {
    email: 'harvey.dent@arkham.com',
    firstName: 'Harvey',
    lastName: 'Dent'
  }
},
{
  id: '2',
  email: 'bruce@wayneindustries.com',
  sentAt: 1605986486238,
  invitedBy: {
    email: 'harley.quinn@arkham.com',
    firstName: 'Harley',
    lastName: 'Quenn'
  }
}];

export const state = () => ({
  invitations: []
});

export const mutations = {
  invitations: (state, inv) => state.invitations = inv
};

export const getters = {
  data: (state) => {
    return state.invitations;
  }
};

export const actions = {
  async fetch({commit}) {
    commit('invitations', DUMMY_INVITATIONS);
  },

  async join({commit, state}, payload) {
    //TODO: Call API to join a mediation.
    //Next is dummy code. Remove after API call is programmed\
    //===========================================
    const result = [...state.invitations];
    const idx = result.findIndex(i => i.id === payload.id);
    const inv = result[idx];
    const sender = inv.invitedBy;
    console.log(`Invitation #${payload.id} Joined (${sender.firstName} ${sender.lastName} invited you to join a mediation.)`);
    console.log('TODO: Call Invitations API');
    result.splice(idx, 1);
    //==========================================

    commit('invitations', result);
  },

  async reject({commit, state}, payload) {
    //TODO: Call API to reject a mediation.
    //Next is dummy code. Remove after API call is programmed\
    //===========================================
    const result = [...state.invitations];
    const idx = result.findIndex(i => i.id === payload.id);
    const inv = result[idx];
    const sender = inv.invitedBy;
    console.log(`Invitation #${payload.id} Rejected (${sender.firstName} ${sender.lastName} invited you to join a mediation.)`);
    console.log('TODO: Call Invitations API');
    result.splice(idx, 1);
    //==========================================

    commit('invitations', result);
  }
};
