

<template>
  <div>
    <b-alert
      show
      :variant="!readAt ? 'warning': 'primary'"
      fade
      dismissible
      @dismissed="dismiss(id)"
    >
      {{ text }}
    </b-alert>
  </div>
</template>

<script>

import {mapActions} from 'vuex';

export default {
  props: {
    id: {type: Number, required: true},
    text: {type: String, required: true},
    readAt: {type: Number, default: 0}
  },
  methods: {
    ...mapActions({
      dismiss: 'user/notifications/dismiss',
      read: 'user/notifications/read'
    })
  }
};
</script>
