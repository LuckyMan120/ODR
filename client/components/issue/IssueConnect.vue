

<template>
  <div v-if="false">
    Issue Connect Component
  </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex';

export default {
  props: {
    issueId: {type: Number, required: true}
  },

  computed: mapGetters({
    issue: 'issue/issue',
    user: 'user/user'
  }),

  async created() {
    this.$io.socket.post(`/issue/${this.issueId}/subscribe`);
    this.$io.socket.on('issue', async msg => {
      console.log('event');
      if (
        msg.verb === 'updated' &&
        msg.id === this.issue.id &&
        msg.userId !== this.user.id &&
        msg.data.updatedAt > this.issue.updatedAt
      ) {
        console.log('update');
        await this.fetchIssue();
        await this.fetchComments();
      }
    });
    this.$io.socket.on('connect', () => {
      this.$io.socket.post(`/issue/${this.issueId}/subscribe`);
    });
  },

  beforeDestroy() {
    this.$io.socket.post(`/issue/${this.issueId}/unsubscribe`);
    this.$io.socket.off('issue');
  },

  methods: mapActions({
    fetchIssue: 'issue/fetch',
    fetchComments: 'issue/comments/fetch'
  })
};
</script>
