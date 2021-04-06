<template>
  <b-form
    @submit.prevent="setOrg({org})"
  >
    <b-form-group
      label="Select organization:"
      label-for="select-organization"
    >
      <b-form-select
        id="select-organization"
        v-model="org"
        :options="orgs.map(org => ({value: org.id, text: org.name}))"
      />
    </b-form-group>

    <err-alert :message="$t('moreThanOneOrgPleaseSelectOne')" />

    <b-button
      type="submit"
      variant="primary"
    >
      {{ $t('submit') }}
    </b-button>
  </b-form>
</template>

<script>

import {mapGetters, mapActions} from 'vuex';

export default {
  data: () => ({
    org: null
  }),
  computed: {
    ...mapGetters({
      orgs: 'user/orgs'
    })
  },
  async created() {
    if (this.orgs.length) {
      this.org = this.orgs[0].id;
    }
  },
  methods: mapActions({
    setOrg: 'user/set-org'
  })
};
</script>
