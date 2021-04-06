

<template>
  <div class="form-style">
    <h1 class="at-title">
      {{ title }}
    </h1>
    <b-form @submit.prevent="onSubmit">
      <b-form-group
        :label="$t('password') + ':'"
        label-for="password-reset-password-input"
        :description="`${$t('for')} ${email}`"
      >
        <b-form-input
          id="password-reset-password-input"
          v-model="$v.form.password.$model"
          :state="validate('password')"
          type="password"
          :placeholder="$t('enterPassword')"
          aria-describedby="password-reset-password-input-feedback"
        />
        <b-form-invalid-feedback
          id="password-reset-password-input-feedback"
        >
          {{ $t(`required8CharactersAndNumbers`) }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('confirmPassword') + ':'"
        label-for="password-reset-password-input"
      >
        <b-form-input
          id="password-reset-password-input"
          v-model="$v.form.confirmPassword.$model"
          :state="validate('confirmPassword')"
          type="password"
          :placeholder="$t('enterPassword')"
          aria-describedby="password-reset-password-input-feedback"
        />
        <b-form-invalid-feedback
          id="password-reset-password-input-feedback"
        >
          {{ $t(`passwordsDoNotMatch`) }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-row class="justify-content-md-left">
        <b-col
          cols="12"
        >
          <b-button
            id="at-btn"
            type="submit"
            variant="outline-warning"
            :disabled="$nuxt.$loading && $nuxt.$loading.show"
          >
            {{ $t('submit') }}
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>

import form from '@/mixins/form.js';
import captcha from '@/mixins/captcha.js';
import {required, minLength, sameAs} from 'vuelidate/lib/validators';
import {password} from '@/validators/index.js';
import {mapActions} from 'vuex';

export default {
  mixins: [form, captcha],
  props: {
    title: {type: String, default: ''},
    email: {type: String, required: true},
    token: {type: String, required: true}
  },
  data: () => ({
    form: {
      password: '',
      confirmPassword: ''
    }
  }),
  validations: {
    form: {
      password: {
        required,
        minLength: minLength(8),
        password
      },
      confirmPassword: {
        sameAsPassword: sameAs('password')
      }
    }
  },
  methods: {
    ...mapActions({
      submit: 'user/sign-in'
    }),
    async onSubmit() {
      if (this.anyError()) return;
      try {
        const captcha = await this.$recaptcha.execute('signIn');
        const res = await this.$axios.post('/user/password-reset', {
          email: this.email,
          token: this.token,
          password: this.form.password,
          captcha
        });
        if (res.status === 200) {
          this.$toast.success(
            `${this.$t('updated')}`
          );
          const captcha = await this.$recaptcha.execute('signIn');
          await this.submit({
            email: this.email,
            password: this.form.password,
            captcha
          });
          this.$toast.success(
            `${this.$t('successfulSignIn')}`
          );
          this.$emit('login');
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
