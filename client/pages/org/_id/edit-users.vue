

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
        <Table
          :fields="fields"
          :items="users"
          identity="users"
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
  pageTitle: 'editUsers',
  async asyncData({$axios, params, store}) {
    await store.dispatch('users/fetch');
    store.commit('orgUsers/where', {
      org: params.id
    });
    await store.dispatch('orgUsers/fetch');
    return {
      org: await $axios.$get(`/org/${params.id}`)
    };
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
      storeUsers: 'users/data',
      orgUsers: 'orgUsers/data'
    }),
    users() {
      return this.storeUsers.map(({
        id,
        email,
        firstName,
        lastName,
        company,
        phone
      }) => ({
        id,
        email,
        firstName,
        lastName,
        company,
        phone,
        actions: (() => {
          const orgUser = this.orgUsers.find(oUser => oUser.user.id === id);
          if (orgUser) {
            return [{
              text: this.$t('remove'),
              type: 'button',
              variant: 'outline-danger',
              action: 'orgUsers/destroy',
              actionData: {
                id: orgUser.id,
                where: {
                  org: this.$route.params.id
                }
              }
            }];
          } else {
            return [{
              text: this.$t('add'),
              type: 'button',
              variant: 'outline-success',
              action: 'orgUsers/create',
              actionData: {
                data: {
                  user: id,
                  org: this.$route.params.id
                },
                where: {
                  org: this.$route.params.id
                }
              }
            }];
          }
        })()
      }));
    }
  }
};
</script>
