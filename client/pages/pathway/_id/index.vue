

<template>
  <b-row class="mt-4 justify-content-md-left">
    <b-col
      md="6"
      cols="12"
    >
      <Pathway
        :pathway="pathway"
        @done="$router.push('/pathway')"
      />
    </b-col>
  </b-row>
</template>

<script>

export default {
  pageTitle: 'editPathway',
  async asyncData({$axios, params}) {
    return {
      pathway: await $axios.$get(`/pathway/${params.id}`, {
        params: {translations: true}
      })
    };
  }
};
</script>
