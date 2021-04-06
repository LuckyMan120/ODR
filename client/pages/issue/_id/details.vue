
<template>
  <div>
    <div>
      <issue-intro
        :title="$t('detailsStepIntroTitle')"
        :desc="$t('detailsStepIntroDesc')"
      />
      <div class="wrapper-content-issue">
        <gr-textarea
          :title="$t('whatHappenedTitle')"
          :issue-id="+$route.params.id"
          :type-id="dataTypes.whatHappened"
          :validations="{required, maxChars: maxLength(250)}"
        />

        <gr-textarea
          v-if="getIssueData(dataTypes.whatHappened)"
          :title="$t('expectationsTitle')"
          :issue-id="+$route.params.id"
          :type-id="dataTypes.expectations"
          :validations="{required, maxChars: maxLength(250)}"
        />

        <gr-textarea
          v-if="getIssueData(dataTypes.expectations)"
          :title="$t('goalsTitle')"
          :issue-id="+$route.params.id"
          :type-id="dataTypes.goals"
          :validations="{required, maxChars: maxLength(250)}"
        />
      </div>
      <template v-if="issueGoals">
        <p v-if="issue && issue.submittedAt">
          {{ $t('agreedAt', [$moment(issue.submittedAt).format("LLLL")]) }}
        </p>
        <b-button
          v-else
          variant="primary"
          :disabled="$nuxt.$loading && $nuxt.$loading.show"
          @click="submit($route.params.id)"
        >
          <b-icon
            v-if="$nuxt.$loading && $nuxt.$loading.show"
            icon="three-dots"
            animation="cylon"
          />
          <span v-else>
            {{ $t('submitComplaint') }}
          </span>
        </b-button>
      </template>
    </div>
  </div>
</template>

<script>

import {dataTypes} from '@/constants/data-types.js';
import {required, maxLength} from 'vuelidate/lib/validators';
import {mapActions, mapState} from 'vuex';

export default {
  data() {
    return {dataTypes, required, maxLength};
  },
  computed: {
    ...mapState('issue', ['issue', 'issueData']),
    issueGoals: function() {
      return this.issueData.find(rr => rr.type.id === this.dataTypes.goals);
    }
  },
  methods: {
    ...mapActions('issue', ['submit']),
    getIssueData(typeId) {
      return this.$store.state.issue.issueData.find(
        issueData => issueData.type.id === typeId
      );
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/style/modules/colors";
.jf-checkbox{
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
}
</style>
