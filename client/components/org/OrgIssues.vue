

<template>
  <div>
    <b-row class="mt-4">
      <b-col>
        <Table
          id="users-list"
          :fields="fields"
          :items="issues"
          :slots="['age']"
          identity="org/issues"
          no-items-message="noComplaintsOrgList"
        >
          <template #age="{data}">
            <p :style="getCss(data.item.age)">
              {{ data.item.age }}
            </p>
          </template>
        </Table>
      </b-col>
    </b-row>
    <b-row>
      <b-col
        cols="12"
        class="d-flex justify-content-center"
      >
        <Pagination identity="org/issues" />
      </b-col>
    </b-row>
  </div>
</template>
<script>

import {mapGetters, mapActions} from 'vuex';

export default {
  data() {
    return {
      fields: [
        {label: this.$t('id'), key: 'id'},
        {label: this.$t('name'), key: 'name'},
        {label: this.$t('submittedAt'), key: 'submittedAt'},
        {label: this.$t('ageListLabel'), key: 'age'},
        {label: this.$t('responseTime'), key: 'responseTime'},
        {label: this.$t('status'), key: 'outcome'},
        {label: this.$t('actions'), key: 'actions'}
      ]
    };
  },
  computed: {
    ...mapGetters({
      orgIssues: 'org/issues/data',
      org: 'user/org'
    }),
    issues() {
      return this.orgIssues.map(({
        id,
        name,
        resolvedAt,
        updatedAt,
        submittedAt,
        agreedAt,
        status,
        responderEngagedAt
      }) => ({
        id,
        name,
        age: this.$moment().diff(this.$moment(submittedAt), 'days'),
        responseTime: responderEngagedAt ?
          this.formatTimeDiff(
            this.$moment(responderEngagedAt)
              .diff(this.$moment(submittedAt), 'minutes')
          ) :
          '-',
        submittedAt: this.$moment(submittedAt).format('DD MMM YY'),
        lastActivity: this.$moment(updatedAt).format('DD MMM YY'),
        resolvedAt: resolvedAt ?
          this.$moment(resolvedAt).format('DD MMM YY') :
          '-',
        agreedAt: agreedAt ?
          this.$moment(agreedAt).format('DD MMM YY') :
          '-',
        outcome: this.$t(status),
        actions: (() => {
          const actions = [
            {
              text: this.$t('view'),
              type: 'button',
              variant: 'outline-primary',
              to: `/issue/${id}`
            }
          ];

          if (
            status === 'closedWithdrawn' ||
            status === 'closedEscalatedMediation' ||
            status === 'closedEscalatedOmbudsman' ||
            status === 'closedOldAge'
          ) {
            actions.push({
              text: this.$t('downloadPdf'),
              type: 'button',
              variant: 'outline-warning',
              to: `/api/issue/${id}/summary-pdf`,
              target: '_blank'
            });
          }

          return actions;
        })()
      }));
    }
  },

  watch: {
    org() {
      this.subscribe();
    }
  },

  created() {
    this.subscribe();
  },

  beforeDestroy() {
    this.$io.socket.post('/org/unsubscribe');
    this.$io.socket.off('org');
  },

  methods: {
    ...mapActions({
      fetch: 'org/issues/fetch'
    }),
    getCss(age) {
      if (age > 30) return 'color: red';
      else if (age > 15) return 'color: orange';
      else return '';
    },
    formatTimeDiff(mins) {
      const days = Math.floor(mins / 1440);
      const hours = Math.floor(mins / 60) % 24;
      mins = mins % 60;
      const dif = days.toString().padStart(2, 0) +
       ':' + hours.toString().padStart(2, 0) +
       ':' + mins.toString().padStart(2, 0);

      return dif;
    },

    subscribe() {
      if (process.client) {
        this.$io.socket.post('/org/unsubscribe');
        this.$io.socket.off('org');
        this.$io.socket.post('/org/subscribe');
        this.$io.socket.on('org', msg => {
          if (
            msg.verb === 'added' &&
            msg.model === 'issue'
          ) {
            this.fetch();
          }
        });
        this.$io.socket.on('connect', () => {
          this.$io.socket.post('/org/subscribe');
        });
      }
    }
  }
};
</script>
