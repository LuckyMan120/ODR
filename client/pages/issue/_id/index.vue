

<template>
  <div class="wrapper-content-issue">
    {{ $t('noStepSelcted') }}
  </div>
</template>

<script>
export default {
  async asyncData({store, redirect, params}) {
    store.commit('issue/id', params.id);
    await store.dispatch('issue/fetch');
    store.commit('issue/initStep');
    redirect(`/issue/${params.id}/${
      store.getters['issue/currentStep'].name
    }`);
  }
};
</script>
