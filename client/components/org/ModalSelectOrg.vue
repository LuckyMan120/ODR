<template>
  <b-modal
    id="modal-seclect-org"
    :title="$t('loadOrg')"
    hide-footer
    hide-header-close
    no-close-on-esc
    no-close-on-backdrop
  >
    <b-jumbotron class="text-center">
      <b-form-select
        v-model="selected"
        :options="listOrgs"
      />
      <b-button
        variant="primary"
        class="mt-3"
        @click="onSubmit"
      >
        {{ $t('submit') }}
      </b-button>
    </b-jumbotron>
  </b-modal>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  data() {
    return {
      selected: null
    };
  },
  computed: {
    ...mapGetters({
      orgs: 'user/orgs',
      org: 'user/org'
    }),
    listOrgs() {
      return this.orgs.map((item) => (
        {
          value: item.id,
          text: item.name
        }
      ));
    }
  },
  created() {
    this.selected = this.orgs[0]?.id;
  },
  mounted() {
    if (this.orgs.length > 1 && !this.org) {
      this.$bvModal.show('modal-seclect-org');
    }
  },
  methods: {
    ...mapActions({
      setOrg: 'user/set-org'
    }),
    onSubmit() {
      this.setOrg({org: this.selected});
      this.$bvModal.hide('modal-seclect-org');
    }
  }
};
</script>
