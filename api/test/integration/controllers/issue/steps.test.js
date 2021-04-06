

describe('issue', () => {
  describe('steps', () => {
    const req = async (
      id,
      cookie = testOrgUserCookie
    ) => await request()
      .get(`/issue/${id}/steps`)
      .set('Cookie', cookie)
      .query();

    let issueId = null;

    before(async () => {
      const res = await request()
        .post('/issue/complaint')
        .set('Cookie', testOrgUserCookie)
        .send({
          name: 'myIssue',
          abn: 29642463125
        });
      expect(res.status).to.be.eq(200);
      issueId = res.body.id;
    });

    it('should return steps', async () => {
      const res = await req(issueId);
      expect(res.status).to.be.eq(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.be.at.least(1);
      expect(res.body[0]).to.not.have.property('createdAt');
      expect(res.body[0]).to.not.have.property('updatedAt');

      let lastSortOrder = null;
      for (const step of res.body) {
        if (lastSortOrder) {
          expect(step.sortOrder).to.be.above(lastSortOrder);
        }
        lastSortOrder = step.sortOrder;

        expect(step.state).to.be.an('object');
        expect(step.state).to.have.property('show');
        expect(step.state).to.have.property('enabled');
        expect(step.state).to.have.property('completed');
        expect(step.state).to.have.property('completedAt');
        expect(step.state).to.have.property('startedAt');

        // expect(step.components).to.be.an('array');

        let lastSortOrderChild = null;
        for (const childStep of step.steps) {
          if (lastSortOrderChild) {
            expect(childStep.sortOrder).to.be.above(lastSortOrderChild);
          }
          lastSortOrderChild = step.sortOrder;

          expect(childStep.state).to.be.an('object');
          expect(childStep.state).to.have.property('show');
          expect(childStep.state).to.have.property('enabled');
          expect(childStep.state).to.have.property('completed');
          expect(childStep.state).to.have.property('completedAt');
          expect(childStep.state).to.have.property('startedAt');

          // expect(childStep.components).to.be.an('array');
        }
      }
    });
  });
});
