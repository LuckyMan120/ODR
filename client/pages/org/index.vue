

<template>
  <div>
    <b-row>
      <b-col
        md="6"
        cols="12"
      >
        <nuxt-link to="/org/create">
          {{ $t('createOrganization') }}
        </nuxt-link>
      </b-col>
      <b-col
        md="6"
        cols="12"
      >
        <Search
          :fields="['name', 'abn', 'slug']"
          identity="orgs"
        />
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <Table
          :fields="fields"
          :items="orgs"
          identity="orgs"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <Pagination identity="orgs" />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  middleware: ['is-site-admin'],
  pageTitle: 'organizations',
  async asyncData({store}) {
    await store.dispatch('orgs/fetch');
  },
  data() {
    return {
      fields: [
        {label: this.$t('id'), key: 'id', sortable: true},
        {label: this.$t('name'), key: 'name', sortable: true},
        {label: this.$t('abn'), key: 'abn', sortable: true},
        {label: this.$t('active'), key: 'boolean', sortable: true},
        {label: this.$t('slug'), key: 'slug', sortable: true},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      storeOrgs: 'orgs/data'
    }),
    orgs() {
      return this.storeOrgs.map(({
        id,
        name,
        abn,
        active,
        slug
      }) => ({
        id,
        name,
        abn,
        boolean: active,
        slug,
        actions: [
          {text: this.$t('users'), to: `/org/${id}/users`},
          {text: this.$t('edit'), to: `/org/${id}`}
        ]
      }));
    }
  }
};
</script>
