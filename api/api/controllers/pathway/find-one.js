

module.exports = {

  friendlyName: 'Find one',

  description: 'Find one pathway',

  inputs: {
    id: {type: 'number', required: true},
    translations: {type: 'boolean', defaultsTo: false}
  },

  fn: async function({id, translations}) {
    if (!translations) {
      return await Pathway.findOneTranslate(id);
    } else {
      const translations = await PathwayTranslation.find({pathway: id});
      return {
        ...(await Pathway.findOne(id)),
        translations: translations.reduce((res, tr) => {
          res[tr.locale] = {name: tr.name};
          return res;
        }, {})
      };
    }
  }

};
