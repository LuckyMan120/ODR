

<template>
  <b-form-group
    :label="title + ':'"
    label-for="gr-select-input"
  >
    <b-form-select
      id="gr-select-input"
      v-model="$v.form.value.$model"
      :state="validate('value')"
      :options="options"
      aria-describedby="gr-select-feedback"
      :disabled="disabled || ($nuxt.$loading && $nuxt.$loading.show)"
      @change="submit"
    />
    <div
      v-if="description"
      class="mt-2"
    >
      <small>{{ description }}</small>
    </div>
    <b-form-invalid-feedback
      id="gr-select-feedback"
    >
      {{ $t('genericRequiredField') }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>

import issueData from '@/mixins/issue-data.js';

export default {
  mixins: [issueData],
  props: {
    options: {type: Array, default: () => ([])}
  }
};
</script>
