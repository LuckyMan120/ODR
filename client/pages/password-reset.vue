<template>
  <div>
    <UserPasswordReset
      :title="$t('passwordReset') + ':'"
      :email="email"
      :token="token"
      @login="$router.push({path: '/'})"
    />
  </div>
</template>

<script>
export default {
  layout: 'pre-auth-form',
  asyncData({query}) {
    return {
      email: query.email,
      token: query.token
    };
  }
};
</script>
