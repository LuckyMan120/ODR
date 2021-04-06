

<template>
  <div>
    <Register
      :slug="$route.params.slug"
      :email="$route.query.email"
      :token="$route.query.token"
    />
  </div>
</template>

<script>
export default {
  layout: 'pre-auth-form',
  asynData({store, redirect}) {
    if (!store.getters['site/type'].includes('mediations')) {
      redirect('/register');
    }
  }
};
</script>
