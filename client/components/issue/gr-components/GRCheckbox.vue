

<template>
  <b-form-group
    :description="description"
  >
    <b-form-checkbox
      id="gr-checkbox-input"
      v-model="$v.form.value.$model"
      size="lg"
      aria-describedby="gr-checkbox-feedback"
      :disabled="disabled || ($nuxt.$loading && $nuxt.$loading.show)"
      @input="debounceSubmit"
    >
      {{ title }}
    </b-form-checkbox>
    <b-form-invalid-feedback
      id="gr-checkbox-feedback"
    >
      {{ $t('genericRequiredField') }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>

import issueData from '@/mixins/issue-data.js';
import {mapActions} from 'vuex';

export default {
  mixins: [issueData],
  methods: {
    ...mapActions({
      delete: 'issue/deleteIssueData'
    }),
    debounceSubmit() {
      const data = this.form.value;
      if (this.debounceId) clearTimeout(this.debounceId);
      this.debounceId = setTimeout(() => {
        if (data) {
          this.submit(data);
        } else {
          this.delete({
            issueDataId: this.issueData.id
          });
        }
      }, 1000);
    }
  }
};
</script>
<style lang="scss">
.custom-checkbox .custom-control-input:disabled:checked ~ .custom-control-label::before{
  top: 0;
}
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after{
  top: 0.05em;
}
</style>
