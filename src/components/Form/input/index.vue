<template>
  <el-form-item :label="labelRet" :prop="prop" :rules="rules">
    <el-input
      :type="type"
      v-model="value"
      :size="size"
      :clearable="clearable"
      :show-password="showPassword"
      :disabled="disabled"
      :readonly="readonly"
      :maxlength="maxlength"
      :placeholder="placeholder"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      :rows="rows"
      :step="step"
      :autofocus="autofocus"
      :validate-event="validateEvent"
      :autocomplete="autocomplete"
      :autosize="autosize"
      @change="onChange"
      @focus="onFocus"
      @blur="onBlur"
    >
      <slot></slot>
    </el-input>
  </el-form-item>
</template>

<script>
export default {
  name: 'InputTep',
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
      type: String | Array | Number
    },
    type: {
      type: String,
      default: 'text'
    },
    size: {
      type: String
    },
    clearable: {
      type: Boolean,
      default: false
    },
    showPassword: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number
    },
    placeholder: {
      type: String,
      default: ''
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    suffixIcon: {
      type: String,
      default: ''
    },
    rows: {
      type: Number,
      default: 2
    },
    autosize: {
      type: Boolean | Object,
      default: false
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    step: null,
    autofocus: {
      type: Boolean,
      default: false
    },
    validateEvent: {
      type: Boolean,
      default: true
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
    onChange (event) {
      const newObj = {
        name: this.prop,
        value: this.value
      }
      this.$emit('onChange', newObj)
    },
    // 输入框聚焦时触发
    onFocus () {
      this.$emit('onFocus')
    },
    // 输入框失去焦点时触发
    onBlur () {
      this.$emit('onBlur')
    }
  },
  mounted () {
    this.value = this.initialValue
  }
}
</script>

<style lang="scss"></style>
