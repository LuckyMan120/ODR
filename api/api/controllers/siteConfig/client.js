module.exports = {

  friendlyName: 'Client get config',

  description: 'Client get config',

  fn: async function() {
    const allKeys = await SiteConfig.find({
      where: {clientSafe: true},
      select: ['key', 'value']
    });
    return allKeys;
  }

};
