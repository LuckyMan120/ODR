

export default function({app, $toast, $axios}) {
  $axios.onError(err => {
    if (err.response.status === 403) {
      $toast.error(
        `${app.i18n.t('error')}: ${app.i18n.t('forbidden')}`
      );
    } else if (err.response.status === 400) {
      $toast.error(
        `${app.i18n.t('error')}: ${
          err.response?.data?.message ||
          app.i18n.t('serverError')
        }`
      );
    } else if (err.response.status === 500) {
      $toast.error(
        `${app.i18n.t('error')}: ${app.i18n.t('serverError')}`
      );
    }
  });
}
