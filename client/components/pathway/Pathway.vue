

<template>
  <b-form
    @submit.prevent="onSubmit"
  >
    <b-card
      v-for="(locale, index) in $i18n.locales"
      :key="index"
      :title="`${$t('language')} ${locale.name}`"
    >
      <b-card-text>
        <b-form-group
          :label="$t('name') + ':'"
          label-for="pathway-name-input"
        >
          <b-form-input
            id="pathway-name-input"
            v-model="$v.form.translations[locale.code].name.$model"
            :state="validateTranslate(locale.code, 'name')"
            type="text"
            :placeholder="$t('enterName')"
            aria-describedby="pathway-name-input-feedback"
          />
          <b-form-invalid-feedback
            id="pathway-name-input-feedback"
          >
            {{ $t('genericRequiredField') }}
          </b-form-invalid-feedback>
        </b-form-group>
      </b-card-text>
    </b-card>

    <b-form-group class="mt-4">
      <b-form-checkbox
        id="active-input"
        v-model="form.active"
        name="active"
      >
        {{ $t('active') }}
      </b-form-checkbox>
    </b-form-group>

    <err-alert :message="errMessage" />

    <b-button
      type="submit"
      variant="primary"
      :disabled="$nuxt.$loading && $nuxt.$loading.show"
    >
      {{ $t('submit') }}
    </b-button>
  </b-form>
</template>

<script>

import form from '@/mixins/form.js';
import {required} from 'vuelidate/lib/validators';

export default {
  mixins: [form],
  props: {
    pathway: {type: Object, default: () => ({})}
  },
  data() {
    const form = {
      active: true,
      translations: {}
    };
    for (const locale of this.$i18n.locales) {
      form.translations[locale.code] = {
        name: ''
      };
    }
    return {
      form,
      errMessage: ''
    };
  },
  created() {
    for (const locale of this.$i18n.locales) {
      this.form.translations[locale.code] = this.form
        .translations[locale.code] || {};
      this.form.translations[locale.code].name = this.pathway
        .translations[locale.code].name;
    }
    if (this.pathway.hasOwnProperty('active')) {
      this.form.active = this.pathway.active;
    }
  },
  validations() {
    const form = {
      translations: {}
    };
    for (const locale of this.$i18n.locales) {
      form.translations[locale.code] = {
        name: {required}
      };
    }
    return {form};
  },
  methods: {
    validateTranslate(code, name) {
      const {$dirty, $error} = this.$v.form.translations[code][name];
      return $dirty ? !$error : null;
    },
    async onSubmit() {
      this.errMessage = '';
      if (this.anyError()) return;
      try {
        if (this.pathway.id) {
          await this.$axios.put(`/pathway/${this.pathway.id}`, this.form);
          this.$toast.success(
            `${this.$t('updated')}`
          );
        } else {
          await this.$axios.post(`/pathway`, this.form);
          this.$toast.success(
            `${this.$t('created')}`
          );
        }
        this.$emit('done');
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>
