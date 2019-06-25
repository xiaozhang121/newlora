<template>
  <el-form-item :label="labelRet" :prop="prop" :rules="rules">
    <el-input-number
      v-model="value"
      :size="size"
      :step="step"
      :precision="precision"
      :disabled="disabled"
      :readonly="readonly"
      :controls="controls"
      :max="max"
      :min="min"
      :placeholder="placeholder"
      :controls-position="controlsPosition"
      :editable="editable"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
      :style="style"
    >
    </el-input-number >
    <!-- 单位插槽  使用此插槽必须设置  showUnit 为true -->
    <div v-if="showUnit" class="unit" :style="'width:' + unitWidth">
      <slot name="unit"></slot>
    </div>
  </el-form-item>
</template>

<script>
export default {
  name: 'InputNumberTep',
  components: {},
  data () {
    return {
      value: null
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
      type: Number
    },
    precision: {
      type: Number
    },
    size: {
      type: String
    },
    step: {
      type: Number,
      step: 1
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: true
    },
    max: {
      type: Number
    },
    min: {
      type: Number
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    controlsPosition: {
      type: String,
      default: 'right'
    },
    editable: {
      type: Boolean,
      default: true
    },
    showUnit: {
      type: Boolean,
      default: false
    },
    unitWidth: {
      type: String,
      default: () => {
        return '50px'
      }
    }
  },
  computed: {
    style () {
      if (this.showUnit) {
        let style = 'width: calc(100% - ' + this.unitWidth + ');'
        return style
      } else {
        let style = 'width: 100%;'
        return style
      }
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
        this.value = 0
      } else {
        this.value = Number(val) || 0
      }
    }
  },
  methods: {
    // 数据改变时触发
    onChange (val) {
      const newObj = {
        name: this.prop,
        value: this.value
      }
      console.log(this.value)
      this.$emit('onChange', newObj)
    },
    // 输入框聚焦时触发
    onFocus () {
      const newObj = {
        name: this.prop,
        value: this.value
      }
      this.$emit('onFocus', newObj)
    },
    // 输入框失去焦点时触发
    onBlur () {
      const newObj = {
        name: this.prop,
        value: this.value
      }
      this.$emit('onBlur', newObj)
    }
  },
  mounted () {
    this.value = Number(this.initialValue) || 0
  }
}
</script>

<style lang="scss" scoped>
.unit {
  display: inline-block;
  padding-left: 10px;
  box-sizing: border-box;
}
</style>