

export const actions = {
  async nuxtServerInit({dispatch}) {
    try {
      await dispatch('site/fetchConfig');
      await dispatch('user/me');
    } catch (err) {
      console.log(err);
    }
  }
};
