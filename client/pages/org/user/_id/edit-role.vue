

<template>
  <b-row class="justify-content-md-left">
    <b-col
      md="4"
      cols="12"
    >
      <UserSelectRole :org-user="orgUser" />
    </b-col>
  </b-row>
</template>

<script>
export default {
  pageTitle: 'editRole',
  async asyncData({$axios, params}) {
    const orgUsers = await $axios.$get(`/org/users?id=${params.id}`);
    return {
      orgUser: orgUsers[0]
    };
  }
};
</script>
