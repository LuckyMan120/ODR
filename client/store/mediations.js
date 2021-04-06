const DUMMY_CASES = [{
  'createdAt': 1605986486238,
  'updatedAt': 1605986486238,
  'id': 1,
  'initiator': true,
  'state': null,
  'lastStep': 0,
  'archived': false,
  'user': 3,
  'mediationRole': 1,
  'mediation': {
    'createdAt': 1605986486197,
    'updatedAt': 1605986486197,
    'id': 1,
    'name': 'Bruce Wayne and Arthur Fleck',
    'closed': false,
    'archived': false,
    'org': 1
  },
  'mediationParty': {
    'createdAt': 1605986486218,
    'updatedAt': 1605986486218,
    'id': 1,
    'name': 'Tha party name',
    'type': 'party',
    'initiator': true,
    'mediation': 1,
    'pathway': 1
  },
  'activity': [
    {
      'id': 1,
      'createdAt': 1605986486218,
      'info': 'Arthur Fleck agreed to ground rule'
    },
    {
      'id': 2,
      'createdAt': 1605986486218,
      'info': 'Bruce Wayne joined the mediation'
    },
    {
      'id': 3,
      'createdAt': 1605986486218,
      'info': 'Bruce Wayne agreed to ground rule'
    },
    {
      'id': 4,
      'createdAt': 1605986486218,
      'info': 'Arthur Fleck added new information'
    }
  ],
  'org': 1
},
{
  'createdAt': 1605986486238,
  'updatedAt': 1605986486238,
  'id': 2,
  'initiator': true,
  'state': null,
  'lastStep': 0,
  'archived': false,
  'user': 3,
  'mediationRole': 1,
  'mediation': {
    'createdAt': 1605986486197,
    'updatedAt': 1605986486197,
    'id': 2,
    'name': 'Bruce Wayne and Jonathan Crane',
    'closed': false,
    'archived': false,
    'org': 1
  },
  'mediationParty': {
    'createdAt': 1605986486218,
    'updatedAt': 1605986486218,
    'id': 2,
    'name': 'Tha party name',
    'type': 'party',
    'initiator': true,
    'mediation': 1,
    'pathway': 1
  },
  'activity': [
    {
      'id': 1,
      'createdAt': 1605986486218,
      'info': 'Jonathan Crane agreed to ground rule'
    },
    {
      'id': 2,
      'createdAt': 1605986486218,
      'info': 'Bruce Wayne joined the mediation'
    },
    {
      'id': 3,
      'createdAt': 1605986486218,
      'info': 'Bruce Wayne agreed to ground rule'
    },
    {
      'id': 4,
      'createdAt': 1605986486218,
      'info': 'Jonathan Crane added new information'
    }
  ],
  'org': 1
}];

export const state = () => ({
  mediations: []
});

export const mutations = {
  mediations: (state, mediations) => state.mediations = mediations,
  add: (state, newMediation) => state.mediations.push(newMediation)
};

export const getters = {
  data: (state) => {
    return state.mediations;
  }
};

export const actions = {
  async fetch({commit}) {
    commit('mediations', DUMMY_CASES);
  }
};
