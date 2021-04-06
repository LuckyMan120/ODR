

<template>
  <b-pagination
    v-if="$store.getters[identity + '/count'] > 0
      && ($store.getters[identity + '/count'] > $store.getters[identity + '/limit'])"
    v-model="currentPage"
    :total-rows="$store.getters[identity + '/count']"
    :per-page="$store.getters[identity + '/limit']"
    aria-controls="users-list"
    :disabled="$nuxt.$loading && $nuxt.$loading.show"
    :first-number="firstNumber"
    :last-number="lastNumber"
  />
</template>

<script>
export default {
  props: {
    identity: {type: String, required: true},
    firstNumber: {type: Boolean, default: false},
    lastNumber: {type: Boolean, default: false}
  },
  computed: {
    currentPage: {
      set(value) {
        this.$store.commit(this.identity + '/currentPage', value);
        this.$store.dispatch(this.identity + '/fetch');
      },
      get() {
        return this.$store.getters[this.identity + '/currentPage'];
      }
    }
  }
};
</script>
