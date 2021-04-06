
<template>
  <div v-if="link">
    <nuxt-link
      v-if="link && !outbound"
      :to="link"
      :target="target"
    >
      {{ text || link }}
    </nuxt-link>
    <a
      v-else-if="link && outbound"
      :href="link"
      :target="target"
    >
      {{ text || link }}
    </a>
    <span v-else>
      {{ text }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    outbound: {type: Boolean, default: false},
    link: {type: String, default: ''},
    text: {type: String, required: true},
    target: {type: String, default: '_self'}
  }
};
</script>
