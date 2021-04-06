
<template>
  <section class="container">
    <div
      v-quill:myQuillEditor="editorOption"
      class="quill-editor"
      :style="styleComputed"
      :content="value"
      @change="onEditorChange($event)"
    />
  </section>
</template>

<script>
export default {
  props: {
    minHeight: {
      type: String,
      default: '200'
    },
    maxHeight: {
      type: String,
      default: '300'
    },
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      editorOption: {
        // Options
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block']
          ]
        }
      }
    };
  },
  computed: {
    styleComputed() {
      return `
            min-height:${this.minHeight}px;
            max-height:${this.maxHeight}px
          `;
    }
  },
  mounted() {

  },
  methods: {
    // onEditorBlur(editor) {

    // },
    // onEditorFocus(editor) {

    // },
    // onEditorReady(editor) {

    // },
    onEditorChange({html}) {
      this.$emit('input', html);
    }
  }
};
</script>

<style lang="scss" scoped>
  .container {
    .quill-editor {
      overflow-y: auto;
    }
  }
</style>
