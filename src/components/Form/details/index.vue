<template>
  <el-form-item :label="labelRet">
    <span v-if="!isHtml">{{value}}</span>
    <div v-else v-html="value"></div>
  </el-form-item>
</template>

<script>
export default {
  name: 'DetailsTep',
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
    initialValue: {
      type: String | Number
    },
    isHtml: {
      type: Boolean,
      default: () => {
        return false
      }
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
  mounted () {
    this.value = this.initialValue
  }
}
</script>

<style lang="scss"></style>
