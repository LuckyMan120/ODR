

<template>
  <div>
    <b-row>
      <b-col>
        <h4
          v-if="org"
        >
          <nuxt-link
            :to="`/org/${org.id}`"
          >
            {{ org.name }}
          </nuxt-link>
        </h4>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <nuxt-link to="edit-users">
          {{ $t('editUsers') }}
        </nuxt-link>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <Table
          class="mt-4"
          :fields="fields"
          :items="users"
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
  pageTitle: 'orgUsers',
  async asyncData({$axios, store, params}) {
    await store.commit('orgUsers/where', {org: params.id});
    await store.dispatch('orgUsers/fetch');
    return {
      org: await $axios.$get(`/org/${params.id}`)
    };
  },
  data() {
    return {
      fields: [
        {label: this.$t('id'), key: 'id', sortable: true},
        {label: this.$t('email'), key: 'email'},
        {label: this.$t('firstName'), key: 'firstName'},
        {label: this.$t('lastName'), key: 'lastName'},
        {label: this.$t('company'), key: 'company'},
        {label: this.$t('phone'), key: 'phone'},
        {label: this.$t('organizationRole'), key: 'role'},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      orgUsers: 'orgUsers/data'
    }),
    users() {
      return this.orgUsers.map(({
        id,
        user,
        role,
        org
      }) => ({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        company: user.company,
        phone: user.phone,
        role: role.name,
        actions: [
          {
            text: this.$t('organizations'),
            to: `/user/${user.id}/orgs`
          },
          {
            text: this.$t('edit'),
            to: `/user/${user.id}`
          },
          {
            text: this.$t('role'),
            to: `/org/${org.id}/user/${id}/edit-role`
          }
        ]
      }));
    }
  }
};
</script>
