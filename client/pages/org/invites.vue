

<template>
  <div>
    <nuxt-link
      :to="`/org/send-invite`"
    >
      {{ $t('inviteUser') }}
    </nuxt-link>
    <b-row class="mt-4">
      <b-col>
        <OrgInvitesList :invites="invites" />
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <Pagination identity="org/invites" />
      </b-col>
    </b-row>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  pageTitle: 'invites',
  async asyncData({store}) {
    await store.dispatch('org/invites/fetch');
  },
  computed: {
    ...mapGetters({
      storeInvites: 'org/invites/data'
    }),
    invites() {
      return this.storeInvites.map(({
        id,
        email,
        user,
        role,
        updatedAt
      }) => ({
        [this.$t('sentBy')]: `${user.firstName} ${user.lastName}`,
        sentAt: new Date(updatedAt).toLocaleString(),
        to: email,
        as: role.name,
        actions: [
          {
            text: this.$t('cancel'),
            type: 'button',
            variant: 'outline-dark',
            icon: 'trash',
            action: 'org/invites/destroy-invite',
            actionData: {id},
            size: 'sm'
          },
          {
            text: this.$t('resend'),
            type: 'button',
            variant: 'outline-dark',
            icon: 'envelope',
            action: 'org/invites/resend-invite',
            actionData: {id},
            size: 'sm'
          }
        ]
      }));
    }
  }
};
</script>
