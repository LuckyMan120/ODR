

<template>
  <div v-if="false">
    Notification Connect Component
  </div>
</template>

<script>

import {mapActions} from 'vuex';

export default {
  async created() {
    this.$io.socket.post('/user/unsubscribe');
    this.$io.socket.off('user');
    this.$io.socket.post('/user/subscribe');
    this.$io.socket.on('user', async msg => {
      if (
        msg.verb === 'added' &&
        msg.model === 'notification'
      ) {
        if (!msg.data.readAt) {
          this.$toast.success(
            msg.data.text,
            {
              action: [
                {
                  text: this.$t('dismiss'),
                  onClick: async (e, toast) => {
                    toast.goAway(0);
                    await this.dismiss(msg.data.id);
                  }
                }
              ]
            }
          );
          await this.read(msg.data.id);
        } else {
          this.fetch();
        }
      }
    });
    this.$io.socket.on('connect', () => {
      this.$io.socket.post('/user/subscribe');
    });
  },

  beforeDestroy() {
    this.$io.socket.post('/user/unsubscribe');
    this.$io.socket.off('user');
  },

  methods: mapActions({
    read: 'user/notifications/read',
    dismiss: 'user/notifications/dismiss',

    fetch: 'user/notifications/fetch'
  })
};
</script>
