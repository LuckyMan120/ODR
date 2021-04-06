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
          variant="success"
        >
          <h4 class="alert-heading">
            {{ titleMsg }}
          </h4>
          <p>
            {{ msg }}
          </p>
        </b-alert>
      </div>
    </b-col>
  </b-row>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  layout: 'pre-auth',

  computed: {
    ...mapGetters({
      user: 'user/user'
    }),
    titleMsg() {
      if (this.user) {
        return this.$t('paymentsuccess');
      } else {
        return this.$t('welcome');
      }
    },
    msg() {
      if (this.user) {
        return this.$t('paymentSuccessUser');
      } else {
        return this.$t('paymentSuccessNonUser');
      }
    }
  },
  mounted() {
    if (this.user) this.$router.push('/');
  }
};
</script>
