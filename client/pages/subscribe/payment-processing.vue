<template>
  <b-alert
    show
    variant="success"
  >
    <h4 class="alert-heading">
      {{ $t('paymentProcessing') }}
    </h4>
    <p>
      {{ $t('pleaseVerifyYourEmail') }}
    </p>
  </b-alert>
</template>

<script>
export default {
  layout: 'pre-auth-form'
};
</script>
