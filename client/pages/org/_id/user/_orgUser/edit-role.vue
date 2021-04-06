

<template>
  <UserSelectRole :org-user="orgUser" />
</template>

<script>
export default {
  pageTitle: 'editRole',
  async asyncData({$axios, params}) {
    return {
      orgUser: await $axios.$get(`/orgUser/${params.orgUser}`)
    };
  }
};
</script>
