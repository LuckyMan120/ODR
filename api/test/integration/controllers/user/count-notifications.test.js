

describe('user', () => {
  describe('count-notifications', () => {
    const req = async (
      query = {},
      cookie = userCookie
    ) => await request()
      .get('/user/notifications/count')
      .set('Cookie', cookie)
      .query(query);

    it('should return notifications count', async () => {
      const count = await Notification.count({
        user: 6,
        dismissed: false
      });
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.body.count).to.be.eq(count);
    });

    it('should be able to count only non read', async () => {
      await Notification.create({
        text: 'test',
        readAt: new Date().getTime(),
        user: 6
      });
      await Notification.create({
        text: 'test',
        user: 6
      });
      const count = await Notification.count({
        user: 6,
        dismissed: false,
        readAt: 0
      });
      expect(count).to.be.at.least(1);
      const res = await req({
        readAt: 0
      });
      expect(res.body.count).to.be.eq(count);
    });
  });
});
