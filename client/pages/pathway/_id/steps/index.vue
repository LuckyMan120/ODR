

<template>
  <div>
    <b-row>
      <b-col
        cols="12"
        align="right"
      >
        <nuxt-link :to="`/pathway/${$route.params.id}/steps/create`">
          {{ $t('createStep') }}
        </nuxt-link>
      </b-col>
    </b-row>
    <b-row class="mt-4">
      <b-col>
        <Table
          :fields="fields"
          :items="steps"
          identity="steps"
        />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <Pagination identity="steps" />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  pageTitle: 'steps',
  async asyncData({store, params}) {
    store.commit('steps/where', {pathway: params.id});
    await store.dispatch('steps/fetch');
  },
  data() {
    return {
      fields: [
        {label: this.$t('id'), key: 'id', sortable: true},
        {label: this.$t('name'), key: 'name', sortable: true},
        {label: this.$t('order'), key: 'sortOrder', sortable: true},
        {label: this.$t('parent'), key: 'relation', sortable: true},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      storeSteps: 'steps/data'
    }),
    steps() {
      return this.storeSteps.map(({
        id,
        name,
        sortOrder,
        parent
      }) => {
        const data = {
          id,
          name,
          sortOrder,
          actions: [
            {
              text: this.$t('remove'),
              type: 'button',
              variant: 'danger',
              icon: 'trash',
              action: 'steps/destroy',
              actionData: {id},
              size: 'sm'
            },
            {
              text: this.$t('edit'),
              to: `/pathway/${this.$route.params.id}/steps/${id}`
            }
          ]
        };
        if (!parent) {
          data.actions.push({
            text: this.$t('steps'),
            to: `/pathway/${this.$route.params.id}/steps/${id}/steps`
          });
        } else {
          data.relation = {
            link: `/pathway/${this.$route.params.id}/steps/${parent.id}/steps`,
            text: parent.name
          };
        }
        return data;
      });
    }
  }
};
</script>
