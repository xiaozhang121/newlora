<template>
  <el-popover
    popper-class="promptBox"
    placement="bottom"
    width="440"
    class="alarmBell alarmPopHeader"
    v-model="visible"
    trigger="manual"
  >
    <div @click="visible = !visible" slot="reference" class="header-icon alarmPopHeader">
      <el-badge :max="99" :value="value" :hidden="!isDot" class="alarmPopHeader">
        <i class="iconfont icon-gaojingxinxi alarmPopHeader"></i>
      </el-badge>
    </div>
    <div class="promptContent alarmPopHeader">
      <h3 class="alarmPopHeader">
        当前异常信息
        <span class="DotNum alarmPopHeader" v-if="isDot">{{value}}</span>
        <i @click="visible = !visible" class="iconfont icon-guanbi alarmPopHeader" />
      </h3>
      <div class="promptItemBox alarmPopHeader">
        <div class="itemData alarmPopHeader" v-for="(item, index) in itemData" :key="'alarm'+index">
          <div class="title alarmPopHeader">{{!isFakeData ? item.mainDevice : item.monitorDeviceName}}</div>
          <div class="itemTitle alarmPopHeader">
            <!--<span v-if="!isFakeData">当前温度：{{item.alarmValue}}℃</span>-->
            <!--<span v-if="!isFakeData">超出阈值：{{item.threshold}}</span>-->
            <!--<span v-if="isFakeData">当前状态：{{item.status}}</span>-->
            <span class="alarmPopHeader">{{item.powerDeviceName}}</span>
          </div>
          <!--    <div class="itemTitle">
            <p>缺陷评估：<span :class="[item.alarmLevel == '1'?'general':(item.alarmLevel == '2'?'warning':'alarm')]">{{item.alarmLevelName}}</span></p>
          </div>-->
          <div class="itemTitle alarmPopHeader" v-if="item['isPhaseAlarm'] != 1">
            <p class="alarmPopHeader">
              内容： {{ item.alarmDetailType }}
              <i-dropdown class="dropAlarmDown alarmPopHeader" trigger="click" placement="bottom-start">
                <div
                  class="table_select alarmPopHeader"
                  :class="[{'serious': item.alarmLevel == '2'},{'commonly': item.alarmLevel == '1'},{'danger': item.alarmLevel == '3'}]"
                >
                  <span class="member_operate_div alarmPopHeader">
                    <span class="alarmPopHeader">{{ alarmLevelName(item.alarmLevelName) }}</span>
                  </span>
                  <i class="iconfont icon-xiala alarmPopHeader"></i>
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
            </p>
          </div>
          <div class="itemTitle" v-else>
            <p class="treeList">
              <span
                :class="{'red': item['phaseData'].split('||')[0].indexOf('\'')>-1}"
              >{{ item['phaseData'].split('||')[0].replace('\'','') }}</span>
              <span
                :class="{'red': item['phaseData'].split('||')[1].indexOf('\'')>-1}"
              >{{ item['phaseData'].split('||')[1].replace('\'','') }}</span>
              <span
                :class="{'red': item['phaseData'].split('||')[2].indexOf('\'')>-1}"
              >{{ item['phaseData'].split('||')[2].replace('\'','') }}</span>
            </p>
          </div>
          <div class="itemBottomTitle">
            <el-row>
              <el-col :span="15">{{item.alarmTime}}</el-col>
              <el-col :span="24">
                <div class="buttonAll">
                  <el-button
                    v-if="item['isReturn']"
                    type="info"
                    round
                    @click="restoration(item, '1', index)"
                  >复归</el-button>
                  <el-button type="success" round @click="restoration(item, '2', index)">备注</el-button>
                  <el-button type="info" round @click="toWatch(item)">查看</el-button>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <Remarks :isShow="dialogVisible" :alarmId="alarmId" @beforeClose="beforeClose" />
    </div>
  </el-popover>
</template>

