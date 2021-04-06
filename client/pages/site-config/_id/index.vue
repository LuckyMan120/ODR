

<template>
  <b-row class="mt-4 justify-content-md-left">
    <b-col
      md="6"
      cols="12"
    >
      <SiteConfig :siteconfig="siteconfig" />
    </b-col>
  </b-row>
</template>

<script>
export default {
  pageTitle: 'Site Config',
  async asyncData({$axios, params}) {
    return {
      siteconfig: await $axios.$get(`/siteconfig/${params.id}`)
    };
  }
};
</script>
