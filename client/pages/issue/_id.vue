<template>
  <div>
    <b-row class="issue-heading">
      <div class="bol">
        <h4>{{ otherParty.name }} <span class="issue-id">({{ $t('issueIdLabel') }} {{ $t('issueIdPrefix') }}{{ issue.id }})</span></h4>
      </div>
      <div

        class="bol"
      >
        <nuxt-link
          class="primary-color"
          to="/"
        >
          <b-icon icon="arrow-bar-left" />
          {{ $t('backToDashboard') }}
        </nuxt-link>
        <a
          class="pointer primary-color ml-4"
          :href="`/api/issue/${issue.id}/summary-pdf`"
          target="_blank"
        >
          {{ $t('downloadPdf') }}
        </a>
        <b-dropdown
          v-if="!issue.closedAt"
          class="ml-4 withdraw"
          variant="link"
          :text="$t('withdrawOrEscalate')"
          toggle-class="primary-color"
        >
          <b-dropdown-item
            @click="showWithdraw(
              'closedWithdrawn',
              'withdraw'
            )"
          >
            {{ $t('withdraw') }}
          </b-dropdown-item>
          <b-dropdown-item
            @click="showWithdraw(
              'closedEscalatedMediation',
              'escalateToMediation'
            )"
          >
            {{ $t('escalateToMediation') }}
          </b-dropdown-item>
          <b-dropdown-item
            @click="showWithdraw(
              'closedEscalatedOmbudsman',
              'escalateToOmbudsmen'
            )"
          >
            {{ $t('escalateToOmbudsmen') }}
          </b-dropdown-item>
        </b-dropdown>
      </div>
    </b-row>
    <b-row
      class="issue-row"
    >
      <b-col
        cols="12 p-0"
        md="4"
        lg="2"
        class="issue-menu"
      >
        <ul class="list">
          <li
            v-for="step in steps"
            :key="step.id"
            class="item"
          >
            <div
              class="case-step"
              :class="{
                active: currentStep.name === step.name
              }"
            >
              <IssueStepState
                :completed="step.state.completed"
                :selected="currentStep.name === step.name"
                :enabled="step.state.enabled"
              />
              <b-button
                variant="link"
                :disabled="!step.state.enabled"
                @click="selectStep(step)"
              >
                {{ $t(step.name) }}
              </b-button>
            </div>
            <ul
              v-if="step.steps.length"
              class="list"
            >
              <li
                v-for="childStep in step.steps"
                :key="childStep.id"
                class="item"
              >
                <div class="case-step">
                  <IssueStepState
                    :completed="childStep.state.completed"
                    :selected="currentStep.name === childStep.name"
                    :enable="childStep.state.enabled"
                  />
                  <b-button
                    variant="link"
                    :disabled="!childStep.state.enabled"
                    @click="selectStep(childStep)"
                  >
                    {{ $t(childStep.name) }}
                  </b-button>
                </div>
              </li>
            </ul>
          </li>
        </ul>

        <div class="my-4 d-none d-md-block">
          <issue-quotes />
        </div>

        <div class="my-4 d-none d-md-block">
          <issue-reminders />
        </div>
      </b-col>
      <b-col
        cols="12"
        md="8"
        lg="10"
        class="issue-content"
      >
        <NuxtChild />

        <div class="btn-group-issue mb-4 mt-4">
          <b-button
            v-if="prevStep"
            variant="outline-warning"
            size="lg"
            :disabled="!prevStep.state.enabled || ($nuxt.$loading && $nuxt.$loading.show)"
            @click="prev"
          >
            <b-icon
              v-if="$nuxt.$loading && $nuxt.$loading.show"
              icon="three-dots"
              animation="cylon"
            />
            <span v-else>
              <b-icon
                icon="arrow-left-short"
              />
              {{ $t('prev') }}
            </span>
          </b-button>

          <b-button
            v-if="nextStep"
            variant="outline-warning"
            size="lg"
            :disabled="!nextStep.state.enabled || ($nuxt.$loading && $nuxt.$loading.show)"
            @click="next"
          >
            <b-icon
              v-if="$nuxt.$loading && $nuxt.$loading.show"
              icon="three-dots"
              animation="cylon"
            />
            <span v-else>
              {{ $t('next') }}
              <b-icon
                icon="arrow-right-short"
              />
            </span>
          </b-button>
        </div>
      </b-col>
    </b-row>

    <b-modal
      id="withdraw"
      :title="$t(title)"
      :ok-title="$t(okTitle)"
      header-bg-variant="warning"
      ok-variant="outline-warning"
      cancel-variant="outline-primary"
      @ok="onOk"
      @cancel="note = ''"
      @close="note = ''"
    >
      <p class="my-4">
        {{ $t('warningClosingWithStatus', {
          status: $t(status)
        }) }}
      </p>
      <b-form-textarea
        v-model="note"
        :placeholder="$t('enterNote')"
        rows="3"
        max-rows="6"
      />
      <div
        v-if="closed && status=='closedEscalatedMediation'"
        class="my-4"
      >
        <!-- XSS_WARNING: Only static input (no user input) -->
        <!-- eslint-disable-next-line -->
        <span  v-html="$t('escalatedToMediation')"></span>
      </div>
      <div
        v-if="closed && status=='closedEscalatedOmbudsman'"
        class="my-4"
      >
        <!-- XSS_WARNING: Only static input (no user input) -->
        <!-- eslint-disable-next-line -->
        <span  v-html="$t('escalatedToAfca')"></span>
      </div>
    </b-modal>

    <client-only>
      <issue-connect :issue-id="+$route.params.id" />
    </client-only>
  </div>
