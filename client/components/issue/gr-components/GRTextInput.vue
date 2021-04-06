<template>
  <form class="d-flex">
    <b-form-group
      :label="title"
      :label-for="`gr-text-input-${title.trim()}`"
      :description="description"
    >
      <b-form-input
        :id="`gr-text-input-${title.trim()}`"
        v-model="$v.form.value.$model"
        :placeholder="placeholder"
        :state="validate('value')"
        aria-describedby="gr-input-feedback"
        :disabled="disabled"
        debunce="500"
        @change="handleSubmit"
      />
      <b-form-invalid-feedback
        id="gr-text-feedback"
      >
        <span v-if="$v.form.value.$params.required">
          {{ $t('genericRequiredField') }}
        </span>
        <span v-if="$v.form.value.$params.maxChars">
          {{ $t('maxcharsLimit', {x: 250}) }}
        </span>
        <span v-if="$v.form.value.$params.numeric">
          {{ $t('genericFieldNumber') }}
        </span>
      </b-form-invalid-feedback>
    </b-form-group>
    <div
      v-if="isFocus"
      class="btn-group-issue"
    >
      <b-button
        variant="warning"
        :disabled="$nuxt.$loading && $nuxt.$loading.show"
        class="btn-submit d-flex justify-content-center align-items-center"
        @click="handleSubmit"
      >
        {{ $t('submit') }}
        <b-icon
          icon="check"
          class="ml-1"
        />
      </b-button>
      <b-button
        v-if="!disableClear"
        variant="outline-warning"
        :disabled="$nuxt.$loading && $nuxt.$loading.show"
        @click="clear"
      >
        {{ $t('clear') }}
      </b-button>
    </div>
  </form>
</template>

<script>

import issueData from '@/mixins/issue-data.js';
import {mapActions} from 'vuex';

export default {
  mixins: [issueData],
  props: {
    placeholder: {type: String, default: ''},
    disableClear: {type: Boolean, default: false}
  },
  data() {
    return {
      isFocus: false
    };
  },
  methods: {
    ...mapActions({
      delete: 'issue/deleteIssueData'
    }),
    async clear() {
      if (!this?.issueData?.id) return this.form.value = '';
      try {
        await this.delete({
          id: this.issueId,
          issueDataId: this.issueData.id
        });
        this.isFocus = false;
        this.form.value = '';
      } catch (err) {
        console.error(err);
      }
    },
    async handleSubmit() {
      if (this.anyError()) return;
      try {
        await this.submit();
        this.isFocus = false;
      } catch (err) {
        console.error(err);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/modules/colors";
@import "@/assets/style/modules/media";

.btn-group-issue{
  display: flex;
  justify-content: flex-end;
  padding-top: 24px;
  button{
    margin-left: 8px;
        display: block;
    height: fit-content;
    &:hover{
      color: white;
    }
  }
  width: 20%;
  @media #{$sm-screen} {
      width: 100%;
    }
    @media #{$md-screen} {
      width: 100%;
    }
}
form{
  margin-bottom: 16px;
  @media #{$sm-screen} {
      flex-direction: column;
    }
  @media #{$md-screen} {
    flex-direction: column;
  }
}
.btn-submit{
  color: white;
  svg{
    stroke: white;
    stroke-width: 0.5px;
  }
}
.custom-textarea{
  width: 140%;
   @media #{$sm-screen} {
      width: 100%;
      margin-bottom: 0;
    }
  @media #{$md-screen} {
    width: 100%;
    margin-bottom: 0;
  }
}
</style>
