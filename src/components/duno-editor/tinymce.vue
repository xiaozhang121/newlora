<template>
  <div class="tinymce">
    <editor ref='tinymce' v-model='tinymceHtml' :init='init'></editor>
  </div>
</template>

<script>
import { formUpData } from '@/api/fromSelect'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/modern/theme'
import 'tinymce/plugins/image'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/link'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount'
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/hr'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/spellchecker'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/fullpage'
import 'tinymce/plugins/template'
import 'tinymce/plugins/anchor'
const languageUrl = require('_c/duno-editor/tinymce/zh_CN.js')
export default {
  name: 'tinymce',
  data () {
    const that = this
    return {
      tinymceHtml: '',
      init: {
        selector: 'textarea',
        language_url: languageUrl,
        language: 'zh_CN',
        height: 300,
        menubar: 'file edit insert view format',
        plugins: ['link','lists','image','media','table','colorpicker','textcolor','wordcount','contextmenu','fullscreen','preview','hr','paste','pagebreak','spellchecker','searchreplace','insertdatetime','fullpage','anchor','template'],
        toolbar:
          'bold italic underline strikethrough pastetext anchor | fontsizeselect fontselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | table tabledelete | bullist numlist | outdent indent blockquote | undo redo | link unlink image media | removeformat | template fullscreen preview fullpage',
        branding: false,
        font_formats: '宋体=宋体;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆;Arial=arial,helvetica,sans-serif;Comic Sans MS=comic sans ms;Courier New=courier new,courier,monospace;Tahoma=tahoma,arial;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats',
        fontsize_formats: '8px 10px 12px 14px 18px 24px 36px 48px 60px 72px',
        media_live_embeds: true,
        paste_data_images: true,
        images_upload_url: '',
        images_upload_handler: (blobInfo, success, failure) => {
          that.handleImgUpload(blobInfo, success, failure)
        },
        setup: function(editor) {
          editor.on('blur', function(){
            that.$emit('on-change', tinymce.activeEditor.setContent(that.tinymceHtml))
          })
        }
      }
    }
  },
  mounted () {
    this.$nextTick(() => {
      if (this.value) {
        this.tinymceHtml = this.value
      }
      tinymce.init({})
    })
  },
  components: { Editor },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  watch: {
    value (val) {
      this.tinymceHtml = val
    }
  },
  methods: {
    handleImgUpload (blobInfo, success, failure) {
      let acceptArr = ['jpg', 'jpeg', 'png', 'gif']
      let suffix = this.getSuffixFn(blobInfo.blob().name)
      if (acceptArr.indexOf(suffix) === -1) {
        failure(`仅支持的格式有：${acceptArr.join('、')}`)
      } else {
        let formdata = new FormData()
        formdata.set('file', blobInfo.blob())
        formdata.append('isCompress', '2')
        formUpData('/venus/oss/upload', formdata).then(res => {
          success(res.data[0].url)
        }).catch(error => {
          console.log(error)
          failure('系统错误')
        })
      }
    },
    getSuffixFn (postfix) { // 获取上传文件后缀名
      let index1 = postfix.lastIndexOf('.')
      let index2 = postfix.length
      let suffix = postfix.substring(index1 + 1, index2).toLowerCase() // 后缀名
      return suffix
    }
  }
}
</script>
<style lang="scss">
  .tinymce{
    @import "./tinymce/skins/lightgray/content.inline.min.css";
    @import "./tinymce/skins/lightgray/content.min.css";
    @import "./tinymce/skins/lightgray/content.mobile.min.css";
    @import "./tinymce/skins/lightgray/skin.min.css";
    @import "./tinymce/skins/lightgray/skin.mobile.min.css";
  }
</style>
