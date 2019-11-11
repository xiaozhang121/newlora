<template>
  <div class="inspection" :class="{'miniWidth': topBtnListFlag != 0}">
    <template v-if="panelType == 'first'">
      <div class="title">{{ cameraName }}</div>
      <div class="cameraMaind">
        <div class="btnList">
          <div class="title">
            <div class="name">已设置预置位：</div>
            <div class="select">
              <el-select :disabled="!boatNow" v-model="startPoint" placeholder="请选择">
                <el-option
                  v-for="(item, index) in dataList[0]['dataList']"
                  :key="index"
                  :label="item.name"
                  :value="index"
                ></el-option>
              </el-select>
            </div>
          </div>
          <duno-table
            ref="table"
            style="width: 100%"
            :height="tableHeight"
            v-for="(item, index) in dataList"
            :key="index"
            :columns="columns"
            :dataList="item.dataList"
          ></duno-table>
          <div>
            <div class="cruiseInterval">
              <div class="name">巡航间隔：</div>
              <div style="flex: 1">
                <el-select :disabled="!boatNow" v-model="selectValue" placeholder="请选择">
                  <el-option
                    v-for="item in timeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
              <div style="display: flex; align-items: center">
                <el-radio v-model="radioValue" label="1">单次</el-radio>
                <el-radio v-model="radioValue" label="2">循环</el-radio>
              </div>
            </div>
          </div>
          <div class="presetSwitch">
            <span style="color: white">
              预置位切换：
              <span style="color: #ffd70a">{{ secondLastShow }}s</span>
            </span>
            <el-button
              @click="startBoat"
              class="startBoot"
              type="primary"
            >{{ boatNow?'开始巡航':'暂停巡航' }}</el-button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import {
  getAxiosData,
  putAxiosData,
  postAxiosData,
  deleteDataId
} from "@/api/axiosType";
import dunoTable from "_c/duno-m/table/Table";
import videojs from "video.js";
import clock from "@/assets/camera/clock.png";
import { DunoCharts } from "_c/duno-charts";
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";
import SWF_URL from "videojs-swf/dist/video-js.swf";
videojs.options.flash.swf = SWF_URL;
export default {
  name: "inspection",
  components: { dunoTable, DunoCharts, videoPlayer },
  data() {
    return {
      tableHeight: 0,
      alarm: require("@/assets/demo/alarm.jpg"),
      normal: require("@/assets/demo/normal.jpg"),
      disabled: false,
      sliderValue: 1,
      clock,
      timeRange: "",
      temparams: null,
      dataCharts: [
        {
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: "line"
        }
      ],
      isEdit: false,
      editIndex: -1,
      addPosInput: "",
      flagNow: -1,
      initFlag: 0,
      startPoint: 0,
      secondLast: 2,
      secondLastShow: 2,
      timerMove: null,
      timer: null,
      showTimer: null,
      lightTimer: null,
      movTimer: null,
      boatNow: true,
      radioValue: "1",
      isViwe: false,
      isEdite: false,
      isDel: false,
      selectValue: "3000",
      timeOptions: [
          { value:'3000', label: '3秒/控制位' },
          { value:'6000', label: '6秒/控制位' },
          { value:'9000', label: '9秒/控制位' },
          { value:'12000', label: '12秒/控制位' },
          { value:'15000', label: '15秒/控制位' }
      ],
      play: require("@/assets/camera/play.png"),
      greenPoint: require("@/assets/camera/greenPoint.png"),
      greyPoint: require("@/assets/camera/greyPoint.png"),
      orangePointG: require("@/assets/camera/orangePoint.gif"),
      orangePointP: require("@/assets/camera/orangePoint.png"),
      columns: [
        {
          type: "index",
          title: "序号",
          width: 80,
          isCheck: true,
          align: "center"
        },
        {
          title: "预置位名称",
          key: "name",
          align: "center",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "状态",
          key: "deal",
          align: "center",
          minWidth: 50,
          tooltip: true,
          render: (h, params) => {
            let temp = "";
            if (params.row.flag == "play") temp = this.play;
            else if (params.row.flag == "greenPoint") temp = this.greenPoint;
            else if (params.row.flag == "greyPoint") temp = this.greyPoint;
            else if (params.row.flag == "orangePointG")
              temp = this.orangePointG;
            else if (params.row.flag == "orangePointP")
              temp = this.orangePointP;
            let newArr = [];
            // if (params.row.flag == "play")
            if (this.isViwe) {
                newArr.push(
                h(
                  "Tooltip",
                  {
                    props: { content: "查看" }
                  },
                  [
                    h("el-button", {
                      class: "tableBtnName",
                      style: {
                        backgroundImage: "url(" + temp + ")",
                        backgroundSize: "contain"
                      },
                      on: {
                        click: () => {
                          this.checkPostion(params.row);
                        }
                      }
                    })
                  ]
                )
              );
            }
            // else
            //   newArr.push(
            //     h("el-button", {
            //       class: "tableBtnName",
            //       style: {
            //         backgroundImage: "url(" + temp + ")",
            //         backgroundSize: "contain"
            //       }
            //     })
            //   );
            if (this.isEdite) {
                newArr.push(
              h(
                "Tooltip",
                {
                  props: { content: "编辑" }
                },
                [
                  h("el-button", {
                    class: "tableBtnName",
                    style: { backgroundImage: "url(" + this.edit + ")" },
                    on: {
                      click: () => {
                        this.editTableData(params);
                      }
                    }
                  })
                ]
              )
            );
            }
            if(this.isDel){
                newArr.push(
              h(
                "Tooltip",
                {
                  props: { content: "删除" }
                },
                [
                  h(
                    "el-poptip",
                    {
                      props: {
                        confirm: true,
                        placement: "top-end",
                        title: "您确定删除数据吗?",
                        transfer: true
                      },
                      on: {
                        "on-ok": () => {
                          this.delTableData(params);
                        }
                      }
                    },
                    [
                      h("el-button", {
                        class: "tableBtnName",
                        style: { backgroundImage: "url(" + this.del + ")" }
                      })
                    ]
                  )
                ]
              )
            );
            }
            return h("div", newArr);
          }
        }
      ],
      dataList: [
        {
          dataList: [
          /*  {
              flag: "play",
              ago: false,
              name: "预置位名称A",
              deal: "删除"
            },
            {
              flag: "play",
              ago: false,
              name: "预置位名称B",
              deal: "删除"
            },
            {
              flag: "play",
              ago: false,
              name: "预置位名称C",
              deal: "删除"
            },
            {
              flag: "play",
              ago: false,
              name: "预置位名称D",
              deal: "删除"
            }*/
          ]
        }
      ],
      columnsd: [
        {
          type: "index",
          title: "预置位序号",
          width: 100,
          fixed: "left",
          isCheck: true,
          align: "center"
        },
        {
          title: "预置位名称",
          key: "name",
          align: "center",
          minWidth: 100,
          tooltip: true
        },
        {
          title: "操作",
          key: "deal",
          align: "center",
          minWidth: 100,
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push(
              h(
                "Tooltip",
                {
                  props: { content: "查看" }
                },
                [
                  h("el-button", {
                    class: "tableBtnName",
                    style: { backgroundImage: "url(" + this.play + ")" },
                    on: {
                      click: () => {
                        this.checkPostion(params.row);
                      }
                    }
                  })
                ]
              )
            );
            newArr.push(
              h(
                "Tooltip",
                {
                  props: { content: "编辑" }
                },
                [
                  h("el-button", {
                    class: "tableBtnName",
                    style: { backgroundImage: "url(" + this.edit + ")" },
                    on: {
                      click: () => {
                        this.editTableData(params);
                      }
                    }
                  })
                ]
              )
            );
            newArr.push(
              h(
                "Tooltip",
                {
                  props: { content: "删除" }
                },
                [
                  h(
                    "el-poptip",
                    {
                      props: {
                        confirm: true,
                        placement: "top-end",
                        title: "您确定删除数据吗?",
                        transfer: true
                      },
                      on: {
                        "on-ok": () => {
                          this.delTableData(params);
                        }
                      }
                    },
                    [
                      h("el-button", {
                        class: "tableBtnName",
                        style: { backgroundImage: "url(" + this.del + ")" }
                      })
                    ]
                  )
                ]
              )
            );
            return h("div", newArr);
          }
        }
      ],
      dataListd: [
        {
          dataList: [
            /* {
                                 flag: 'play',
                                 ago: false,
                                 name: '预置位名称A',
                                 deal: '删除'
                             },
                             {
                                 flag: 'play',
                                 ago: false,
                                 name: '预置位名称B',
                                 deal: '删除'
                             }*/
          ]
        }
      ],
      leftBtnList: [
        { name: "云台", active: true },
        { name: "巡航", active: false },
        { name: "预置位", active: false }
      ],
      leftBtnListFlag: 0,
      topBtnList: [
        { name: "实时信息", active: true },
        { name: "历史告警", active: false },
        { name: "历史数据", active: false }
      ],
      topBtnListFlag: 0,
      Wfs: require("@/libs/wfs"),
      xjBtn: require("@/assets/camera/xjBtn.png"),
      xjBtnClick: require("@/assets/camera/xjBtnClick.png"),
      squera: require("@/assets/camera/squera.png"),
      squeraClick: require("@/assets/camera/squeraClick.png"),
      edit: require("@/assets/images/btn/edit.png"),
      del: require("@/assets/images/btn/del.png"),
      operateUrl: {
        play: "/lenovo-visible/api/visible-equipment/stable/play/{deviceId}", // 视频播放
        pause: "/lenovo-visible/api/visible-equipment/stable/pause/{deviceId}", // 暂停
        ptzSet:
          "/lenovo-visible/api/visible-equipment/ptz/direction-adjust/{cmd}/{step}/{flag}/{id}", //
        stop: "/lenovo-visible/api/visible-equipment/stable/stop/{deviceId}" // 停止播放
      },
      playerOptions: {
        width: 720,
        sources: [
          {
            type: "rtmp/flv",
            src: "rtmp://live.hkstv.hk.lxdns.com/live/hks2"
          }
        ],
        techOrder: ["flash"],
        autoplay: true,
        controls: true
      },
      activeNum: -1,
      sliderValueold: 1,
      clearCameraTimer: null
    };
  },
  computed: {
    cameraName() {
      if (this.itemData) return this.itemData["deviceMessage"]["cameraName"];
      else return "";
    }
  },
  watch: {
    selectValue(now) {
      this.resetBoot();
    },
    startPoint(now) {
      const that = this;
      this.initFlag = now;
      this.resetBoot();
    },
    sliderValue(now, old) {
      /*   if(this.clearCameraTimer)
                    return
                if(now < old){
                    this.viewCamera(4, true)
                    this.viewCamera(5, false)
                }else{
                    this.viewCamera(5, true)
                    this.viewCamera(4, false)
                }
                this.clearCameraTimer = setTimeout(()=>{
                    this.cameraSFClear()
                    this.clearCameraTimer = null
                },Math.abs(now - old)*500)*/
    },
    panelType() {
      const that = this;
      this.$nextTick(() => {
        // that.initCamera()
      });
    },
    topBtnListFlag(now) {
      if (now == 0) {
        const that = this;
        this.$nextTick(() => {
          // that.initCamera()
        });
      }
    },
    leftBtnListFlag(now) {
      const that = this;
      this.$nextTick(() => {
        // that.initCamera()
      });
    },
    flagNow(now) {
      const that = this;
      // alert(now)
      console.log(now);
      putAxiosData('/lenovo-iir/device/operate/set/ptz/'+that.deviceId+'?cmd='+10+'&value='+this.dataList[0]['dataList'][now]['number'])
      this.dataList[0]["dataList"][now]["ago"] = true;
      this.dataList[0]["dataList"][now]["flag"] = "orangePointP";
      that.lightTimer = setInterval(() => {
        if (this.dataList[0]["dataList"][now]["flag"] != "orangePointP")
          this.dataList[0]["dataList"][now]["flag"] = "orangePointP";
        else {
          if (this.dataList[0]["dataList"][now]["ago"]) {
            this.dataList[0]["dataList"][now]["flag"] = "greenPoint";
          } else {
            this.dataList[0]["dataList"][now]["flag"] = "greyPoint";
          }
        }
        that.$forceUpdate();
      }, 500);
    }
  },
  props: {
    deviceId: {
      type: [String, Number],
      default: ""
    },
    itemData: {},
    panelType: {
      type: String,
      default: "first"
    },
    num: {},
    showCamera: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  methods: {
    resetBoot() {
      this.flagNow = -1;
      this.boatNow = false;
      this.startBoat();
    },
    alarmNow() {
      this.normal = this.alarm;
      this.$emit("on-alarm");
    },
    cameraSF(now) {
      const that = this;
      if (now == this.sliderValueold) {
        return;
      }
      let old = this.sliderValueold;
      let timeSeed = 190;
      if (now == 1 || now == 20) {
        timeSeed = 300;
      }
      this.disabled = true;
      if (now < old) {
        this.viewCamera(5, false).then(res => {
          setTimeout(() => {
            this.viewCamera(5, true).then(res => {
              that.disabled = false;
            });
          }, Math.abs(now - old) * timeSeed);
        });
      } else {
        this.viewCamera(4, false).then(res => {
          setTimeout(() => {
            this.viewCamera(4, true).then(res => {
              that.disabled = false;
            });
          }, Math.abs(now - old) * timeSeed);
        });
      }
      this.sliderValueold = now;
    },
    cameraSFClear(now) {
      const that = this;
      Promise.all([this.viewCamera(5, true), this.viewCamera(4, true)]).then(
        data => {
          that.disabled = false;
        }
      );
    },
    getListData() {
      const that = this;
      let url = '/lenovo-iir/manager/preset/list?='+ that.deviceId
      getAxiosData(url, { pageNo: 1, pageSize: 9999999 }).then(res => {
        let data = res.data.data.records
        data.map(item => {
          item["flag"] = "play";
        });
        that.dataList[0]["dataList"] = data;
        that.dataListd[0]["dataList"] = data;
      }, error => {
        this.$message.error(error.response.data.message)
      });
    },
    fullScreen() {
      let ele = this.$refs.videoPlayer.$el
        .getElementsByClassName("vjs-fullscreen-control")[0]
        .click();
    },
    checkPostion(data) {
      const that = this;
      let pid = data.number
      let url = '/lenovo-iir/device/operate/set/ptz/'+this.deviceId+'?cmd='+10+'&value='+pid
      putAxiosData(url).then(res=>{
          this.$message.info(res.msg)
      }, error => {
        this.$message.error(error.response.data.message)
      })
    },
    editTableData(params) {
      const that = this;
      that.editIndex = params.index;
      that.addPosInput = params.row.name;
      that.temparams = params;
      that.isEdit = true;
      that.$emit("on-edit", that.addPosInput);
    },
    delTableData(params) {
        const that = this;
        deleteDataId(
            '/lenovo-iir/manager/preset/delete/'+params.row.id
        ).then(res => {
            that.getListData();
            this.$message.info(res.msg)
        });
    },
    addPosition() {
      const that = this;
      if (!that.isEdit) {
        // 增加
        if (that.addPosInput.trim() == "") {
          that.$message.info("请输入新增预置位名称");
          return;
        }
        let tempName = that.addPosInput;
        postAxiosData('/lenovo-iir/manager/preset/add',{'deviceId': that.deviceId, 'name':that.addPosInput}).then(res=>{
            that.getListData()
        }, error => {
          this.$message.error(error.response.data.message)
        })
        that.addPosInput = "";
      } else {
        // 修改
        let temp = that.addPosInput;
        this.$forceUpdate();
        that.addPosInput = "";
        that.isEdit = !that.isEdit;
        putAxiosData('/lenovo-iir/manager/preset/update', { deviceId: that.deviceId, id: that.temparams.row.id.toString(), name:temp }).then(res=>{
            that.getListData()
        }, error => {
          this.$message.error(error.response.data.message)
        })
      }
    },
    startBoat() {
      const that = this;
      this.boatNow = !this.boatNow;
      if (!this.boatNow) {
        clearInterval(that.showTimer);
        if (that.radioValue == 1 && that.allGreen()) {
          that.flagNow = -1;
        }
        if (that.flagNow == -1) {
          that.initGrey();
          that.flagNow = 0;
          that.mvFunc(true);
        } else {
          that.timeoutFun();
        }
        // 查看到期
        that.timer = setInterval(() => {
          that.timeoutFun();
        }, parseInt(that.selectValue));
      } else {
        clearInterval(that.timer);
        clearInterval(that.lightTimer);
        clearInterval(that.movTimer);
        that.dataList[0]["dataList"][that.flagNow]["flag"] = "greenPoint";
      }
    },
    allGreen() {
      const that = this;
      let arr = [];
      arr = that.dataList[0]["dataList"].filter(item => {
        return item["ago"];
      });
      if (that.radioValue == 1) {
        return arr.length == that.dataList[0]["dataList"].length;
      } else {
        return false;
      }
    },
    timeoutFun() {
      const that = this;
      if (
        that.flagNow + 1 < that.dataList[0]["dataList"].length &&
        !that.allGreen()
      ) {
        that.flagNow++;
        if (that.flagNow - 1 >= 0) {
          that.dataList[0]["dataList"][that.flagNow - 1]["flag"] = "greenPoint";
        }
      } else {
        that.dataList[0]["dataList"][that.dataList[0]["dataList"].length - 1][
          "flag"
        ] = "greenPoint";
        if (that.radioValue == 1) {
          if (that.allGreen()) {
            clearInterval(that.timer);
            that.boatNow = true;
            that.dataList[0]["dataList"][that.flagNow]["flag"] = "greenPoint";
            return;
          } else {
            that.flagNow = 0;
          }
        }
        that.flagNow = 0;
        that.dataList[0]["dataList"][0]["flag"] = "greenPoint";
      }
      that.mvFunc();
      that.$forceUpdate();
    },
    mvFunc(flag) {
      const that = this;
      clearInterval(that.lightTimer);
      clearInterval(that.showTimer);
      that.secondLastShow = that.secondLast;
      if (flag) {
        that.flagNow = that.initFlag;
      }
      // 摄像头旋转期间
      that.movTimer = setTimeout(() => {
        clearInterval(that.lightTimer);
        that.dataList[0]["dataList"][that.flagNow]["flag"] = "orangePointG";
      }, that.secondLast * 1000);

      that.secondLastShow--;
      that.showTimer = setInterval(() => {
        that.secondLastShow--;
        if (that.secondLastShow == 0) {
          clearInterval(that.showTimer);
        }
      }, 1000);
    },
    lightFunc() {},
    initGrey() {
      const that = this;
      that.dataList[0]["dataList"].map(item => {
        item["flag"] = "greyPoint";
        item["ago"] = false;
      });
      that.$forceUpdate();
    },
    changeRightActive(index) {
      this.topBtnList.map(item => {
        item["active"] = false;
      });
      this.topBtnList[index]["active"] = true;
      this.topBtnListFlag = index;
      this.$forceUpdate();
    },
    changeLeftActive(index) {
      this.leftBtnList.map(item => {
        item["active"] = false;
      });
      this.leftBtnList[index]["active"] = true;
      this.leftBtnListFlag = index;
      this.$forceUpdate();
    },
    onClose() {
      this.panelType = "none";
      this.$emit("on-close");
    },
    viewCamera(command, flag) {
      this.activeNum = command;
      let value = 20
      let url = "/lenovo-iir/device/operate/ptz"
      return new Promise((resolve, reject) => {
        putAxiosData(url, {deviceId:this.deviceId ,cmd: command, value: value}).then(
          res => {
            resolve(res);
          },
          error => {
            reject(res);
            this.$message.error(error.message);
          }
        );
      });
    },
    initCamera() {
      const that = this;
      that.disabled = true;
      const url = "/lenovo-visible/api/visible-equipment/sdk/rtmp";
      getAxiosData(url, {}).then(res => {
        that.playerOptions.sources[0].src = res.data;
        setTimeout(() => {
          that.viewCamera(5, false).then(res => {
            setTimeout(() => {
              this.viewCamera(5, true).then(res => {
                that.disabled = false;
              });
            }, 5000);
          });
        }, 500);
      });
    }
  },
  created() {
    const that = this;
    that.initCamera(); // 初始化摄像头
    that.getListData(); // 获取表格数据
  },
  mounted() {
    const that = this;
    window.addEventListener("resize", function() {
      console.log(document.querySelector(".contain").offsetHeight);
      that.tableHeight = document.querySelector(".contain").offsetHeight - 170;
    });
    this.$nextTick(() => {
      that.tableHeight = document.querySelector(".contain").offsetHeight - 170;
    });
    this.isViwe = this.getAuthority("10072002");
    this.isEdite = this.getAuthority("10073002");
    this.isDel = this.getAuthority("10074002");
  }
};
</script>

