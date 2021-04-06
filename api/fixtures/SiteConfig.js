
module.exports = [
  {
    id: 1,
    key: 'siteName',
    value: 'Guided Resolution',
    inputType: 'text',
    desc: 'Site Name',
    clientSafe: true
  },
  {
    id: 2,
    key: 'siteTypes',
    value: 'complaints',
    data: 'complaints,mediations',
    inputType: 'dropdown',
    desc: 'Allowed dispute types in this site,' +
      ' can only be mediation and/or complaint' +
      ' (lower case and no typos!)',
    clientSafe: true
  }
];
