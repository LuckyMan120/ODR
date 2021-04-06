

<template>
  <div>
    <Complaint @done="({id}) => $router.push(`/issue/${id}`)" />
  </div>
</template>

<script>
export default {};
</script>
