<template>
  <div>
    <form class="">
      <b-row>
        <b-col
          lg="10"
          sm="12"
        >
          <b-form-group
            :label="title"
            :label-for="`gr-textarea-input-${title.trim()}`"
            :description="description"
            class="custom-textarea"
          >
            <b-form-textarea
              v-if="!autoSave"
              :id="`gr-textarea-input-${title.trim()}`"
              v-model="$v.form.value.$model"
              :state="validate('value')"
              :placeholder="placeholder"
              :rows="rows"
              :max-rows="maxRows"
              aria-describedby="gr-textarea-feedback"
              :disabled="disabled"
              debunce="500"
              @focus="isFocus = true"
            />
            <b-form-textarea
              v-else
              :id="`gr-textarea-input-${title.trim()}`"
              v-model="$v.form.value.$model"
              :state="validate('value')"
              :placeholder="placeholder"
              :rows="rows"
              :max-rows="maxRows"
              aria-describedby="gr-textarea-feedback"
              :disabled="disabled"
              debunce="500"
              @change="handleSubmit"
            />
            <b-form-invalid-feedback
              id="gr-textarea-feedback"
            >
              <span v-if="!$v.form.value.required">
                {{ $t('genericRequiredField') }}
              </span>
              <span v-else-if="!$v.form.value.maxChars">
                {{ $t('maxcharsLimit', {x: 250}) }}
              </span>
            </b-form-invalid-feedback>
          </b-form-group>
        </b-col>
        <b-col cols="2">
          <div
            v-if="isFocus"
            class="btn-group-issue text-left"
          >
            <b-button
              variant="outline-warning"
              :disabled="$nuxt.$loading && $nuxt.$loading.show"
              class=""
              @click="handleSubmit"
            >
              {{ $t('submit') }}
              <!-- <b-icon
                icon="check"
                class="ml-1"
              /> -->
            </b-button>
            <!-- <b-button
              v-if="!disableClear"
              variant="outline-warning"
              :disabled="$nuxt.$loading && $nuxt.$loading.show"
              @click="clear"
            >
              {{ $t('clear') }}
            </b-button> -->
          </div>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>

import issueData from '@/mixins/issue-data.js';
import {mapActions} from 'vuex';

export default {
  mixins: [issueData],
  props: {
    placeholder: {type: String, default: ''},
    rows: {type: Number, default: 2},
    maxRows: {type: Number, default: 6},
    disableClear: {type: Boolean, default: false},
    autoSave: {type: Boolean, default: false}
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

.btn-group-issue {
  display: inline-block;
    @media #{$sm-screen} {
      margin-top: 10px;
    }
    @media #{$md-screen} {
      margin-top: 10px;
    }
    margin-top: 1.7rem;
}

// .btn-group-issue{
//   display: flex;
//   justify-content: flex-end;
//   padding-top: 24px;
//   button{
//     margin-left: 8px;
//         display: block;
//     height: fit-content;
//     &:hover{
//       color: white;
//     }
//   }
//   width: 20%;
//   @media #{$sm-screen} {
//       width: 100%;
//     }
//     @media #{$md-screen} {
//       width: 100%;
//     }
// }
// form{
//   margin-bottom: 16px;
//   @media #{$sm-screen} {
//       flex-direction: column;
//     }
//   @media #{$md-screen} {
//     flex-direction: column;
//   }
// }
// .btn-submit{
//   color: white;
//   svg{
//     stroke: white;
//     stroke-width: 0.5px;
//   }
// }
// .custom-textarea{
//   width: 140%;
//    @media #{$sm-screen} {
//       width: 100%;
//       margin-bottom: 0;
//     }
//   @media #{$md-screen} {
//     width: 100%;
//     margin-bottom: 0;
//   }
// }
</style>
