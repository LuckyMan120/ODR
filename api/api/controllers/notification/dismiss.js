

module.exports = {

  friendlyName: 'Dismiss',

  description: 'Dismiss a notification.',

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
      dismissed: true,
      readAt: new Date().getTime()
    });
  }

};
