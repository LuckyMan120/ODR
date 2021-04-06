

describe('issue-data', () => {
  describe('update-status', () => {
    const req = async (
      id,
      data = {},
      cookie = userCookie
    ) => await request()
      .put(`/issue-data/${id}/status`)
      .set('Cookie', cookie)
      .send(data);

    let issueId = null;
    let id = null;

    before(async () => {
      let res = await request()
        .post('/issue/complaint')
        .set('Cookie', userCookie)
        .send({
          name: 'myIssue',
          abn: 13069942552
        });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
      res = await request()
        .post(`/issue/${issueId}/data`)
        .set('Cookie', userCookie)
        .send({
          value: 'test',
          type: 1
        });
      id = res.body.id;
    });

    it('should be able to update issue-data status', async () => {
      const value = 'accepted';
      const res = await req(id, {value});
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('object');
      expect(res.body.value).to.be.eq(value);

      const issueData = await IssueDataStatus.findOne({
        issueData: id
      });
      expect(issueData.value).to.be.eq(value);
    });

    it('should fail with unknown status value', async () => {
      const value = 'bad_status';
      const res = await req(id, {value});
      expect(res.status).to.be.eq(400);
    });
  });
});
