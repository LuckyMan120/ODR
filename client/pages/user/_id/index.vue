

<template>
  <b-row class="mt-4 justify-content-md-left">
    <b-col
      md="6"
      cols="12"
    >
      <User
        :user="user"
      />
    </b-col>
  </b-row>
</template>

<script>
export default {
  pageTitle: 'user',
  async asyncData({$axios, params}) {
    return {
      user: await $axios.$get(`/user/${params.id}`)
    };
  }
};
</script>
