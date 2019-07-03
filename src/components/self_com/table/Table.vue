<template>
  <div class="duno-table">
    <div>
      <duno-tables-tep
        :columns="columns"
        :data="dataList"
        :totalNum="dataList.length"
        :border="false"
        :height="height"
        :showSizer="true"
        :isShowPage="false"
      />
    </div>
  </div>
</template>
<script>
import { DunoTablesTep } from '_c/duno-tables-tep'
import moment from 'moment'
export default {
  name: 'alarmTable',
  components: { DunoTablesTep },
  data () {
    return {
      value: '',
      input: ''
    }
  },
  computed:{
      getDateTime(){
          const that = this
          const date = new Date()
          let time = moment(date).format('YYYY.MM.DD HH:mm:ss')
          return time
      }
  },
  props: {
    height:{},
    noBottom: {},
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    },
    totalNum: {
      type: Number,
      default: () => {
        return 0
      }
    },
    optionsList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods:{
      onClose(){
          this.$emit('on-close')
      }
  }
}
</script>
<style>
  .ivu-table-small td{
    background: transparent;
  }
  .ivu-table td, .ivu-table th{
    border-bottom: 1px solid #00788b;
  }
  .ivu-table-small th{
    background: #00828f;
  }
</style>
<style lang="scss" scoped>
.duno {
  &-table {
    width: 100%;
    /*border: 1px solid #008290;*/
    border-radius: 15px;
    padding: 20px;
    /*background: rgba(0, 130, 144, 0.3)*/
  }
  &-title {
    height: 50px;
    line-height: 50px;
    position: relative;
    color: #fff;
    font-weight: bold;
    font-size: 24px;
  }
  &-select{
    width: 120px;
    height: 30px;
    border: 1px solid #008290;
    border-radius: 5px;
    position: absolute;
    right: 6px;
    top: 11px;
  }
}
</style>
<style lang="scss">

</style>
