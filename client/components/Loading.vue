

<template>
  <b-icon
    v-if="loading"
    icon="three-dots"
    animation="cylon"
    font-scale="4"
  />
</template>

<script>
export default {
  props: {
    loading: {type: Boolean, default: false}
  }
};
</script>
