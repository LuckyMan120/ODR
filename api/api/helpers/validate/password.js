

const hasNumber = /\d/;

module.exports = {
  friendlyName: 'Validate Password',
  sync: true,
  inputs: {
    password: {type: 'string', required: true}
  },
  fn: ({password}) => hasNumber.test(password) && password.length >= 8
};
