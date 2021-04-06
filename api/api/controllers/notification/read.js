

module.exports = {

  friendlyName: 'Read',

  description: 'Read a notification.',

  inputs: {
    id: {type: 'number', required: true}
  },

  exits: {
    notFound: {
      responseType: 'notFound'
    }
  },

  fn: async function({id}) {
    const notification = await Notification.findOne({
      id,
      user: this.req.session.userId
    });
    if (!notification) throw 'notFound';
    return await Notification.updateOne(id).set({
      readAt: new Date().getTime()
    });
  }

};
