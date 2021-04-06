<template>
  <div>
    <div v-if="identity === 'siteconfig'">
      <span v-if="value">{{ $t('yes') }}</span>
      <span v-else>{{ $t('no') }}</span>
    </div>
    <div v-else>
      <b-icon
        v-if="value"
        icon="check"
      />
      <b-icon
        v-else
        icon="dash"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {type: Boolean, required: true},
    identity: {type: String, default: ''}
  }
};
</script>
