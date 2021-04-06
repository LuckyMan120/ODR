

<template>
  <div>
    <User @done="$router.push('/user')" />
  </div>
</template>

<script>
export default {
  pageTitle: 'user'
};
</script>
