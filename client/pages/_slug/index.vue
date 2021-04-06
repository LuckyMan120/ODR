

<template>
  <div>
    <SignIn
      :slug="$route.params.slug"
      @login="$router.push({path: '/'})"
    />
  </div>
</template>

<script>
export default {
  layout: 'pre-auth-form',
  asyncData({store, redirect}) {
    if (!store.getters['site/type'].includes('mediations')) {
      redirect('/sign-in');
    }
  }
};
</script>
