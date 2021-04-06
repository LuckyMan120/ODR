

<template>
  <b-card>
    <b-form
      inline
      @submit.prevent="submit"
    >
      <b-form-group :label="$t('orgRole')">
        <b-form-checkbox-group
          v-model="select"
          :options="options"
        />
      </b-form-group>

      <b-button
        type="submit"
        variant="primary"
        :disabled="$nuxt.$loading && $nuxt.$loading.show"
      >
        {{ $t('submit') }}
      </b-button>
    </b-form>
  </b-card>
</template>

<script>
export default {
  props: {
    options: {type: Array, required: true},
    identity: {type: String, required: true}
  },
  computed: {
    select: {
      set(orgRole) {
        this.$store.commit(this.identity + '/orgRole', orgRole);
      },
      get() {
        return this.$store.getters[this.identity + '/orgRole'];
      }
    }
  },
  methods: {
    submit() {
      this.$store.dispatch(this.identity + '/fetch');
    }
  }
};
</script>
