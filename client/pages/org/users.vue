

<template>
  <div>
    <b-row>
      <b-col
        md="2"
        cols="12"
      >
        <nuxt-link to="/org/send-invite">
          {{ $t('inviteUser') }}
        </nuxt-link>
      </b-col>
      <b-col
        md="4"
        cols="12"
      >
        <OrgRoleFilter
          :options="[
            {value: 1, text: 'admin'},
            {value: 2, text: 'staff'},
            {value: 3, text: 'user'}
          ]"
          identity="org/users"
        />
      </b-col>
      <b-col
        md="6"
        cols="12"
      >
        <Search
          :fields="['firstName', 'lastName', 'email']"
          identity="org/users"
        />
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <Table
          id="users-list"
          :fields="fields"
          :items="users"
          identity="org/users"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <Pagination identity="org/users" />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  pageTitle: 'orgUsers',
  async asyncData({store}) {
    await store.dispatch('org/users/fetch');
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
        {label: this.$t('organizationRole'), key: 'role'},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      orgUsers: 'org/users/data'
    }),
    users() {
      return this.orgUsers.map(({
        user,
        role
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
            text: this.$t('role'),
            to: `/org/user/${user.id}/edit-role`
          }
        ]
      }));
    }
  }
};
</script>
