

<template>
  <b-alert
    v-if="message"
    show
    variant="variant"
  >
    <!-- XSS_WARNING: Only static input (no user input) -->
    <!-- eslint-disable-next-line -->
    <span v-html="message"></span>
  </b-alert>
</template>

<script>
export default {
  props: {
    message: {type: String, default: ''},
    variant: {type: String, default: 'warning'}
  }
};
</script>
