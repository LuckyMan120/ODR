<template>
  <div>
    <UserPasswordReset
      :title="$t('setPassword') + ':'"
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
    let email = query.email;
    if (email.includes(' ')) {
      email = email.replace(' ', '+');
    }
    return {
      email,
      token: query.token
    };
  }
};
</script>
