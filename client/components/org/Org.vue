

<template>
  <b-form
    @submit.prevent="onSubmit"
  >
    <b-form-group
      :label="$t('name') + ':'"
      label-for="org-name-input"
    >
      <b-form-input
        id="org-name-input"
        v-model="$v.form.name.$model"
        :state="validate('name')"
        type="text"
        :placeholder="$t('enterName')"
        aria-describedby="org-name-input-feedback"
        :disabled="role.name !== userRole.superadmin && !!org.id"
      />
      <b-form-invalid-feedback
        id="org-name-input-feedback"
      >
        {{ $t('genericRequiredField') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      :label="$t('abn') + ':'"
      label-for="abn-input"
    >
      <b-form-input
        id="abn-input"
        v-model="$v.form.abn.$model"
        :state="validate('abn')"
        type="text"
        :disabled="role.name !== userRole.superadmin && !!org.id"
        :placeholder="$t('abnExample')"
        aria-describedby="abn-input-feedback"
      />
    </b-form-group>

    <b-form-group
      v-if="role.name === userRole.admin || role.name === userRole.superadmin"
    >
      <b-form-checkbox
        id="active-input"
        v-model="$v.form.active.$model"
        name="active"
      >
        {{ $t('active') }}
      </b-form-checkbox>
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
import {required} from 'vuelidate/lib/validators';
import {abn} from '@/validators/index.js';
import {mapGetters, mapActions} from 'vuex';
import {roleMixin} from '@/mixins/roleMixin.js';

export default {
  mixins: [form, roleMixin],
  props: {
    org: {type: Object, default: () => ({})}
  },
  data: () => ({
    form: {
      name: '',
      abn: '',
      active: true
    },
    errMessage: '',
    unique: true
  }),
  computed: mapGetters({
    role: 'user/role',
    siteType: 'site/type'
  }),
  created() {
    this.form.name = this.org.name;
    this.form.abn = this.org.abn;
  },
  validations: {
    form: {
      name: {required},
      abn: {abn},
      active: {}
    }
  },
  methods: {
    ...mapActions({
      getMe: 'user/me'
    }),
    async onSubmit() {
      this.errMessage = '';
      if (this.anyError()) return;
      const data = {
        ...this.form,
        abn: +this.form.abn.replace(/ /g, '')
      };
      try {
        if (this.org.id) {
          if (this.role.name === this.userRole.admin || this.role.name === this.userRole.superadmin) {
            await this.$axios.put(`/org/${this.org.id}`, data);
          } else {
            await this.$axios.put('/org', data);
          }
          this.$toast.success(
            `${this.$t('updated')}`
          );
          await this.getMe();
        } else {
          await this.$axios.post(`/org`, data);
          this.$toast.success(
            `${this.$t('created')}`
          );
        }
        this.$emit('done');
      } catch (err) {
        if (err.response.data.code === 'E_UNIQUE') {
          this.errMessage = this.$t('slugUnique');
          this.unique = false;
        }
      }

    }
  }
};
</script>
