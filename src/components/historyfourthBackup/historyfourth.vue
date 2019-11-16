<template>
  <div
    class="historyfourth"
    v-loading="loadingOption"
    element-loading-background="rgba(0, 0, 0, 0)"
    element-loading-text="请稍后，正在加载数据…"
  >
    <h4 class="title">{{title}}</h4>
    <div class="center" v-if="isVoid">暂无历史告警内容</div>
    <div v-else class="historyfourthBox">
      <div
        :class="['historyfourthItem', mouseNum == index ? 'activeItem':'']"
        style="position: relative"
        @mouseenter.stop="mouseNum = index"
        @mouseleave.stop="mouseNum = -1"
        v-for="(item, index) in alarmHistoryData"
        :key="index"
      >
        <div>{{item.alarmTime}}</div>
        <!-- <div><span>温度：{{item.alarmValue}}℃</span><span class="threshold">超出阈值：{{item.threshold}}</span>缺陷评估：<span :class="[item.alarmLevel == '1'?'general':(item.alarmLevel == '2'?'warning':'alarm')]">{{item.alarmLevelName}}</span></div> -->
        <div>
          <span>{{item.powerDeviceName}}</span>&nbsp;&nbsp;
          <span>{{item.alarmContent}}</span>
          <span class="threshold">内容：{{item.alarmValue?item.alarmValue:item.alarmDetailType}}</span>
          <span
            :class="[item.alarmLevel == '1'?'general':(item.alarmLevel == '2'?'warning':'alarm')]"
          >{{item.alarmLevelName}}</span>
        </div>
        <div class="itemdetail" :key="index">
          <span @click="handleClick(item)">详情</span>
        </div>
      </div>
    </div>
    <wraning
      :popData="popData"
      :top="0"
      :modal="false"
      detailsType="alarm"
      :visible="visible"
      @handleClose="handleClose"
    />
  </div>
</template>
<script>
import wraning from "_c/duno-j/warning";
import { getAxiosData } from "@/api/axiosType";
import { error } from "util";
export default {
  name: "historyfourth",
  components: { wraning },
  data() {
    return {
      timer: null,
      loadingOption: true,
      visible: false,
      isVoid:false,
      alarmHistoryData: [],
      popData: {},
      mouseNum: -1
    };
  },
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      }
    },
    itemId: {
      type: String | Number,
      default: () => {
        return 0;
      }
    },
    itemData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  watch: {
    itemId(now) {
      if (now) {
        this.getData();
      }
    }
  },
  methods: {
    getData() {
      this.loadingOption = true;
      this.timer = setTimeout(() => {
        this.loadingOption = false;
      }, 1000000000);
      const that = this;
      const url = "/lenovo-alarm/api/alarm/history";
      let query = {
        monitorDeviceId: this.itemId,
        pageIndex: 1,
        pageRows: 10
      };
      if (that.itemData.monitorDeviceType) {
        query.deviceType = that.itemData.monitorDeviceType;
      }
      getAxiosData(url, query).then(res => {
        console.log(res.data.tableData);
        clearTimeout(this.timer);
        this.loadingOption = false;
        if (res.code == 200) {
          that.alarmHistoryData = res.data.tableData;
          if(that.alarmHistoryData.length>0){
            that.isVoid=false
          }else{
            let timeVoid=setTimeout(() => {
              that.isVoid = true;
              clearTimeout(timeVoid);
            }, 500);
          }
        } else {
          that.alarmHistoryData = [];
          that.isVoid=true
        }
      });
    },
    handleClick(item) {
      this.popData = item;
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
    }
  },
  mounted() {
    if (this.itemId) {
      this.getData();
    }
  }
};
</script>
<style lang="scss">
  .el-loading-text{
    color: #969696   !important;
  }
  .historyfourth{
    .el-dialog__wrapper{
      background: rgba(0,0,0, 0.8) !important;
    }
  }
</style>
<style lang="scss" scoped>
.historyfourth {
  .title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }
  .center{
      line-height: 300px;
      width: 100%;
      margin-top: 50px;
      color: #aaa;
      font-size: 20px;
      text-align: center;
    }
  &Box {
    width: 100%;
    max-height: 300px;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    .itemdetail {
      position: absolute;
      top: 25px;
      right: 40px;
      span {
        display: inline-block;
        padding: 2px 15px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 14px;
        border: 1px solid #fff;
      }
    }
  }
  &Item {
    color: #fff;
    font-size: 18px;
    padding: 10px;
    background: rgba(32, 54, 68, 0.7);
    margin-bottom: 10px;
    border-radius: 4px;

    .threshold {
      margin-right: 1em;
    }
    .alarm {
      color: #d7203f;
    }
    .warning {
      color: #ff8300;
    }
    .general {
      color: #ffe828;
    }
  }
  .activeItem {
    background: #444a5a;
  }
  .el-dialog__body{
    background-color: rgba(32, 54, 68, 0);
  }
}
  .historyfourthBox::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 10px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .historyfourthBox::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 20px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.5);
  }
  .historyfourthBox::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0);
    border-radius: 10px;
    background: rgba(0, 0, 0, 0);
  }
</style>
