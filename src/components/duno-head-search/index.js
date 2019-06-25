/*
* 头部搜索条件组件
*   组件包括：
*     input输入框、
*     select下拉框、
*     datePicker日期选择框,分为:
*       {
*         date：YYYY-MM-DD、
*         datetime：YYYY-MM-DD HH:mm:ss、
*         datetimerange：[YYYY-MM-DD HH:mm:ss, YYYY-MM-DD HH:mm:ss]、
*         daterange：[YYYY-MM-DD, YYYY-MM-DD]、
*         month：YYYY-MM、
*         year：YYYY
*       }、
*      数字范围组件，type必须等于numArr，并且json中的name必须是数组形式且数组长度为2
* */
import DunoHeadSearch from './head-search.vue'
export default DunoHeadSearch

/* 
  使用说明
  import DunoHeadSearch from '_c/duno-head-search'

  <duno-head-search
    v-if="from.length"
    :fromData="from"
    labelPosition="right"
    labelWidth="120px"
    :isLoad="false"
    @clcikSearch="clickQuery"
  />

  from: [
    {
      'type': 'input', // 表单类型
      'title': '消息内容', // label名称
      'name': 'content', // 字段名称
      'initial': '' // 默认值
    },
    {
      'type': 'daterange',
      'title': '时间',
      'name': 'time',
      'initial': []
    },
    {
      'type': 'select',
      'title': '消息状态',
      'name': 'isRead',
      'transfer': false,
      'filterable': false,
      'multiple': false,
      'clearable': true,
      'entityName': 'VENUS_READ_STATE',
      'isDictionaries': true,
      'initial': ''
    }
  ]

  注意：
    1、如果下拉框是多选模式  initial选项必须是数组，同时处理完数据以后查询时会将选中的值以逗号分隔
*/