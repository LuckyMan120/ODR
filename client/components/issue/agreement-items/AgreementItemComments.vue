

<template>
  <div>
    <div class="mb-1">
      <b>{{ $t('comments') }}:</b>
    </div>
    <agreement-item-comment-form
      class="mb-4"
      :issue-data-id="issueDataId"
    />

    <div>
      <b>{{ $t('previousComments') }}:</b>
    </div>
    <div
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class=" mt-4">
        {{ comment.user.firstName }} {{ comment.user.lastName }}
        {{ $t('commented') }}
        {{ $moment.utc(comment.createdAt).local().format('DD MMM YY h:mm a') }}
      </div>
      <b-card
        class="mt-2 mr-4"
      >
        <b-card-text>
          <div>
            {{ comment.text }}
          </div>
        </b-card-text>
      </b-card>
    </div>

    <div class="d-flex flex-row justify-content-center align-items-center mt-4">
      <Pagination identity="issue/comments" />
    </div>
  </div>
</template>

<script>

import {mapGetters, mapActions, mapMutations} from 'vuex';

export default {
  props: {
    issueId: {type: Number, required: true},
    issueDataId: {type: Number, required: true}
  },

  async fetch() {
    this.setIssueId(this.issueId);
    this.setIssueDataId(this.issueDataId);
    await this.fetch();
  },

  computed: mapGetters({
    comments: 'issue/comments/data'
  }),

  methods: {
    ...mapMutations({
      setIssueId: 'issue/comments/issueId',
      setIssueDataId: 'issue/comments/issueDataId'
    }),
    ...mapActions({
      fetch: 'issue/comments/fetch'
    })
  }
};
</script>
