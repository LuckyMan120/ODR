

<template>
  <b-form
    @submit.prevent="submit"
  >
    <b-input-group>
      <b-form-input
        v-model="search"
        type="text"
        :placeholder="placeholder"
      />
      <b-input-group-append>
        <b-button
          class="btn-clear d-flex align-items-center"
          aria-description="Clear Search"
          @click="reset"
        >
          <b-icon
            icon="x"
            variant="primary"
          />
        </b-button>
        <b-button
          type="submit"
          variant="outline-primary"
          :disabled="$nuxt.$loading && $nuxt.$loading.show"
        >
          {{ $t('submit') }}
        </b-button>
      </b-input-group-append>
    </b-input-group>
  </b-form>
</template>

<script>
export default {
  props: {
    fields: {type: Array, required: true},
    identity: {type: String, required: true}
  },
  data() {
    let placeholder = this.$t('searchFor');
    placeholder += ' ';
    placeholder += this.fields.map(f => this.$t(f)).join(', ');
    return {placeholder};
  },
  computed: {
    search: {
      set(search) {
        this.$store.commit(this.identity + '/search', {
          search,
          fields: this.fields
        });
      },
      get() {
        return this.$store.getters[this.identity + '/search'];
      }
    }
  },
  methods: {
    submit() {
      this.$store.dispatch(this.identity + '/fetch');
    },
    reset() {
      this.search = '';
      this.submit();
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modules/colors";
.btn-clear{
  color:$color_primary ;
  background-color: $color_background;
  border: 1px solid $color_border_input;
  border-left:none;
  &:active{
    background-color: initial!important;
    border: 1px solid $color_border_input;
  }
}
</style>
