<template>
  <div
    class="historyfourth"
    v-loading="loadingOption"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    element-loading-text="加载中"
  >
    <h4 class="title">{{title}}</h4>
    <div class="historyfourthBox">
      <div
        :class="['historyfourthItem', mouseNum == index ? 'activeItem':'']"
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
          <span class="threshold">内容：{{item.alarmValue?item.alarmValue:item.alarmDetailType}}℃</span>
          <span
            :class="[item.alarmLevel == '1'?'general':(item.alarmLevel == '2'?'warning':'alarm')]"
          >{{item.alarmLevelName}}</span>
        </div>
        <div class="itemdetail" :key="index">
          <span @click="handleClick(index)">详情</span>
        </div>
      </div>
    </div>
    <wraning
      :popData="popData"
      :top="0"
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
      loadingOption: false,
      visible: false,
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
        } else {
          that.alarmHistoryData = [];
        }
      });
    },
    handleClick(index) {
      this.popData = this.dataList[index];
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
<style lang="scss" scoped>
.historyfourth {
  .title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
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
}
</style>
