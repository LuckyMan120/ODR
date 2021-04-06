

const isSlug = /^[a-z0-9-]+$/;

module.exports = {
  friendlyName: 'Validate Slug',
  sync: true,
  inputs: {
    slug: {type: 'string', required: true}
  },
  fn: ({slug}) => isSlug.test(slug) && slug.length >= 4
};
