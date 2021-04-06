
module.exports = {
  friendlyName: 'Get party name from user name',
  sync: true,
  inputs: {
    user: {type: 'ref', required: true}
  },
  fn: (user) => {
    if (user.company) {
      return user.company;
    }
    return user.firstname + ' ' + user.lastname;
  }
};

