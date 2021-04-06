<template>
  <div class="w-100">
    <b-row
      v-if="currentQuote"
      class="w-100"
      no-gutters
    >
      <b-col cols="12">
        <div class="p-4">
          <!-- eslint-disable-next-line -->
          <div class="quote text-center text-warning font-italic">
            "{{ $t(currentQuote) }}"
          </div>
          <div class="quote-author text-center mt-2 font-italic text-secondary">
            {{ $t(currentQuote + 'Author') }}
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
export default {
  data: () => ({
    responderQuotes: [
      'quoteUnhappyCustomers',
      'quoteItsTheOutcome',
      'quoteTrunLoyalCustomer',
      'quoteOpportunity',
      'beThankful',
      'manyGooddeeds'
    ],
    participantQuotes: [
      'quoteDialogResolvesConflict',
      'quoteFindARemedy',
      'quoteWrongToneOfVoice'
    ],
    currentQuote: null
  }),
  computed: mapGetters({
    party: 'issue/party'
  }),
  watch: {
    $route() {
      this.selectQuote();
    }
  },
  mounted() {
    this.selectQuote();
  },
  methods: {
    selectQuote() {
      if (this.party.type === 'responder') {
        this.currentQuote = this.responderQuotes[Math.floor(Math.random() * this.responderQuotes.length)];
      } else {
        this.currentQuote = this.participantQuotes[Math.floor(Math.random() * this.participantQuotes.length)];
      }
    }
  }
};

</script>
<style scoped>
.quote{
  font-size: 1.1rem;
}
.quote-author{
  font-size: 0.8rem;
}
</style>
