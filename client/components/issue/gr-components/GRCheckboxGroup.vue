

<template>
  <b-form-group
    :label="groupLabel"
    label-for="gr-checkbox-group-input"
    :description="description"
  >
    <b-form-checkbox-group
      id="gr-checkbox-group-input"
      v-model="$v.form.selected.$model"
      size="lg"
      :state="validate('selected')"
      :options="options"
      aria-describedby="gr-checkbox-group-feedback"
      :stacked="stacked"
      :disabled="disabled || ($nuxt.$loading && $nuxt.$loading.show)"
      @input="debounceSubmit"
    />
    <b-form-invalid-feedback
      id="gr-checkbox-group-feedback"
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
  props: {
    options: {type: Array, default: () => ([])},
    stacked: {type: Boolean, default: false}
  },
  data() {
    return {
      form: {
        selected: [],
        ...issueData.validations().data
      },
      debounceId: null
    };
  },
  validations() {
    return {
      form: {
        selected: this.validations,
        ...issueData.validations().form
      }
    };
  },
  computed: {
    groupLabel() {
      return (this.title ? this.title + ':' : '');
    }
  },
  mounted() {
    if (this.form.value) {
      this.form.selected = this.form.value.split(',');
    } else {
      this.form.selected = [];
    }
  },
  methods: {
    ...mapActions({
      delete: 'issue/deleteIssueData'
    }),
    debounceSubmit() {
      const data = this.form.selected.join(',');
      if (this.issueData && data === this.issueData.value) return;
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
@import "@/assets/style/modules/colors";

.custom-checkbox.b-custom-control-lg .custom-control-label::before, .input-group-lg .custom-checkbox .custom-control-label::before{
  top: 0;
}
.custom-checkbox .custom-control-input:checked ~ .custom-control-label::after{
  top: 0.05em;
}

.was-validated .custom-control-input:valid, .custom-control-input.is-valid {
  ~ .custom-control-label {
    color: $color_primary;
    margin-bottom: 8px;

    &:before {
      border-color: $color_primary;
    }
  }

  &:checked {
    ~ .custom-control-label:before {
      border-color: $color_primary;
      background-color: $color_primary;
    }
  }
}
</style>
