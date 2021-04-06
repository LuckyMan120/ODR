
const sails = require('sails');
const rc = require('sails/accessible/rc');
const chai = require('chai');
const chaiHttp = require('chai-http');

const socketIOClient = require('socket.io-client');
const sailsIOClient = require('sails.io.js');

process.env.NODE_ENV = 'test';

chai.use(chaiHttp);

process.env['NODE_ENV'] = 'test';

global.expect = chai.expect;

global.signIn = async ({email, password, slug}) => {
  try {
    const res = await request()
      .post('/user/sign-in')
      .send({email, password, slug});
    return res.header['set-cookie'][0];
  } catch (err) {
    console.log(err);
  }
};

before(done => sails.lift(rc('sails'), async err => {
  global.request = (app = sails.hooks.http.app) => chai.request(app);

  global.superadminCookie = await signIn({
    email: 'superadmin@nkb.com',
    password: '1234abcd'
  });
  global.adminCookie = await signIn({
    email: 'admin@nkb.com',
    password: '1234abcd'
  });
  global.userCookie = await signIn({
    email: 'user@nkb.com',
    password: '1234abcd'
  });

  global.testOrgAdminCookie = await signIn({
    email: 'orgAdmin@test.org',
    password: '1234abcd',
    slug: 'test-org'
  });
  global.testOrgStaffCookie = await signIn({
    email: 'orgStaff@test.org',
    password: '1234abcd',
    slug: 'test-org'
  });
  global.testOrgUserCookie = await signIn({
    email: 'orgUser@test.org',
    password: '1234abcd',
    slug: 'test-org'
  });

  global.noOrgUserCookie = await signIn({
    email: 'noOrgUser@test.org',
    password: '1234abcd'
  });
  global.updateUserCookie = await signIn({
    email: 'updateUserCookie@test.org',
    password: '1234abcd'
  });

  global.singleOrgUserCookie = await signIn({
    email: 'singleOrgUser@test.org',
    password: '1234abcd',
    slug: 'org-slug'
  });

  const io = sailsIOClient(socketIOClient);
  io.sails.url = sails.config.custom.baseURL;
  const headers = {
    'Cookie': testOrgStaffCookie
  };
  io.sails.initialConnectionHeaders = headers;
  io.sails.headers = headers;
  global.io = io;

  done(err);
}));
after(done => sails.lower(err => done(err)));
