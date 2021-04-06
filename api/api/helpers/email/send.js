

module.exports = {
  friendlyName: 'Send',

  description: 'Send email.',

  inputs: {
    template: {type: 'string', required: true},
    data: {type: 'ref', required: true},
    options: {type: 'ref', required: true}
  },

  fn: async function({template, data, options}) {

    // find siteName
    const siteName = await SiteConfig
    .findOne({where: {key: 'siteName'}, select: ['value']});

    // add siteName
    data.siteName = siteName.value;

    // add logo image
    options.attachments = [
      {
        filename: 'logo.png',
        path: './assets/images/logo.png',
        cid: 'logo'
      }
    ];

    return new Promise((resolve, reject) => {
      sails.hooks.email.send(
        template,
        data,
        options,
        err => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
};

