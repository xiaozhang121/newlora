<template>
  <el-form-item :label="labelRet" :prop="prop" :rules="rules">
    <el-select
      ref="selectRef"
      v-model.trim="value"
      :clearable="true"
      :remote="remote"
      :loading="loading"
      :disabled="disabled"
      :multiple="multiple"
      :filterable="filterable"
      :size="size"
      :placeholder="placeholder"
      :remote-method="onQueryChange"
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
  name: 'longSelectTep',
  components: {},
  data () {
    return {
      value: null,
      groupVal: null,
      loading: false,
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
    filterable: {
      type: Boolean,
      default: true
    },
    remote: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '--'
    },
    queryFieldName: { // 远程搜索那个字段必填项
      type: String,
      default: ''
    },
    ganged: null, // 是否联动的，联动的那个字段
    isMaxData: {
      type: Boolean,
      default: false
    },
    isDictionaries: {
      type: Boolean,
      default: false
    },
    idFieldName: {
      type: String,
      default: ''
    },
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
        if (that.isDictionaries) {
          if(that.groupVal == null || that.optionData[i].group == that.groupVal) {
            list.push(that.optionData[i])
          }
        } else {
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
        this.value = val
      }
    },
    ganged (val) {
      if (val === null || val === undefined) {
        this.groupVal = ''
      } else {
        this.groupVal = val
      }
      this.initialData(false)
      const newObj = { name: this.prop, value: this.value }
      this.$emit('onChange', newObj)
    },
    value (val) {
      if (this.isMaxData) {
        // console.log('值变化')
        // this.initialData(true)
      }
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
      this.onChange()
    },
    // 数据改变时触发
    onChange () {
      const newObj = { name: this.prop, value: this.value, select: this.list }
      this.$emit('onChange', newObj)
    },
    // 搜索词改变时触发
    onQueryChange (query) {
      if (query !== '') {
        this.remoteMethod(query)
      } else {
        this.initialData(true)
      }
    },
    // 点击清空按钮时触发
    onClear () {
      this.initialData(true)
      this.$emit('onClear')
    },
    // 下拉框展开或收起时触发
    onVisibleChange (falg) {
      this.$emit('onVisibleChange', falg)
    },
    initialData (falg) {
      const that = this
      // 发起请求获取select下拉框数据
      let query = {}
      if (JSON.stringify(that.queryObjData) !== '{}') {
        query = {...that.queryObjData}
      }
      query['entityName'] = that.entityName
      if (that.queryFieldName) {
        query['queryFieldName'] = {
          field: that.queryFieldName,
          value: !falg ? '' : that.value
        }
      }
      if (that.ganged) {
        query['groupFieldName'] = that.ganged
      }
      if (this.idFieldName) {
        query['idFieldName'] = this.idFieldName
      }
      that.queryData(query, false)
    },
    remoteMethod (val) {
      const that = this
      that.loading = true
      // 发起请求获取select下拉框数据
      let query = {}
      if (JSON.stringify(that.queryObjData) !== '{}') {
        query = {...that.queryObjData}
      }
      query['entityName'] = that.entityName
      query['queryFieldName'] = {
          field: that.queryFieldName,
          value: val
        }
      that.queryData(query, true)
    },
    queryData (query, isSeek) {
      const that = this
      if (that.userDefinedURL) {
        const url = that.userDefinedURL.indexOf('/') === 0 ? that.userDefinedURL : '/' + that.userDefinedURL
        postAxiosData(url, query).then(res => {
          this.pushData(isSeek, res.data)
        })
      } else {
        if (that.isDictionaries) {
          getSelectList(query).then(res => {
            this.pushData(isSeek, res.data)
          })
        } else {
          getSelectCustomList(query).then(res => {
            this.pushData(isSeek, res.data)
          })
        }
      }
    },
    pushData (isSeek, data) {
      const that = this
      that.loading = false
      if (that.value) {
        let falg = false
        for (let item in data) {
          if (data[item].value == that.value) {
            falg = true
            break
          }
        }
        if (!falg) {
          that.clickSingleSelect()
        }
      }
      that.optionData = data
    }
  },
  mounted () {
    this.value = this.initialValue
    this.groupVal = this.ganged === undefined || this.ganged === null ? null : this.ganged
    if (this.groupVal == null && !this.isMaxData) {
      this.initialData(true)
    }
  }
}
</script>

<style lang="scss"></style>