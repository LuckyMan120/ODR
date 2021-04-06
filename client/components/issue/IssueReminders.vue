<template>
  <div class="w-100">
    <b-row
      class="w-100"
      no-gutters
    >
      <b-col cols="12 ml-4">
        <label>{{ $t('reminders') }}:</label>
      </b-col>
    </b-row>
    <b-row
      class="w-100"
      no-gutters
    >
      <b-col cols="12">
        <div
          v-if="party.type === 'responder'"
          class="pr-4"
        >
          <!-- eslint-disable-next-line -->
          <span v-html="$t('responderReminders')"></span>
        </div>
        <div
          v-else
          class="pr-4"
        >
          <!-- eslint-disable-next-line -->
          <span v-html="$t('clientReminders')"></span>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  computed: mapGetters({
    party: 'issue/party'
  })
};

</script>

