

<template>
  <div>
    <SignIn
      @login="$router.push({path: '/'})"
    />
  </div>
</template>

<script>

export default {
  layout: 'pre-auth-form'
};
</script>
