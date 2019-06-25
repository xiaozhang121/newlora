<template>
  <el-form-item :label="labelRet" :prop="prop" :rules="rules">
    <el-date-picker
      v-model="value"
      :type="type"
      :format="format"
      :valueFormat="valueFormat"
      :options="options"
      :placeholder="placeholder"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :show-week-numbers="showWeekNumbers"
      :start-date="startDate"
      :confirm="confirm"
      :size="size"
      :disabled="disabled"
      :clearable="clearable"
      :readonly="readonly"
      :editable="editable"
      :unlink-panels="unlinkPanels"
      :split-panels="splitPanels"
      style="width: 100%;"
      @change="onChange"
    ></el-date-picker>
  </el-form-item>
</template>

<script>
import moment from 'moment'
export default {
  name: 'DatePickerTep',
  components: {},
  data () {
    return {
      value: null
    }
  },
  props: {
    type: {
      type: String,
      default: 'date'
    },
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
    size: {
      type: String
    },
    format: String,
    valueFormat: String,
    options: Object,
    placeholder: {
      type: String,
      default: '请选择日期'
    },
    showWeekNumbers: {
      type: Boolean,
      default: false
    },
    confirm: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    unlinkPanels: {
      type: Boolean,
      default: true
    },
    clearable: {
      type: Boolean,
      default: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    },
    splitPanels: {
      type: Boolean,
      default: true
    },
    startDate: null
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
        if (this.type === 'datetimerange' || this.type === 'daterange' || this.type === 'dates') {
          this.value = []
        } else {
          this.value = ''
        }
      } else {
        this.value = val
      }
    }
  },
  methods: {
    // 数据改变时触发
    onChange (date) {
      let dateTime = ''
      let format = ''
      if ((this.type === 'datetime' || this.type === 'date' || !this.type) && date) { // 选择日期
        if (this.type === 'datetime') {
          format = this.format ? this.format : 'YYYY-MM-DD HH:mm:ss'
        } else {
          format = this.format ? this.format : 'YYYY-MM-DD'
        }
        dateTime = moment(date).format(format)
      } else if (this.type === 'datetimerange' || this.type === 'daterange') { // 选择时间范围
        if (this.type === 'datetimerange') {
          format = this.format ? this.format : 'YYYY-MM-DD HH:mm:ss'
        } else {
          format = this.format ? this.format : 'YYYY-MM-DD'
        }
        dateTime = []
        if (date && date.length && date[0] !== '' && date[1] !== '') {
          dateTime[0] = moment(date[0]).format(format)
          dateTime[1] = moment(date[1]).format(format)
        }
      } else if (this.type === 'month' && date) { // 选择月
        format = this.format ? this.format : 'YYYY-MM'
        dateTime = moment(date).format(format)
      } else if (this.type === 'year' && date) { // 选择年
        format = this.format ? this.format : 'YYYY'
        dateTime = moment(date + '-01-01').format(format)
      } else if (this.type === 'dates' && date) {
        format = this.format ? this.format : 'YYYY-MM-DD'
        dateTime = []
        for (let i in date) {
          dateTime.push(moment(date[i]).format(format))
        }
      } else if (this.type === 'week' && date) {
        const WW = moment(date).format("WW")
        const YYYY = moment(date).format("YYYY")
        dateTime = YYYY + '|' + WW
      }
      const newObj = { name: this.prop, value: dateTime }
      this.$emit('onChange', newObj)
    }
  },
  mounted () {
    this.value = this.initialValue
  }
}
</script>