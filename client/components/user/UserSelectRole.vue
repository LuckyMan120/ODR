

<template>
  <b-form
    @submit.prevent="submit"
  >
    <b-form-group
      :label="$t('role') + ':'"
      label-for="role-input"
    >
      <b-form-select
        id="role-input"
        v-model="selected"
        :options="roles"
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
</template>

<script>

import {mapActions} from 'vuex';

export default {
  props: {
    orgUser: {type: Object, required: true}
  },
  data: () => ({
    selected: 3,
    roles: [
      {value: 1, text: 'admin'},
      {value: 2, text: 'staff'},
      {value: 3, text: 'user'}
    ]
  }),
  created() {
    this.selected = this.orgUser.role.id;
  },
  methods: {
    ...mapActions({
      update: 'orgUsers/update'
    }),
    async submit() {
      try {
        await this.update({
          id: this.orgUser.id,
          user: this.orgUser.user.id,
          role: this.selected
        });
        this.$toast.success(
          `${this.$t('updated')}`
        );
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
