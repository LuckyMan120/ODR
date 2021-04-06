

<template>
  <div>
    <issue-intro
      :title="$t('responderDetailsStepIntroTitle')"
      :desc="$t('responderDetailsStepIntroDesc')"
    />

    <div class="wrapper-content-issue">
      <div>
        <b-table
          :items="items"
          :fields="fields"
          class="table-headless"
          bordered
        />
      </div>
    </div>

    <div />
  </div>
</template>

<script>

import {dataTypes} from '@/constants/data-types.js';
export default {
  data() {
    return {
      dataTypes,
      fields: [
        {key: 'type', label: 'Type', tdClass: 'td-20 label-td'},
        {key: 'value', label: 'Value'}
      ]
    };
  },
  computed: {
    items() {
      const issueSector = this.getIssueData(this.dataTypes['issueSector']);
      const issueCategory = this.getIssueData(this.dataTypes['issueCategory']);
      const issueSubCategory = this.getIssueData(this.dataTypes['issueSubCategory']);
      const whatHappened = this.getIssueData(this.dataTypes['whatHappened']);
      const expectations = this.getIssueData(this.dataTypes['expectations']);
      return [
        {
          type: this.$t('issueSectorTitle') + ':',
          value: issueSector ? this.$t(issueSector.value) : this.$t('notProvidedYet')
        },
        {
          type: this.$t('issueCategoryTitle') + ':',
          value: issueCategory ? this.$t(issueCategory.value) : this.$t('notProvidedYet')
        },
        {
          type: this.$t('issueSubCategoryTitle') + ':',
          value: issueSubCategory ? this.seperateCommas(this.$t(issueSubCategory.value)) : this.$t('notProvidedYet')
        },
        {
          type: this.$t('whatHappenedTitle') + ':',
          value: whatHappened ? whatHappened.value : this.$t('notProvidedYet')
        },
        {
          type: this.$t('expectationsResponderTitle') + ':',
          value: expectations ? expectations.value : this.$t('notProvidedYet')
        }
      ];
    }
  },
  methods: {
    getIssueData(typeId) {
      return this.$store.state.issue.issueData.find(
        issueData => issueData.type.id === typeId
      );
    },
    seperateCommas(value) {
      const newValue = [];
      for (const item of value.split(',')) {
        newValue.push(this.$t(item));
      }
      return newValue.join(', ');
    }
  }
};
</script>
<style scoped>
table{
  background-color: white;
}
</style>