<style lang="scss">
.miniWidth {
  width: 364px !important;
}
.inspection {
  position: relative;
  display: flex;
  padding-bottom: 30px;
  flex-direction: column;
  /*border: 1px solid #04e6e7;*/
  padding: 1px 14px;
  .tableBtnName {
    background-size: contain;
  }
  .el-select .el-input .el-select__caret {
    color: #4b9bc1;
  }
  .el-radio__input.is-checked .el-radio__inner {
    border-color: #4b9bc1;
    background: #4b9bc1;
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: white;
  }
  .presetSwitch {
    width: 100%;
    text-align: right;
    margin-top: 5px;
    .startBoot {
      height: 30px;
      line-height: 10px;
      margin-left: 15px;
    }
  }
  .cruiseInterval {
    display: flex;
    justify-content: center;
    margin: 16px 0;
    .name {
      margin-top: 4px;
      color: white;
      font-size: 15px;
    }
  }
  .vjs-custom-skin {
    transform: scale(0.6);
    transform-origin: left top;
    position: relative;
    left: -7px;
  }
  /*background: rgba(0,39,70,0.8);*/
  .control_slider {
    display: flex;
    position: absolute;
    bottom: -40px;
    width: 100%;
    justify-content: center;
    align-items: center;
    .elSlider {
      padding: 0 10px;
      padding-left: 15px;
      flex: 1;
    }
  }
  .iconList {
    display: flex;
    justify-content: flex-start;
    height: 34px !important;
    span {
      display: flex;
      margin-right: 25px;
      flex: none !important;
      align-items: center;
      text-align: left !important;
    }
    i {
      font-size: 21px;
      margin-right: 7px;
    }
  }
  .el-input--small .el-input__inner {
    background: transparent;
    color: #cccccc;
  }
  .historyAlarm {
    display: flex;
    flex-direction: column;
    .item {
      display: flex;
      margin-bottom: 24px;
      .img {
        position: relative;
        display: flex;
        img {
        }
      }
      .explain {
        display: flex;
        flex-direction: column;
        padding-left: 15px;
        color: white;
        .title {
          font-weight: bold;
          margin-bottom: 7px;
        }
      }
    }
    .item:last-child {
      margin-bottom: 0;
    }
  }
  .element::-webkit-scrollbar {
    display: none;
  }
  .el-input__inner {
    border-color: #409eff !important;
    color: white;
  }
  .el-radio__label {
    color: white;
  }
  .title {
    font-size: 15px;
    color: white;
    margin-top: 5px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    .name {
    }
    .select {
      position: relative;
      top: -4px;
      width: 133px !important;
      .el-select .el-input .el-select__caret {
        color: white !important;
      }
      .el-input__inner {
        font-size: 15px;
        color: white !important;
        border-color: transparent !important;
      }
    }
  }
  .addPosition {
    display: flex;
    .left {
      flex-basis: 300px;
    }
    .right {
      padding-left: 30px;
      flex: 1;
      .table {
        position: relative;
        top: -16px;
      }
    }
    .title {
      margin-bottom: 20px;
      font-size: 14px;
    }
    .input {
      margin: 10px 0;
    }
    .btnEx {
      margin: 15px 0;
      .btnEx_title {
        color: white;
      }
      .btnEx_btn {
        float: right;
      }
    }
  }

  .ivu-table th {
    font-size: 14px!important;
    height: 50px;
  }
}
</style>
