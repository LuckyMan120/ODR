

<template>
  <div class="form-style">
    <h1 class="at-title">
      {{ $t('requestPasswordReset') }}
    </h1>
    <div v-if="submitted">
      <b-alert
        show
        variant="success"
      >
        {{ $t('successPasswordReset') }}
      </b-alert>
    </div>

    <b-form @submit.prevent="submit">
      <b-form-group
        :label="$t('emailAddress') + ':'"
        label-for="pswd-reset-email-address-input"
      >
        <b-form-input
          id="pswd-reset-email-address-input"
          v-model="$v.form.email.$model"
          :state="validate('email')"
          type="email"
          :placeholder="$t('enterEmail')"
          aria-describedby="pswd-reset-email-input-feedback"
        >
          <b-form-invalid-feedback
            id="pswd-reset-email-input-feedback"
          >
            {{ $t('requiredEmail') }}
          </b-form-invalid-feedback>
        </b-form-input>
      </b-form-group>

      <b-row class="justify-content-md-left">
        <b-col
          cols="12"
        >
          <b-button
            id="at-btn"
            type="submit"
            variant="outline-warning"
            :disabled="($nuxt.$loading && $nuxt.$loading.show) || submitted"
          >
            {{ $t('submit') }}
          </b-button>
        </b-col>
      </b-row>
      <b-row class="mt-4 mb-4">
        <b-col
          cols="12"
          class="at-signup-link"
        >
          <p>
            {{ $t('backTo') }}
            <nuxt-link to="/sign-in">
              {{ $t('signIn') }}
            </nuxt-link>
          </p>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>

import form from '@/mixins/form.js';
import captcha from '@/mixins/captcha.js';
import {required, email} from 'vuelidate/lib/validators';

export default {
  mixins: [form, captcha],
  data: () => ({
    form: {
      email: ''
    },
    submitted: false
  }),
  validations: {
    form: {
      email: {required, email}
    }
  },
  methods: {
    async submit() {
      if (this.anyError()) return;
      const captcha = await this.$recaptcha.execute('signIn');
      try {
        await this.$axios.$post(
          '/user/request-password-reset',
          {...this.form, captcha}
        );
        this.submitted = true;
      } catch (err) {
        console.log(err);
      }

    }
  }
};
</script>
