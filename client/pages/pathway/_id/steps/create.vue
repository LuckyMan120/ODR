

<template>
  <div>
    <Step
      :pathway-id="Number($route.params.id)"
      @done="$router.push(`/pathway/${$route.params.id}/steps`)"
    />
  </div>
</template>

<script>
export default {
  pageTitle: 'createStep'
};
</script>
