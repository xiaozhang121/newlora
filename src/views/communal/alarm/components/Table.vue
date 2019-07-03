<template>
  <div class="duno-table demoTable">
    <div class="duno-title" v-if="title">
      {{title}}
      <div class="duno-select">
        <el-select v-model="value" placeholder="选择设备" style="width: 100%; top: -11px;">
          <el-option
            v-for="item in optionsList"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <div style="margin-top: 20px">
      <duno-tables-tep
        :columns="columns"
        :data="dataList"
        :totalNum="dataList.length"
        :border="true"
        :showSizer="true"
        :isShowPage="false"
      />
    </div>
  </div>
</template>
<script>
import { DunoTablesTep } from '_c/duno-tables-tep'
export default {
  name: 'alarmTable',
  components: { DunoTablesTep },
  data () {
    return {
      value: ''
    }
  },
  props: {
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
  }
}
</script>
<style lang="scss" scoped>
.duno {

}
</style>
<style lang="scss">
  .image h3{
    margin-top: 70px;
    text-align: center;
  }
.demoTable{
  display: flex;
  align-items: center;
  justify-content: center;
  .tablesTep{
    overflow: hidden;
  }
  .tablesTep .ivu-table-wrapper tr:nth-child(odd) td{
    background-color: rgba(18,33,39, 0.7) !important;
  }
  .tablesTep{
    border-radius: 4px;
    padding: 30px;
  }
}
</style>
