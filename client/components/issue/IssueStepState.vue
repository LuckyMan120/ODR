

<template>
  <span class="icon">
    <b-icon
      v-if="selected"
      font-scale="1.5"
      icon="arrow-right"
      class="bold-icon"
    />
    <b-icon
      v-else-if="completed"
      font-scale="1.5"
      icon="check"
      class="bold-icon"
    />
    <b-icon
      v-else-if="enabled"
      icon="arrow-right-short"
      font-scale="1.5"
      class="bold-icon"
    />
    <b-icon
      v-else
      icon="slash-circle"
      font-scale="1.5"
      class="bold-icon"
    />
  </span>
</template>

<script>
export default {
  props: {
    completed: {type: Boolean, default: false},
    selected: {type: Boolean, default: false},
    enabled: {type: Boolean, default: false}
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/style/modules/colors";

ul.list {
  li {
    .case-step {
      &.active {
        svg{
          stroke: $color_accent;
        }
      }
    }
  }
}
.bold-icon{
  stroke-width: 1px;
  stroke: $color_primary;
}
</style>

