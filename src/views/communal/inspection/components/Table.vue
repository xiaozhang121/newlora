<template>
  <div class="duno-table">
    <div class="duno-title" v-if="title">
      {{title}}
      <span  @click="onClose" style="cursor: pointer; float: right"><i class="el-icon-close"></i></span>
    </div>
    <div>
      <duno-tables-tep
        :columns="columns"
        :data="dataList"
        :totalNum="dataList.length"
        :border="true"
        :showSizer="true"
        :isShowPage="false"
      />
    </div>
    <div style="margin-top: 20px; display: flex" v-if="!noBottom">
      <span style="color: white; flex: 1">日期：{{getDateTime}}</span>
      <div style="float: right; display:flex">
        <div class="title"  style="color: white;width:96px">任务名称</div>
        <el-input size="mini" style="width: 250px; border: 1px solid #00fefe; color: white" v-model="input" placeholder="请输入内容"></el-input>
      </div>
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
<style lang="scss" scoped>
.duno {
  &-table {
    width: 100%;
    border: 1px solid #008290;
    border-radius: 15px;
    padding: 20px;
    background: rgba(0, 130, 144, 0.3)
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
