<template>
  <historical-documents
    class="popuponeinfoBox"
    width="400px"
    :title="itemData.powerDeviceName"
    :isShowTab="false"
    :dialogTableVisible="visible"
    @close="onClose"
  >
    <div class="popuponeinfo">
      <el-row v-if="itemData['type'] == 'phase'">
        <el-col :span="24">
          <p class="itemTitle">
            内容：
            <span>{{itemData['alarmContent']}}</span>
          </p>
        </el-col>
        <el-col :span="24">
          <p class="itemTitle main">
            <img :src="itemData['alarmFileAddress'].split('||')[0]" />
            <span
              :class="{'red':itemData['alarmValue'].split('||')[0].indexOf('\'')>-1}"
            >A相：{{itemData['alarmValue'].split('||')[0].replace('\'','')}}</span>
          </p>
        </el-col>
        <el-col :span="24">
          <p class="itemTitle main">
            <img :src="itemData['alarmFileAddress'].split('||')[1]" />
            <span
              :class="{'red':itemData['alarmValue'].split('||')[1].indexOf('\'')>-1}"
            >B相：{{itemData['alarmValue'].split('||')[1].replace('\'','')}}</span>
          </p>
        </el-col>
        <el-col :span="24">
          <p class="itemTitle main">
            <img :src="itemData['alarmFileAddress'].split('||')[2]" />
            <span
              :class="{'red':itemData['alarmValue'].split('||')[2].indexOf('\'')>-1}"
            >C相：{{itemData['alarmValue'].split('||')[2].replace('\'','')}}</span>
          </p>
        </el-col>
      </el-row>
      <template v-else>
        <el-row>
          <!-- <el-col :span="24">
            <p class="itemTitle">
              设备名称：
              <span>{{itemData.powerDeviceName}}</span>
            </p>
          </el-col>-->
          <el-col :span="24">
            <p class="itemTitle">
              当前状态：
              <span>{{itemData.status}}</span>
            </p>
          </el-col>
          <el-col :span="24">
            <p class="itemTitle">
              内容：
              <span>{{ itemData.alarmContent }}</span>
              <i-dropdown
                      class="iDropDown"
                      trigger="click"
                      placement="bottom-start"
              >
                <div
                        class="table_select"
                        :class="[{'serious': itemData.alarmLevel == 2},{'commonly': itemData.alarmLevel == 1},{'danger': itemData.alarmLevel == 3}]"
                >
                      <span class="member_operate_div" v-if="itemData.alarmLevelName">
                        <span>{{ alarmLevelName }}</span>
                      </span>
                  <i class="iconfont icon-xiala" v-if="itemData.alarmLevelName"></i>
                </div>
                <i-dropdownMenu slot="list">
                  <i-dropdownItem
                          v-for="(item, index) in selectList"
                          :key="index"
                          @click.native="selectItem(itemData, index)"
                  >
                    <div class="alarmLevel">{{ item }}</div>
                  </i-dropdownItem>
                </i-dropdownMenu>
              </i-dropdown>
             <!-- <span
                :class="[itemData.alarmLevel == '1'?'general':(itemData.alarmLevel == '2'?'warning':'alarm')]"
              >{{itemData.alarmLevelName}}</span>-->
            </p>
          </el-col>
          <el-col :span="12">
            <p class="itemTitle alarmTime">
              <span>{{itemData.alarmTime}}</span>
            </p>
          </el-col>
        </el-row>
        <div>
          <div class="imgBox" :class="{'isImg': itemData['alarmFileType'] == 1}">
            <img
              v-if="itemData['alarmFileType'] == 1"
              :src="itemData.alarmFileAddress"
              style="width: 100% !important;"
            />
            <el-tabs class="tabPanel" v-model="activeName2" type="card"    v-if="itemData['alarmFileType'] == 2">
              <el-tab-pane label="实时视频" name="first">
                <video-player
                        class="vjs-custom-skin realtime_video"
                        :options="{
                   width:355,
                  height: 320,
                  sources: sourcesd,
                  techOrder: ['flash'],
                  autoplay: true,
                  controls: false
                  }"
                ></video-player>
              </el-tab-pane>
              <el-tab-pane label="录像" name="second">
                <video-player
                        class="vjs-custom-skin realtime_video"
                        :options="{
                   width:355,
                  height: 320,
                  sources: sources,
                  techOrder: ['flash'],
                  autoplay: true,
                  controls: false
                  }"
                ></video-player>
              </el-tab-pane>
            </el-tabs>
            <!--<p class="itemTitle itemBottomTitle">位置：{{itemData.deviceAddress}}</p>-->
          </div>
        </div>
      </template>
      <el-row>
        <el-col :span="24">
          <p class="itemTitle">
            来源：
            <span style="color: #366590" @click="getJump">{{itemData.source}}</span>
          </p>
        </el-col>
      </el-row>
      <el-row style="position: relative; top: -12px; margin-top: 20px">
        <!--<el-col :span="15"><h5 class="itemTitle time">{{itemData.alarmTime}}</h5></el-col>-->
        <el-col :span="17">
          <div class="buttonAll">
            <el-button type="info" round @click="restoration('1')" style="margin-right: 25px">复归</el-button>
            <el-button type="success" round @click="restoration('0')">备注</el-button>
          </div>
        </el-col>
      </el-row>
      <Remarks :isShow="dialogVisible" :alarmId="alarmId" @beforeClose="beforeClose" />
    </div>
  </historical-documents>
