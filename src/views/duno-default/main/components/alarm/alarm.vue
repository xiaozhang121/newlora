<template>
  <el-popover
    popper-class="promptBox"
    placement="bottom"
    width="440"
    v-model="visible"
    trigger="manual">
    <div @click="visible = !visible" slot="reference" class="header-icon">
      <el-badge :max="99" :value="value" :hidden="!isDot">
        <i class="iconfont icon-gaojingxinxi"></i>
      </el-badge>
    </div>
    <div class="promptContent">
      <h3>当前告警信息<span class="DotNum" v-if="isDot">{{value}}</span> <i  @click="visible = !visible" class="iconfont icon-guanbi"/></h3>
      <div class="promptItemBox">
        <div class="itemData" v-for="(item, index) in itemData" :key="index">
          <el-row>
            <el-col :span="15"><h5 class="title">{{item.powerDeviceName}}</h5></el-col>
            <el-col :span="9"><div class="buttonAll"><el-button type="info" round @click="restoration(item, '1', index)">复位</el-button><el-button type="success" round @click="restoration(item, '0', index)">保存</el-button></div></el-col>
          </el-row>
          <p class="itemTitle">当前温度：<span>{{item.alarmValue}}℃</span></p>
          <p class="itemTitle">超出阈值：<span>{{item.threshold}}</span></p>
          <!-- 接数据时要对此处的状态做处理，下方class类名已经写好 -->
          <p class="itemTitle">缺陷评估：<span :class="[item.alarmLevel == '1'?'general':(item.alarmLevel == '2'?'warning':'alarm')]">{{item.alarmLevelName}}</span></p>
          <p class="itemTitle itemBottomTitle ">{{item.alarmTime}}<span class="location">位置：{{item.deviceAddress}}</span></p>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script>
import { getAxiosData, postAxiosData } from '@/api/axiosType.js'
import { mapState } from 'vuex'
export default {
  name: 'alarmTip',
  data () {
    return {
      value: 0,
      visible: false,
      itemData: []
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    isDot () {
      return this.value > 0
    }
  },
  watch: {
    itemData: {
      handler(now) {
        if (now && now.length) {
          this.value = now.length
        } else {
          this.value = 0
        }
      },
      deep: true
    }
  },
  methods: {
    restoration (item, type, index) {
      console.log(type == '1'?'复位':'保存')
      const url = type == '1' ? "/lenovo-alarm/api/alarm/reset" : '/lenovo-alarm/api/alarm/save'
      const query = {
        alarmId: item.alarmId
      }
      postAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.itemData.splice(index, 1)
        this.$message.success(res.msg)
      })
    },
    getData () {
      const that = this
      const url = '/lenovo-alarm/api/alarm/list'
      const query = {
        'pageIndex': 1,
        'pageRows': 44321,
        'isDeal': '0',
        'deviceName': ''
      }
      getAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          that.itemData = []
          return false
        }
        that.itemData = res.data.tableData
      })
    }
  },
  mounted () {
    this.getData()
  }
}
</script>
<style lang="scss">
  .header-icon{
    color: white;
    position: relative;
    overflow: inherit;
    
    .el-badge__content {
      border: none;
      background-color:#ce021d;
    }
  }
  body .prompt {
    &Box {
      box-sizing: border-box;
      background: rgba(18, 33, 39, 0.7);
      padding: 10px;
      border: none;
      color: #fff;
      .popper__arrow {
        border-bottom-color:rgba(27, 59, 71, 0.7) !important;
      }
    }
    &Content {
      > h3 {
        height: 45px;
        line-height: 45px;
        margin-bottom: 10px;
        padding: 0 15px;
        font-size: 16px;
        background: rgba(50, 95, 125, 0.8);
        > i {
          float: right;
          margin-right: 10px;
        }
      }
      .DotNum {
        display: inline-block;
        font-size: 12px;
        vertical-align: text-bottom;
        padding: 3px 5px;
        border-radius: 30px;
        margin-left: 1em;
        width: auto;
        height: auto;
        line-height: initial;
        background: #ce021d;
        color: #fff;
      }
    }
    &ItemBox {
      max-height: 588px;
      overflow-x: hidden;
      overflow-y: auto;
      .itemData {
        box-sizing: border-box;
        padding: 20px 20px 10px;
        background: rgba(32, 54, 68, 0.7);
        margin-bottom: 10px;
      }
      .itemData:last-of-type{
        margin-bottom: 0;
      }
      .title {
        font-size: 22px;
        font-weight: bold;
        color: #05E0E1;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .buttonAll {
        text-align: right;
      }
      .itemTitle {
        color: #fff;
        font-size: 18px;
        padding: 5px 0;
        .alarm {
          color: #d7203f;
          font-size: 22px;
        }
        .warning {
          color: #ff8300;
          font-size: 22px;
        }
        .general {
          color: #ffe828;
          font-size: 22px;
        }
      }
      .itemBottomTitle {
        color: #999;
        font-size: 16px;
      }
      .location {
        margin-left: 1em;
      }
    }
    
  }
</style>