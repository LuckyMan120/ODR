<template>
  <div class="form-style">
    <h1 class="at-title">
      {{ $t('yourCompanyDetails') }}
    </h1>
    <div v-if="submitted">
      <b-alert
        show
        variant="success"
      >
        <h4 class="alert-heading">
          {{ $t("successRegistrationTitle") }}
        </h4>
        <p>
          {{ $t("redirecting") }}
        </p>
      </b-alert>
    </div>

    <b-form @submit.prevent="onSubmit">
      <b-form-group
        :label="$t('company') + ':'"
        label-for="register-company-input"
      >
        <b-form-input
          id="register-company-input"
          v-model="$v.form.company.$model"
          :state="validate('company')"
          type="text"
          :placeholder="$t('enterCompany')"
          aria-describedby="company-input"
          disabled
        />
        <b-form-invalid-feedback
          id="company-input"
        >
          {{ $t("required2Characters") }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('abnInput') + ':'"
        label-for="abn-input"
      >
        <b-form-input
          id="abn-input"
          v-model="$v.form.abn.$model"
          :state="validate('abn')"
          type="text"
          :placeholder="$t('enterAbn')"
          aria-describedby="abn-input-business"
          disabled
        />
        <b-form-invalid-feedback
          id="abn-input-business"
        >
          {{ $t("11numbers") }}
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
          {{ $t("genericRequiredField") }}
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
          {{ $t("genericRequiredField") }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('emailAddress') + ':'"
        label-for="register-email-input"
      >
        <b-form-input
          id="register-email-input"
          v-model="$v.form.email.$model"
          :state="validate('email')"
          type="email"
          :placeholder="$t('enterEmail')"
          aria-describedby="register-email-input-feedback"
          :disabled="submitted || emailDisabled"
          @focus="unique = true"
        />
        <b-form-invalid-feedback id="register-email-input-feedback">
          {{ $t("requiredEmail") }}
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
          {{ $t("genericFieldNumber") }}
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        :label="$t('website') + ':'"
        label-for="website-input"
      >
        <b-form-input
          id="website-input"
          v-model="$v.form.website.$model"
          :state="validate('website')"
          type="text"
          :placeholder="$t('enterWebsite')"
          aria-describedby="website-input-business"
          :disabled="submitted"
        />
        <b-form-invalid-feedback
          v-if="!$v.form.website.required"
          id="website-input-business"
        >
          {{ $t("genericRequiredField") }}
        </b-form-invalid-feedback>
      </b-form-group>

      <err-alert :message="errMessage" />
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
            {{ $t("submit") }}
          </b-button>
        </b-col>
      </b-row>
    </b-form>
  </div>
</template>

<script>
import form from '@/mixins/form.js';
import captcha from '@/mixins/captcha.js';
import {
  required,
  numeric,
  minLength
} from 'vuelidate/lib/validators';
import {email} from '@/validators/index.js';

export default {
  mixins: [form, captcha],
  props: {
    priceId: {type: String, required: true},
    abn: {type: Number, required: true},
    name: {type: String, default: ''}
  },
  data() {
    const data = {
      form: {
        email: '',
        firstName: '',
        lastName: '',
        abn: '',
        phone: '',
        company: '',
        website: '',
        priceId: this.priceId
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
  mounted() {
    this.form.abn = this.abn;
    this.form.company = this.name;
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
      company: {required, String, minLength: minLength(2)},
      phone: {required, numeric},
      abn: {required},
      website: {},
      priceId: {required}
    }
  },
  methods: {
    async onSubmit() {
      if (this.anyError()) return;
      try {
        const captcha = await this.$recaptcha.execute('signIn');
        const res = await this.$axios.post(
          '/org/register',
          {...this.form, captcha}
        );
        this.submitted = true;
        if (res.data.stripeSessionId) {
          setTimeout(() => Stripe(this.$config.STRIPE_PUBLISHABLE_KEY)
            .redirectToCheckout({
              sessionId: res.data.stripeSessionId
            }), 1500);
        }
      } catch (err) {
        console.error(err);
        if (err.response.data.code === 'E_UNIQUE') {
          this.errMessage = this.$t('emailUnique');
          this.unique = false;
        }
      }
    }
  }
};
</script>
