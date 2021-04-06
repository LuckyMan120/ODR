
<template>
  <div>
    <div>
      <issue-intro
        :title="$t('resolutionStepIntroTitle')"
        :desc="$t('resolutionStepIntroDesc')"
      />
      <div class="wrapper-content-issue">
        <b-row>
          <b-col
            cols="12"
            class="mb-2"
          >
            <b>{{ $t('agreedItemsListTitle') }}:</b>
          </b-col>
        </b-row>

        <b-row>
          <b-col cols="12">
            <table class="table table-bordered">
              <tbody>
                <tr
                  v-for="agreement in acceptedAgreementItems"
                  :key="agreement.id"
                >
                  <td>
                    {{ $t(agreement.category) }}: {{ agreement.value }}
                  </td>
                </tr>
              </tbody>
            </table>
          </b-col>
        </b-row>

        <div>
          <div class="mt-4 mb-1">
            <b>{{ $t('agreement') }}:</b>
          </div>

          <table class="table table-bordered">
            <tbody>
              <tr
                v-for="issueParty in issue.parties"
                :key="issueParty.id"
              >
                <td style="width:20%">
                  <div v-if="party.id === issueParty.id">
                    {{ $t('you') }}:
                  </div>
                  <div v-else>
                    {{ issueParty.name }}:
                  </div>
                </td>
                <td>
                  <div v-if="partyConfirmedResolution(issueParty.id)">
                    {{ $t('acceptedOn', [$moment(partyConfirmedResolution.createdAt).format('LLL')]) }}
                  </div>
                  <div v-else>
                    <div v-if="party.id === issueParty.id">
                      <gr-checkbox-group
                        :description="$t('acceptanceFieldDesc')"
                        :issue-id="+$route.params.id"
                        :options="[{value: 1, text: $t('confirmFieldLabel')}]"
                        :type-id="dataTypes.resolutionConfirmed"
                        :party-id="party.id"
                        class="mb-0"
                      />
                    </div>
                    <div v-else>
                      {{ $t('notAgreed') }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="party.type === 'responder'">
            <b-row class="mt-4">
              <b-col cols="12">
                <label>{{ $t('repsonderAdditionalInfoLabel') }}</label>
              </b-col>
            </b-row>

            <b-row class="mt-3">
              <b-col cols="12">
                <gr-textarea
                  :title="$t('systemicProblemsTitle')"
                  :issue-id="+$route.params.id"
                  :type-id="dataTypes.systemicProblems"
                  auto-save
                />
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col cols="12">
                <gr-textarea
                  :title="$t('underlyingCausesTitle')"
                  :issue-id="+$route.params.id"
                  :type-id="dataTypes.underlyingCauses"
                  auto-save
                />
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col cols="12">
                <gr-textarea
                  :title="$t('improvementRecomTitle')"
                  :issue-id="+$route.params.id"
                  :type-id="dataTypes.improvementRecom"
                  auto-save
                />
              </b-col>
            </b-row>
            <b-row class="mt-3">
              <b-col cols="12">
                <gr-text-input
                  :title="$t('resolutionCostTitle')"
                  :issue-id="+$route.params.id"
                  :type-id="dataTypes.resolutionCost"
                  :validations="{decimal}"
                  class="tiny-input"
                  auto-save
                />
                <b-form-invalid-feedback id="phone-input-feedback">
                  {{ $t('genericFieldDecimal') }}
                </b-form-invalid-feedback>
              </b-col>
            </b-row>
          </div>

          <div
            v-if="resolutionConfirmedItems.length === issue.parties.length"
            class="text-bold mt-4"
          >
            <b-alert
              show
              variant="success"
            >
              <!-- eslint-disable-next-line -->
              <b v-html="$t('haveAgreemnetMsg')" />
            </b-alert>
          </div>

          <b-button
            class="mt-4"
            variant="outline-warning"
            :href="`/api/issue/${$route.params.id}/summary-pdf`"
            target="_blank"
          >
            {{ $t('downloadPdf') }}
          </b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {dataTypes} from '@/constants/data-types.js';
import {required, decimal} from 'vuelidate/lib/validators';
import {mapGetters} from 'vuex';

export default {
  data() {
    return {dataTypes, required, decimal};
  },
  computed: {
    ...mapGetters({
      issue: 'issue/issue',
      party: 'issue/party',
      issueData: 'issue/issueData'
    }),
    agreementItems() {
      return this.issueData.filter(issueData => {
        return issueData.type.id === dataTypes.agreementItem;
      });
    },
    resolutionConfirmedItems() {
      return this.issueData.filter(issueData => {
        return issueData.type.id === dataTypes.resolutionConfirmed;
      });
    },
    acceptedAgreementItems() {
      return this.agreementItems.filter(issueData => {
        return issueData.statuses.every(status => status.value === 'accepted');
      });
    }
  },
  methods: {
    mapOptions(options) {
      return options.map(t => ({value: t, text: this.$t(t)}));
    },
    partyConfirmedResolution(partyId) {
      return this.resolutionConfirmedItems.find(issueData => {
        return issueData.party === partyId;
      });
    }
  }
};
</script>
