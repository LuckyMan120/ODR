

module.exports = {

  friendlyName: 'Count notifications',

  description: 'Count notifications of a user',

  inputs: {
    readAt: {type: 'number'}
  },

  fn: async function({readAt}) {
    const where = {
      user: this.req.session.userId,
      dismissed: false
    };
    if (readAt !== undefined) where.readAt = readAt;
    return {
      count: await Notification.count(where)
    };
  }

};
