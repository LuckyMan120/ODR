

<template>
  <form @submit.prevent="submit">
    <blockquote class="blockquote">
      Generic Issue Data component for
      issue id {{ issueId }}
      type id {{ typeId }}
    </blockquote>

    <b-form-group
      :label="$t(title || 'value') + ':'"
      label-for="value-input"
      :description="$t('noEmailSharing')"
    >
      <b-form-input
        id="value-input"
        v-model="$v.form.value.$model"
        :state="validate('value')"
        type="text"
        :placeholder="$t('value')"
        aria-describedby="value-input-feedback"
      />
      <b-form-invalid-feedback
        id="value-input-feedback"
      >
        {{ $t('genericRequiredField') }}
      </b-form-invalid-feedback>
    </b-form-group>

    <b-button
      type="submit"
      variant="primary"
      :disabled="$nuxt.$loading && $nuxt.$loading.show"
    >
      {{ $t('submit') }}
    </b-button>
  </form>
</template>

<script>

import issueData from '@/mixins/issue-data.js';

export default {
  mixins: [issueData]
};
</script>
