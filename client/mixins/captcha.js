

export default {
  async mounted() {
    try {
      await this.$recaptcha.init();
    } catch (e) {
      console.error(e);
    }
  },
  beforeDestroy() {
    this.$recaptcha.destroy();
  }
};
