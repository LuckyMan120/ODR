

<template>
  <div>
    <b-row>
      <b-col
        lg="10"
        sm="12"
      >
        <b-alert
          v-if="bothAccepted"
          show
          variant="success"
        >
          <b-icon
            icon="arrow-right"
            class="icon"
          />
          {{ myMessage }}
        </b-alert>
        <b-alert
          v-else
          show
        >
          <b-icon
            icon="arrow-right"
            class="icon"
          />
          {{ myMessage }}
        </b-alert>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        lg="10"
        sm="12"
        class="text-right"
      >
        <b-button
          v-if="myStatus !== 'accepted'"
          variant="link"
          size="sm"
          class="text-success"
          @click.stop="updatePartyStatus('accepted')"
        >
          {{ $t('accept') }}
        </b-button>

        <b-button
          v-if="myStatus !== 'rejected'"
          variant="link"
          size="sm"
          class="text-primary"
          @click.stop="updatePartyStatus('rejected')"
        >
          {{ $t('reject') }}
        </b-button>
        <b-button
          v-if="!bothAccepted"
          variant="link"
          size="sm"
          color="text-warning"
          @click.prevent="modify()"
        >
          {{ $t('modify') }}
        </b-button>

        <b-button
          v-if="issueData.revisions.length"
          variant="link"
          size="sm"
          class="text-grey"
          @click.prevent="showHistory = !showHistory"
        >
          {{ historyBtnLabel }}
        </b-button>

        <gr-issue-data-revisions
          v-if="showHistory"
          :issue-data="issueData"
        />
      </b-col>
    </b-row>
    <div />
  </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex';

export default {
  props: {
    issueId: {type: Number, required: true},
    issueDataId: {type: Number, required: true},
    statuses: {type: Array, default: () => ([])},
    issueData: {type: Object, required: true}
  },
  data() {
    return {
      showHistory: false
    };
  },
  computed: {
    ...mapGetters({
      party: 'issue/party'
    }),
    myStatus() {
      return this.statuses.find(status => {
        return this.party.id === status.party.id;
      }).value;
    },
    theirStatus() {
      return this.statuses.find(status => {
        return this.party.id !== status.party.id;
      }).value;
    },
    latestAuthor() {
      if (!this.issueData) {
        return;
      }

      if (this.issueData.revisions.length) {
        console.log('yes revs');
        if (this.issueData.revisions[this.issueData.revisions.length - 1].party.id === this.party.id) {
          return 'me';
        } else {
          return 'them';
        }
      } else {
        if (this.issueData.party === this.party.id) {
          return 'me';
        } else {
          return 'them';
        }
      }
    },
    myMessage() {
      if (this.myStatus === 'accepted') {
        if (this.theirStatus === 'accepted') {
          return this.$t('bothAccepted');
        } else if (this.theirStatus === 'rejected') {
          return this.$t('otherRejectedTryModify', {partyName: this.otherPartyName});
        } else if (this.theirStatus === 'none') {
          return this.$t('youAcceptedAwaitingOther', {partyName: this.otherPartyName});
        }
      } else if (this.myStatus === 'rejected') {
        if (this.theirStatus === 'accepted') {
          return this.$t('youRejectedOtherAcceptedTryModfify', {partyName: this.otherPartyName});
        } else if (this.theirStatus === 'rejected') {
          return this.$t('bothRejectedTryModify', {partyName: this.otherPartyName});
        } else if (this.theirStatus === 'none') {
          return this.$t('youRejectedAwaitingOtherTryModify', {partyName: this.otherPartyName});
        }
      } else {
        if (this.theirStatus === 'accepted') {
          return this.$t('otherAcceptedPlzEvaluate', {partyName: this.otherPartyName});
        } else if (this.theirStatus === 'rejected') {
          return this.$t('otherRejectedTryModify', {partyName: this.otherPartyName});
        } else if (this.theirStatus === 'none') {
          if (this.latestAuthor === 'me') {
            return this.$t('awaitOtherThenEvaluate', {partyName: this.otherPartyName});
          } else {
            if (this.issueData.revisions.length) {
              return this.$t('otherModifiedPlzEvaluate', {partyName: this.otherPartyName});
            } else {
              return this.$t('otherCreatedPlzEvaluate', {partyName: this.otherPartyName});
            }
          }
        }
      }
      return 'unrecognised status';
    },
    otherPartyName() {
      return this.statuses.find(status => {
        return this.party.id !== status.party.id;
      }).party.name;
    },
    bothAccepted() {
      return this.myStatus === 'accepted' && this.theirStatus === 'accepted';
    },
    historyBtnLabel() {
      return this.showHistory ? this.$t('hideDataHistory') : this.$t('showDataHistory');
    }
  },

  methods: {
    ...mapActions({
      updateStatus: 'issue/updateIssueDataStatus'
    }),
    modify() {
      this.$emit('modify');
    },
    async updatePartyStatus(status) {
      await this.updateStatus({
        issueDataId: this.issueDataId,
        value: status
      });
      if (this.bothAccepted) {
        this.$toast.success(
        `${this.$t('hasAcceptedAgreementItems')}`
        );
      }
    }

  }
};
</script>

<style lang="scss" scoped>
.text-grey{
  color: grey;
}

.icon {
  margin-right: 4px;
  font-size: 1rem;
}

.list-group-item {
  background-color: inherit;
}
</style>
