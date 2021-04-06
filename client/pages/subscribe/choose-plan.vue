<template>
  <div class="dash-wrapper">
    <h1 class="mt-4 text-uppermediation mb-4 text-uppercase">
      {{ $t('chooseYourPlan') }}
    </h1>
    <div class="chooseplan-wrapper mt-4">
      <div
        v-for="plan in plans"
        :key="plan.id"
        class="gr-card d-flex flex-column justify-content-start align-items-center m-3"
      >
        <div
          id="chooseplan-header"
          class="gr-header chooseplan-header w-100 d-flex justify-content-center align-items-center p-4"
        >
          <span
            :id="`chooseplan-title-${plan.metadata.slug}`"
            class="title-plan"
          >
            <h2>{{ plan.nickname }}</h2>

            <b-popover
              :target="`chooseplan-title-${plan.metadata.slug}`"
              triggers="hover"
              placement="top"
            >
              {{ plan.nickname }}
            </b-popover>
          </span>
        </div>
        <div
          class="d-flex flex-column justify-content-start align-items-center mb-1 w-100 p-5"
        >
          <div>
            <div class="text-uppermediation font-weight-bold text-center mb-4">
              <h1>${{ plan.amount / 100 }} {{ $t('per') }}{{ $t(plan.interval) }}</h1>
            </div>
            <div>
              <ul>
                <li
                  v-for="(desc, index) in plan.metadata.desc.split(',')"
                  :key="index"
                >
                  {{ desc }}
                </li>
              </ul>
            </div>
          </div>
          <div
            class="d-flex flex-column justify-content-start align-items-center w-100 h-100 p-3 overflow-hidden"
          >
            <b-button
              variant="warning"
              class="mb-4 w-75 btn-join p-0"
            >
              <nuxt-link
                v-if="user"
                :to="`/subscribe/${plan.metadata.slug}`"
                class="py-3"
              >
                {{ $t('start') }}
              </nuxt-link>
              <nuxt-link
                v-else
                :to="`/register/${plan.metadata.slug}`"
                class="py-3"
              >
                {{ $t('start') }}
              </nuxt-link>
            </b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';

export default {
  layout: 'pre-auth',
  async asyncData({store}) {
    await store.dispatch('plans/fetch');
  },
  computed: mapGetters({
    plans: 'plans/data',
    user: 'user/user'
  })
};
</script>
<style lang="scss" scoped>

@import "@/assets/style/modules/colors";

.dash-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding: 2em 0 4em;
  >h1{
   color: $color_primary;
   font-size: 3em;
  }
}

.chooseplan-wrapper {
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
}

.title-plan{
    font-size: 16px;
    text-align: center;
}
.btn-join{
  >a {
    color: white;
    display: block;
    width: 100%;
    height: 100%;
    font-size: 1.2em;
  }
  &:hover{
    >a {
    color: $color_text;
    text-decoration: none;
    }
  }
}
ul{
  padding-left: 0px;
}
li{
  margin-bottom: 4px;
}
.gr-card{
  width: 320px;
}
</style>
