

<template>
  <b-table
    striped
    hover
    responsive
    :items="invites"
  >
    <template #cell(actions)="row">
      <TableActions :actions="row.value" />
    </template>
  </b-table>
</template>

<script>
export default {
  props: {
    invites: {type: Array, default: () => ([])}
  }
};
</script>
