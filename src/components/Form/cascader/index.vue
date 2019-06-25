<template>
  <el-form-item :label="labelRet" :prop="prop" :rules="rules">
    <el-cascader
      ref="cascaderRef"
      v-model="value"
      :size="size"
      :props="props"
      :separator="separator"
      :popper-class="popperClass"
      :placeholder="placeholder"
      :disabled="disabled"
      :clearable="clearable"
      :expand-trigger="expandTrigger"
      :show-all-levels="showAllLevels"
      :filterable="filterable"
      :debounce="debounce"
      :change-on-select="changeOnSelect"
      :before-filter="beforeFilter"
      :options="optionData"
      @change="onChange"
      @active-item-change="onActiveItemChange"
      @blur="onBlur"
      @focus="onFocus"
      @visible-change="onVisibleChange"
      style="width:100%"
    >
    </el-cascader>
  </el-form-item>
</template>
<script>
export default {
  name: 'CascaderTep',
  data () {
    return {
      value: []
    }
  },
  props: {
    /* 表单标题 */
    label: {
      type: String,
      default: ''
    },
    /* 表单prop值 */
    prop: {
      type: String,
      default: ''
    },
    /* 表单验证 */
    rules: {
      type: Object | Array
    },
    /* 级联默认值 */
    initialValue: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* 
      联动选项的数据格式：
      [
        {
          value: 'zhinan',
          label: '指南',
          children: [
            {
              value: 'shejiyuanze',
              label: '设计原则',
              children: [
                {
                  value: 'yizhi',
                  label: '一致'
                },
                {
                  value: 'fankui',
                  label: '反馈'
                },
                {
                  value: 'xiaolv',
                  label: '效率'
                },
                {
                  value: 'kekong',
                  label: '可控'
                }
              ]
            }
          ]
        }
      ]
    */
    optionData: {
      type: Array,
      default: () => {
        return []
      }
    },
    /* 尺寸大小 */
    size: {
      type: String
    },
    /* 配置选项
      参数                        说明                                              类型	         可选值	       默认值
      value                      指定选项的值为选项对象的某个属性值                 string类型         -            -
      label                      指定选项标签为选项对象的某个属性值                 string类型         -            -
      children                   指定选项的子选项为选项对象的某个属性值             string类型         -             -
      disabled                   指定选项的禁用为选项对象的某个属性值               string类型         -             -
    */
    props: {
      type: Object
    },
    /* 选项分隔符 */
    separator: {
      type: String,
      default: () => {
        return '/'
      }
    },
    /* 自定义浮层类名 */
    popperClass	: {
      type: String
    },
    /* 输入框占位文本 */
    placeholder	: {
      type: String,
      default: () => {
        return '请选择'
      }
    },
    /* 是否禁用 */
    disabled	: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    /* 是否支持清空选项 */
    clearable	: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    /* 次级菜单的展开方式      click / hover  */
    expandTrigger	: {
      type: String,
      default: () => {
        return 'click'
      }
    },
    /* 输入框中是否显示选中值的完整路径 */
    showAllLevels	: {
      type: Boolean,
      default: () => {
        return true
      }
    },
    /* 是否可搜索选项 */
    filterable	: {
      type: Boolean
    },
    /* 搜索关键词输入的去抖延迟，毫秒 */
    debounce	: {
      type: Number,
      default: () => {
        return 300
      }
    },
    /* 是否允许选择任意一级的选项 */
    changeOnSelect	: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    /* 筛选之前的钩子，参数为输入的值，若返回 false 或者返回 Promise 且被 reject，则停止筛选 */
    beforeFilter	: {
      type: Function
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
      this.value = val || []
    }
  },
  methods: {
    /*  当绑定值变化时触发的事件     (当前值) */
    onChange (val) {
      const newObj = {
        name: this.prop,
        value: this.value
      }
      console.log(this.value)
      // this.$emit('onChange', newObj)
    },
    /* 在 Cascader 获得焦点时触发   (event: Event) */
    onFocus () {
      const newObj = {
        name: this.prop,
        value: this.value
      }
      this.$emit('onFocus', newObj)
    },
    /* 在 Cascader 失去焦点时触发   (event: Event) */
    onBlur () {
      const newObj = {
        name: this.prop,
        value: this.value
      }
      this.$emit('onBlur', newObj)
    },
    /* 下拉框出现/隐藏时触发  出现则为 true，隐藏则为 false */
    onVisibleChange (flag) {
      this.$emit('onVisibleChange', flag)
    },
    /* 当父级选项变化时触发的事件，仅在 change-on-select 为 false 时可用    各父级选项组成的数组 */
    onActiveItemChange (val) {
      this.$emit('onActiveItemChange', val)
    }
  },
  mounted () {
    this.value = this.initialValue || []
  }
}
</script>
