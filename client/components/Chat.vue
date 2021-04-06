
<template>
  <div>
    <b-card
      footer-bg-variant="default"
      class="wrapper-chat"
    >
      <b-card-text
        ref="messages"
        class="messages"
      >
        <div v-if="loading">
          <Loading :loading="loading" />
        </div>
        <div
          v-for="message in messages"
          :key="message.id"
        >
          <p
            v-if="message.type === 'system'"
            class="system-message"
          >
            <span v-if="message.user">
              {{ message.user.firstName }} {{ message.user.lastName }}
            </span>
            {{ message.text }}
            {{ $moment.utc(message.created_at).local().format('HH:mm') }}
          </p>
          <b-card
            v-else
            class="mt-2 mr-4"
          >
            <b-card-text>
              <div class="text-sm-left">
                <span class="font-weight-bold">
                  {{ message.user.firstName }} {{ message.user.lastName }}
                </span>
                <span class="text-secondary">
                  {{ $moment.utc(message.created_at).local().format('HH:mm') }}
                </span>
              </div>
              <div>
                {{ message.text }}
              </div>
            </b-card-text>
          </b-card>
        </div>
      </b-card-text>
      <b-card-footer>
        <b-form
          class="mr-4"
          @submit.prevent="submit"
        >
          <b-form-group>
            <b-form-textarea
              id="message"
              v-model="newMessage"
              :placeholder="$t('typeAMessage')"
              :disabled="$nuxt.$loading && $nuxt.$loading.show"
              rows="4"
              @keyup.enter.exact="submit"
            />
          </b-form-group>

          <b-button
            type="submit"
            class="submit-chat"
            :disabled="$nuxt.$loading && $nuxt.$loading.show"
          >
            {{ $t('submit') }}
          </b-button>
        </b-form>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script>

import {mapGetters} from 'vuex';
import {StreamChat} from 'stream-chat';

export default {
  props: {
    issueId: {type: Number, required: true}
  },

  data: () => ({
    messages: [],
    newMessage: '',
    channel: null,
    loading: false
  }),

  computed: mapGetters({
    user: 'user/user'
  }),

  watch: {
    messages() {
      setTimeout(() => this.scroll(), 0);
    }
  },

  async created() {
    this.loading = true;
    const chat = new StreamChat(this.$config.GETSTREAM_KEY);
    const {token} = await this.$axios
      .$post(`/issue/${this.issueId}/join-chat`);
    await chat.connectUser({id: this.user.id.toString()}, token);
    this.channel = chat.channel('issue', this.issueId.toString());
    this.messages = (await this.channel.watch()).messages;
    this.channel.on('message.new', event => {
      this.messages.push({
        text: event.message.text,
        user: event.message.user
      });
      this.scroll();
    });
    this.loading = false;
  },

  methods: {
    submit() {
      if (!this.newMessage.trim()) return;
      this.channel.sendMessage({
        text: this.newMessage
      });
      this.newMessage = '';
      this.scroll();
    },
    scroll() {
      const container = this.$refs.messages;
      if (container) container.scrollTop = container.scrollHeight;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modules/colors";
.messages {
  height: 400px;
  overflow-y: scroll;
}
.wrapper-chat{
  background: none;
  .card-body{
    border: none !important;
  }
}
.submit-chat{
  background: $color_accent;
  color: white;
  border: none;
  &:hover{
    opacity: 0.8;
  }
}
.system-message {
  color: grey;
  margin-top: 4px;
  margin-left: 4px;
  margin-right: 4px;
}
.card-body{
  padding: 0.5rem ;
}
</style>
