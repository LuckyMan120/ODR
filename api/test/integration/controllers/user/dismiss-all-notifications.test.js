

describe('notification', () => {
  describe('read-all-notifications', () => {
    const req = async (
      cookie = userCookie
    ) => await request()
      .put(`/user/notifications/dismiss-all`)
      .set('Cookie', cookie);

    it('should read all', async () => {
      await Notification.create({
        text: 'test 0',
        user: 6
      });
      await Notification.create({
        text: 'test 1',
        user: 6
      });
      await Notification.create({
        text: 'test 2',
        user: 6
      });
      const res = await req();
      expect(res.status).to.be.eq(200);
      const notifications = await Notification.find({user: 6});
      for (let i = 0; i < notifications.length; i++) {
        const notification = notifications[i];
        expect(notification.dismissed).to.be.true;
        expect(notification.readAt).to.be.at.least(1);
      }
    });
  });
});
