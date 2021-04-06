

<template>
  <b-form
    @submit.prevent="onSubmit"
  >
    <b-form-group
      :label="$t('name') + ':'"
      label-for="step-name-input"
    >
      <b-form-input
        id="step-name-input"
        v-model="$v.form.name.$model"
        :state="validate('name')"
        type="text"
        :placeholder="$t('enterName')"
        aria-describedby="step-name-input-feedback"
      />
      <b-form-invalid-feedback
        id="step-name-input-feedback"
      >
        {{ $t('genericRequiredField') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      :label="$t('linkTo') + ':'"
      label-for="step-linkTo-input"
    >
      <b-form-input
        id="step-linkTo-input"
        v-model="$v.form.linkTo.$model"
        :state="validate('linkTo')"
        type="text"
        :placeholder="$t('linkTo')"
        aria-describedby="step-linkTo-input-feedback"
      />
      <b-form-invalid-feedback
        id="step-linkTo-input-feedback"
      >
        {{ $t('genericRequiredField') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-form-group
      v-if="parents.length"
      :label="$t('parent') + ':'"
      label-for="parent-input"
    >
      <b-form-select
        id="parent-input"
        v-model="form.parent"
        :options="parents.map(s => ({value: s.id, text: s.name}))"
      />
    </b-form-group>

    <b-form-group
      :label="$t('sortOrder') + ':'"
      label-for="step-sortOrder-input"
      :description="$t('leaveEmptyForAutoSortOrder')"
    >
      <b-form-input
        id="step-sortOrder-input"
        v-model="$v.form.sortOrder.$model"
        :state="validate('sortOrder')"
        type="number"
        :placeholder="$t('sortOrder')"
        aria-describedby="step-sortOrder-input-feedback"
      />
      <b-form-invalid-feedback
        id="step-sortOrder-input-feedback"
      >
        {{ $t('genericFieldNumber') }}
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
import {required, numeric} from 'vuelidate/lib/validators';

export default {
  mixins: [form],
  props: {
    step: {type: Object, default: () => ({})},
    parents: {type: Array, default: () => ([])},
    pathwayId: {type: Number, required: true},
    parentId: {type: Number, default: 0}
  },
  data: () => ({
    form: {
      name: '',
      linkTo: '',
      parent: null,
      sortOrder: null
    },
    errMessage: ''
  }),
  created() {
    this.form.name = this.step.name;
    this.form.linkTo = this.step.linkTo;
    if (this.step.parent) {
      if (
        typeof this.step.parent === 'object' &&
        this.step.parent !== null
      ) {
        this.form.parent = this.step.parent.id;
      } else {
        this.form.parent = this.step.parent;
      }
    }
    if (this.step.sortOrder) this.form.sortOrder = this.step.sortOrder;
  },
  validations: {
    form: {
      name: {required},
      linkTo: {required},
      sortOrder: {numeric}
    }
  },
  methods: {
    async onSubmit() {
      this.errMessage = '';
      if (this.anyError()) return;
      try {
        const {
          sortOrder,
          ...form
        } = this.form;
        if (sortOrder) form.sortOrder = sortOrder;

        if (this.step.id) {
          await this.$axios.put(`/pathwayStep/${this.step.id}`, form);
          this.$toast.success(
            `${this.$t('updated')}`
          );
        } else {
          const data = {
            ...form,
            pathway: this.pathwayId
          };
          if (this.parentId) data.parent = this.parentId;
          await this.$axios.post(`/pathwayStep`, data);
          this.$toast.success(
            `${this.$t('created')}`
          );
        }

        this.$emit('done');
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
