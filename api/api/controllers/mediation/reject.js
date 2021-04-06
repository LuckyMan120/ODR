module.exports = {

  friendlyName: 'Reject my case invitation',

  description: 'An invited participant rejected invitation from other party',

  inputs: {
    caseId: {type: 'number', required: true}
  },

  fn: async function(inputs) {

    const user = await User.findOne(this.req.session.userId);

    const caseInvitation = await CaseInvitation.findOne(user.email);

    //@todo if(!caseInvitation)
    //   Throw a meaningful message
    //   notFound: {
    //     message: sails.__('User not found in this org')
    //   }
    // };

    const now = new Date();

    // create a caseActivity
    await sails.helpers.case.createCaseActivity(
      {
        caseId: inputs.caseId,
        activityType: 6
      }
    );

    return await CaseInvitation.updateOne({
      id: caseInvitation.id
    }).set({rejectedAt: now}).fetch();
  }

};
