

<template>
  <div>
    <b-row>
      <b-col>
        <h4
          v-if="user"
        >
          <nuxt-link
            :to="`/user/${user.id}`"
          >
            {{ user.firstName }} {{ user.lastName }}
          </nuxt-link>
        </h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <nuxt-link to="edit-orgs">
          {{ $t('editOrgs') }}
        </nuxt-link>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <Table
          class="mt-4"
          :fields="fields"
          :items="orgs"
          identity="orgUsers"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <Pagination
          identity="orgUsers"
        />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  pageTitle: 'usersOrganizations',
  async asyncData({$axios, params, store}) {
    store.commit('orgUsers/where', {user: params.id});
    await store.dispatch('orgUsers/fetch');
    return {
      user: await $axios.$get(`/user/${params.id}`)
    };
  },
  data() {
    return {
      fields: [
        {label: this.$t('id'), key: 'id', sortable: true},
        {label: this.$t('name'), key: 'name', sortable: true},
        {label: this.$t('abn'), key: 'abn', sortable: true},
        {label: this.$t('active'), key: 'boolean', sortable: true},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      orgUsers: 'orgUsers/data'
    }),
    orgs() {
      return this.orgUsers.map(({
        org,
        role
      }) => ({
        id: org.id,
        name: org.name,
        abn: org.abn,
        boolean: org.active,
        slug: org.slug,
        organizationRole: role.name,
        actions: [
          {text: this.$t('users'), to: `/org/${org.id}/users`},
          {text: this.$t('edit'), to: `/org/${org.id}`}
        ]
      }));
    }
  }
};
</script>
