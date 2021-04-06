

describe('user', () => {
  describe('notifications', () => {
    const req = async (
      query = {},
      cookie = userCookie
    ) => await request()
      .get('/user/notifications')
      .set('Cookie', cookie)
      .query(query);

    before(async () => {
      await Notification.create({
        text: 'test',
        user: 6
      });
      await Notification.create({
        text: 'test',
        user: 6,
        dismissed: true
      });
      await Notification.create({
        text: 'test',
        user: 7
      });
    });

    it('should be able to get user notifications', async () => {
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
      let lastId = 1000;
      for (let i = 0; i < res.body.length; i++) {
        const notification = res.body[i];
        expect(lastId).to.be.above(notification.id);
        lastId = notification.id;
        expect(notification.dismissed).to.be.eq(false);
        expect(notification.user).to.be.eq(6);
      }
    });

    it('should paginate notifications', async () => {
      const res = await req({
        limit: 1,
        skip: 0
      });
      expect(res.body.length).to.be.eq(1);
    });
  });
});
