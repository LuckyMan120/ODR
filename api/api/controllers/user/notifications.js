

module.exports = {

  friendlyName: 'Notifications',

  description: 'Users notifications.',

  inputs: {
    limit: {type: 'number', defaultsTo: 30},
    skip: {type: 'number', defaultsTo: 0}
  },

  fn: async function({limit, skip}) {
    return await Notification.find({
      user: this.req.session.userId,
      dismissed: false
    })
    .limit(limit)
    .skip(skip)
    .sort('id DESC');
  }

};
