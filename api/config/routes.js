/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  'GET /ping': 'common/ping',
  'GET /version': 'common/version',

  'POST /user/sign-in': 'user/sign-in',
  'POST /user/sign-out': 'user/sign-out',
  'POST /user/register': 'user/register',
  'POST /user/request-password-reset': 'user/request-password-reset',
  'POST /user/password-reset': 'user/password-reset',
  'GET /user/me': 'user/me',
  'PUT /user/me': 'user/update-me',
  'GET /user/orgs': 'user/orgs',
  'PUT /user/org': 'user/set-org',
  'GET /user/mediations': 'user/mediations',
  'GET /user/mediation-invites': 'user/mediation-invites',
  'GET /user/issues': 'user/issues',
  'GET /user/issues/count': 'user/issues-count',
  'POST /user/org': 'user/create-org',
  'GET /user/notifications': 'user/notifications',
  'GET /user/notifications/count': 'user/count-notifications',
  'PUT /user/notifications/dismiss-all': 'user/dismiss-all-notifications',

  'GET /:model/count': 'common/count',

  'GET /org/users': 'org/get-users',
  'GET /org/user': 'org/get-users',
  'GET /org/users/count': 'org/users-count',
  'GET /org/lookup': 'org/lookup',
  'POST /org/user': 'org/add-user',
  'PUT /org/user/:id': 'org/update-user',
  'DELETE /org/user/:id': 'org/destroy-user',
  'POST /org/invite': 'org/create-invite',
  'GET /org/invite': 'org/get-invites',
  'GET /org/invites': 'org/get-invites',
  'GET /org/invites/count': 'org/invites-count',
  'PUT /org': 'org/update-org',
  'DELETE /org/invite/:id': 'org/destroy-invite',
  'POST /org/invite/:id/resend': 'org/resend-invite',
  'GET /org/issues': 'org/get-issues',
  'GET /org/issues/count': 'org/count-issues',
  'POST /org/register': 'org/register',

  'POST /org/subscribe': 'org/subscribe',
  'POST /org/unsubscribe': 'org/unsubscribe',

  'GET /org/board-report-pdf': 'org/board-report-pdf',

  'POST /mediation': 'mediation/create',

  'PUT /mediation-invite/:id/accept': 'mediation-invite/accept',
  'PUT /mediation-invite/:id/reject': 'mediation-invite/reject',

  'GET /siteconfig/client': 'siteConfig/client',

  'GET /pathway/count': 'pathway/count',
  'GET /pathway/:id': 'pathway/find-one',

  'POST /stripe/webhook': 'stripe/webhook',
  'GET /stripe/portal': 'stripe/portal',
  'GET /stripe/plans': 'stripe/plans',

  'POST /issue/complaint': 'issue/create-complaint',
  'POST /issue/mediation': 'issue/create-mediation',
  'GET /issue/:id': 'issue/find-one',
  'GET /issue/:id/data': 'issue/get-data',
  'POST /issue/:id/data': 'issue/create-data',
  'GET /issue/:id/party': 'issue/party',
  'GET /issue/:id/steps': 'issue/steps',
  'POST /issue/:id/join': 'issue/join',
  'POST /issue/:id/join-chat': 'issue/join-chat',
  'POST /issue/:id/subscribe': 'issue/subscribe',
  'POST /issue/:id/unsubscribe': 'issue/unsubscribe',
  'PUT /issue/:id/withdraw': 'issue/withdraw',
  'GET /issue/:id/summary-pdf': 'issue/summary-pdf',

  'PUT /issue-data/:id': 'issue-data/update',
  'DELETE /issue-data/:id': 'issue-data/destroy',
  'GET /issue-data/:id/status': 'issue-data/status',
  'PUT /issue-data/:id/status': 'issue-data/update-status',
  'GET /issue-data/:id/comments': 'issue-data/comments',
  'GET /issue-data/:id/comments/count': 'issue-data/count-comments',
  'POST /issue-data/:id/comment': 'issue-data/create-comment',
  'POST /issue-data/:id/revision': 'issue-data/create-revision',

  'PUT /notification/:id/dismiss': 'notification/dismiss',
  'PUT /notification/:id/read': 'notification/read'
};
