<template>
  <div>
    <form>
      <b-row>
        <b-col
          lg="12"
        >
          <label
            class="d-block mt-2"
          >{{ $t('agreementItemTitle') }}:</label>
          <b-form-select
            id="gr-select-input"
            v-model="$v.form.category.$model"
            :disabled="disabled"
            :options="[
              {
                value: '',
                text: $t('selectOne'),
                disabled: true
              },
              ...mapOptions([
                'explanation',
                'apology',
                'assistance',
                'refund',
                'waiveFees',
                'goodwillPayment',
                'compainsationPayment',
                'waiveDebt',
                'replacement',
                'correctionOfRecords',
                'repair',
                'changeTerms',
                'ceaseLegalAction',
                'undertakeToImprove',
                'other'
              ])
            ]"
            aria-describedby="gr-select-feedback"
            :description="description"
          />
        </b-col>
      </b-row>

      <b-row class="mt-4">
        <b-col
          cols="12"
        >
          <label>{{ $t('provideMoreInfoAgreemntItem') }}</label>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          lg="10"
          sm="12"
        >
          <b-form-group
            v-if="form.category"
            :label-for="`gr-textarea-input-${title.trim()}`"
            :description="description"
            class="custom-textarea"
          >
            <b-form-textarea
              :id="`gr-textarea-input-${title.trim()}`"
              v-model="$v.form.value.$model"
              :state="validate('value')"
              :placeholder="placeholder"
              :rows="rows"
              :max-rows="maxRows"
              aria-describedby="gr-textarea-feedback"
              :disabled="disabled"
              debunce="500"
              @focus="isFocus = true"
            />
            <b-form-invalid-feedback
              id="gr-textarea-feedback"
            >
              <span v-if="!$v.form.value.required">
                {{ $t('genericRequiredField') }}
              </span>
              <span v-else-if="!$v.form.value.maxChars">
                {{ $t('maxcharsLimit', {x: 250}) }}
              </span>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col cols="2">
          <div
            v-if="isFocus"
            class="btn-group-issue text-left"
          >
            <b-button
              variant="outline-warning"
              :disabled="$nuxt.$loading && $nuxt.$loading.show"
              class=""
              @click="handleSubmit"
            >
              {{ $t('submit') }}
            </b-button>
          </div>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>

import issueData from '@/mixins/issue-data.js';
import {mapActions} from 'vuex';

export default {
  mixins: [issueData],
  props: {
    placeholder: {type: String, default: ''},
    rows: {type: Number, default: 2},
    maxRows: {type: Number, default: 6}
  },

  data() {
    return {
      isFocus: false
    };
  },

  methods: {
    ...mapActions({
      delete: 'issue/deleteIssueData',
      createRevision: 'issue/createIssueDataRevision'
    }),
    async clear() {
      if (!this?.issueData?.id) return this.form.value = '';
      try {
        await this.delete({
          issueDataId: this.issueData.id
        });
        this.isFocus = false;
        this.form.value = '';
      } catch (err) {
        console.error(err);
      }
    },
    async handleSubmit() {
      if (this.anyError()) return;
      try {
        if (this.issueData) {
          await this.createRevision({
            issueDataId: this.issueData.id,
            value: this.form.value
          });
        } else {
          await this.submit();
        }
        this.isFocus = false;
      } catch (err) {
        console.error(err);
      }
    },
    mapOptions(options) {
      return options.map(t => ({value: t, text: this.$t(t)}));
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modules/colors";
@import "@/assets/style/modules/media";

.btn-group-issue {
  display: inline-block;
    @media #{$sm-screen} {
      margin-top: 10px;
    }
    @media #{$md-screen} {
      margin-top: 10px;
    }
    margin-top: 1.7rem;
}
</style>
