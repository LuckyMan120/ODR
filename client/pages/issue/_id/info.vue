<template>
  <div>
    <issue-intro
      :title="$t('infoStepIntroTitle')"
      :desc="$t('infoStepIntroDesc')"
    />

    <issue-intro
      v-if="!issue.org.active"
      :desc="$t('notAMemberYet')"
    />

    <div
      v-else
      class="wrapper-content-issue"
    >
      <gr-select
        :title="$t('issueSectorTitle')"
        :issue-id="+$route.params.id"
        :type-id="dataTypes.issueSector"
        :options="sectorOptions"
        :validations="{required}"
      />

      <gr-select
        :title="$t('issueCategoryTitle')"
        :issue-id="+$route.params.id"
        :type-id="dataTypes.issueCategory"
        :options="categoryOptions"
        :validations="{required}"
        :disabled="!!issueSubCategory || !getIssueData(dataTypes.issueSector)"
        :description="getCategoryFieldDesc"
      />

      <gr-checkbox-group
        v-if="issueCategory"
        :title="$t('issueSubCategoryTitle')"
        :issue-id="+$route.params.id"
        :type-id="dataTypes.issueSubCategory"
        :options="subCategoryOptions"
        :validations="{required}"
        stacked
      />

      <gr-textarea
        :disabled="!getIssueData(dataTypes.issueSubCategory)"
        :title="$t('whatHappenedTitle') + '?'"
        :description="$t('keepItShort')"
        :issue-id="+$route.params.id"
        :type-id="dataTypes.whatHappened"
        :validations="{required}"
      />

      <gr-textarea
        :disabled="!getIssueData(dataTypes.whatHappened)"
        :title="$t('expectationsTitle')"
        :issue-id="+$route.params.id"
        :type-id="dataTypes.expectations"
        :placeholder="$t('maxcharsLimit', {x: 250})"
        :validations="{required, maxChars: maxLength(250)}"
      />

      <div v-if="issue && issue.submittedAt > 0">
        <b-alert
          show
          variant="success"
        >
          {{ $t('submittedToProviderOn', [$moment(issue.submittedAt).format("LLLL")]) }} <strong>{{ $t('proceedtoSolutions') }}</strong>
        </b-alert>
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import {dataTypes} from '@/constants/data-types.js';
import {required, maxLength} from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      dataTypes,
      required,
      maxLength,
      sectors: [
        'investmentsAndFinancialAdvice',
        'creditFinanceAndLoan',
        'insurance',
        'bankingDepositsAndPayments',
        'superannuation'
      ]
    };
  },
  computed: {
    ...mapGetters({
      issue: 'issue/issue',
      issueCategory: 'issue/issueCategory',
      issueSubCategory: 'issue/issueSubCategory'
    }),
    sectorOptions() {
      return [
        {
          value: '',
          text: this.$t('selectOne'),
          disabled: true
        },
        ...this.mapOptions(this.sectors)
      ];
    },
    categoryOptions() {
      return [
        {
          value: '',
          text: this.$t('selectOne'),
          disabled: true
        },
        ...this.mapOptions([
          'advice',
          'productCharges',
          'performance',
          'behavior',
          'other'
        ])
      ];
    },
    subCategoryOptions() {
      if (
        this.issueCategory?.value === 'advice'
      ) {
        return this.mapOptions([
          'notBestInterestAdvice',
          'inappropriateAdvice',
          'insufficientAdvice',
          'noneOfTheAbove'
        ]);
      } else if (
        this.issueCategory?.value === 'productCharges'
      ) {
        return this.mapOptions([
          'badProductInformation',
          'incorrectCharges',
          'noneOfTheAbove'
        ]);
      } else if (
        this.issueCategory?.value === 'performance'
      ) {
        return this.mapOptions([
          'inappropriateDecisions',
          'incorrectTransactions',
          'unauthorizedTransactions',
          'delayedDecisions',
          'instructionsNotFollowed',
          'disputeLiability',
          'noneOfTheAbove'
        ]);
      } else if (
        this.issueCategory?.value === 'behavior'
      ) {
        return this.mapOptions([
          'unhelopful',
          'impoliteness',
          'dismissive',
          'agressive',
          'noneOfTheAbove'
        ]);
      } else if (
        this.issueCategory?.value === 'other'
      ) {
        return this.mapOptions([
          'complaintHandling',
          'financialDifficulty',
          'noneOfTheAbove'
        ]);
      } else {
        return [];
      }
    },
    getCategoryFieldDesc() {
      if (this.getIssueData(dataTypes.issueSubCategory)) {
        return this.$t('categoryFieldDesc');
      } else {
        return '';
      }
    }
  },
  methods: {
    mapOptions(options) {
      return options.map(t => ({value: t, text: this.$t(t)}));
    },
    getIssueData(typeId) {
      return this.$store.state.issue.issueData.find(
        issueData => issueData.type.id === typeId
      );
    }

  }
};
</script>
