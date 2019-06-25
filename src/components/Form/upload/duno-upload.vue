<template>
  <div>
    <el-form-item :label="labelRet" :prop="prop" :rules="rules">
      <div class="formItemDiv">
        <a class="mediaBtnA">{{ fileName }}
          <input type="file" @change="changeFile" ref="mediaInput" :accept="accept" class="mediaInput"/>
        </a>
        <p v-if="isLoading || loadingEnd" class="isLoading">{{ upHtml }}</p>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { formUpData } from '@/api/fromSelect'
export default {
  name: 'DunoUpLoadTep',
  components: {},
  data () {
    return {
      upHtml: '上传中...',
      isLoading: false,
      loadingEnd: false, // 延时关闭
      upImgData: null,
      fileName: '上传',
      imgSrc: '',
      suffix: false,
      returnData: null
    }
  },
  props: {
    label: {
      type: String,
      default: ''
    },
    prop: {
      type: String,
      default: ''
    },
    rules: {
      type: Object | Array
    },
    initialValue: {
      type: String,
      default: ''
    },
    fileSize: {
      type: Number,
      default: 100 // 上传文件最大支持100M
    },
    accept: {
      type: String,
      default: '*/*'
    },
    upUrl: {
      type: String,
      default: ''
    },
    isCompress: {
      type: String,
      default: '0'
    }
  },
  computed: {
    labelRet () {
      const that = this
      let label = this.label
      if (that.label) {
        const indexEn = that.label.indexOf(':')
        const indexZh = that.label.indexOf('：')
        if (indexEn === -1 && indexZh === -1) {
          label = that.label + '：'
        }
      }
      return label
    }
  },
  watch: {
    initialValue (now) {
      if (now) {
        this.fileName = now
      }
    }
  },
  methods: {
    // 数据改变时触发
    onChange () {
      const value = this.returnData && this.returnData.length ? this.returnData[0] : ''
      const newObj = { name: this.prop, value: value }
      this.$emit('onChange', newObj)
      this.isLoading = false
      this.isUpOk()
    },
    isUpOk () {
      const that = this
      that.loadingEnd = true
      if (that.returnData && that.returnData.length) {
        that.upHtml = '上传成功'
      } else {
        that.upHtml = '上传失败'
        that.fileName = '上传失败'
        that.$refs.mediaInput.value = ''
      }
      setTimeout(() => {
        that.loadingEnd = false
        that.upHtml = '上传中...'
      }, 1000)
    },
    upData () {
      const url = this.upUrl
      if (!url) {
        this.$message.warning('请填写上传的url地址')
        return false
      }
      let formData = new FormData()
      formData.append('file', this.upImgData)
      formData.append('isCompress', this.isCompress)
      this.isLoading = true
      formUpData(url, formData).then(res => {
        this.returnData = res.data
        this.onChange()
      }, error => {
        console.log(error)
        this.isUpOk()
        this.isLoading = false
      })
    },
    changeFile () {
      let that = this
      let filesList = that.$refs.mediaInput.files
      if (filesList && filesList.length) {
        let reader = new FileReader()
        reader.readAsDataURL(filesList[0])
        let suffix = that.getSuffixFn(filesList[0].name)
        let isSuffix = true
        let acceptArr = []
        if (that.accept === 'audio/*') {
          acceptArr = ['mp3', 'ogg']
        } else if (that.accept === 'video/*') {
          acceptArr = ['mp4', 'mov', 'ogg']
        } else if (that.accept === 'image/*') {
          acceptArr = ['jpg', 'jpeg', 'png', 'gif']
        } else {
          acceptArr = []
        }
        if ((filesList[0].size / 1024 / 1024) > that.fileSize) {
          isSuffix = false
          that.$message.warning({ content: `文件最大支持：${that.fileSize}M`, showClose: true })
          that.$refs.mediaInput.value = ''
        } else if (acceptArr.indexOf(suffix) !== -1 || !acceptArr.length) {
          isSuffix = true
        } else {
          isSuffix = false
          that.$message.error({ content: `仅支持的格式有：${acceptArr.join('、')}`, showClose: true })
          that.$refs.mediaInput.value = ''
        }
        if (isSuffix) {
          that.upImgData = filesList[0]
          that.fileName = filesList[0].name
          reader.onloadend = function (e) {
            that.imgSrc = e.target.result
          }
          that.upData()
        } else {
          that.upImgData = null
          that.fileName = this.initialValue ? this.initialValue : '上传'
        }
      }
    },
    getSuffixFn (postfix) { // 获取上传文件后缀名
      let index1 = postfix.lastIndexOf('.')
      let index2 = postfix.length
      let suffix = postfix.substring(index1 + 1, index2).toLowerCase() // 后缀名
      return suffix
    }
  },
  mounted () {
    if (this.initialValue) {
      this.fileName = this.initialValue
    }
  }
}
</script>

<style lang="scss" scoped>
  .formItemDiv{
    position: relative;
  }
  .mediaBtnA{
    display: block;
    width: 100%;
    text-align: center;
    height: 30px;
    line-height: 30px;
    padding: 0 15px;
    box-sizing: border-box;
    border-radius: 4px;
    color: #495060;
    border:1px solid #dddee1;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
  }
  .mediaBtnA:hover,.mediaBtnA:active{
    color: #495060;
  }
  .mediaInput{
    filter:alpha(opacity=0);
    -moz-opacity:0;
    -khtml-opacity:0;
    opacity: 0;
    position: absolute;
    top:0;
    left: -5px;
    width: 101%;
    height: 100%;
    overflow: hidden;
    display: block;
    z-index: 1;
    font-size: 400px;
  }
  .isLoading {
    margin: 0;
    padding: 2px 0;
    font-size: 12px;
    position: absolute;
    bottom: -32px;
    color: #07d3f5;
  }
</style>
