

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
export default {
  pageTitle: 'organization',
  async asyncData({$axios, params}) {
    return {
      org: await $axios.$get(`/org/${params.id}`)
    };
  }
};
</script>
