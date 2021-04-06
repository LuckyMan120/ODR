

const port = 1338;

module.exports = {
  port,
  models: {
    migrate: 'drop'
  },
  log: {
    level: 'debug'
  },
  custom: {
    baseURL: `http://localhost:${port}`
  },
  email: {
    testMode: true
  },
  policies: {
    user: {
      'sign-in': true,
      register: true,
      'request-password-reset': true,
      'password-reset': true
    },
    org: {
      lookup: true,
      register: true
    }
  },
  fixtures: {
    order: [
      // defined in fixtures
      'Role',
      'OrgRole',
      'MediationRole',
      'Pathway',
      'PathwayStep',
      'MediationType',
      'SiteConfig',

      // defined locally
      'Org',
      'User',
      'OrgUser',

      'DataType'
    ],
    Org: [
      {
        id: 1,
        name: 'OrgName',
        slug: 'org-slug',
        abn: 11111111111,
        active: true
      },
      {
        id: 2,
        name: 'TestOrg',
        slug: 'test-org',
        abn: 11111111112,
        active: true
      },
      {
        id: 3,
        name: 'Unnamed Org',
        slug: 'unnamed-org',
        abn: 11111111113,
        active: true
      },
      {
        id: 4,
        name: 'E-corp',
        slug: 'e-corp',
        abn: 11111111114,
        active: true
      },
      {
        id: 5,
        name: 'Add To Org',
        slug: 'add-to-org',
        abn: 11111111115,
        active: true
      },
      {
        id: 6,
        name: 'Org inactive',
        slug: 'org-inactive',
        active: false,
        abn: 11111111116
      }
    ],
    User: [
      {
        id: 1,
        email: 'johndoe@gmail.com',
        password: '1234abcd',
        firstName: 'John',
        lastName: 'Doe'
      },
      {
        id: 2,
        email: 'doejohn@gmail.com',
        firstName: 'Doe',
        lastName: 'John'
      },
      {
        id: 3,
        email: 'loginTest@gmail.com',
        password: '1234abcd',
        firstName: 'Doe',
        lastName: 'John'
      },
      {
        id: 4,
        email: 'superadmin@nkb.com',
        password: '1234abcd',
        firstName: 'superadmin',
        lastName: 'superadmin',
        role: 1
      },
      {
        id: 5,
        email: 'admin@nkb.com',
        password: '1234abcd',
        firstName: 'admin',
        lastName: 'admin',
        role: 2
      },
      {
        id: 6,
        email: 'user@nkb.com',
        password: '1234abcd',
        firstName: 'user',
        lastName: 'user',
        role: 3
      },
      {
        id: 7,
        email: 'orgAdmin@test.org',
        password: '1234abcd',
        firstName: 'orgAdmin',
        lastName: 'orgAdmin'
      },
      {
        id: 8,
        email: 'orgStaff@test.org',
        password: '1234abcd',
        firstName: 'orgStaff',
        lastName: 'orgStaff'
      },
      {
        id: 9,
        email: 'orgUser@test.org',
        password: '1234abcd',
        firstName: 'orgUser',
        lastName: 'orgUser'
      },
      {
        id: 10,
        email: 'otherOrgUser@test.org',
        password: '1234abcd',
        firstName: 'orgUser',
        lastName: 'orgUser'
      },
      {
        id: 11,
        email: 'noOrgUser@test.org',
        password: '1234abcd',
        firstName: 'noOrgUser',
        lastName: 'noOrgUser'
      },
      {
        id: 12,
        email: 'logOutUser@test.org',
        password: '1234abcd',
        firstName: 'noOrgUser',
        lastName: 'noOrgUser'
      },
      {
        id: 13,
        email: 'updateUserCookie@test.org',
        password: '1234abcd',
        firstName: 'updateUserCookie',
        lastName: 'updateUserCookie'
      },
      {
        id: 14,
        email: 'existingInviteUser@test.org',
        password: '1234abcd',
        firstName: 'existingInviteUser',
        lastName: 'existingInviteUser'
      },
      {
        id: 15,
        email: 'singleOrgUser@test.org',
        password: '1234abcd',
        firstName: 'singleOrgUser',
        lastName: 'singleOrgUser'
      }
    ],
    OrgUser: [
      {
        user: 3,
        org: 1,
        role: 3
      },
      {
        user: 7,
        org: 2,
        role: 1
      },
      {
        user: 8,
        org: 2,
        role: 2
      },
      {
        user: 9,
        org: 2,
        role: 3
      },
      {
        user: 10,
        org: 2,
        role: 3
      },
      {
        user: 10,
        org: 1,
        role: 3
      },
      {
        user: 9,
        org: 4,
        role: 3
      },
      {
        user: 9,
        org: 6,
        role: 3
      },
      {
        user: 15,
        org: 1,
        role: 3
      }
    ],
    DataType: [
      {
        id: 1,
        name: 'test',
        activityDesc: 'test activity desc',
        shared: true
      },
      {
        id: 2,
        name: 'test2',
        activityDesc: 'test activity desc2',
        shared: false
      }
    ]
  }
};
