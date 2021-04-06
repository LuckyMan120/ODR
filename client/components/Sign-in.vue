<template>
  <div class="form-style">
    <h1 class="at-title">
      {{ $t('signIn') }}
    </h1>
    <b-form
      @submit.prevent="onSubmit"
    >
      <b-form-group
        label-for="email-input"
        :description="$t('noEmailSharing')"
      >
        <label for="pName">{{ $t('emailAddress') + ':' }}</label>
        <b-form-input
          id="email-input"
          v-model="$v.form.email.$model"
          :state="validate('email')"
          type="email"
          :placeholder="$t('enterEmail')"
          aria-describedby="email-input-feedback"
        />
        <b-form-invalid-feedback
          id="email-input-feedback"
        >
          {{ $t('requiredEmail') }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('password') + ':'"
        label-for="password-input"
      >
        <b-form-input
          id="password-input"
          v-model="$v.form.password.$model"
          :state="validate('password')"
          type="password"
          :placeholder="$t('enterPassword')"
          aria-describedby="password-input-feedback"
        />
        <b-form-invalid-feedback
          id="password-input-feedback"
        >
          {{ $t(`required8Characters`) }}
        </b-form-invalid-feedback>
      </b-form-group>

      <err-alert :message="errMessage" />

      <b-row class="justify-content-md-left">
        <b-col
          cols="12"
        >
          <b-button
            class="at-btn"
            type="submit"
            variant="outline-warning"
            :disabled="$nuxt.$loading && $nuxt.$loading.show"
          >
            {{ $t('submit') }}
          </b-button>
        </b-col>
      </b-row>
      <b-row class="mt-4">
        <b-col
          cols="12"
          class="at-signup-link"
        >
          <p>
            {{ $t('dontHaveAccount') }}
            <nuxt-link
              v-if="!slug && siteType === 'complaints'"
              to="/register"
            >
              {{ $t('register') }}
            </nuxt-link>
            <nuxt-link
              v-else
              :to="`/${slug}/register`"
            >
              {{ $t('register') }}
            </nuxt-link>
          </p>
        </b-col>
      </b-row>
      <b-row class="mt-4 mb-4">
        <b-col
          cols="12"
          class="at-signup-link"
        >
          <p>
            {{ $t('forgotPassword') }}
            <nuxt-link
              v-if="!slug && siteType === 'complaints'"
              to="/request-password-reset"
            >
              {{ $t('passwordReset') }}
            </nuxt-link>
            <nuxt-link
              v-else
              :to="`/${slug}/request-password-reset`"
            >
              {{ $t('passwordReset') }}
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
import {email, required, minLength} from 'vuelidate/lib/validators';
import {mapGetters, mapActions} from 'vuex';

export default {
  mixins: [form, captcha],
  props: {
    slug: {type: String, default: ''}
  },
  data: () => ({
    form: {
      email: '',
      password: ''
    },
    errMessage: ''
  }),
  validations: {
    form: {
      email: {required, email},
      password: {required, minLength: minLength(8)}
    }
  },
  computed: mapGetters({
    siteType: 'site/type'
  }),
  methods: {
    ...mapActions({
      submit: 'user/sign-in'
    }),
    async onSubmit() {
      this.errMessage = '';
      if (this.anyError()) return;
      try {
        const captcha = await this.$recaptcha.execute('signIn');
        await this.submit({
          email: this.form.email,
          password: this.form.password,
          slug: this.slug,
          captcha
        });
        this.$toast.success(
          `${this.$t('successfulSignIn')}`
        );
        this.$emit('login');
      } catch (err) {
        this.errMessage = err.response.data.message;
      }

    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modules/colors";

.at-signup-link {
  text-align: center;
  > p {
    margin: 0px;
    font-size: 15px;
    #at-signUp {
      color: $color_accent;
    }
  }
}
</style>
