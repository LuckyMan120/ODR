
<template>
  <div>
    <div>
      <div>
        <issue-intro
          :title="$t('conversationStepIntroTitle')"
          :desc="$t('conversationStepIntroDesc')"
        />

        <b-alert
          v-if="acceptedAgreementItems.length"
          show
          variant="success"
        >
          {{ $t('hasAcceptedAgreementItems') }}
        </b-alert>

        <div class="wrapper-content-issue">
          <div class="d-flex flex-row justify-content-center align-items-center mb-2">
            <b-button
              v-if="!showForm"
              size="lg"
              class="dashed-button d-flex flex-row justify-content-center align-items-center"
              @click="showForm = true"
            >
              <b-icon icon="plus-circle-fill" />
              <span class="ml-3"> {{ $t("newAgreementItem") }} </span>
            </b-button>
          </div>

          <gr-agreement-item
            v-if="showForm"
            :title="$t('agreementItemTitle') + ':'"
            :description="$t('agreementItemFieldDesc')"
            :issue-id="+$route.params.id"
            :type-id="dataTypes.agreementItem"
            :validations="{required, maxChars: maxLength(250)}"
            :bind="false"
          />

          <b-row
            v-for="agreementItem in agreementItems"
            :key="agreementItem.id"
          >
            <b-col>
              <b-card class="mt-2">
                <AgreementItem
                  :issue-id="+$route.params.id"
                  :issue-data="agreementItem"
                />
              </b-card>
            </b-col>
          </b-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {dataTypes} from '@/constants/data-types.js';
import {required, maxLength} from 'vuelidate/lib/validators';
import {mapGetters} from 'vuex';
export default {

  data: () => ({
    dataTypes,
    required,
    maxLength,
    showForm: false
  }),

  computed: {
    ...mapGetters({
      issue: 'issue/issue',
      issueData: 'issue/issueData'
    }),
    agreementItems() {
      return this.issueData.filter(issueData => {
        return issueData.type.id === dataTypes.agreementItem;
      });
    },
    acceptedAgreementItems() {
      const items = this.agreementItems.filter(issueData => {
        const agreedStatuses = issueData.statuses.filter(status => {
          return status.value === 'accepted';
        });
        return agreedStatuses.length === this.issue.parties.length;
      });
      return items;
    }
  },

  watch: {
    agreementItems() {
      this.showForm = !this.agreementItems.length;
    }
  },

  mounted() {
    this.showForm = !this.agreementItems.length;
  }

};
</script>
