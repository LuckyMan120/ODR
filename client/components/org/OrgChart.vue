

<template>
  <div>
    <div>
      <!-- action bar -->
      <div class="d-flex justify-content-end align-items-center mb-2">
        <p
          class="hover-primary mb-0"
          @click="$toast.success('Coming soon')"
        >
          {{ $t('recordOfflineComplaint') }}
        </p>

        <span class="px-3">|</span>

        <p
          class="hover-primary mb-0"
          @click="opened=!opened"
        >
          {{ opened ? $t('snapshot.hide') : $t('snapshot.show') }}
        </p>

        <span class="px-3"> | </span>

        <p
          v-if="!orgIssues.length"
          class="hover-primary mb-0"
          @click="$toast.success($t('notEnoughIssues'))"
        >
          {{ $t('downloadBoardReport') }}
        </p>

        <b-overlay
          :show="loading"
          rounded
          opacity="0.7"
          spinner-small
          spinner-variant="primary"
          class="d-inline-block"
        >
          <b-dropdown
            v-if="orgIssues.length"
            :disabled="$nuxt.$loading && $nuxt.$loading.show"
            variant="text"
            class="hover-primary"
            :text="$t('downloadBoardReport')"
            boundary="scrollParent"
          >
            <b-dropdown-item
              v-for="(range, index) in rangeOptions"
              :key="index"
              :disabled="$nuxt.$loading && $nuxt.$loading.show"
              :href="`/api/org/board-report-pdf?start=${range.value.start}&end=${range.value.end}`"
              target="_blank"
            >
              {{ range.text }}
            </b-dropdown-item>
          </b-dropdown>
        </b-overlay>
      </div>
      <!-- chart box -->
      <b-card
        v-if="opened"
        class="mh-500"
      >
        <b-row>
          <b-col
            cols="12"
            md="3"
          >
            <client-only>
              <highchart
                redraw
                :options="{
                  chart: {
                    type: 'pie',
                    height: 200
                  },
                  exporting: {enabled: false},
                  credits: {enabled: false},
                  title: {text: ''},
                  colors: ['#FAAD50', '#e64040', '#48947a' ],
                  plotOptions: {
                    pie: {
                      dataLabels: {
                        enabled: false,
                        format: `<b>{point.name}</b>: {point.y}`
                      },
                      size: 100,
                      showInLegend: true
                    }
                  },
                  series: [
                    {
                      data: [
                        {name: $t('inProgress'), y: series.opened},
                        {name: $t('gettingLate'), y: series.getting},
                        {name: $t('closed'), y: series.closed}
                      ]
                    }
                  ]
                }"
                :update="['options', 'options.series']"
              />
            </client-only>
          </b-col>
          <b-col
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <div>
              <h4>{{ $t('inProgressOnTime') }}</h4>
              <p>{{ $t('under15DaysOld') }}</p>
              <p>{{ series.opened }}</p>
            </div>
          </b-col>
          <b-col
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <div>
              <h4>{{ $t('gettingLate') }}</h4>
              <p>{{ $t('15orMoreDaysOld') }}</p>
              <p>{{ series.getting }}</p>
            </div>
          </b-col>
          <b-col
            cols="12"
            md="3"
            class="d-flex align-items-center"
          >
            <div>
              <h4>{{ $t("closed") }}</h4>
              <p>&nbsp;</p>
              <p>{{ series.closed }}</p>
            </div>
          </b-col>
        </b-row>
      </b-card>
    </div>
    <div
      v-show="false"
      id="chartDownload"
      class="position-absolute"
    />
  </div>
</template>
<script>

import {mapGetters} from 'vuex';

export default {
  data() {
    return {
      opened: true,
      loading: false,
      newKey: 'newKey'
    };
  },

  computed: {
    ...mapGetters({
      org: 'user/org',
      orgIssues: 'org/issues/data'
    }),

    rangeOptions() {
      const range = [];
      const start = this.$moment(this.org.createdAt);
      const end = this.$moment();

      while (
        end > start ||
        start.format('M') === end.format('M')
      ) {
        range.push({
          text: start.format('MMMM YYYY'),
          value: {
            start: start.startOf('month').valueOf(),
            end: start.endOf('month').valueOf()
          }
        });
        start.add(1, 'month');
      }

      return range.reverse();
    },

    series() {
      const closedArr = this.orgIssues.filter(el => el.closedAt > 0);
      const gettingLate = this.orgIssues.filter(el => {
        return !el.closedAt &&
        this.$moment().diff(this.$moment(el.submittedAt), 'days') >= 15;
      });
      const openedCnt = (
        this.orgIssues.length -
        closedArr.length -
        gettingLate.length
      );
      return {
        closed: closedArr.length,
        opened: openedCnt,
        getting: gettingLate.length
      };
    }
  },

  mounted() {
    if (this.orgIssues && this.orgIssues.length) {
      this.opened = true;
    } else {
      this.opened = false;
    }
  }
};
</script>
<style scoped>
.mh-500{
  max-height: 500px;
}
</style>
