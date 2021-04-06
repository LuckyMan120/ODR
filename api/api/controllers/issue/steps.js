

module.exports = {

  friendlyName: 'Steps',

  description: 'Issue steps.',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id}) {
    const issueUser = await IssueUser.findOne({
      issue: id,
      user: this.req.session.userId
    }).select(['id', 'party']);
    if (!issueUser) throw 'notFound';

    const {pathway} = await Issue
      .findOne({id})
      .select(['pathway']);

    const steps = await PathwayStep.find({
      pathway,
      parent: null
    }).sort('sortOrder');

    for (const step of steps) {
      step.steps = await PathwayStep.find({
        pathway,
        parent: step.id
      });

      for (const childStep of step.steps) {
        childStep.state = await IssuePartyStep.findOne({
          party: issueUser.party,
          issue: id,
          step: childStep.id
        }).select([
          'show',
          'enabled',
          'completed',
          'completedAt',
          'startedAt'
        ]);
      }

      step.state = await IssuePartyStep.findOne({
        party: issueUser.party,
        issue: id,
        step: step.id
      }).select([
        'show',
        'enabled',
        'completed',
        'completedAt',
        'startedAt'
      ]);
    }

    return steps;
  }

};
