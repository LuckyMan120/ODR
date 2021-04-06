

export default {
  data: () => ({
    form: {}
  }),
  validations: {
    form: {}
  },
  methods: {
    validate(name) {
      const {$dirty, $error} = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    anyError() {
      this.$v.$touch();
      return this.$v.$anyError;
    }
  }
};
