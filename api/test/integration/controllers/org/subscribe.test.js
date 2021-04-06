

describe('org', () => {
  describe('subscribe', () => {

    it('should refuse if request with http', async () => {
      const res = await request()
        .post('/org/subscribe')
        .set('Cookie', userCookie)
        .send();
      expect(res.status).to.be.eq(400);
      expect(res.body.message).to.be.eq(
        'This request is socket only'
      );
    });

    it('should be able to call subscribe', async () => {
      const res = await new Promise(resolve => {
        io.socket.post('/org/subscribe', (body, jwr) => resolve(jwr));
      });
      expect(res.statusCode).to.be.eq(200);
    });

    it('should receive published events after subscribe', done => {
      const data = {foo: 'bar'};
      io.socket.on('org', msg => {
        expect(msg).to.be.eql(data);
        done();
      });
      setTimeout(() => Org.publish([2], data), 0);
    });

  });
});
