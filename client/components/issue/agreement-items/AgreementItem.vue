

<template>
  <div>
    <gr-agreement-item
      :title="$t('agreementItemTitle') + ':'"
      :issue-id="issueId"
      :type-id="dataTypes.agreementItem"
      :issue-data-id="issueData.id"
      :validations="{required, maxChars: maxLength(250)}"
      :disabled="disabled"
    />

    <agreement-item-status
      v-if="!!issueData"
      :issue-id="+$route.params.id"
      :issue-data-id="issueData.id"
      :statuses="issueData.statuses"
      :issue-data="issueData"
      @modify="disabled = false"
    />

    <div
      v-if="!!issueData"
      v-show="false"
      class="mt-2"
    >
      <b-button
        variant="outline-primary"
        @click="showComments = true"
      >
        {{ $t('requestChangeDiscuss') }}
      </b-button>
      <b-button
        v-if="issueData.user === user.id"
        variant="outline-primary"
        @click="disabled = !disabled"
      >
        {{ $t('modify') }}
      </b-button>
    </div>

    <b-modal
      :visible="showComments"
      hide-footer
      hide-header
      centered
      size="lg"
      @cancel="showComments = false"
      @close="showComments = false"
      @hidden="showComments = false"
    >
      <AgreementItemComments
        :issue-id="issueId"
        :issue-data-id="issueData.id"
      />
    </b-modal>
  </div>
</template>

<script>

import {dataTypes} from '@/constants/data-types.js';
import {required, maxLength} from 'vuelidate/lib/validators';
import {mapGetters} from 'vuex';

export default {

  props: {
    issueId: {type: Number, required: true},
    issueData: {type: Object, required: true}
  },

  data: () => ({
    dataTypes,
    required,
    maxLength,
    showComments: false,
    disabled: true
  }),

  computed: mapGetters({
    user: 'user/user'
  }),

  watch: {
    issueData() {
      this.disabled = true;
    }
  }
};
</script>
