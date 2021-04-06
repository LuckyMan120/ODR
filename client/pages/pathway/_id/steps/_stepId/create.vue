

<template>
  <div>
    <Step
      :pathway-id="Number($route.params.id)"
      :parent-id="Number($route.params.stepId)"
      @done="$router.push(`/pathway/${$route.params.id}/steps/${$route.params.stepId}/steps`)"
    />
  </div>
</template>

<script>
export default {
  pageTitle: 'createStep'
};
</script>
