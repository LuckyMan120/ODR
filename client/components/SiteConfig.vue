

<template>
  <b-form
    @submit.prevent="onSubmit"
  >
    <b-form-group>
      <h3 class="mb-3">
        {{ form.key }}
      </h3>

      <h5 class="mb-3">
        {{ form.desc }}
      </h5>

      <b-form-input
        v-if="form.inputType === 'text'"
        id="siteconfig-value-input"
        v-model="$v.form.value.$model"
        :state="validate('value')"
        type="text"
        :placeholder="$t('entervalue')"
        aria-describedby="siteconfig-value-input-feedback"
      />

      <b-form-checkbox
        v-if="form.inputType === 'bool'"
        id="siteconfig-value-input"
        v-model="$v.form.value.$model"
      />

      <b-form-select
        v-if="form.inputType === 'dropdown'"
        id="siteconfig-value-input"
        v-model="$v.form.value.$model"
        :options="$v.form.$model.data.split(',')"
      />

      <QuillEditor
        v-if="form.inputType === 'html'"
        v-model="$v.form.value.$model"
      />

      <b-form-invalid-feedback
        id="siteconfig-value-input-feedback"
      >
        {{ $t('genericRequiredField') }}
      </b-form-invalid-feedback>
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
import {mapGetters} from 'vuex';
import {roleMixin} from '@/mixins/roleMixin.js';

export default {
  mixins: [form, roleMixin],
  props: {
    siteconfig: {type: Object, default: () => ({})}
  },
  data: () => ({
    inputTypes: [
      {value: 'text', text: 'text'},
      {value: 'bool', text: 'bool'},
      {value: 'html', text: 'html'}
    ],
    form: {
      key: '',
      inputType: '',
      value: '',
      protected: true,
      desc: ''
    },
    errMessage: ''
  }),
  computed: mapGetters({
    role: 'user/role'
  }),
  created() {
    this.form.key = this.siteconfig.key;
    this.form.inputType = this.siteconfig.inputType;
    this.form.protected = this.siteconfig.protected;
    this.form.value = this.siteconfig.value;
    this.form.data = this.siteconfig.data;
    this.form.desc = this.siteconfig.desc;
  },
  validations: {
    form: {
      key: {required},
      value: {required}
    }
  },
  methods: {
    async onSubmit() {
      this.errMessage = '';
      if (this.anyError()) return;
      try {
        if (this.siteconfig.id) {
          if (this.role.name === this.userRole.admin || this.role.name === this.userRole.superadmin) {
            await this.$axios.patch(`/siteconfig/${this.siteconfig.id}`, this.form);
          } else {
            await this.$axios.patch('/siteconfig', this.form);
          }
          this.$toast.success(
            `${this.$t('updated')}`
          );
        } else {
          await this.$axios.post(`/siteconfig`, this.form);
          this.$toast.success(
            `${this.$t('created')}`
          );
        }
        this.$emit('done');
        this.$router.back();
      } catch (err) {
        this.errMessage = err.response.data.message;
      }

    }
  }
};
</script>