</template>
<script>
import HistoricalDocuments from "_c/duno-c/HistoricalDocuments";
import buttonCustom from "_c/duno-m/buttonCustom";
import videojs from "video.js";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";
import { truncate } from "fs";
import SWF_URL from "videojs-swf/dist/video-js.swf";
import Remarks from "_c/duno-c/Remarks";
import { dealRemarks } from "@/api/configuration/configuration.js";
videojs.options.flash.swf = SWF_URL;
export default {
  name: "popuponeinfo",
  components: { HistoricalDocuments, videoPlayer, buttonCustom, Remarks },
  data() {
    return {
      activeName2: 'first',
      selectList: ["一般", "严重", "危急"],
      itemData: {},
      alarmId: "",
        sources: [{
            src: '',
            type: 'video/mp4'
        }],
        sourcesd: [{
            src: '',
            type: 'application/x-mpegURL'
        }],
      inputValue: "",
      dialogVisible: false
    };
  },
  props: {
    itemDataOption: {},
    itemId: {
      type: String | Number
    },
    visible: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  computed:{
      alarmLevelName(){
          if(this.itemData.alarmLevelName.indexOf('缺陷')>-1)
            return this.itemData.alarmLevelName.substring(0,2)
          else
            return this.itemData.alarmLevelName
      }
  },
  watch: {
      itemDataOption: {
          handler(now) {
              this.itemData = now;
              if(this.itemData['alarmFileAddress']){
                  if (this.itemData['alarmFileAddress'].indexOf("mp4") > -1 || this.itemData['alarmFileAddress'].indexOf("MP4") > -1) {
                      this.sources[0]["type"] = "video/mp4";
                  } else {
                      this.sources[0]["type"] = "application/x-mpegURL";
                  }
                  this.sources[0]["src"] = this.itemData['alarmFileAddress'];
              }
              if(this.itemData['rtmpUrl']){
                  if (this.itemData['rtmpUrl'].indexOf("mp4") > -1 || this.itemData['rtmpUrl'].indexOf("MP4") > -1) {
                      this.sourcesd[0]["type"] = "video/mp4";
                  } else {
                      this.sourcesd[0]["type"] = "application/x-mpegURL";
                  }
                  this.sourcesd[0]["src"] = this.itemData['rtmpUrl'];
              }
              this.$forceUpdate();
              /*  if(now){
                      this.getData()
                  }*/
          },
          deep: true,
          immediate: true
    },
    visible(now) {
      /*  if (now)
          this.getData()*/
    }
  },
  created() {
    // if (this.visible) this.getData()
  },
  methods: {
    selectItem(item, index) {
        this.psotAlarmData(item, index + 1);
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
                  this.$message({
                      type: "success",
                      message: "修改成功"
                  });
                  this.itemData.alarmLevelName = newLevel
                  this.itemData.alarmLevel = No
                  //   this.$emit("updateData");
              },
              error => {}
          );
    },
    getJump() {
      if ("monitorDeviceId" in this.itemData) {
        getAxiosData("/lenovo-device/api/preset/type", {
          monitorDeviceId: this.itemData.monitorDeviceId
        }).then(res => {
          let supportPreset = res.data["supportPreset"];
          let monitorDeviceType = res.data["monitorDeviceType"];
          if (monitorDeviceType == 1) {
            if (supportPreset) {
              this.$router.push({
                path: "/surveillancePath/detailLight",
                query: {
                  monitorDeviceId: this.itemData.monitorDeviceId
                }
              });
            } else {
              this.$router.push({
                path: "/surveillancePath/detailLightN",
                query: {
                  monitorDeviceId: this.itemData.monitorDeviceId
                }
              });
            }
          } else if (monitorDeviceType == 2) {
              if (supportPreset) {
                  this.$router.push({
                      path: "/surveillancePath/detailRed",
                      query: {
                          monitorDeviceId: this.itemData.monitorDeviceId,
                          typeId: res.data["typeId"]
                      }
                  });
              }else{
                  this.$router.push({
                      path: "/surveillancePath/detailRedN",
                      query: {
                          monitorDeviceId: this.itemData.monitorDeviceId,
                          typeId: res.data["typeId"]
                      }
                  });
              }

          } else if (monitorDeviceType == 3) {
            this.$router.push({
              path: "/surveillancePath/detailEnv",
              query: {
                monitorDeviceId: this.itemData.monitorDeviceId
              }
            });
          }
        });
      }
    },
    restoration(type) {
      if (type == "0") {
        this.dialogVisible = true;
        this.alarmId = this.itemData.alarmId;
        return;
      }
      this.$store.state.user.isAlarm = false;
      console.log(type == "1" ? "复归" : "备注");
      // const url = type == '1' ? "/lenovo-alarm/api/alarm/reset" : '/lenovo-alarm/api/alarm/save'
      const url = "/lenovo-alarm/api/alarm/deal";
      const query = {
        alarmId: this.itemData.alarmId,
        type: type
      };
      postAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.msg);
        }
        this.$emit("onRestoration", type);
        this.onClose(false);
        this.$message.success(res.msg);
      });
    },
    getData() {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/unhandel-list";
      const query = {
        pageIndex: 1,
        pageRows: 1,
        isDeal: "0",
        powerDeviceId: that.itemData["powerDeviceId"]
      };
      getAxiosData(url, query).then(res => {
        // if (res.code !== 200 || (res.data.tableData && res.data.tableData.length == 0)) {
        /* that.onClose(false)
          return that.$message.error(res.msg)*/
        // }
        // that.itemData = res.data.tableData[0]
        that.itemData = res.data[0];
      });
    },
    onClose(data) {
      this.$emit("onClose", data);
    },
    beforeClose() {
      this.dialogVisible = false;
    }
  }
};
</script>
<style lang="scss">
  .popuponeinfo{
    .el-tabs__content{
      height: 342px;
    }
    .el-tabs__header{
      top: -2px !important;
    }
  }
