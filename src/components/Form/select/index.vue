<template>
  <el-form-item :label="labelRet" :prop="prop" :rules="rules">
    <el-select
      ref="selectRef"
      :clearable="clearable"
      v-model="value"
      :disabled="disabled"
      :multiple="multiple"
      :multiple-limit="multipleLimit"
      :filterable="filterable"
      :size="size"
      :placeholder="placeholder"
      @change="onChange"
      @clear="onClear"
      @visible-change="onVisibleChange"
      style="width:100%"
    >
      <el-option
        v-for="item in optionList"
        :label="item.label"
        :value="item.value"
        :key="item.value"
      ></el-option>
    </el-select>
  </el-form-item>
</template>

<script>
import { getSelectList, getSelectCustomList } from '@/api/fromSelect'
import { postAxiosData } from '@/api/axiosType'
export default {
  name: 'SelectTep',
  components: {},
  data () {
    return {
      value: null,
      groupVal: null,
      optionData: []
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
    entityName: {
      type: String,
      default: ''
    },
    initialValue: {
      type: String | Array | Number | null
    },
    size: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    multipleLimit: {
      type: Number,
      default: 0
    },
    filterable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: false
    },
    isDictionaries: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '--'
    },
    ganged: null,
    queryObjData: {
     type: Object,
     default: () => {
       return {}
     } 
    },
    userDefinedURL: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  computed: {
    optionList () {
      const that = this
      const list = []
      for (let i in that.optionData) {
        if(that.groupVal == null || that.optionData[i].group == that.groupVal) {
          list.push(that.optionData[i])
        }
      }
      return list
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
    }
  },
  watch: {
    initialValue (val) {
      if (val === null || val === undefined) {
        this.clickSingleSelect()
      } else {
        if (this.multiple) {
          this.value = val ? val.split(',') : []
        } else {
          this.value = val
        }
      }
    },
    ganged (val) {
      if (val === null || val === undefined) {
        this.groupVal = ''
      } else {
        this.groupVal = val
      }
      this.clickSingleSelect()
      let value = ''
      if (this.multiple) {
        value = this.value ? this.value.join(',') : ''
      } else {
        value = this.value
      }
      const newObj = { name: this.prop, value: value }
      this.$emit('onChange', newObj)
    }
  },
  methods: {
    // 清空下拉框然后赋值
    clickSingleSelect () {
      if (this.multiple) {
        this.value = []
      } else {
        this.value = ''
      }
      // this.$refs.selectRef.clearSingleSelect()
    },
    // 数据改变时触发
    onChange () {
      let value = ''
      if (this.multiple) {
        value = this.value ? this.value.join(',') : ''
      } else {
        value = this.value
      }
      const newObj = { name: this.prop, value: value }
      this.$emit('onChange', newObj)
    },
    // 点击清空按钮时触发
    onClear () {
      this.$emit('onClear')
    },
    // 下拉框展开或收起时触发
    onVisibleChange (falg) {
      this.$emit('onVisibleChange', falg)
    },
    initialData () {
      const that = this
      // 发起请求获取select下拉框数据
      let query = {}
      if (JSON.stringify(that.queryObjData) !== '{}') {
        query = {...that.queryObjData}
      }
      query['entityName'] = that.entityName
      if (that.userDefinedURL) {
        const url = that.userDefinedURL.indexOf('/') === 0 ? that.userDefinedURL : '/' + that.userDefinedURL
        postAxiosData(url, query).then(res => {
          that.optionData = res.data
        })
      } else {
        if (that.isDictionaries) {
          getSelectList(query).then(res => {
            that.optionData = res.data
          })
        } else {
          getSelectCustomList(query).then(res => {
            that.optionData = res.data
          })
        }
      }
    }
  },
  mounted () {
    if (this.multiple) {
      this.value = this.initialValue ? this.initialValue.split(',') : []
    } else {
      this.value = this.initialValue
    }
    this.groupVal = this.ganged === undefined || this.ganged === null ? null : this.ganged
    this.initialData()
  }
}
</script>

<style lang="scss"></style>