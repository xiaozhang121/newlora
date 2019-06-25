<template>
  <el-form-item :label="labelRet" :prop="prop" :rules="rules">
    <div class="formItemDiv">
      <el-upload
        :multiple="multiple"
        name="file"
        :data="returnQuery"
        :accept="accept"
        :disabled="disabled"
        :drag="drag"
        :limit="limit"
        :headers="headers"
        :with-credentials="withCredentials"
        :action="actionUrl"
        :auto-upload="autoUpload"
        :show-file-list="showFileList"
        :on-success="onChange"
        :on-remove="onRemove"
        :file-list="defaultFileList"
        class="upLoadDiv"
      >
        <el-button style="width:100%;" icon="ios-cloud-upload-outline">上传</el-button>
        <slot></slot>
      </el-upload>
    </div>
  </el-form-item>
</template>
<script>

import { mapState } from 'vuex'
export default {
  name: 'UpLoadTep',
  components: {},
  data () {
    const that = this
    return {
      fileName: '上传',
      defaultFileList: [],
      baseUrl: process.env.NODE_ENV === 'development' ? that.$config.baseUrl.dev : that.$config.baseUrl.pro
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
    limit: {
      type: Number // 上传文件最大数量
    },
    accept: {
      type: String
    },
    upUrl: {
      type: String,
      default: ''
    },
    isCompress: {
      type: String,
      default: '0'
    },
    showFileList: {
      type: Boolean,
      default: true
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    drag: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    withCredentials: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    queryObj: {
      type: Object
    }
  },
  watch: {
    isInitialValue (now) {
      const that = this
      if (now) {
          const newArr = now.split(',')
          const uploadList = []
          for (let i in newArr) {
            let name = newArr[i]
            const index = name.indexOf("?")
            name = name.substring(index + 1, name.length)
            const newObj = {
              name: name,
              url: newArr[i]
            }
            uploadList.push(newObj)
          }
          that.defaultFileList = uploadList
        } else {
          that.defaultFileList = []
        }
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    returnQuery () {
      let query = {}
      if (this.queryObj) {
        query = {...this.queryObj}
      }
      query.isCompress = this.isCompress
      return query
    },
    isInitialValue () {
      return this.initialValue
    },
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
    },
    actionUrl () {
      const upUrl = this.upUrl.indexOf('/') === 0 ? (this.baseUrl + this.upUrl) : (this.baseUrl + '/' + this.upUrl)
      return upUrl
    },
    maxSize () {
      const fileSize = fileSize * 1024
      return fileSize
    },
    headers () {
      if (this.user.token) {
        return {
          Authorization: this.user.token
        }
      } else {
        return {}
      }
    }
  },
  methods: {
    // 上传成功调用的方法
    onChange (response, file, fileList) {
      this.emitOk(fileList)
    },
    // 文件移除时的方法
    onRemove (file, fileList) {
      this.emitOk(fileList)
    },
    emitOk (fileList) {
      let newArr = []
      for (let i = 0; i < fileList.length; i++) {
        if (fileList[i].response && fileList[i].response.data && fileList[i].response.data.length) {
          newArr.push(fileList[i].response.data[0])
        }
      }
      if (newArr.length === fileList.length) {
        const newObj = { name: this.prop, value: newArr.join(',') }
        this.$emit('onChange', newObj)
      }
    }
  },
  mounted () {}
}
</script>
<style></style>