

<template>
  <b-row class="mt-4 justify-content-md-center">
    <b-col
      md="6"
      cols="12"
    >
      <p>
        {{ $t('youWillBeRedirectedShortlyIfItDidntHappenClickTheLinkBelow') }}
      </p>
      <a href="/api/stripe/portal">{{ $t('redirect') }}</a>
    </b-col>
  </b-row>
</template>

<script>
export default {
  pageTitle: 'billing',
  async asyncData({store, params}) {
    await store.dispatch('user/set-org', {org: params.id});
  },
  mounted() {
    window.location.replace('/api/stripe/portal');
  }
};
</script>
