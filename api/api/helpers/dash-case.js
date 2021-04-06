

module.exports = {
  friendlyName: 'Validate Slug',
  sync: true,
  inputs: {
    string: {type: 'string', required: true}
  },
  fn: ({string}) => string
    .toLowerCase()
    .replace(/\W+/g, ' ')
    .split(/ |\B(?=[A-Z])/)
    .map(word => word.toLowerCase())
    .join('-')
};
