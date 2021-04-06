

<template>
  <div>
    <b-row>
      <b-col
        cols="12"
        align="right"
      >
        <nuxt-link to="/pathway/create">
          {{ $t('createPathway') }}
        </nuxt-link>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <Table
          :fields="fields"
          :items="pathways"
          identity="pathways"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <Pagination identity="pathways" />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  pageTitle: 'pathways',
  async asyncData({store}) {
    await store.dispatch('pathways/fetch');
  },
  data() {
    return {
      fields: [
        {label: this.$t('id'), key: 'id', sortable: true},
        {label: this.$t('name'), key: 'name', sortable: true},
        {label: this.$t('active'), key: 'boolean', sortable: true},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      storePathways: 'pathways/data'
    }),
    pathways() {
      return this.storePathways.map(({
        id,
        name,
        active
      }) => ({
        id,
        name,
        boolean: active,
        actions: [
          {
            text: this.$t('remove'),
            type: 'button',
            variant: 'danger',
            icon: 'trash',
            action: 'pathways/destroy',
            actionData: {id},
            size: 'sm',
            disabled: active
          },
          {text: this.$t('edit'), to: `/pathway/${id}`},
          {text: this.$t('steps'), to: `/pathway/${id}/steps`}
        ]
      }));
    }
  }
};
</script>
