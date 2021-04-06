

<template>
  <b-form
    @submit.prevent="onSubmit"
  >
    <b-form-group
      :label="$t('emailAddress') + ':'"
      label-for="user-email-address-input"
    >
      <b-form-input
        id="user-email-address-input"
        v-model="$v.form.email.$model"
        :state="validate('email')"
        type="email"
        :placeholder="$t('enterEmail')"
        aria-describedby="user-email-input-feedback"
        :disabled="isProfile"
        @focus="unique = true"
      />

      <b-form-invalid-feedback
        id="user-email-input-feedback"
      >
        {{ $t('requiredEmail') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      v-if="!user.id"
      :label="$t('password') + ':'"
      label-for="user-password-input"
    >
      <b-form-input
        id="user-password-input"
        v-model="$v.form.password.$model"
        :state="validate('password')"
        type="password"
        :placeholder="$t('enterPassword')"
        aria-describedby="user-password-input-feedback"
      />
      <b-form-invalid-feedback
        id="user-password-input-feedback"
      >
        {{ $t(`required8CharactersAndNumbers`) }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      v-if="!user.id"
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

    <b-form-group
      :label="$t('company') + ':'"
      label-for="user-company-input"
    >
      <b-form-input
        id="user-company-input"
        v-model="form.company"
        type="text"
        :placeholder="$t('enterCompany')"
      />
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
      />
      <b-form-invalid-feedback
        v-if="!$v.form.firstName.required"
        id="firstName-input-feedback"
      >
        {{ $t('genericRequiredField') }}
      </b-form-invalid-feedback>
      <b-form-invalid-feedback
        v-if="!$v.form.firstName.alpha"
        id="lastName-input-feedback"
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
      />
      <b-form-invalid-feedback
        v-if="!$v.form.lastName.required"
        id="lastName-input-feedback"
      >
        {{ $t('genericRequiredField') }}
      </b-form-invalid-feedback>

      <b-form-invalid-feedback
        v-if="!$v.form.lastName.alpha"
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
      />
      <b-form-invalid-feedback id="phone-input-feedback">
        {{ $t('genericFieldNumber') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      v-if="(role.name === userRole.superadmin) && !isProfile"
      :label="$t('role') + ':'"
      label-for="role-input"
    >
      <b-form-select
        v-model="form.role"
        :options="optionRolesUser"
      />
    </b-form-group>

    <err-alert :message="errMessage" />

    <b-button
      type="submit"
      variant="primary"
      :disabled="$nuxt.$loading && $nuxt.$loading.show"
    >
      {{ $t('submit') }}
    </b-button>
  </b-form>
</template>

<script>

import form from '@/mixins/form.js';
import {required, minLength, sameAs, alpha, numeric} from 'vuelidate/lib/validators';
import {mapGetters, mapActions} from 'vuex';
import {roleMixin} from '@/mixins/roleMixin.js';
import {email, password} from '@/validators/index.js';

export default {
  mixins: [form, roleMixin],
  props: {
    isProfile: {type: Boolean, default: false},
    user: {type: Object, default: () => ({})}
  },
  data: () => ({
    form: {
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      company: '',
      role: 3
    },
    errMessage: '',
    unique: true,
    optionRolesUser: [
      {value: 1, text: 'superadmin'},
      {value: 2, text: 'admin'},
      {value: 3, text: 'user'}
    ]
  }),
  computed: {
    ...mapGetters({
      role: 'user/role'
    })
  },
  created() {
    this.form.email = this.user.email;
    this.form.firstName = this.user.firstName;
    this.form.lastName = this.user.lastName;
    this.form.phone = this.user.phone;
    this.form.company = this.user.company;
    if (this.user.role) this.form.role = this.user.role.id;
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
      password: {
        required,
        minLength: minLength(8),
        password
      },
      confirmPassword: {
        sameAsPassword: sameAs('password')
      },
      firstName: {required, alpha},
      lastName: {required, alpha},
      phone: {numeric}
    }
  },
  methods: {
    ...mapActions({
      me: 'user/me'
    }),
    async onSubmit() {
      try {
        this.errMessage = '';
        if (this.user.id) {
          const data = {};
          const keys = Object.keys(this.form);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (this.$v.form[key]) {
              if (this.$v.form[key].$dirty) {
                this.$v.form[key].$touch();
                data[key] = this.form[key];
              }
            } else {
              data[key] = this.form[key];
            }
          }
          if (this.$v.$anyError) return;
          let id = this.user.id;
          if (this.isProfile) id = 'me';
          await this.$axios.put(`/user/${id}`, data);
          this.$toast.success(
            `${this.$t('updated')}`
          );
          if (this.isProfile) await this.me();
        } else {
          if (this.anyError()) return;
          await this.$axios.post(`/user`, this.form);
          this.$toast.success(
            `${this.$t('created')}`
          );
        }
        this.$emit('done');
      } catch (err) {
        if (err.response.data.code === 'E_UNIQUE') {
          this.errMessage = this.$t('emailUnique');
          this.unique = false;
        }
      }
    }
  }
};
</script>
