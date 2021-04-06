

module.exports = {

  friendlyName: 'Count',

  description: 'Count pathways.',

  fn: async function() {
    return {
      count: await Pathway.count(this.req.allParams())
    };

  }

};
