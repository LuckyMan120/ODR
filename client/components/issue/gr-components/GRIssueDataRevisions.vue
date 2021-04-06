<template>
  <div>
    <div>
      <b-row class="mt-4">
        <b-col
          lg="8"
          md="8"
          sm="12"
          class="text-left"
        >
          <label>{{ $t('historyValueLabel') }}</label>
        </b-col>

        <b-col
          lg="2"
          md="4"
          sm="12"
          class="text-left"
        >
          <label>{{ $t('historyItemAuthorLabel') }}</label>
        </b-col>
      </b-row>
      <b-row>
        <b-col
          lg="8"
          md="8"
          sm="12"
          class="my-2 text-left"
        >
          {{ issueData.originalData.value }}
        </b-col>
        <b-col

          lg="4"
          md="4"
          sm="12"
          class="text-left"
        >
          <div class="font-italic">
            {{ issueData.originalData.party.name }} ({{ $moment(issueData.originalData.createdAt).format('DD MMM YYYY HH:mm') }})
          </div>
        </b-col>
      </b-row>
      <b-row
        v-for="revision in issueData.revisions"
        :key="revision.id"
      >
        <b-col
          lg="8"
          md="8"
          sm="12"
          class="my-2 text-left"
        >
          {{ revision.value }}
        </b-col>
        <b-col

          lg="4"
          md="4"
          sm="12"
          class="text-left"
        >
          <div class="font-italic">
            {{ revision.party.name }} ({{ $moment(revision.createdAt).format('DD MMM YYYY HH:mm') }})
          </div>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    issueData: {type: Object, required: true}
  }
};
</script>
