<template>
  <div class="duno-table">
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
  &-table {
    width: 100%;
    height: 100%;
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
