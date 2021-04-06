<template>
  <div class="w-100">
    <b-row
      class="w-100"
      no-gutters
    >
      <b-col cols="12">
        <div class="issue-intro-box">
          <h5
            v-if="title"
            class="issue-intro-title"
          >
            {{ title }}
          </h5>
          <!-- eslint-disable-next-line -->
          <div class="issue-intro-desc" v-html="desc">
          </div>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  props: {
    title: {type: String, default: ''},
    desc: {type: String, default: ''}
  }
};
</script>
