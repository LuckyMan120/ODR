

<template>
  <div>
    <b-row>
      <b-col
        md="6"
        cols="12"
      />
      <b-col
        md="6"
        cols="12"
      >
        <Search
          :fields="['key']"
          identity="siteconfig"
        />
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <Table
          :fields="fields"
          :items="siteConfig"
          identity="siteconfig"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <Pagination identity="siteconfig" />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  middleware: ['is-site-admin'],
  pageTitle: 'Site config',
  async asyncData({store}) {
    await store.dispatch('siteconfig/fetch');
  },
  data() {
    return {
      fields: [
        {label: this.$t('id'), key: 'id'},
        {label: this.$t('Key'), key: 'key'},
        {label: this.$t('Description'), key: 'desc'},
        {label: this.$t('Protected'), key: 'boolean'},
        {label: this.$t('Value'), key: 'value'},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      storeSiteConfig: 'siteconfig/data'
    }),
    siteConfig() {
      return this.storeSiteConfig.map((item) => (
        {
          id: item.id,
          key: item.key,
          desc: item.desc,
          boolean: item.protected,
          value: item.value,
          actions: [
            {text: this.$t('edit'), to: `/site-config/${item.id}`}
          ]
        }
      ));
    }
  }
};
</script>
