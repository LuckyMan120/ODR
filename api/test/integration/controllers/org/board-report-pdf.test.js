

describe('org', () => {
  describe('board-report-pdf', () => {
    const req = async (
      query = {},
      cookie = testOrgStaffCookie
    ) => await request()
      .get('/org/board-report-pdf')
      .set('Cookie', cookie)
      .query(query);

    it('should respond with board report pdf', async () => {
      const res = await req({
        start: Date.now(),
        end: Date.now()
      });
      expect(res.status).to.be.eq(200);
      expect(res.headers['content-type']).to.be.eq('application/pdf');
    });
  });
});
