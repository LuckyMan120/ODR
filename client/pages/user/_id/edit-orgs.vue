

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
  pageTitle: 'editOrgs',
  async asyncData({$axios, params, store}) {
    await store.dispatch('orgs/fetch');
    store.commit('orgUsers/where', {
      user: params.id
    });
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
        {label: this.$t('slug'), key: 'slug', sortable: true},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      storeOrgs: 'orgs/data',
      orgUsers: 'orgUsers/data'
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
        actions: (() => {
          const orgUser = this.orgUsers.find(oUser => oUser.org.id === id);
          if (orgUser) {
            return [{
              text: this.$t('remove'),
              type: 'button',
              variant: 'outline-danger',
              action: 'orgUsers/destroy',
              actionData: {
                id: orgUser.id
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
                  user: this.$route.params.id,
                  org: id
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
