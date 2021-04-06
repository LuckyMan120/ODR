

<template>
  <b-form @submit.prevent="submit">
    <b-form-group
      :label="$t('emailAddress') + ':'"
      label-for="invite-email-address-input"
    >
      <b-form-input
        id="invite-email-address-input"
        v-model="$v.form.email.$model"
        :state="validate('email')"
        type="email"
        :placeholder="$t('enterEmail')"
        aria-describedby="invite-email-input-feedback"
      >
        <b-form-invalid-feedback
          id="invite-email-input-feedback"
        >
          {{ $t('requiredEmail') }}
        </b-form-invalid-feedback>
      </b-form-input>
    </b-form-group>

    <b-form-group
      :label="$t('role') + ':'"
      label-for="role-input"
    >
      <b-form-select
        id="role-input"
        v-model="form.role"
        :options="roles"
      />
    </b-form-group>

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
import {roleMixin} from '@/mixins/roleMixin.js';
import {required, email} from 'vuelidate/lib/validators';
import {mapGetters} from 'vuex';

export default {
  mixins: [form, roleMixin],
  data: () => ({
    form: {
      email: '',
      role: 3
    }
  }),
  validations: {
    form: {
      email: {required, email}
    }
  },
  computed: {
    ...mapGetters({
      orgRoleStore: 'user/orgRole'
    }),
    roles() {
      if (this.orgRoleStore.name === this.orgRole.admin) {
        return [
          {value: 1, text: 'admin'},
          {value: 2, text: 'staff'},
          {value: 3, text: 'user'}
        ];
      } else {
        return [
          {value: 2, text: 'staff'},
          {value: 3, text: 'user'}
        ];
      }
    }
  },

  methods: {
    async submit() {
      if (this.anyError()) return;
      try {
        const data = await this.$axios.$post('/org/invite', this.form);
        if (data.orgInvite) {
          this.$toast.success(
            `${this.$t('inviteSent')}`
          );
          this.$emit('done-invite-sent');
        } else if (data.orgUser) {
          this.$toast.success(
            `${this.$t('userAdded')}`
          );
          this.$emit('done-user-added');
        }
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
