module.exports = {

  friendlyName: 'Update',

  description: 'Update pathway.',

  inputs: {
    id: {type: 'number', required: true},
    active: {type: 'boolean', defaultsTo: true},
    translations: {type: 'ref'}
  },

  exits: {

  },

  fn: async function({id, active, translations}) {
    const pathwayId = await sails
      .getDatastore()
      .transaction(async tx => {
        const {id: pathway} = await Pathway
          .updateOne(id)
          .set({active})
          .usingConnection(tx);
        for (const locale in translations) {
          if (Object.hasOwnProperty.call(translations, locale)) {
            const {name} = translations[locale];
            const {id: pathwayTranslateId} = await PathwayTranslation
              .findOrCreate({
                pathway,
                locale
              }, {
                pathway,
                locale,
                name
              })
              .usingConnection(tx);
            await PathwayTranslation
              .updateOne(pathwayTranslateId)
              .set({
                name
              })
              .usingConnection(tx);
          }
          return pathway;
        }
      });
    return await Pathway.findOneTranslate(pathwayId);
  }

};
