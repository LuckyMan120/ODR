

<template>
  <b-form
    class="mr-4"
    @submit.prevent="submit"
  >
    <b-form-group>
      <b-form-textarea
        id="message"
        ref="text"
        v-model="$v.form.text.$model"
        :placeholder="$t('typeAComment')"
        :disabled="$nuxt.$loading && $nuxt.$loading.show"
        rows="2"
        @keyup.enter.exact="submit"
      />
    </b-form-group>

    <b-button
      type="submit"
      class="submit-chat"
      variant="outline-warning"
      :disabled="$nuxt.$loading && $nuxt.$loading.show"
    >
      {{ $t('submit') }}
    </b-button>
  </b-form>
</template>

<script>

import form from '@/mixins/form.js';
import {required} from 'vuelidate/lib/validators';
import {mapActions} from 'vuex';

export default {
  mixins: [form],

  props: {
    issueDataId: {type: Number, required: true}
  },

  data: () => ({
    form: {
      text: ''
    },
    errMessage: ''
  }),

  validations: {
    form: {
      text: {required}
    }
  },

  methods: {
    ...mapActions({
      createComment: 'issue/comments/create-comment'
    }),
    async submit() {
      if (this.anyError()) return;
      await this.createComment(this.form);
      this.form.text = '';
    }
  }
};
</script>
