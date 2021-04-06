

<template>
  <div>
    <Notification
      v-for="notification in notifications"
      :id="notification.id"
      :key="notification.id"
      :text="notification.text"
      :read-at="notification.readAt"
    />
    <div class="d-flex flex-row justify-content-center">
      <Pagination
        identity="user/notifications"
        first-number
        last-number
      />
      <b-button
        class="page-link ml-4"
        size="sm"
        :disabled="$nuxt.$loading && $nuxt.$loading.show"
        @click="fetch"
      >
        <b-icon icon="arrow-clockwise" />
      </b-button>
      <b-button
        class="page-link ml-4"
        size="sm"
        :disabled="$nuxt.$loading && $nuxt.$loading.show"
        @click="readAll"
      >
        {{ $t('viewAll') }}
      </b-button>
    </div>
  </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex';

export default {
  async fetch() {
    await this.fetch();
  },
  computed: mapGetters({
    notifications: 'user/notifications/data'
  }),
  methods: mapActions({
    fetch: 'user/notifications/fetch',
    readAll: 'user/notifications/dismiss-all-notifications'
  })
};
</script>