</template>

<script>

import {mapGetters, mapMutations, mapActions} from 'vuex';

export default {
  async asyncData({params, store, route}) {
    store.commit('issue/id', params.id);
    await store.dispatch('issue/fetch');
    const urlStep = route.path.split('/')[3];
    if (urlStep) {
      store.commit(
        'issue/currentStep',
        store.getters['issue/steps']
          .find(step => step.name === urlStep)
      );
    } else {
      store.commit('issue/initStep');
    }
  },
  data: () => ({
    note: '',
    status: 'withdraw',
    title: 'withdraw',
    okTitle: 'confirm',
    closed: false
  }),
  computed: {
    ...mapGetters({
      steps: 'issue/steps',
      currentStep: 'issue/currentStep',
      issueData: 'issue/issueData',
      issueParty: 'issue/party',
      issue: 'issue/issue'
    }),
    otherParty() {
      return this.issue.parties
        .find(party => party.id !== this.issueParty.id);
    },
    currentStepIndex() {
      return this.steps.findIndex(
        step => step.id === this.currentStep.id
      );
    },
    nextStep() {
      return this.steps[this.currentStepIndex + 1];
    },
    prevStep() {
      return this.steps[this.currentStepIndex - 1];
    }
  },
  watch: {
    $route(to) {
      const newStepName = to.path.split('/')[3];
      if (newStepName !== this.currentStep.name) {
        console.log('Step mismatch, fixing...');
        this.setStep(this.steps.find(step => step.name === newStepName));
      }
    }
  },
  mounted() {
    this.navToCurrStep();
  },
  methods: {
    ...mapMutations({
      setStep: 'issue/currentStep'
    }),
    ...mapActions({
      withdraw: 'issue/withdraw'
    }),
    navToCurrStep() {
      this.$router.push(
        `/issue/${this.$route.params.id}/${this.currentStep.name}`
      );
    },
    selectStep(step) {
      this.setStep(step);
      this.navToCurrStep();
    },
    next() {
      this.setStep(this.nextStep);
      this.navToCurrStep();
    },
    prev() {
      this.setStep(this.prevStep);
      this.navToCurrStep();
    },

    showWithdraw(status, title = 'withdraw') {
      this.status = status;
      this.title = title;
      this.$bvModal.show('withdraw');
    },
    async onOk(e) {
      if (this.closed || this.status === 'closedWithdrawn') {
        this.$router.push('/');
      } else {
        e.preventDefault();
        await this.withdraw({
          status: this.status,
          note: this.note
        });
        this.okTitle = 'close';
        this.closed = true;
      }

    }
  }
};
</script>

<style lang="scss" >

@import "@/assets/style/modules/colors";
@import "@/assets/style/modules/media";

.issue-row {
  min-height: unset;
}
ul.list {
  list-style: none;
  background-color: $color_background;
  padding:0px;

  li{
    border-bottom: 1px solid #E9E9E9;
    .case-step{
      padding: 20px 10px 16px 35px !important;
      display: flex;
      align-items: center;
        button{
          color: $color_primary;
          text-decoration: none;
          padding:0px;
          padding-left: 17px;
          &:focus {
              border: none;
              box-shadow: none;
              outline: none;
          }
          &:hover{
            cursor: pointer;
            font-weight: 400;
          }
      }
      &.active{
        button{
            font-weight: 400;
            color: $color_accent;
        }
      }
      &:disabled,
      &[disabled]{
        cursor: not-allowed!important;
          button{
              cursor: not-allowed;
              color: #9199B4!important;
          }
    }
    }
  }
}
.issue-content{
  padding: 50px 70px 24px;
   @media #{$md-screen} {
    padding: 8px 8px 20px 12px;
  }
  @media #{$sm-screen} {
    padding: 8px 8px 20px 12px;
  }
  .wrapper-content-issue{
    background: white;
    padding: 24px 25px;
    border: #DDDFE7 1px solid;
  }
  color: $color_primary;
}
.btn-group-issue{
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 16px;
  svg{
    stroke-width: 1px;
    stroke: $color_accent;
  }
  button{
    padding: 3px 15px 7px;
    margin: 0 8px ;
  }
  span{
    color: $color_accent;
    font-weight: 500;
  }
  button:hover {
    span{
      color: $white;
    }
    svg{
      stroke: $white;
    }
  }
  button.disabled{
    border: 1px solid $color_border;
    span{
      color: $color_border;
    }
    svg{
      stroke: $color_border;
    }
  }
  button.disabled:hover{
    span{
      color: $color_border;
    }
    svg{
      stroke: $color_border;
    }
  }
}
.issue-heading {
  padding: 16px;
  background: white;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: space-between;
  h4 {
    color: $color_primary;
    margin: 0;
    font-weight: 600;
    font-size: 20px;
  }

}

.issue-menu {
  background-color: white;
}
.issue-id{
  font-size: 0.8rem;
}
.withdraw .btn-linkid{
  font-weight: 300 !important;
}
</style>
