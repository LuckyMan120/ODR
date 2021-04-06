

module.exports = {

  friendlyName: 'Dismiss all notifications',

  description: 'Dismiss and read all users notifications',

  fn: async function() {
    return await Notification.update({
      user: this.req.session.userId
    }).set({
      readAt: new Date().getTime(),
      dismissed: true
    });
  }

};
