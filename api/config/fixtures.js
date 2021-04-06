

const PathwayStep = require('../fixtures/PathwayStep.json');
const DataType = require('../fixtures/DataType.json');
const SiteConfig = require('../fixtures/SiteConfig');

const {orgRole, userRole} = require('../api/enum/role');

module.exports.fixtures = {
  order: [
    'Role',
    'OrgRole',
    'Org',
    'User',
    'OrgUser',
    'DataType',
    'Pathway',
    'PathwayTranslation',
    'PathwayStep',
    'SiteConfig',

    // 'MediationType',
    'MediationRole'
    // 'MediationActivityType',
  ],
  overwrite: ['SiteConfig', 'DataType'],
  Role: [
    {id: 1, name: userRole.superadmin},
    {id: 2, name: userRole.admin},
    {id: 3, name: userRole.user}
  ],
  OrgRole: [
    {id: 1, name: orgRole.admin},
    {id: 2, name: orgRole.staff},
    {id: 3, name: orgRole.user}
  ],
  MediationRole: [
    {id: 1, name: 'participant'},
    {id: 2, name: 'mediator'}
  ],
  Pathway: [
    {id: 1},
    {id: 2}
  ],
  PathwayTranslation: [
    {
      pathway: 1,
      name: 'equal parties',
      locale: 'en-gb'
    },
    {
      pathway: 2,
      name: 'equal parties mediator',
      locale: 'en-gb'
    }
  ],
  MediationType: [
    {
      id: 1, name: 'Equal Parties',
      defaultInitiatorPathway: 1,
      defaultPartyPathway: 1,
      defaultMediatorPathway: 2
    },
    {
      id: 2, name: 'Consumer Company',
      defaultInitiatorPathway: 1,
      defaultPartyPathway: 1,
      defaultMediatorPathway: 2
    }
  ],
  MediationActivityType: [
    {
      id: 1,
      name: 'updated mediation data'
    },
    {
      id: 2,
      name: 'started',
      desc: 'started the mediation'
    },
    {
      id: 3,
      name: 'invited',
      desc: 'sent an invitation to the mediation'
    },
    {
      id: 4,
      name: 'joined',
      desc: 'joined the mediation',
      instructions: ''
    },
    {
      id: 5,
      name: 'quit',
      desc: 'left the mediation'
    },
    {
      id: 6,
      name: 'rejected',
      desc: 'did not accept the invitation to the mediation'
    },
    {
      id: 7,
      name: 'mediator added',
      desc: 'joined as mediator'
    }
  ],

  Org: [
    {
      id: 1,
      name: 'My Org',
      slug: 'my-org',
      abn: 11111111111,
      active: true
    },
    {
      id: 2,
      name: 'Second Org',
      slug: 'second-org',
      abn: 22222222222,
      active: true
    },
    {
      id: 3,
      name: 'Third Org',
      slug: 'third-org',
      abn: 33333333333,
      active: true
    }
  ],
  User: [
    {
      id: 1,
      email: 'john@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
      password: '1234abcd',
      role: 2
    },
    {
      id: 2,
      email: 'jane@gmail.com',
      firstName: 'Jane',
      lastName: 'Johnson',
      password: '1234abcd',
      company: 'Company Pty Ltd'
    },
    {
      id: 3,
      email: 'bill@gmail.com',
      firstName: 'Bill',
      lastName: 'Billson',
      password: '1234abcd'
    },
    {
      id: 4,
      email: 'john.smith@gmail.com',
      firstName: 'John',
      lastName: 'Smith',
      password: '1234abcd'
    },
    {
      id: 5,
      email: 'staff@gmail.com',
      firstName: 'Staff',
      lastName: 'McOrg',
      password: '1234abcd'
    },
    {
      id: 6,
      email: 'admin@guidedresolution.com',
      firstName: 'superadmin',
      lastName: 'superadmin',
      role: 1
    }
  ],
  OrgUser: [
    {
      user: 1,
      org: 1,
      role: 1
    },
    {
      user: 1,
      org: 2,
      role: 2
    },
    {
      user: 2,
      org: 1,
      role: 3
    },
    {
      user: 2,
      org: 2,
      role: 3
    },
    {
      user: 3,
      org: 1,
      role: 3
    },
    {
      user: 4,
      org: 1,
      role: 3
    },
    {
      user: 5,
      org: 1,
      role: 2
    },
    {
      user: 3,
      org: 3,
      role: 1
    }
  ],
  DataType,
  SiteConfig,
  PathwayStep
};
