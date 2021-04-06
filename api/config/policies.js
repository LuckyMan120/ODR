/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

const exits = {
  notFound: res => res.notFound(),
  badRequest: (res, message) => res.badRequest({message}),
  forbidden: res => res.forbidden()
};

const and = (policies) => (req, res, next) => {
  async.waterfall(policies.map(policy => cb => {
    if (typeof policy === 'function') {
      policy(req, res, err => cb(err));
    } else {
      sails.hooks.policies.middleware[
        policy.toLowerCase()
      ](req, res, err => cb(err));
    }
  }), (err) => {
    if (err) {
      if (exits[err.error]) {
        return exits[err.error](res, err.message);
      } else {
        return next(err);
      }
    } else {
      return next();
    }
  });
};

const or = (policies) => (req, res, next) => {
  async.series(policies.map(policy => cb => {
    if (typeof policy === 'function') {
      policy(req, res, err => cb(null, err));
    } else {
      sails.hooks.policies.middleware[
        policy.toLowerCase()
      ](req, res, err => cb(null, err));
    }
  }), (serverError, errors) => {
    if (serverError) return res.serverError(serverError);
    for (let i = 0; i < errors.length; i++) {
      const err = errors[i];
      if (err === undefined) return next();
    }
    exits[errors[0].error](res, errors[0].message);
  });
};
const {userRole, orgRole} = require('../api/enum/role');

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/

  '*': false,

  common: {
    ping: true,
    version: true,
    count: and([
      userRole.auth,
      or([userRole.admin, userRole.superadmin])
    ])
  },

  user: {
    '*': and([
      userRole.auth,
      or([userRole.admin, userRole.superadmin])]),

    'sign-in': and(['captcha']),
    'sign-out': and([userRole.auth]),
    register: and(['captcha']),
    'request-password-reset': and(['captcha']),
    'password-reset': and(['captcha']),
    me: and([userRole.auth]),
    'update-me': and([userRole.auth]),

    orgs: and([userRole.auth]),
    'set-org': and([userRole.auth]),

    mediations: and([userRole.auth, or([orgRole.user, orgRole.staff])]),
    'mediation-invites': and([
      userRole.auth,
      or([orgRole.user, orgRole.staff])]),

    issues: and([userRole.auth]),
    'issues-count': and([userRole.auth]),

    'create-org': and([userRole.auth]),

    subscribe: and([userRole.auth, 'socket']),
    unsubscribe: and([userRole.auth, 'socket']),

    notifications: and([userRole.auth]),
    'count-notifications': and([userRole.auth]),
    'dismiss-all-notifications': and([userRole.auth])
  },

  'org/*': and([
    userRole.auth,
    or([userRole.admin, userRole.superadmin])]),
  'orgUser/*': and([
    userRole.auth,
    or([userRole.admin, userRole.superadmin])]),
  'pathway/*': and([
    userRole.auth,
    or([userRole.admin, userRole.superadmin])]),
  'pathwayStep/*': and([
    userRole.auth,
    or([userRole.admin, userRole.superadmin])]),

  org: {
    'get-users': and([userRole.auth, orgRole.admin]),
    'add-user': and([userRole.auth, orgRole.admin]),
    'users-count': and([userRole.auth, orgRole.admin]),
    'update-user': and([userRole.auth, orgRole.admin]),
    'destroy-user': and([userRole.auth, orgRole.admin]),

    'create-invite': and([
      userRole.auth,
      or([orgRole.admin, orgRole.staff])]),
    'get-invites': and([userRole.auth, orgRole.admin]),
    'invites-count': and([userRole.auth, orgRole.admin]),
    'destroy-invite': and([userRole.auth, orgRole.admin]),
    'resend-invite': and([userRole.auth, orgRole.admin]),

    'update-org': and([userRole.auth, orgRole.admin]),

    'get-issues': and([userRole.auth, or([orgRole.admin, orgRole.staff])]),
    'count-issues': and([userRole.auth, or([orgRole.admin, orgRole.staff])]),

    subscribe: and([
      userRole.auth,
      'socket',
      or([orgRole.admin, orgRole.staff])
    ]),
    unsubscribe: and([
      userRole.auth,
      'socket',
      or([orgRole.admin, orgRole.staff])
    ]),

    lookup: or([userRole.auth, 'captcha']),

    register: and(['captcha']),

    'board-report-pdf': and([userRole.auth, or([orgRole.staff, orgRole.admin])])
  },

  mediation: {
    create: and([userRole.auth, orgRole.any])
  },

  issue: {
    'create-complaint': and([userRole.auth]),
    'create-mediation': and([
      userRole.auth, or(Object.values(orgRole))
    ]),

    'find-one': and([userRole.auth]),

    'get-data': and([userRole.auth]),
    'create-data': and([userRole.auth]),

    steps: and([userRole.auth]),
    party: and([userRole.auth]),
    join: and([userRole.auth]),
    'join-chat': and([userRole.auth]),

    subscribe: and([userRole.auth, 'socket']),
    unsubscribe: and([userRole.auth, 'socket']),

    withdraw: and([userRole.auth]),

    'summary-pdf': and([userRole.auth])
  },
  'issue-data': {
    update: and([userRole.auth]),
    destroy: and([userRole.auth]),

    status: and([userRole.auth]),
    'update-status': and([userRole.auth]),

    comments: and([userRole.auth]),
    'count-comments': and([userRole.auth]),
    'create-comment': and([userRole.auth]),

    revision: and([userRole.auth]),
    'create-revision': and([userRole.auth])
  },

  'mediation-invite': {
    accept: and([userRole.auth, orgRole.any]),
    reject: and([userRole.auth, orgRole.any])
  },

  'siteconfig/*': and([
    userRole.auth,
    or([userRole.admin, userRole.superadmin])]),

  'siteconfig': {
    'client': true
  },
  'subscription/business/*': true,
  'subscription/company': {
    create: and([userRole.auth])
  },

  stripe: {
    webhook: true,
    portal: and([userRole.auth, orgRole.admin]),
    plans: true
  },

  notification: {
    dismiss: and([userRole.auth]),
    read: and([userRole.auth])
  }
};
