<template>
  <b-row class="mt-4 justify-content-md-center">
    <b-col
      md="7"
      cols="9"
    >
      <div class="mt-5">
        <b-alert
          show
          class="py-4"
          variant="danger"
        >
          <h4 class="alert-heading">
            {{ $t(`paymenterror`) }}
          </h4>
          <p>
            {{ $t(`paymenterror`) }}
            {{ $t(`paymenterrorcontent`) }}
          </p>
          <hr>
          <p class="mb-0">
            <nuxt-link to="/">
              {{ $t(`backToHomepahe`) }}
            </nuxt-link>
          </p>
        </b-alert>
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  layout: 'pre-auth-form'
};
</script>
