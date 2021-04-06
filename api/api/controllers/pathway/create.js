module.exports = {

  friendlyName: 'Create',

  description: 'Create pathway.',

  inputs: {
    active: {type: 'boolean', defaultsTo: true},
    translations: {type: 'ref'}
  },

  fn: async function({active, translations}) {
    const pathwayId = await sails
      .getDatastore()
      .transaction(async tx => {
        const {id: pathway} = await Pathway
          .create({active})
          .usingConnection(tx)
          .fetch();
        for (const locale in translations) {
          if (Object.hasOwnProperty.call(translations, locale)) {
            const {name} = translations[locale];
            await PathwayTranslation
              .create({
                pathway,
                locale,
                name
              })
              .usingConnection(tx);
          }
        }
        return pathway;
      });
    return await Pathway.findOneTranslate(pathwayId);
  }

};
