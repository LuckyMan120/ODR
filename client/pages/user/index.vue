

<template>
  <div>
    <b-row>
      <b-col
        md="6"
        cols="12"
      >
        <nuxt-link to="/user/create">
          {{ $t('createUser') }}
        </nuxt-link>
      </b-col>
      <b-col
        md="6"
        cols="12"
      >
        <Search
          :fields="['firstName', 'lastName', 'email']"
          identity="users"
        />
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <Table
          :fields="fields"
          :items="users"
          identity="users"
          excel="true"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <Pagination identity="users" />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  pageTitle: 'users',
  async asyncData({store}) {
    await store.dispatch('users/fetch');
  },
  data() {
    return {
      fields: [
        {label: this.$t('id'), key: 'id', sortable: true},
        {label: this.$t('email'), key: 'email', sortable: true},
        {label: this.$t('firstName'), key: 'firstName', sortable: true},
        {label: this.$t('lastName'), key: 'lastName', sortable: true},
        {label: this.$t('company'), key: 'company'},
        {label: this.$t('phone'), key: 'phone'},
        {label: this.$t('role'), key: 'role'},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      storeUsers: 'users/data'
    }),
    users() {
      return this.storeUsers.map(({
        id,
        email,
        firstName,
        lastName,
        company,
        phone,
        role
      }) => ({
        id,
        email,
        firstName,
        lastName,
        company,
        phone,
        role: role.name,
        actions: [
          {text: this.$t('organizations'), to: `/user/${id}/orgs`},
          {text: this.$t('edit'), to: `/user/${id}`}
        ]
      }));
    }
  }
};
</script>
