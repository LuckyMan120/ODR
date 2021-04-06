

<template>
  <layout>
    <Nuxt />
    <client-only>
      <notifications-connect />
    </client-only>
  </layout>
</template>

<script>
export default {
  middleware: ['auth'],
  head() {
    return {
      title: this.title
    };
  }
};
</script>
