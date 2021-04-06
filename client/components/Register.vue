

<template>
  <div class="form-style">
    <div v-if="submitted">
      <b-row class="text-center">
        <b-col
          cols="12"
        >
          <h4 class="alert-heading">
            {{ $t('successRegistrationTitle') }}
          </h4>
        </b-col>
      </b-row>
      <b-row class="text-center">
        <b-col
          cols="12"
        >
          <h4>
            {{ $t('validationEmailSent') }}
          </h4>
        </b-col>
      </b-row>
    </div>

    <div v-else>
      <h1 class="at-title">
        {{ $t('registerNewAccount') }}
      </h1>
      <b-form
        @submit.prevent="onSubmit"
      >
        <b-form-group>
          <label for="register-email-input">{{ $t('emailAddress') + ':' }}</label>
          <b-form-input
            id="register-email-input"
            v-model="$v.form.email.$model"
            :state="validate('email')"
            type="email"
            :placeholder="$t('enterEmail')"
            aria-describedby="register-email-input-feedback"
            :disabled="submitted || emailDisabled"
            @input="unique = true"
          />
          <b-form-invalid-feedback id="register-email-input-feedback">
            <template v-if="!unique">
              {{ $t('emailUnique') }}
            </template>
            <template v-else>
              {{ $t('requiredEmail') }}
            </template>
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          :label="$t('firstName') + ':'"
          label-for="firstName-input"
        >
          <b-form-input
            id="firstName-input"
            v-model="$v.form.firstName.$model"
            :state="validate('firstName')"
            type="text"
            :placeholder="$t('enterFirstName')"
            aria-describedby="firstName-input-feedback"
            :disabled="submitted"
          />
          <b-form-invalid-feedback
            id="firstName-input-feedback"
          >
            {{ $t('genericRequiredField') }}
          </b-form-invalid-feedback>

          <b-form-invalid-feedback
            id="firstName-input-feedback"
          >
            {{ $t('genericFieldString') }}
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          :label="$t('lastName') + ':'"
          label-for="lastName-input"
        >
          <b-form-input
            id="lastName-input"
            v-model="$v.form.lastName.$model"
            :state="validate('lastName')"
            type="text"
            :placeholder="$t('enterLastName')"
            aria-describedby="lastName-input-feedback"
            :disabled="submitted"
          />
          <b-form-invalid-feedback
            id="lastName-input-feedback"
          >
            {{ $t('genericRequiredField') }}
          </b-form-invalid-feedback>

          <b-form-invalid-feedback
            id="lastName-input-feedback"
          >
            {{ $t('genericFieldString') }}
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          :label="$t('phone') + ':'"
          label-for="phone-input"
        >
          <b-form-input
            id="phone-input"
            v-model="$v.form.phone.$model"
            type="text"
            :state="validate('phone')"
            :placeholder="$t('enterPhone')"
            aria-describedby="phone-input-feedback"
            :disabled="submitted"
          />

          <b-form-invalid-feedback id="phone-input-feedback">
            {{ $t('genericFieldNumber') }}
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          :label="$t('company') + ':'"
          label-for="register-company-input"
        >
          <b-form-input
            id="register-company-input"
            v-model="$v.form.company.$model"
            type="text"
            :state="validate('company')"
            :placeholder="$t('enterCompany')"
            aria-describedby="company-input-feedback"
            :disabled="submitted"
          />
          <b-form-invalid-feedback id="company-input-feedback">
            {{ $t('genericFieldString') }}
          </b-form-invalid-feedback>
        </b-form-group>

        <err-alert :message="errMessage" />

        <b-row class="text-center">
          <b-col cols="12">
            <b-button
              id="at-btn"
              type="submit"
              class="at-btn"
              variant="outline-warning"
              :disabled="($nuxt.$loading && $nuxt.$loading.show) || submitted"
            >
              {{ $t('register') }}
            </b-button>
          </b-col>
        </b-row>
        <b-row class="justify-content-md-left">
          <b-col
            v-if="slug"
            cols="12"
            class="at-signin-link"
          >
            <p>
              {{ $t('alreadyAccount') }}
              <nuxt-link
                id="at-signIn"
                :to="`/${slug}`"
              >
                {{ $t('signIn') }}
              </nuxt-link>
            </p>
          </b-col>
          <b-col
            v-if="!slug"
            cols="12"
            class="at-signin-link"
          >
            <p>
              {{ $t('alreadyAccount') }}
              <nuxt-link
                id="at-signIn"
                to="/sign-in"
              >
                {{ $t('signIn') }}
              </nuxt-link>
            </p>
            <div class="mt-4">
              <!-- eslint-disable-next-line -->
              <small v-html="$t('agreeingToTermsOfUse')"><small /></small>
            </div>
          </b-col>
        </b-row>
      </b-form>
    </div>
  </div>
</template>

<script>

import form from '@/mixins/form.js';
import captcha from '@/mixins/captcha.js';
import {required, numeric} from 'vuelidate/lib/validators';
import {mapActions} from 'vuex';
import {email} from '@/validators/index.js';

export default {
  mixins: [form, captcha],
  props: {
    slug: {type: String, default: ''},
    email: {type: String, default: ''},
    token: {type: String, default: ''}
  },
  data() {
    const data = {
      form: {
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        company: ''
      },
      submitted: false,
      errMessage: '',
      unique: true,
      emailDisabled: false
    };
    if (this.email) {
      data.form.email = this.email;
      data.emailDisabled = true;
    }
    return data;
  },
  validations: {
    form: {
      email: {
        required,
        email,
        unique() {
          return this.unique;
        }
      },
      firstName: {required},
      lastName: {required},
      phone: {numeric},
      company: {}
    }
  },
  methods: {
    ...mapActions({
      submit: 'user/register'
    }),
    async onSubmit() {
      if (this.anyError()) return;
      try {
        const captcha = await this.$recaptcha.execute('signIn');
        const token = await this.submit({
          ...this.form,
          slug: this.slug,
          token: this.token,
          captcha
        });
        if (token) {
          this.$router.push(
            `/finish-registration?email=${this.form.email}&token=${token}`
          );
        } else {
          this.submitted = true;
        }
      } catch (err) {
        if (err.response.data.code === 'E_UNIQUE') {
          this.errMessage = err.response?.data?.message ||
            this.$t('emailUnique');
          this.unique = false;
        }
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modules/colors";

.at-signin-link {
  margin-top: 20px;
  margin-bottom: 30px;
  text-align: center;
  > p {
    margin: 0px;
    font-size: 15px;
    #at-signIn {
      color: $color_accent;
    }
  }
}
</style>
