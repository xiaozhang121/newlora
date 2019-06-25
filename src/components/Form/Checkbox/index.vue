<template>
  <el-form-item :label="labelRet" :prop="prop" :rules="rules">
    <el-checkbox
      v-if="allCheck"
      :indeterminate="indeterminate"
      :value="checkAll"
      @change="handleCheckAll">全选</el-checkbox>

    <el-checkbox-group
      v-model="value"
      :size="size"
      @change="onChange"
    >
      <el-checkbox
        v-for="item in optionData"
        :key="item.value"
        :label="item.value"
      >
        <span>{{ item.label }}</span>
      </el-checkbox>
    </el-checkbox-group>
  </el-form-item>
</template>

<script>
import { getSelectList, getSelectCustomList } from '@/api/fromSelect'
export default {
  name: 'CheckboxTep',
  components: {},
  data () {
    return {
      indeterminate: false,
      checkAll: false,
      value: null,
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
      type: Array
    },
    size: {
      type: String
    },
    allCheck: {
      type: Boolean,
      default: false
    },
    isDictionaries: {
      type: Boolean,
      default: false
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
    initialValue (val) {
      if (val === null || val === undefined) {
        this.value = []
      } else {
        this.value = val
      }
    }
  },
  methods: {
    // 数据改变时触发
    onChange (data) {
      if (this.allCheck) {
        if (data.length === this.optionData.length) {
          this.indeterminate = false
          this.checkAll = true
        } else if (data.length > 0) {
          this.indeterminate = true
          this.checkAll = false
        } else {
          this.indeterminate = false
          this.checkAll = false
        }
      }
      const newObj = { name: this.prop, value: this.value }
      this.$emit('onChange', newObj)
    },
    handleCheckAll () { // 全选
      if (this.indeterminate) {
        this.checkAll = false
      } else {
        this.checkAll = !this.checkAll
      }
      this.indeterminate = false

      if (this.checkAll) {
        const newArr = []
        for (let i = 0; i < this.optionData.length; i++) {
          newArr.push(this.optionData[i].value)
        }
        this.value = newArr
      } else {
        this.value = []
      }
    },
    initialData () {
      const that = this
      // 发起请求获取选项数据
      if (that.isDictionaries) {
        const query = { entityName: that.entityName }
        getSelectList(query).then(res => {
          that.optionData = res.data
        })
      } else {
        const query = { entityName: that.entityName }
        getSelectCustomList(query).then(res => {
          that.optionData = res.data
        })
      }
    }
  },
  mounted () {
    this.value = this.initialValue
    this.initialData()
    if (this.allCheck && this.value.length) {
      this.onChange(this.value)
    }
  }
}
</script>

<style lang="scss"></style>
