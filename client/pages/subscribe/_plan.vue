<template>
  <div>
    <div class="w-100">
      <b-row
        class="w-100"
        no-gutters
      >
        <b-col cols="12">
          <div class="issue-intro-box">
            <h5
              class="issue-intro-title"
            >
              {{ $t('yourCompanyDetails') }}
            </h5>
            <div class="issue-intro-desc">
              <abn-lookup
                v-if="!abnSelected"
                v-model="abn"
                @name="_name => name = _name"
                @submit="abnSelected = true"
              />
              <EndUserDetail
                v-else
                :abn="abn"
                :price-id="priceId"
                :name="name"
                @reset="reset"
              />
            </div>
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

export default {
  async asyncData({store, params}) {
    await store.dispatch('plans/fetch');
    return {
      priceId: store.getters['plans/indexed'][params.plan].id
    };
  },
  data() {
    return {
      abn: null,
      name: null,
      abnSelected: false
    };
  },
  head() {
    return {
      script: [{
        src: 'https://js.stripe.com/v3/'
      }]
    };
  },
  computed: {
    fidnOrgMsg() {
      if (this.abn) {
        return '';
      } else {
        return this.$t('findOrg');
      }
    }
  },
  methods: {
    next() {
      this.abnSelected = true;
    },
    reset() {
      this.abn = null;
      this.name = null;
      this.abnSelected = false;
    }
  }
};
</script>
<style scoped>
.issue-intro-box {
  margin: auto;
  max-width: 700px;
}
</style>
