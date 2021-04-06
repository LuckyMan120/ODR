

const emailReg = /^\+?\w+([+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

module.exports = {
  friendlyName: 'Validate Email',
  sync: true,
  inputs: {
    email: {type: 'string', required: true}
  },
  fn: ({email}) => emailReg.test(email)
};
