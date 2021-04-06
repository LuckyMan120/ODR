

module.exports = {
  friendlyName: 'Validate ABN',
  sync: true,
  inputs: {
    abn: {type: 'number', required: true}
  },
  fn: ({abn}) => {
    return abn.toString().length === 11;
  }
};
