

<template>
  <b-row class="mt-4 justify-content-md-left">
    <b-col
      md="6"
      cols="12"
    >
      <Pathway @done="$router.push('/pathway')" />
    </b-col>
  </b-row>
</template>

<script>
export default {
  pageTitle: 'createPathway'
};
</script>
