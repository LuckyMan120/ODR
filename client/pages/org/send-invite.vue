

<template>
  <b-row class="justify-content-md-left">
    <b-col
      md="4"
      cols="12"
    >
      <OrgInvite
        @done-invite-sent="inviteSent"
        @done-user-added="userAdded"
      />
    </b-col>
  </b-row>
</template>

<script>

import {mapGetters} from 'vuex';
import {roleMixin} from '@/mixins/roleMixin.js';

export default {
  mixins: [roleMixin],
  pageTitle: 'inviteUser',
  computed: mapGetters({
    orgRoleStore: 'user/orgRole'
  }),
  methods: {
    inviteSent() {
      if (this.orgRoleStore.name === this.orgRole.admin) this.$router.push('/org/invites');
    },
    userAdded() {
      if (this.orgRoleStore.name === this.orgRole.admin) this.$router.push('/org/users');
    }
  }
};
</script>