<script>
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType.js";
import { dealRemarks } from "@/api/configuration/configuration.js";
import buttonCustom from "_c/duno-m/buttonCustom";
import Remarks from "_c/duno-c/Remarks";
import { mapState } from "vuex";
export default {
  name: "alarmTip",
  components: {
    buttonCustom,
    Remarks
  },
  data() {
    return {
      selectList: ["一般", "严重", "危急"],
      value: 0,
      visible: false,
      itemData: [],
      isFakeData: false, // 假数据
      dialogVisible: false,
      alarmId: "",
      queryData: null
    };
  },
  computed: {
    ...mapState(["user"]),
    isDot() {
      return this.value > 0;
    },
    isAlarm() {
      return this.$store.state.user.alarmInfo;
    }
  },
  watch: {
    isAlarm: {
      handler(now) {
        this.getData();
      },
      deep: true
    },
    itemData: {
      handler(now) {
        if (now && now.length) {
          this.value = now.length;
        } else {
          this.value = 0;
        }
      },
      deep: true
    }
  },
  methods: {
    toWatch(item){
      let query = {}
      query['alarmId'] = item['alarmId']
      query['type'] = 'alarm'
      if(item['isPhaseAlarm'] == 1){
          query['type'] = 'phase'
      }
      this.$store.state.user.popPanel = true
      getAxiosData("/lenovo-alarm/api/alarm/sendWithType",query).then(res=>{

      })
    },
    beforeClose() {
      this.dialogVisible = false;
    },
    psotAlarmData(row, No) {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/level-edit";
      let oldLevel;
      let newLevel;
      if (No == "1") {
        newLevel = "一般";
      } else if (No == "2") {
        newLevel = "严重";
      } else {
        newLevel = "危急";
      }
      if (row.alarmLevel == "1") {
        oldLevel = "一般";
      } else if (row.alarmLevel == "2") {
        oldLevel = "严重";
      } else {
        oldLevel = "危急";
      }
      const query = {
        id: row.id,
        alarmLevel: No,
        oldLevel: oldLevel,
        newLevel: newLevel,
        userName: this.$store.state.user.userName
      };
      putAxiosData(url, query).then(
        res => {
          that.getData();
        },
        error => {}
      );
    },
    alarmLevelName(name) {
      return name.substring(0, 2);
    },
    selectItem(item, index) {
      this.psotAlarmData(item, index + 1);
    },
    restoration(item, type, index) {
      console.log(type == "1" ? "复归" : "备注");
      this.$store.state.user.isAlarm = false;
      const url = "/lenovo-alarm/api/alarm/deal";
      const query = {
        alarmId: item.alarmId,
        type: type
      };
      if (type == "1") {
        postAxiosData(url, query).then(res => {
          if (res.code !== 200) {
            return this.$message.error(res.msg);
          }
          this.itemData.splice(index, 1);
          this.$message.success(res.msg);
        });
      } else if (type == "2") {
        this.dialogVisible = true;
        this.queryData = query;
        this.alarmId = item.alarmId;
      }
    },
    eventEl(event){
      let path = event.path || (event.composedPath && event.composedPath());
      for(let i=0; i<path.length; i++){
          if(path[i].classList && path[i].classList.length && path[i].classList.contains('alarmBell')){
            this.visible = true
            return
          }
      }
      this.visible = false
      return false
    },
    bindEvent(){
      document.addEventListener('click', this.eventEl)
    },
    getData() {
      const that = this;
      const url = that.isFakeData
        ? "/lenovo-alarm/api/alarm/unhandel-list"
        : "/lenovo-alarm/api/alarm/list";
      const query = {
        pageIndex: 1,
        pageRows: 20,
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
    }
    // clickRemarks() {
    //   const that = this;
    //   that.dialogVisible = false;
    //   let query = {
    //     alarmId: this.queryData.alarmId,
    //     type: "2",
    //     content: this.textarea
    //   };
    //   dealRemarks(query).then(res => {
    //     that.textarea = "";
    //     if (res.data.isSuccess) that.$message.success(res.msg);
    //     else that.$message.error(res.msg);
    //     this.$emit("handleListData");
    //   });
    // }
  },
  beforeDestroy(){
    document.removeEventListener('click', this.eventEl)
  },
  mounted() {
    this.bindEvent()
    this.getData();
  }
};
</script>
<style lang="scss">
.dropAlarmDown {
  margin-left: 5px;
  .serious {
    span {
      background: #f4a723;
    }
  }
  .commonly {
    span {
      background: #5eb0fc;
    }
  }
  .danger {
    span {
      background: #d0011b;
    }
  }
  .table_select {
    cursor: pointer;
    color: #1d1f26;
    .member_operate_div {
      margin-right: 3px;
      span {
        font-size: 14px !important;
      }
    }
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 47px !important;
      height: 24px !important;
      border-radius: 20px;
    }
    &.serious {
      span {
        background: #f4a723;
      }
    }
    &.commonly {
      span {
        background: #5eb0fc;
      }
    }
    &.danger {
      span {
        background: #d0011b;
      }
    }
  }
  .iconfont.icon-xiala {
    color: white;
    font-size: 13px;
    margin-left: 3px;
  }
}
.header-icon {
  color: white;
  position: relative;
  overflow: inherit;

  .el-badge__content {
    border: none;
    background-color: #ce021d;
  }
}
.promptContent {
  h3 {
    font-size: 20px;
    font-weight: normal;
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
      border-bottom-color: rgba(27, 59, 71, 0.7) !important;
    }
  }
  &Content {
    > h3 {
      height: 45px;
      line-height: 45px;
      margin-bottom: 10px;
      padding: 0 15px;
      font-size: 20px;
      font-weight: normal;
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
      .title {
        font-size: 20px;
        font-weight: normal;
        color: #05e0e1;
        margin-bottom: 20px;
      }
      .buttonAll {
        text-align: right;
      }
      .itemTitle {
        margin-bottom: 10px;
        font-size: 16px;
        .treeList {
          .red {
            color: red;
          }
          span {
            margin-right: 15px;
          }
        }
        & > span {
          padding-right: 30px;
        }
        p {
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
      .itemBottomTitle {
        padding-top: 20px;
        color: #999;
        font-size: 16px;
      }
    }
  }
}
</style>