<template>
  <div class="historicalwarning" @mouseenter="noEvent = false">
    <h3 class="title">{{title}}</h3>
    <div class="historicalwarningBox" :class="{'noEvent': noEvent}">
      <div v-for="(item, index) in dataList" :key="index" class="itemData">
        <div
          class="historicalwarningItem"
          :class="{'clip': isClip,'noEvent': noEvent}"
          style="position: absolute"
          @mouseenter.stop="mouseenter(index)"
          @mouseleave.stop="mouseleave"
        >
          <transition name="el-zoom-in-center">
            <div class="picDetail" v-show="item.show">
              <img :src="item.alarmFileAddress" ref="imgFull" />
              <i class="iconfont icon-quanping" @click="changeFullScreen($refs.imgFull,index)"></i>
            </div>
          </transition>
          <div class="mainMli">
            <div class="M_nr">
              <div  class="item_n">{{item.alarmTime}}</div>
              <div  class="item_n">
                <el-tooltip effect="dark" :content="item.powerDeviceName +'  '+ item.alarmContent" placement="top">
                  <span>{{item.powerDeviceName}}</span>&nbsp;&nbsp;<span>{{item.alarmContent}}</span>
                </el-tooltip>
              </div>
              <div class="item_n">
                <p>
                  内容：{{item.alarmValue?item.alarmValue:item.alarmDetailType}}
                  <span
                    class="commonly"
                    v-if="item.alarmLevel == '1'"
                  >一般</span>
                  <span class="serious" v-if="item.alarmLevel == '2'">严重</span>
                  <span class="danger" v-if="item.alarmLevel == '3'">危急</span>
                </p>
              </div>
              <div class="itemdetail">
                <span @click="handleClick(index)">详情</span>
              </div>
            </div>
            <!--
            <div>
              <i-dropdown class="dropAlarmDown" trigger="click" placement="bottom-start">
                <div
                  class="table_select"
                  :class="[{'serious': item.alarmLevel == '2'},{'commonly': item.alarmLevel == '1'},{'danger': item.alarmLevel == '3'}]"
                >
                  <span class="member_operate_div">
                    <span>{{ alarmLevelName(item.alarmLevelName) }}</span>
                  </span>
                  <i class="iconfont icon-xiala"></i>
                </div>
                <i-dropdownMenu slot="list">
                  <i-dropdownItem
                    v-for="(itemL, indexL) in selectList"
                    :key="'select'+indexL"
                    @click.native="selectItem(item, indexL)"
                  >
                    <div class="alarmLevel">{{ itemL }}</div>
                  </i-dropdownItem>
                </i-dropdownMenu>
              </i-dropdown>
            </div>
            -->
          </div>
          <!-- <div>
            缺陷评估：
            <span
              :class="[item.alarmLevel == '1'?'general':(item.alarmLevel == '2'?'warning':'alarm')]"
            >{{item.alarmLevelName}}</span>
          </div>-->
        </div>
      </div>
    </div>
    <wraning
      :popData="popData"
      detailsType="alarm"
      :top="0"
      :visible="visible"
      :modal='false'
      @handleClose="handleClose"
    />
  </div>
