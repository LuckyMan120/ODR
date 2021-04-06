

<template>
  <div>
    <h5>
      {{ title }}
    </h5>
    <div v-if="issueData">
      <span v-if="commaSeparated">
        {{ seperateCommas(issueData.value) }}
      </span>
      <span v-else>
        {{ $t(issueData.value) }}
      </span>
    </div>
    <p v-else>
      {{ $t('providerDetailsViewNoDataYet') }}
    </p>
  </div>
</template>

<script>

import issueData from '@/mixins/issue-data.js';

export default {
  mixins: [issueData],
  props: {
    issueId: {type: Number, default: 0},
    title: {type: String, default: ''},
    commaSeparated: {type: Boolean, default: false}
  },
  methods: {
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
