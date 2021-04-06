

describe('notification', () => {
  describe('dismiss', () => {
    const req = async (
      id,
      cookie = userCookie
    ) => await request()
      .put(`/notification/${id}/dismiss`)
      .set('Cookie', cookie)
      .send();

    it('should be able to dismiss a notification', async () => {
      let notification = await Notification.create({
        text: 'testNotificationText',
        user: 6
      }).fetch();
      expect(notification.dismissed).to.be.eq(false);
      const res = await req(notification.id);
      expect(res.status).to.be.eq(200);
      notification = await Notification.findOne(notification.id);
      expect(notification.dismissed).to.be.eq(true);
      expect(notification.readAt).to.be.at.least(1);
    });

    it('should not be able to dismiss a notification of another user',
      async () => {
        let notification = await Notification.create({
          text: 'testNotificationText',
          user: 7
        }).fetch();
        expect(notification.dismissed).to.be.eq(false);
        const res = await req(notification.id);
        expect(res.status).to.be.eq(404);
        notification = await Notification.findOne(notification.id);
        expect(notification.dismissed).to.be.eq(false);
      }
    );
  });
});
