<template>
  <div>
    <div v-if="submitted">
      <b-alert
        show
        variant="success"
      >
        <h4 class="alert-heading">
          {{ $t('redirecting') }}
        </h4>
      </b-alert>
    </div>
    <div v-else>
      <p>
        {{ $t('companyDetailExplanation') }}
      </p>
    </div>

    <b-form
      @submit.prevent="onSubmit"
    >
      <b-form-group v-if="form.abn">
        <b-form-group
          :label="$t('companyName') + ':'"
          label-for="name-input"
          label-cols-sm="4"
          label-align-sm="right"
        >
          <b-form-input
            id="name-input"
            v-model="$v.form.name.$model"
            :state="validate('name')"
            type="text"
            :placeholder="$t('enterCompany')"
            aria-describedby="name-input-feedback"
            disabled
            @input="exists = false"
          />
          <b-form-invalid-feedback
            id="name-input-feedback"
          >
            {{ $t('required2Characters') }}
          </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group
          :label="$t('website') + ':'"
          label-for="website-input"
          label-cols-sm="4"
          label-align-sm="right"
        >
          <b-form-input
            id="website-input"
            v-model="$v.form.website.$model"
            type="text"
            :placeholder="$t('enterWebsite')"
            :disabled="submitted"
          />
        </b-form-group>

        <b-form-group
          :label="$t('companyPhone') + ':'"
          label-for="phone-input"
          label-cols-sm="4"
          label-align-sm="right"
        >
          <b-form-input
            id="phone-input"
            v-model="$v.form.phone.$model"
            type="text"
            :placeholder="$t('enterPhone')"
            aria-describedby="phone-input-feedback"
            :disabled="submitted"
          />

          <b-form-invalid-feedback id="phone-input-feedback">
            {{ $t("genericFieldNumber") }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-form-group>

      <b-form-group
        :label="$t('abn') + ':'"
        label-for="abn-input"
        label-cols-sm="4"
        label-align-sm="right"
      >
        <b-form-input
          id="abn-input"
          v-model="$v.form.abn.$model"
          type="text"
          :placeholder="$t('enterWebsite')"
          disabled
        />
      </b-form-group>

      <b-row class="justify-content-md-center">
        <b-col
          cols="12"
          class="text-center"
        >
          <b-button
            variant="outline-warning"
            :disabled="$nuxt.$loading && $nuxt.$loading.show"
            class="mt-2"
            @click="searchAgain"
          >
            {{ $t('searchAgain') }}
          </b-button>
          <b-button
            v-if="form.abn"
            type="submit"
            variant="primary"
            class="mt-2"
            :disabled="($nuxt.$loading && $nuxt.$loading.show) || submitted"
          >
            {{ $t('submit') }}
          </b-button>
        </b-col>
      </b-row>

      <err-alert :message="errMessage" />
    </b-form>
  </div>
</template>

<script>
import form from '@/mixins/form.js';
import {required, minLength} from 'vuelidate/lib/validators';

export default {
  mixins: [form],
  props: {
    priceId: {type: String, required: true},
    abn: {type: Number, required: true},
    name: {type: String, default: ''}
  },
  data() {
    return {
      form: {
        name: this.name,
        abn: this.abn,
        website: '',
        phone: '',
        priceId: this.priceId
      },
      submitted: false,
      errMessage: '',
      exists: false
    };
  },
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(2),
        exists() {
          return !this.exists;
        }
      },
      abn: {required},
      website: {},
      phone: {},
      priceId: {required}
    }
  },
  methods: {
    async onSubmit() {
      if (this.anyError()) return;

      try {
        const res = await this.$axios.post('/user/org', this.form);
        this.submitted = true;
        if (res.data.stripeSessionId) {
          setTimeout(() => Stripe(this.$config.STRIPE_PUBLISHABLE_KEY)
            .redirectToCheckout({
              sessionId: res.data.stripeSessionId
            }), 1500);
        }
      } catch (err) {
        if (err?.response?.data?.code === 'E_UNIQUE') {
          this.errMessage = this.$t('orgWithThisNameExists');
          this.exists = true;
        } else {
          this.errMessage = err.response?.data?.message ||
            this.$t('serverError');
        }
      }
    },
    searchAgain() {
      this.$emit('reset');
    }
  }
};
</script>
