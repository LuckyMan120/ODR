

<template>
  <div>
    <h1 v-if="error.statusCode === 404">
      {{ $t('pageNotFound') }}
    </h1>
    <h1 v-else>
      {{ $t('serverError') }}
    </h1>
    <NuxtLink to="/">
      {{ $t('backToHomepahe') }}
    </NuxtLink>
  </div>
</template>

<script>
export default {
  layout: 'error',
  props: {
    error: {type: Object, default: () => ({})}
  }
};
</script>
