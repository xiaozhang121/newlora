<template>
  <el-form
    ref="formTep"
    :model="model"
    :inline="inline"
    :rules="rules"
    :label-suffix="labelSuffix"
    :hide-required-asterisk="hideRequiredAsterisk"
    :show-message="showMessage"
    :inline-message="inlineMessage"
    :status-icon="statusIcon"
    :validate-on-rule-change="validateOnRuleChange"
    :size="size"
    :disabled="disabled"
    :label-width="$store.state.user.isFormWidthTop ? null : labelWidth"
    :label-position="$store.state.user.isFormWidthTop ? 'top': labelPosition"
    @validate="onValidate"
   >
    <slot></slot>
  </el-form>
</template>

<script>
import debounce from 'lodash/debounce'
export default {
  name: 'FormTep',
  components: {},
  data () {
    return {
      rulesValue: {}
    }
  },
  props: {
    model: {
      type: Object,
      default: () => {
        return {}
      }
    },
    rules: {
      type: Object | Array
    },
    inline: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    hideRequiredAsterisk: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    inlineMessage: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    statusIcon: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    showMessage: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    validateOnRuleChange: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    labelSuffix: {
      type: String,
      default: () => {
        return ""
      }
    },
    size: {
      type: String,
      default: () => {
        return ""
      }
    },
    labelWidth: {
      type: String,
      default: () => {
        return "120px"
      }
    },
    labelPosition: {
      type: String,
      default: () => {
        return "right"
      }
    }
  },
  computed: {},
  methods: {
    onValidate () {
      this.$emit('onValidate')
    },
    onSubmit: debounce(function (name) {
      const that = this
      that.$refs.formTep.validate((valid) => {
        if (valid) {
          this.$emit('onSubmit')
        } else {
          that.$message.error('请输入必填项!')
        }
      })
    }, 1000, { 'leading': true, 'trailing': false })
  },
  mounted () {
    this.$nextTick(() => {
      this.$refs.formTep.clearValidate()
    })
  }
}
</script>
