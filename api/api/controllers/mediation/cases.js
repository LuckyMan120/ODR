/*
list of all unarchived org cases for orgAdmin and orgStaff
(org admin/staff dashboard: list of cases)
List columns: createdAt, case name, Parties names,progress
Sort by: date created (default), name, progress
Filter:
include closed (default false),
no mediator assigned
cases with un accepted caseInvitation
createdAt date range (from, to)
 */
module.exports = {

  friendlyName: 'Cases',

  description: 'Org cases list for org admin/staff.',

  inputs: {
    limit: {type: 'number', defaultsTo: 30},
    skip: {type: 'number', defaultsTo: 0}
  },

  fn: async function({limit, skip}) {
    return await Case.find({
      org: this.req.session.orgId,
      archived: false
    })
    .limit(limit)
    .skip(skip)
    .populate('caseUsers')
    .populate('caseParties');
  }

};
