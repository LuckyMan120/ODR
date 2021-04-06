
<template>
  <div>
    <div class="w-100">
      <b-row
        class="w-100"
        no-gutters
      >
        <b-col cols="12">
          <div class="issue-intro-box">
            <h5
              class="issue-intro-title"
            >
              {{ $t('createComplaintTitle') }}
            </h5>
            <div class="issue-intro-desc">
              <abn-lookup
                v-model="$v.form.abn.$model"
                :state="validate('abn')"
                @submit="onSubmit"
              />
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

import form from '@/mixins/form.js';
import {required, alphaNum} from 'vuelidate/lib/validators';

export default {
  mixins: [form],
  data: () => ({
    form: {
      abn: null
    }
  }),
  validations: {
    form: {
      abn: {required, alphaNum}
    }
  },
  methods: {
    async onSubmit() {
      if (this.anyError()) return;
      const {id} = await this.$axios.$post('/issue/complaint', this.form);
      this.$toast.success(
        `${this.$t('newIssueCreatedMsg')}`
      );
      this.$emit('done', {id});
    }
  }
};
</script>
<style scoped>
.issue-intro-box {
  margin: auto;
  max-width: 700px;
}
</style>

