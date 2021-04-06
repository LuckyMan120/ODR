

<template>
  <div>
    <Step
      :pathway-id="Number($route.params.id)"
      :step="step"
      :parents="parentSteps"
      @done="$router.push(`/pathway/${$route.params.id}/steps`)"
    />
  </div>
</template>

<script>
export default {
  pageTitle: 'editStep',
  async asyncData({$axios, params}) {
    const data = {
      step: await $axios.$get(`/pathwayStep/${params.stepId}`),
      parentSteps: []
    };
    if (data.step.parent) {
      data.parentSteps = await $axios.$get('/pathwayStep', {
        params: {
          where: {
            pathway: params.id,
            parent: null
          }
        }
      });
    }
    return data;
  }
};
</script>
