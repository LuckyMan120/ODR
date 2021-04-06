

<template>
  <div>
    <b-row class="mt-4 justify-content-md-left">
      <b-col
        md="6"
        cols="12"
      >
        <User
          :user="user"
          :is-profile="true"
        />
      </b-col>
    </b-row>
    <b-row class="mt-3">
      <b-col>
        <h4>
          {{ $t('password') }}
        </h4>
        <b-button
          variant="outline-info"
          :disabled="submitted || ($nuxt.$loading && $nuxt.$loading.show)"
          @click="passwordReset"
        >
          {{ $t('passwordResetRequest') }}
        </b-button>
        <b-alert
          :show="submitted"
          variant="warning"
          class="mt-4"
        >
          {{ $t('successPasswordReset') }}
        </b-alert>
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  pageTitle: 'profile',
  data: () => ({
    submitted: false
  }),
  computed: mapGetters({
    user: 'user/user'
  }),
  methods: {
    passwordReset() {
      try {
        this.$axios.$post('/user/request-password-reset', {
          email: this.user.email
        });
        this.submitted = true;
        this.$toast.success(
          `${this.$t('successPasswordReset')}`
        );
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
