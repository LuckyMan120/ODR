<template>
  <b-navbar
    toggleable="lg"
    type="dark"
    variant="dark"
    sticky
    class="d-flex justify-content-between"
  >
    <b-navbar-brand to="/">
      <img
        src="/logo.png"
        alt="logo"
      >
    </b-navbar-brand>

    <b-navbar-toggle target="nav-collapse" />

    <b-collapse
      id="nav-collapse"
      is-nav
    >
      <b-navbar-nav v-if="user">
        <b-nav-item
          to="/"
          exact
        >
          {{ $t('dashboard') }}
        </b-nav-item>

        <!-- Start dropdown portal -->
        <b-nav-item-dropdown
          v-if="role.name === userRole.admin || role.name === userRole.superadmin"
          :text="$t('portal')"
          right
        >
          <b-dropdown-item
            to="/org"
            :active="$route.path === '/org'"
          >
            {{ $t('organizations') }}
          </b-dropdown-item>

          <b-dropdown-item
            to="/user"
            :active="$route.path === '/user'"
          >
            {{ $t('users') }}
          </b-dropdown-item>

          <b-dropdown-item
            to="/pathway"
            :active="$route.path === '/pathway'"
          >
            {{ $t('pathways') }}
          </b-dropdown-item>

          <b-dropdown-item
            to="/site-config"
            :active="$route.path === '/site-config'"
          >
            {{ $t('siteconfig') }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- End dropdown portal -->

        <!-- Dropdown organization for complaints site -->
        <b-nav-item-dropdown
          v-if="siteType === 'complaints' && orgs.length"
          :text="$t('manageOrg')"
          right
        >
          <div
            v-for="org in orgs"
            :key="org.id"
            class="mb-2"
          >
            <b-dropdown-item disabled>
              <strong class="org-item">
                {{ org.name }}
              </strong>
            </b-dropdown-item>
            <b-dropdown-item
              v-if="org.orgRole === orgRole.admin"
              :to="`/org/${org.id}/details`"
              :active="
                $route.path.includes('details') &&
                  userOrg &&
                  userOrg.id == org.id
              "
            >
              <b-icon icon="clipboard" />
              {{ $t('details') }}
            </b-dropdown-item>
            <b-dropdown-item
              v-if="org.orgRole === orgRole.admin"
              :to="`/org/${org.id}/billing`"
            >
              <b-icon icon="card-heading" />
              {{ $t('subscriptionAndBilling') }}
            </b-dropdown-item>
          </div>
          <b-dropdown-item
            to="/subscribe/choose-plan"
            :active="$route.path === '/subscribe/choose-plan'"
          >
            <strong>{{ $t('registerAnotherBusiness') }}</strong>
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- End dropdown organization for complaints site -->

        <!-- dropdown organization for mediations site -->
        <b-nav-item-dropdown
          v-if="siteType === 'mediations'"
          :text="$t('organization')"
          right
        >
          <b-dropdown-item disabled>
            {{ org.name }}
          </b-dropdown-item>
          <b-dropdown-item
            v-if="orgRoleStore.name === orgRole.admin"
            to="/org/users"
          >
            <b-icon icon="people" />
            {{ $t('users') }}
          </b-dropdown-item>
          <b-dropdown-item
            v-if="orgRoleStore.name === orgRole.admin || orgRoleStore.name === orgRole.staff"
            to="/org/send-invite"
          >
            <b-icon icon="envelope" />
            {{ $t('inviteUser') }}
          </b-dropdown-item>
          <b-dropdown-item
            v-if="orgRoleStore.name === orgRole.admin"
            to="/org/invites"
          >
            <b-iconstack font-scale="1">
              <b-icon
                stacked
                scale="0.5"
                shift-h="-3"
                shift-v="4"
                icon="envelope"
              />
              <b-icon
                stacked
                scale="0.5"
                icon="envelope"
              />
              <b-icon
                stacked
                scale="0.5"
                shift-h="3"
                shift-v="-4"
                icon="envelope"
              />
            </b-iconstack>
            {{ $t('invites') }}
          </b-dropdown-item>
          <b-dropdown-item
            v-if="orgRoleStore.name === orgRole.admin"
            to="/org/details"
          >
            <b-icon icon="clipboard" />
            {{ $t('details') }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <!-- End dropdown organization for mediations site -->
      </b-navbar-nav>

      <b-navbar-nav>
        <client-only>
          <b-nav-item-dropdown
            v-if="$i18n.locales.length > 1"
            text="Lang"
            right
          >
            <template #button-content>
              <em>
                <b-icon icon="globe" />
                {{ $t('lang') }}
              </em>
            </template>

            <b-dropdown-item
              v-for="locale in $i18n.locales"
              :key="locale.code"
              :disabled="$i18n.locale === locale.code"
              :to="switchLocalePath(locale.code)"
            >
              <b-icon
                v-if="$i18n.locale === locale.code"
                icon="check"
              />
              {{ locale.name }}
            </b-dropdown-item>
          </b-nav-item-dropdown>
        </client-only>
      </b-navbar-nav>

      <b-navbar-nav v-if="user">
        <b-nav-item-dropdown
          :disabled="!notiCount"
          right
          :no-caret="!notiCount"
        >
          <template #button-content>
            <client-only>
              <span
                :class="{'text-warning': unreadNotiCount}"
              >
                <b-icon icon="bell" />
                <b-badge
                  v-if="unreadNotiCount"
                  variant="warning"
                >
                  {{ unreadNotiCount }}
                </b-badge>
              </span>
            </client-only>
          </template>

          <b-dropdown-form
            v-show="notiCount"
            class="noification-dropdown"
          >
            <Notifications />
          </b-dropdown-form>
        </b-nav-item-dropdown>

        <b-nav-item-dropdown right>
          <template #button-content>
            <em>
              <b-icon icon="person" />
              {{ `${user.firstName} ${user.lastName}` }}
            </em>
          </template>
          <b-dropdown-item
            to="/profile"
            :active="$route.path === '/profile'"
          >
            <b-icon icon="gear" />
            {{ $t('profile') }}
          </b-dropdown-item>
          <b-dropdown-item
            href="#"
            @click.prevent="onSignOut"
          >
            <b-icon icon="box-arrow-right" />
            {{ $t('signOut') }}
          </b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import {mapGetters, mapActions} from 'vuex';
import {roleMixin} from '@/mixins/roleMixin.js';

export default {
  mixins: [roleMixin],
  computed: mapGetters({
    user: 'user/user',
    role: 'user/role',
    userOrg: 'user/org',
    orgRoleStore: 'user/orgRole',

    orgs: 'user/orgs',

    siteType: 'site/type',

    notiCount: 'user/notifications/count',
    unreadNotiCount: 'user/notifications/unreadCount'
  }),
  methods: {
    ...mapActions({
      signOut: 'user/sign-out'
    }),
    onSignOut() {
      this.signOut();
      this.$toast.success(
        `${this.$t('signOutSuccess')}`
      );
      this.$router.replace({path: '/sign-in'});
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modules/colors";
@import "@/assets/style/modules/constants";
@import "@/assets/style/modules/media";

.navbar {
  padding: 0 40px 0 40px;

  @media #{$md-screen} {
    padding: 10px 40px 10px 40px;
  }

  .nav-link {
    color: $color_text;
    height: 100%;
  }

  .navbar-collapse {
    height: $nav-height;
    flex-grow: 0;
    li.nav-item{
      margin-left: 24px;
    }
    &.show {
      height: auto;
    }
  }

  .navbar-brand {
    img {
      max-width: 130px;
    }

    &::after {
      display: none;
    }
  }
}

.nuxt-link-active {
  color: $color_accent !important;
  position: relative;

  &::after {
    content: " ";
    width: 100%;
    height: 4px;
    background-color: $color_accent;
    position: absolute;
    z-index: 1000;
    left: 0px;
    bottom: -34px;

    @media #{$md-screen} {
      display: none;
    }
  }
}

.org-item {
  color: #6c757d;
}

.noification-dropdown {
  width: 600px;
}

</style>
