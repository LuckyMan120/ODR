<template>
  <div class="dash-wrapper">
    <div
      v-if="userInvitations.length"
      class="toasts-wrapper"
    >
      <invitation-toast
        v-for="(i, idx) in userInvitations"
        :key="i.id"
        v-model="userInvitations[idx]"
        @join="onJoin"
        @reject="onReject"
      />
    </div>

    <new-mediation-button
      class="mt-4"
      @new-mediation="onNewMediation"
    />

    <div class="mediations-wrapper mt-4">
      <mediation-card
        v-for="(c, idx) in userMediations"
        :key="c.id"
        v-model="userMediations[idx]"
      />
    </div>
  </div>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';

export default {
  async asyncData({store}) {
    await store.dispatch('mediations/fetch');
    await store.dispatch('invitations/fetch');
  },

  computed: {
    ...mapGetters({
      userMediations: 'mediations/data',
      userInvitations: 'invitations/data'
    })
  },

  methods: {
    ...mapActions({
      fetchMediations: 'mediations/fetch',
      fetchInvitations: 'invitations/fetch',
      onJoin: 'invitations/join',
      onReject: 'invitations/reject'
    }),

    onNewMediation() {
      console.log('TODO: New Mediation');
    }
  }

};
</script>

<style lang="scss" scoped>
.dash-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
}

.mediations-wrapper {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}
</style>
