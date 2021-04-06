
<template>
  <div class="dash-wrapper">
    <b-container fluid>
      <b-row>
        <b-col class="d-flex justify-content-end align-items-center">
          <nuxt-link
            v-if="!orgs.length"
            :to="`/subscribe/choose-plan`"
            class="btn-choose-plan btn btn-primary"
          >
            {{ $t('createBusiness') }}
          </nuxt-link>
        </b-col>
      </b-row>

      <div v-if="orgs.length">
        <b-row
          class="mt-2 mb-3 text-center"
        >
          <b-col>
            <b-form-group>
              <b-form-radio-group
                id="btn-radios-2"
                v-model="selected"
                :options="menuButtons"
                button-variant="outline-primary btn-lg"
                buttons
                button-class="btn-lg"
                @change="selectOrg($event)"
              />
            </b-form-group>
          </b-col>
        </b-row>
        <b-row
          v-if="selected > 0"
          class="mt-2"
        >
          <b-col>
            <b-row>
              <b-col>
                <org-chart />
              </b-col>
            </b-row>
            <b-row>
              <b-col>
                <org-issues />
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
      <div v-if="selected === 0">
        <user-issues />
      </div>
    </b-container>
  </div>
</template>

<script>

import {mapGetters, mapActions} from 'vuex';
import {roleMixin} from '@/mixins/roleMixin.js';

export default {
  mixins: [roleMixin],
  async asyncData({store}) {
    let selected = 0;

    if (store.getters['user/orgs'].length) {
      const {id: org} = store.getters['user/orgs'][0];
      await store.dispatch('user/set-org', {org});
      selected = org;
      store.commit('org/issues/sort', 'submittedAt DESC');
      await store.dispatch('org/issues/fetch');
    }

    return {selected};
  },
  computed: {
    ...mapGetters({
      storedIssues: 'user/issues/data',
      siteType: 'site/type',
      orgs: 'user/orgs'
    }),
    menuButtons() {
      const menuButtons = this.orgs.map(({
        id,
        name
      }) => ({
        value: id,
        text: name + '\'s ' + this.$t('complaints')
      }));
      menuButtons.push({
        value: 0,
        text: this.$t('orgIssuesListSelctorMyPersonal')
      });
      return menuButtons;
    }
  },
  methods: {
    ...mapActions({
      setOrg: 'user/set-org',
      fetch: 'org/issues/fetch'
    }),
    async selectOrg(org) {
      await this.setOrg({org});
      await this.fetch();
    }
  }
};
</script>

<style lang="scss" scoped>

#btn-radios-2{
  margin-left: 10px;
}

.btn-choose-plan{
  margin-right: 8px;
}
</style>
