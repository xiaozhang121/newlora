/*
* Tinymce：功能相对Editor较多，适用于小中型项目的文本编辑
* */
export { default as DunoTinymce } from './tinymce.vue'

/* 
  使用方法

  import { DunoTinymce } from '_c/duno-editor'

  <duno-tinymce ref="editor" :value="content" @on-change="handleChange"/>


  // 内容发生变化时调用
  handleChange (html) {
    this.formData.content = html
    // 内容发生变化调用表单的验证事件
    this.$refs.formData.$refs.formTep.validateField('content')
  },
*/