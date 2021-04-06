

<template>
  <div class="gr-app-wrapper">
    <Menu />
    <div class="mx-lg-5 mx-md-3 mx-3 d-flex flex-column justify-content-start mt-3 min-height-5">
      <b-row class="mt-2">
        <b-col>
          <b-breadcrumb
            v-if="showBreadcrumbs && crumbs.length > 1"
            :items="crumbs.map(({
              title,
              path
            }) => ({
              text: title,
              to: path
            }))"
          />
        </b-col>
      </b-row>
      <h2 v-if="title !== ''">
        {{ title }}
      </h2>
      <slot />
    </div>
    <!-- eslint-disable -->
    <div
      class="text-center small mt-4"
      v-html="$t('copyright')"
    />
    <!-- eslint-enable -->
  </div>
</template>

<script>
export default {
  data: () => ({
    showBreadcrumbs: false
  }),
  computed: {
    title() {
      return this.$route.matched.map(({components}) => {
        return this.$t(
          components.default.options
            ? components.default.options.pageTitle
            : components.default.pageTitle
        );
      })[0];
    },
    crumbs() {
      const fullPath = this.$route.fullPath;
      const params = fullPath.startsWith('/')
        ? fullPath.substring(1).split('/')
        : fullPath.split('/');
      const crumbs = [];
      let path = '';
      params.forEach(param => {
        path = `${path}/${param}`;
        const match = this.$router.match(path);
        if (match.name !== null) {
          crumbs.push({
            title: param.replace(/-/g, ' '),
            path: match.path
          });
        }
      });
      return crumbs;
    }
  }
};
</script>

<style scoped>
.gr-app-wrapper {
  padding-bottom: 40px;
}
</style>
