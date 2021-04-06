

describe('org', () => {
  describe('unsubscribe', () => {
    it('should refuse if request with http', async () => {
      const res = await request()
        .post('/org/unsubscribe')
        .set('Cookie', userCookie)
        .send();
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq(
        'This request is socket only'
      );
    });

    it('should be able to call unsubscribe', async () => {
      const res = await new Promise(resolve => {
        io.socket.post('/org/unsubscribe', (body, jwr) => resolve(jwr));
      });
      expect(res.statusCode).to.be.eq(200);
    });

  });
});
