<template>
  <el-form-item :label="labelRet" :prop="prop" :rules="rules">
    <el-radio-group
      v-model="value"
      :size="size"
      @change="onChange"
    >
      <!-- 按钮样式 -->
      <template v-if="type == 'button'">
        <el-radio-button
          v-for="item in optionData"
          :key="item.value"
          :label="item.value"
          :border="border"
        >
          {{ item.label }}
        </el-radio-button>
      </template>
      <!-- 普通样式 -->
      <template v-else>
        <el-radio
          v-for="item in optionData"
          :key="item.value"
          :label="item.value"
          :border="border"
        >
          {{ item.label }}
        </el-radio>
      </template>
    </el-radio-group>
  </el-form-item>
</template>

<script>
import { getSelectList, getSelectCustomList } from '@/api/fromSelect'
export default {
  name: 'RadioTep',
  components: {},
  data () {
    return {
      value: null,
      optionData: []
    }
  },
  props: {
    type: String,
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
      type: String | Array | Number
    },
    size: {
      type: String
    },
    isDictionaries: {
      type: Boolean,
      default: false
    },
    border: {
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
        this.value = ''
      } else {
        this.value = val
      }
    }
  },
  methods: {
    // 数据改变时触发
    onChange () {
      const newObj = { name: this.prop, value: this.value }
      this.$emit('onChange', newObj)
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
  }
}
</script>

<style lang="scss"></style>