</template>
<script>
import wraning from "_c/duno-j/warning";
import screenfull from "screenfull";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType.js";
export default {
  name: "historicalwarning",
  components: {
    wraning
  },
  data() {
    return {
      selectList: ["一般", "严重", "危急"],
      timer: null,
      noEvent: false,
      isClip: true,
      visible: false,
      popData: {}
    };
  },
  props: {
    title: {
      type: String,
      default: () => {
        return "";
      }
    },
    dataList: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  methods: {
    mouseleave() {
      this.timer = setTimeout(() => {
        this.dataList.map(item => {
          item["show"] = false;
        });
        setTimeout(() => {
          this.noEvent = true;
          this.isClip = true;
        }, 200);
      }, 300);
    },
    mouseenter(index) {
      this.noEvent = false;
      this.isClip = false;
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      this.dataList.map(item => {
        item["show"] = false;
      });
      let item = this.dataList[index];
      item["show"] = true;
      this.$forceUpdate();
    },
    alarmLevelName(name) {
      return name.substring(0, 2);
    },
    psotAlarmData(row, No) {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/level-edit";
      const query = {
        id: row,
        alarmLevel: No
      };
      putAxiosData(url, query).then(
        res => {
          that.getData();
          this.$forceUpdate();
        },
        error => {}
      );
    },
    selectItem(item, index) {
      this.psotAlarmData(item.id, index + 1);
    },
    getData() {
      const that = this;
      const url = that.isFakeData
        ? "/lenovo-alarm/api/alarm/unhandel-list"
        : "/lenovo-alarm/api/alarm/list";
      const query = {
        pageIndex: 1,
        pageRows: 10,
        isDeal: "0",
        deviceName: ""
      };
      getAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          that.itemData = [];
          return false;
        }
        if (that.isFakeData) {
          that.itemData = res.data;
        } else {
          that.itemData = res.data.tableData;
        }
      });
    },
    handleClick(index) {
      this.popData = this.dataList[index];
      this.visible = true;
    },
    handleClose() {
      this.visible = false;
    },
    changeFullScreen(target, index) {
      const that = this;
      let imgtarget = target[index];
      screenfull.toggle(imgtarget);
    }
  },
  mounted() {
    this.getData();
  }
};
</script>
<style lang="scss" scoped>
.historicalwarning {
  .itemData {
    position: relative;
    height: 100px;
    margin-bottom: 10px;
    background: linear-gradient(
      to right,
      transparent 26%,
      #203644 10%
    ); /* 标准的语法（必须放在最后） */
  }
  .noEvent {
    pointer-events: none;
  }
  .clip {
    /*pointer-events: none;*/
    clip: rect(0px, 613px, 99px, 157px);
  }
  .itemData:last-child {
    margin-bottom: 0px;
  }
  .historicalwarningBox {
    width: 136%;
    max-height: 400px;
    overflow-x: visible;
    overflow-y: auto;
    position: relative;
    left: -159px;
  }
  .historicalwarningItem {
    padding-left: 175px;
    width: 100%;
    background: transparent;
    /*background: linear-gradient(to right,transparent 26%, #203644 10%); !* 标准的语法（必须放在最后） *!*/
    position: relative;
    .picDetail {
      position: absolute;
      width: 137px;
      height: 99px;
      left: 4px;
      margin-top: -10px;
      background: pink;
      img {
        width: 137px;
        height: 99px;
      }
      i {
        position: absolute;
        left: 117px;
        bottom: 0;
        cursor: pointer;
      }
    }
  }
  .title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }
  &Box {
    width: 100%;
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  //   &Item {
  //     color: #fff;
  //     font-size: 18px;
  //     padding: 10px;
  //     background: rgba(32, 54, 68, 0.7);
  //     margin-bottom: 10px;
  //     border-radius: 4px;

  //     .threshold {
  //       margin-left: 1.5em;
  //     }
  //     .alarm {
  //       color: #d7203f;
  //     }
  //     .warning {
  //       color: #ff8300;
  //     }
  //     .general {
  //       color: #ffe828;
  //     }
  //   }
  .mainMli {
    margin-top: 20px;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
    position: relative;
    .M_nr{
      .item_n{
        max-width: 338px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
    .itemdetail {
      position: absolute;
      top: 20px;
      right: 20px;
      span {
        display: inline-block;
        padding: 2px 15px;
        border-radius: 3px;
        cursor: pointer;
        font-size: 14px;
        border: 1px solid #fff;
      }
      // span:hover {
      //   color: #5eb0fc;
      //   border: 1px solid #5eb0fc;
      // }
    }
    .itemTitle {
      p {
        font-size: 16px !important;
      }
    }
    .dropAlarmDown {
      margin-right: 20px;
      margin-top: 20px;
      .member_operate_div span {
        font-size: 16px !important;
      }
    }
  }
  .itemTitle {
    margin-bottom: 10px;
    font-size: 16px;
    & > span {
      padding-right: 30px;
    }
    p {
      font-size: 16px;
      .alarm {
        color: #d7203f;
        font-size: 18px;
      }
      .warning {
        color: #ff8300;
        font-size: 18px;
      }
      .general {
        color: #ffe828;
        font-size: 18px;
      }
    }
  }
  .commonly {
    color: #5eb0fc;
    padding-left: 10px;
  }
  .serious {
    color: #ff8300;
    padding-left: 10px;
  }
  .danger {
    color: #d7203f;
    padding-left: 10px;
  }
}
// .HistoricalDocuments .el-dialog__wrapper .el-dialog .el-dialog__body {
//   background: #fff;
// }
</style>
