

describe('common', () => {
  describe('/ping', () => {
    const req = async () => request()
      .get('/ping')
      .send();

    it('should pong', async () => {
      const res = await req();
      expect(res.status).to.be.eq(200);
      expect(res.text).to.be.eq('pong');
    });
  });
});