</style>
<style lang="scss" scoped>
  .popuponeinfo {
    font-size: 20px;
    font-weight: normal;
    .tabPanel{
      padding-top: 37px;
    }
    .alarmTime{
      color: #95989b !important;
      font-size: 16px !important;
    }
    .iDropDown{
      margin-left: 15px;
    }
    .iconfont.icon-xiala {
      color: white;
      font-size: 10px;
      margin-left: 3px;
    }
    .table_select {
      cursor: pointer;
      color: #1d1f26;
      .member_operate_div {
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
    .red {
      color: red;
    }
    .itemTitle {
      color: #fff;
      font-size: 18px;
      padding: 5px 0;
      &.main {
        display: flex;
        align-items: center;
        img {
          width: 150px;
          height: 85px;
          margin-right: 20px;
        }
      }

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
      font-size: 16px !important;
      padding: 5px 10px;
      background: rgba(0, 0, 0, 0.5);
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .time {
      font-size: 16px;
    }
    .imgBox {
      width: 100%;
      height: 0;
      margin: 20px auto;
      padding-bottom: 100%;
      position: relative;
      &.isImg {
        padding-bottom: 59% !important;
      }
      img {
        width: 100%;
        left: 0;
        bottom: 0px;
        position: absolute;
      }
    }
    .buttonAll {
      text-align: right;
    }
  }
</style>
<style lang="scss">
  .popuponeinfoBox {
    .realtime_video > div {
      /*transform: scale(2.2095, 2.8) !important;*/
      transform-origin: left top;
    }
  }
  .popuponeinfoBox .el-dialog__body {
    padding: 0 20px;
  }
</style>
