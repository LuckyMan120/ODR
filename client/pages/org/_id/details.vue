

<template>
  <b-row class="mt-4 justify-content-md-left">
    <b-col
      md="6"
      cols="12"
    >
      <Org :org="org" />
    </b-col>
  </b-row>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  pageTitle: 'details',
  async asyncData({store, params}) {
    await store.dispatch('user/set-org', {org: params.id});
  },
  computed: mapGetters({
    org: 'user/org'
  })
};
</script>
