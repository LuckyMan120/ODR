

<template>
  <div>
    <span
      v-for="action in actions"
      :key="action.text"
      class="pr-2"
    >
      <b-button
        v-if="action.type === 'button'"
        :variant="action.variant || 'outline-primary'"
        :disabled="($nuxt.$loading && $nuxt.$loading.show) || action.disabled"
        :size="action.size || 'default'"
        @click="click(action)"
      >
        <b-icon
          v-if="action.icon"
          :icon="action.icon"
        />
        {{ action.text }}
      </b-button>
      <b-button
        v-else-if="action.target === '_blank'"
        variant="link"
        :to="action.to"
        target="_blank"
      >
        {{ action.text }}
      </b-button>
      <nuxt-link
        v-else
        :to="action.to"
      >
        {{ action.text }}
      </nuxt-link>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    actions: {type: Array, default: () => ([])}
  },
  methods: {
    click(action) {
      if (action.to) {
        this.$router.push(action.to);
      } else {
        this.$store.dispatch(action.action, action.actionData);
      }
    }
  }
};
</script>
