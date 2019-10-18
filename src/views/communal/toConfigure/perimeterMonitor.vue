<template>
  <div class="perimeterMonitorM">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="topTitle">
      <!-- <div>{{ dataForm.monitorDeviceName }}</div> -->
      <div>布控球</div>
      <button-custom :title="btnTitle" @click.native="startHandle"/>
    </div>
    <!--<img-line-panel></img-line-panel>-->
    <div class="ballMonitorItem" v-for="(item, index) in cameraList" :key="index">
      <perimeter-monitor :checkTypeT="checkType" ref="monitorRef" :monitor="item" :zIndex = "index"/>
    </div>
  </div>
</template>

<script>
import imgLinePanel from '_c/duno-m/imgLinePanel'
import buttonCustom from '_c/duno-m/buttonCustom'
import areaSetting from '_c/duno-m/areaSetting'
import perimeterMonitor from '_c/duno-m/perimeterMonitor'
import controlCheck from '_c/duno-m/controlCheck'
import enlarge from "_c/duno-c/enlarge";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import echarts from "_c/duno-c/echarts";
import cover from "_c/duno-c/cover";
import controBtn from "_c/duno-m/controBtn";
import pattery from "_c/duno-m/pattery";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import wraning from "_c/duno-j/warning";
import Remarks from "_c/duno-c/Remarks";
import {
  getAxiosData,
  postAxiosData,
  putAxiosData,
  deleteDataId
} from "@/api/axiosType";
import moment from "moment";
import {
  getVLIght,
  getVType,
  getVGrade,
  getVPreset,
  getVEcharts,
  getPosition
} from "@/api/configuration/configuration.js";
export default {
  name: "perimeterMonitorM",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    KeyMonitor,
    Breadcrumb,
    controBtn,
    DunoTablesTep,
    echarts,
    wraning,
    enlarge,
    Remarks,
    pattery,
    cover,
    controlCheck,
    perimeterMonitor,
    areaSetting,
    imgLinePanel,
    buttonCustom
  },
  data() {
    const that = this;
    return {
      checkType: false,
      demoList: [{},{},{}],
      lockPress: false,
      addOrEdit: "添加",
      disabled: false,
      mixinViewModuleOptions: {
        getDataListURL: "/lenovo-alarm/api/security/list",
        exportURL: "/lenovo-alarm/api/security/history/export"
      },
      videoList: [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      titleTypeL: "全部数据类型",
      titleTypeR: "全部异常类型",
      isControl: "1",
      currentTime: 10,
      isCamera: true, //是否点击拍照
      isShowBox: false, //框选div是否显示
      isMonitor: true, //是否开始监控
      isDraw: false, //是否允许画div
      isStart: false, //是否框选div了
      controlAble: true, //左侧按钮是否可控
      clickFlage: 0,
      startPointX: null,
      endPointX: null,
      startPointY: null,
      endPointY: null,
      x0: null,
      y0: null,
      x1: null,
      y1: null,
      pageCurrent: 1,
      totalRows: 20,
      shotData: [],
      imgsrc: "",
      timeOut: null,
      srcData: [],
      pageSizeVideo: "8",
      echartTitle: "",
      alarmId: "",
      isEnlarge: false,
      dialogVisible: false,
      queryForm: {},
      dataForm: {},
      echartForm: {},
      echartData: [],
      typeList: [],
      alarmLevel: "",
      visible: false,
      popData: {},
      columns: [
        {
          title: "拍摄时间",
          key: "alarmTime",
          minWidth: 100,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay = params.row.alarmTime.slice(5);
            return h("div", [
              h(
                "Tooltip",
                {
                  props: { placement: "top", content: timeDay, transfer: true },
                  style: {
                    display: "inline-block",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }
                },
                timeDay
              )
            ]);
          }
        },
        {
          title: "告警类型",
          key: "alarmDetailType",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "处理记录",
          key: "dealType",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h("div", params.row.dealList[0].dealType);
          }
        },
        {
          title: "处理时间",
          key: "dealTime",
          minWidth: 90,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let timeDay = params.row.dealList[0].dealTime.slice(5);
            return h("div", timeDay);
          }
        },
        {
          title: "视频/图片",
          key: "id",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            if (params.row.fileType == "1") {
              newArr.push([
                h("img", {
                  class: "imgOrMv",
                  attrs: { src: params.row.pic },
                  draggable: false,
                  on: {
                    click: () => {
                      that.isEnlarge = true;
                      that.srcData = params.row;
                    }
                  }
                })
              ]);
            } else if (params.row.fileType == "2") {
              newArr.push([
                h("video", {
                  class: "imgOrMv",
                  attrs: { src: params.row.alarmFileAddress },
                  draggable: false,
                  on: {
                    click: () => {
                      that.isEnlarge = true;
                      that.srcData = params.row;
                    }
                  }
                })
              ]);
            }
            return h("div", newArr);
          }
        },
        {
          title: "自动/手动",
          key: "sourceType",
          width: 120,
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          width: 200,
          align: "center",
          render: (h, params) => {
            let newArr = [];
            if (params.row.isReturn == "0") {
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: { background: "#305e83!important" },
                    props: { type: "text" },
                    on: {
                      click: () => {
                        that.addReturn(params.row);
                      }
                    }
                  },
                  "复归"
                )
              );
            }
            if (params.row.isReturn == "1") {
              newArr.push(
                h(
                  "el-button",
                  {
                    class: "btn_pre",
                    style: {
                      background: "#979797",
                      color: "#767676",
                      pointerEvents: "none"
                    },
                    props: { type: "text" }
                  },
                  "已复归"
                )
              );
            }
            newArr.push(
              h(
                "el-button",
                {
                  class: "btn_pre",
                  style: { background: "#3a81a1!important" },
                  props: { type: "text" },
                  on: {
                    click: () => {
                      this.alarmId = params.row.alarmId;
                      this.dialogVisible = true;
                    }
                  }
                },
                "备注"
              )
            );
            return h("div", newArr);
          }
        },
        {
          title: " ",
          key: "id",
          width: 90,
          align: "center",
          render: (h, params) => {
            const that = this;
            let newArr = [];
            newArr.push([
              h(
                "el-button",
                {
                  class: "table_link",
                  style: { marginRight: "20px" },
                  props: { type: "text" },
                  on: {
                    click: () => {
                      that.handleNotes = [];
                      that.handleNotes.push({
                        dealTime: params.row.dealTime,
                        dealType: params.row.dealRecord
                      });
                      that.alarmType = params.row.alarmType;
                      that.popData = params.row;
                      that.alarmLevel = params.row.alarmLevel;
                      that.visible = true;
                      that.$forceUpdate();
                    }
                  }
                },
                "详情"
              )
            ]);
            return h(
              "div",
              {
                class: "flexPos"
              },
              newArr
            );
          }
        }
      ],
      playerOptions: {
        streamAddr: "",
        autoplay: true
      },
      presetName: "",
      allDataKind: [],
      allDataLevel: [],
      dataTime: "",
      dataTimeD: "",
      dataBread: [{ name: "统一配置" }],
      pageParam: {
        pageIndex: 1,
        totalRows: 1
      },
      isLock: 0,
      timeData: "",
      cameraList: []
    };
  },
  computed:{
      btnTitle(){
          if(this.checkType){
              return  '撤防'
          }else{
              return '开始监测'
          }
      }
  },
  watch: {
    isLock(now) {
      if (now) {
        this.controlAble = true;
        this.isMonitor = false;
        this.isShowBox = true;
        this.isCamera = false;
      }
    }
  },
  props: {
    deviceId: {
      type: [String, Number],
      default: "54"
    }
  },
  methods: {
    startHandle(){
        if(this.checkType){
            this.planEnd()
        }else{
            this.planStart()
        }
    },
    planEnd(){
        postAxiosData('/lenovo-plan/api/unified/plan/stop',{planId: '', plUnifiedTaskDtos: ''}).then(res=>{
            this.checkType = !this.checkType
        })
    },

    handleData(arr){
        let line = ""
        for(let i=0; i<arr.length; i++){
            for(let j=0; j<arr[i].length; j++){
                if(line){
                    line+=':'
                }
                if(arr[i][j+1]){
                    line+=arr[i][j].x+':'+arr[i][j].y+":"+arr[i][j+1].x+":"+arr[i][j+1].y
                }
            }
            if(i+1 != arr.length)
            line+="|"
        }
        line = line.replace(/:\|:/g,'|')
        line = line.substring(0, line.length-1)
        return line
    },
    planStart(){
       let dom = this.$refs.monitorRef
       let data = []
       for(let i=0; i<dom.length; i++){
          if(dom[i].drawArealist.length == 0){
              this.$message.info('请设定所有区域')
              return
          }
          data.push(dom[i].drawArealist)
       }
       let line = this.handleData(data)
       postAxiosData('/lenovo-plan/api/unified/plan/start',{planId: '', plUnifiedTaskDtos: '', areaRect: line}).then(res=>{
           this.checkType = !this.checkType
       })
    },
    initData(){
        getAxiosData('/lenovo-plan/api/unified/plan/task/detail',{planId: this.dataForm.planId}).then(res=>{
            this.cameraList = res.data.cameraList
        })
    },
    onDisable(flag){
        if(!this.controlAble){
            this.controlAble = flag
        }
    },
    getCoordinate(type, w0, w1, h0, h1, x0, y0) {
      let obj = { x: 0, y: 0 };
      // 原始-->页面
      if (type) {
        obj["x"] = (w0 / w1) * x0;
        obj["y"] = (h0 / h1) * y0;
      } else {
        // 页面-->原始
        obj["x"] = (w1 / w0) * x0;
        obj["y"] = (h1 / h0) * y0;
      }
      return obj;
    },
    getVideo(pageIndex) {
      let index = 1;
      if (pageIndex) {
        index = pageIndex;
      }
      getAxiosData("/lenovo-device/device/video/record/videos", {
        startTime: this.timeData,
        endTime: this.timeData,
        pageIndex: index,
        pageRows: 10,
        monitorDeviceId: this.dataForm.monitorDeviceId
      }).then(res => {
        let data = res.data.tableData;
        this.videoList = data;
        data.forEach((item, index) => {
          postAxiosData("/lenovo-device/device/video/record/video/pic", {
            videoPath: item["streamAddr"],
            positionIndex: index
          }).then(res => {
            this.videoList[res.data["positionIndex"]]["pic"] = res.data.pic;
            this.$forceUpdate();
          });
        });
        this.pageParam = res.data.pageParam;
      });
    },
    closeEnlarge() {
      this.isEnlarge = false;
    },
    onEdit(name) {
      this.presetName = name;
      this.addOrEdit = "编辑";
    },
    addPoint() {
      this.$refs.inspectionRef.addPosInput = this.presetName;
      this.$refs.inspectionRef.addPosition();
      this.addOrEdit = "添加";
      this.presetName = "";
    },
    addReturn(row) {
      const that = this;
      const query = {
        alarmId: row.alarmId,
        type: "1"
      };
      dealRemarks(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
        this.getDataList();
      });
    },
    initCamera() {
      const that = this;
      that.controlAble = false;
      const url =
        "/lenovo-visible/api/visible-equipment/sdk/rtmp/" +
        this.dataForm.monitorDeviceId;
      getAxiosData(url, {}).then(res => {
        that.playerOptions.streamAddr = res.data;
     /*   that.$nextTick(() => {
          setTimeout(() => {
            this.$refs.controBtnRef.viewCamera(5, false).then(res => {
              setTimeout(() => {
                this.$refs.controBtnRef.viewCamera(5, true).then(res => {
                  that.controlAble = false;
                });
              }, 5000);
            });
          }, 500);
        });*/
      });
    },
    beforeClose() {
      this.dialogVisible = false;
    },
    cutOut(data) {
      if (data) {
        const index = data.indexOf("缺陷");
        if (index > -1) {
          data = data.substring(0, index);
        }
        return data;
      } else {
        return "更多";
      }
    },
    onClickDropdown(row, type, No) {
      const index = row._index;
      this.dataList[index].alarmLevelName = type;
      this.dataList[index].alarmLevel = No;
      let oldLevel;
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
        newLevel: type,
        userName: this.$store.state.user.userName
      };
      getVLIght(query).then(
        res => {
          if (res.code !== 200) {
            this.dataList[index].alarmLevel = row.alarmLevel;
            this.dataList[index].alarmLevelName = row.alarmLevelName;
            return that.$message.error(res.msg);
          }
          that.$message.success(res.msg);
        },
        error => {
          this.dataList[index].alarmLevel = row.alarmLevel;
          this.dataList[index].alarmLevelName = row.alarmLevelName;
        }
      );
    },
    onSelect(item, index) {
      this[item.title] = item["describeName"];
      if (item.title == "titleTypeL") {
        this.dataForm.dataType = item.monitorDeviceType;
        this.getDataList();
      } else if (item.title == "titleTypeR") {
        this.dataForm.alarmLevel = item.monitorDeviceType;
        this.getDataList();
      }
    },
    onChangeHis(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.dataForm.startTime = startTime;
      this.dataForm.endTime = endTime;
      this.getDataList();
    },
    getSelectType() {
      getVType().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeL"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有数据类型",
          monitorDeviceType: "",
          title: "titleTypeL"
        });
        this.allDataKind = map;
      });
    },
    getSelcetGrade() {
      getVGrade().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeR"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有异常等级",
          monitorDeviceType: "",
          title: "titleTypeR"
        });
        this.allDataLevel = map;
      });
    },
    getSelectPreset() {
      getPosition().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: "titleTypeR"
          };
          return obj;
        });
        this.typeList = map;
      });
    },
    clickExcel() {
      const that = this;
      that.queryForm.monitorDeviceId = this.$route.query.monitorDeviceId;
      that.exportHandle();
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    getInit() {
      let time = moment()
        .add(-1, "days")
        .format("YYYY-MM-DD");
      this.echartForm.startTime = `${time} 00:00:00`;
      this.echartForm.endTime = `${time} 23:59:59`;
      this.echartTitle = moment()
        .add(-1, "days")
        .format("YYYY/MM/DD");
    },
    getControl() {
      if (this.isControl == "1") {
        this.isControl = "2";
        this.endControl();
      } else if (this.isControl == "2" || this.isControl == "3") {
        this.isControl = "1";
      }
    },
    endControl() {
      if (this.isControl == "2") {
        let that = this;
        let num = 10;
        clearInterval(that.timeOut);
        that.timeOut = setInterval(function() {
          that.isControl = "3";
          let countDown = setInterval(function() {
            that.currentTime--;
            num--;
            if (num == 0) {
              clearInterval(countDown);
              that.isControl = "1";
            }
          }, 1000);
        }, 1000 * 60 * 5);
      }
    },
    sizeChange(item) {
      this.getVideo(item);
      // this.getDataList();
    },
    getMonitorDeviceName() {
      const that = this;
      let url = "/lenovo-device/api/device-monitor/device";
      let query = {
        monitorDeviceId: this.$route.query.monitorDeviceId
      };
      getAxiosData(url, query).then(res => {
        this.dataForm.monitorDeviceName = res.data.deviceName;
        this.isLock = Number(res.data.isLock);
        this.imgsrc = res.data.imgAddress;
        let img = new Image();
        img.src = this.imgsrc;
        let w1 = 0;
        let h1 = 0;
        img.onload = function() {
          w1 = img.width;
          h1 = img.height;
          let w0 = document.querySelector(".calibration").offsetWidth;
          let h0 = document.querySelector(".calibration").offsetHeight;
          let ww1 = Math.abs(res.data.x0 - res.data.x1);
          let hh1 = Math.abs(res.data.y0 - res.data.y1);
          let point = that.getCoordinate(
            1,
            w0,
            w1,
            h0,
            h1,
            res.data.x0,
            res.data.y0
          );
          let whData = that.getCoordinate(1, w0, w1, h0, h1, ww1, hh1);
          document.querySelector("#boxImg").style.left = point.x + "px";
          document.querySelector("#boxImg").style.top = point.y + "px";
          document.querySelector("#boxImg").style.width = whData.x + "px";
          document.querySelector("#boxImg").style.height = whData.y + "px";
        };
      });
    },
    changeDate(now) {
      let data = "";
      if (now) {
        data = moment(now).format("YYYY-MM-DD");
      } else {
        data = "";
      }
      this.timeData = data;
      this.getVideo();
    },
    handleCamare() {
      let that = this;
      let url = "/lenovo-device/api/stream/snapshoot";
      let query = {
        rtmpUrl: that.playerOptions.streamAddr
      };
      postAxiosData(url, query).then(res => {
        that.shotData = res.data;
        that.imgsrc = `http://10.0.10.35:8100/lenovo-storage/api/storageService/file/imgFile?bucketName=${that.shotData.cephBucket}&fileName=${that.shotData.cephFileName}`;
      });
      that.isCamera = false;
      that.controlAble = false;
    },
    changeCamare() {
      this.isCamera = true;
      this.isMonitor = true;
      this.controlAble = true;
      this.imgsrc = "";
      this.clearDraw();
      let url = `/lenovo-storage/api/storageService/file/deleteFile?bucketName=${this.shotData.cephBucket}&fileName=${this.shotData.cephFileName}`;
      deleteDataId(url).then(res => {
        this.$message({
          type: "success",
          message: "删除成功"
        });
      });
    },
    handleDraw() {
      this.isDraw = true;
    },
    clearDraw() {
      this.isDraw = false;
      this.isShowBox = false;
      this.isStart = false;
      this.$refs.box.style.width = null;
      this.$refs.box.style.height = null;
    },
    handleStart() {
      let that = this;
      //   debugger;
      console.log(!that.isShowBox, !that.isStart);
      if (!that.isStart) {
        this.$message({
          message: "请先设定区域",
          type: "warning"
        });
        return;
      }
      that.isDraw = false;
      let url = "/lenovo-device/api/monitor/ball-control/start";
      let img = new Image();
      img.src = this.imgsrc;
      let w1 = 0;
      let h1 = 0;
      img.onload = function() {
        w1 = img.width;
        h1 = img.height;
        let w0 = document.querySelector(".calibration").offsetWidth;
        let h0 = document.querySelector(".calibration").offsetHeight;
        let startPoint = that.getCoordinate(
          0,
          w0,
          w1,
          h0,
          h1,
          that.startPointX,
          that.startPointY
        );
        let endPoint = that.getCoordinate(
          0,
          w0,
          w1,
          h0,
          h1,
          that.endPointX,
          that.endPointY
        );
        let query = {
          monitorDeviceId: that.$route.query.monitorDeviceId,
          /*     fileName: that.shotData.cephFileName,
                   bucketName: that.shotData.cephBucket,*/
          imgAddress: that.imgsrc,
          x0: startPoint.x,
          y0: startPoint.y,
          x1: endPoint.x,
          y1: endPoint.y
        };
        postAxiosData(url, query).then(res => {
          if (res.data.isSuccess) {
            that.isMonitor = false;
            this.$message({
              type: "success",
              message: "开始监控标定区域"
            });
          }
        });
      };
    },
    handleEnd() {
      let that = this;
      that.isDraw = true;
      that.isMonitor = true;
      let url = "/lenovo-device/api/monitor/ball-control/end";
      let query = {
        monitorDeviceId: that.$route.query.monitorDeviceId
      };
      postAxiosData(url, query).then(res => {
        if (res.data.isSuccess) {
          this.$message({
            type: "success",
            message: "结束监控"
          });
        }
      });
    },
    clearCan() {
      this.imgsrc = "";
      this.$refs.box.style.width = null;
      this.$refs.box.style.height = null;
      this.isCalibrat = true;
      this.selectValue = "";
      this.textarea = "";
      this.props.lazyLoad = null;
    },
    getFirstCode(e) {
      if (this.clickFlage == 0 && !this.isDraw) {
        this.$message({
          type: "warning",
          message: "请先点击设定区域"
        });
      }
      if (this.isShowBox) {
        this.$message({
          type: "warning",
          message: "清空后再绘制"
        });
        return;
      }
      if (this.clickFlage == 0 && this.isDraw) {
        this.isShowBox = true;
        this.isStart = true;
        this.$nextTick(() => {
          this.$refs.box.style.width = null;
          this.$refs.box.style.height = null;
          this.startPointX = e.offsetX;
          this.startPointY = e.offsetY;
          this.$refs.box.style.left = this.startPointX + "px";
          this.$refs.box.style.top = this.startPointY + "px";
          this.clickFlage = 1;
        });
      }
    },
    getEndCode(e) {
      if (this.clickFlage == 1) {
        this.endPointY = e.offsetY;
        this.endPointX = e.offsetX;
        this.clickFlage = 0;
      }
    },
    getCircle(e) {
      if (this.clickFlage == 1) {
        let width = Math.abs(e.offsetX - this.startPointX);
        let height = Math.abs(e.offsetY - this.startPointY);
        if (e.offsetY - this.startPointY <= 0) {
          this.$refs.box.style.top = e.offsetY + "px";
        } else {
          this.$refs.box.style.top = this.startPointY + "px";
        }
        if (e.offsetX - this.startPointX <= 0) {
          this.$refs.box.style.left = e.offsetX + "px";
        } else {
          this.$refs.box.style.left = this.startPointX + "px";
        }
        this.$refs.box.style.width = width + "px";
        this.$refs.box.style.height = height + "px";
      }
    }
  },
  created() {
    this.dataForm.planId = this.$route.query.planId;
    this.getMonitorDeviceName();
    this.getDataList();
    this.initCamera();
    this.getVideo();
    this.initData()
  },
  mounted() {
    this.getInit();
    this.getSelectType();
    this.getSelcetGrade();
    this.getSelectPreset();
    this.lockPress = this.getAuthority("10075002")
    window.addEventListener("onmousemove", this.endControl());
    document.querySelector(".mainAside").style.height = "inherit";
    document.querySelector(".mainAside").style.minHeight = "100%";
    /* setTimeout(()=>{
        this.controlAble = true
        this.isMonitor =  false
        this.isShowBox =  true
        this.isCamera = false
    },4000)*/
  },
  beforeDestroy() {
    document.querySelector(".mainAside").style.height = "calc(100% - 80px)";
    document.querySelector(".mainAside").style.minHeight = "inherit";
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.perimeterMonitorM {
  width: 100%;
  min-height: 100%;
  padding-bottom: 100px;
  .ballMonitorItem{
    padding-bottom: 25px;
  }
  .controlCheck{
    right: 0;
    width: 211px;
    color: white;
    top: -35px;
  }
  .el-input--small .el-input__inner {
    border-radius: 5px;
    width: 100%;
    line-height: 40px;
    color: #fff;
    height: 40px;
    border: none;
    background-color: #192f41;
  }
  .control_slider {
    width: 94%;
    position: absolute;
    height: 8%;
    top: calc(100% + 9%);
    left: 3%;
    .iconfont {
      color: white;
    }
  }
  .breadcrumb {
    margin-bottom: 20px;
  }
  .exportExcel {
    font-size: 16px;
  }
  .imgOrMv {
    width: 50%;
    height: 35px;
    position: relative;
    top: 2px;
  }
  .flexPos {
    .el-button {
      background: rgba(0, 0, 0, 0);
      border: none;
    }
  }
  .table_link {
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .table_select {
    cursor: pointer;
    color: #fff;
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 30px;
      border-radius: 20px;
    }
    &.serious {
      span {
        background: #f4a723;
        color: #1d1f26;
      }
    }
    &.commonly {
      span {
        background: #5eb0fc;
        color: #1d1f26;
      }
    }
    &.danger {
      span {
        background: #d0011b;
        color: #1d1f26;
      }
    }
  }
  .topTitle {
    overflow: hidden;
    line-height: 40px;
    display: flex;
    justify-content: space-between;
    & > div {
      color: #fff;
      float: left;
    }
    .Battery {
      margin-left: 38%;
      display: flex;
      & > div {
        margin-left: 10px;
      }
    }
  }
  .content {
    display: flex;
    .left {
      width: 75%;
      &.nr {
        display: flex;
        flex-direction: column;
        padding-bottom: 3px;
        position: relative;
        .item {
          background: #132838;
          display: flex;
          .camera_surveillanceDetail {
            width: 68%;
            .contain {
              position: relative;
              width: 100%;
              padding-bottom: 56%;
              background: black;
              .monitor {
                position: absolute;
                width: 100% !important;
                top: 0;
                left: 0;
              }
            }
          }
          .control {
            position: relative;
            display: flex;
            margin-left: 3.4%;
            flex-direction: column;
            justify-content: center;
            width: 25%;
            .controBtnContain {
              margin-bottom: 26%;
            }
            .controlTitle {
              overflow: hidden;
              color: #fff;
              margin-bottom: 10px;
              & > div {
                float: left;
              }
              & > div:first-child {
                font-size: 14px;
                width: 100%;
              }
              .controlT {
                font-size: 14px;
                color: #fff;
                text-align: center;
                & > span:last-child {
                  font-size: 14px;
                  text-align: center;
                  cursor: pointer;
                  display: inline-block;
                  width: 90px;
                  line-height: 32px;
                  background: #305e83;
                  border-radius: 16px;
                  margin-left: 10px;
                }
                i {
                  color: #ffcc30;
                  font-style: normal;
                }
              }
            }
          }
        }
      }
    }
    .right {
      width: 25%;
      padding: 20px;
      margin-left: 20px;
      background: #132838;
    }
    .areaTitle {
      color: #fff;
      display: flex;
      justify-content: space-between;
      i {
        cursor: pointer;
      }
      i:hover {
        color: #5fafff;
      }
    }
    .iconControl {
      float: right;
      color: #fff;
      font-size: 14px;
      i {
        padding-left: 20px;
      }
      span {
        cursor: pointer;
        padding-left: 5px;
      }
    }
    .calibration {
      margin-top: 10%;
      width: 100%;
      background-color: #000;
      padding-bottom: 56.25%;
      height: 0;
      position: relative;
      p {
        padding-top: 20%;
        color: #fff;
        font-size: 14px;
        text-align: center;
      }
      & > p:nth-child(2) {
        padding-top: 0;
      }
      img {
        width: 100%;
        height: 100%;
        position: absolute;
        display: block;
      }
      //   .shotImg {
      //     width: 100%;
      //     height: 100%;
      //     img {
      //       width: 100%;
      //       height: 100%;
      //       display: block;
      //     }
      //   }
    }
    .buttonC {
      display: flex;
      justify-content: center;
      span {
        margin: 20px 10px 0;
        cursor: pointer;
        display: block;
        line-height: 40px;
        width: 139px;
        color: #fff;
        text-align: center;
        background-image: url(../../../assets/images/btn/moreBtn.png);
      }
    }
  }
  .middle_table {
    margin-top: 20px;
    width: 100%;
    min-height: 300px;
    .top {
      color: #ffffff;
      height: 40px;
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
      .name {
        align-items: center;
        display: flex;
        flex: 1;
      }
      & > .select {
        display: flex;
        & > div {
          margin-right: 10px;
          .dunoBtnTop {
            width: 170px;
            position: relative;
            left: 10px;
            display: inline-flex;
            padding-bottom: 0;
            .btnList {
              top: inherit !important;
              width: 160px;
              .title {
                padding: 8px 20px;
              }
            }
          }
        }
      }
      .btn {
        display: flex;
        & > div {
          margin-left: 10px;
        }
        & > div:nth-child(2) {
          & > div {
            width: 140px;
            line-height: 40px;
            text-align: center;
            background-color: #192f41;
            cursor: pointer;
          }
        }
        .clickBtn {
          line-height: 40px;
          width: 139px;
          background-image: url(../../../assets/images/btn/moreBtn.png);
          text-align: center;
          font-size: 18px;
          color: #ffffff;
        }
        .dateChose {
          .el-date-editor {
            background-color: #192f41;
            border: none;
            .el-range-input {
              background-color: rgba(81, 89, 112, 0);
            }
            .el-range-separator {
              font-size: 20px;
              color: #fff;
            }
            .el-range-input {
              color: #fff;
            }
          }
          .el-range-editor--small.el-input__inner {
            height: 40px !important;
          }
          .el-range-editor--small .el-range__icon,
          .el-range-editor--small .el-range__close-icon {
            line-height: 35px;
          }
          .el-range-editor--small .el-range-input {
            font-size: 16px;
          }
        }
      }
    }
    .video {
      background: #132838;
      min-height: 400px;
      padding: 20px 0 20px 20px;
      & > div:first-child {
        overflow: hidden;
      }
      .videoItem {
        float: left;
        width: calc(20% - 20px);
        margin-right: 20px;
        margin-bottom: 20px;
        .cover {
          min-height: 196px;
          @media screen and (min-width: 3500px) {
            min-height: 150px;
          }
        }
        p {
          margin-top: 5px;
          color: #fff;
          text-align: center;
        }
      }
      .el-pagination {
        text-align: center;
      }
      .el-pager li {
        background: rgba(0, 0, 0, 0);
        color: #fff;
      }
      .el-pager li.active {
        color: #5fafff;
        border-bottom: 1px solid #2d8cf0;
      }
      .el-pagination .btn-prev,
      .el-pagination .btn-next {
        background-color: rgba(0, 0, 0, 0);
        color: #ffffff;
      }
    }
  }
  .btn_pre {
    padding: 10px 20px;
    cursor: pointer;
    border: none;
    border-radius: 20px;
    @media screen and (min-width: 3500px) {
      padding: 6px 12px;
    }
  }
  //-------------------表格样式
  .dunoMain {
    height: inherit;
  }
  .ivu-table {
    font-size: 16px;
  }
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    background-color: #2d5980 !important;
    font-size: 18px;
    font-weight: normal;
  }
  .ivu-page {
    text-align: center;
    .ivu-page-total {
      display: none;
    }
    .ivu-page-item-jump-next:after,
    .ivu-page-item-jump-prev:after {
      color: white;
    }
    .ivu-page-next,
    .ivu-page-prev {
      background: transparent;
      display: none;
      border: none;
    }
    .ivu-page-item {
      background: transparent !important;
      border: none !important;
      min-width: 16px;
      height: 28px;
      a {
        color: white;
      }
    }
    .ivu-page-options {
      display: none;
    }
    .ivu-page-item-active {
      border-bottom: 1px solid #2d8cf0 !important;
      border-radius: 0;
      a {
        color: #2d8cf0;
      }
    }
  }
  .ivu-table-wrapper {
    tr {
      td {
        height: 48px;
      }
    }
    tr:nth-child(odd) {
      td {
        background: rgba(0, 0, 0, 0) !important;
      }
    }
    tr:nth-child(even) {
      td {
        background-color: #2a526c;
      }
    }
  }
  .ivu-select-dropdown {
    background: white !important;
  }
  .ivu-table-small td {
    background: black;
  }
  //------------------
}
.el-popper[x-placement^="bottom"] {
  background: #192f41;
  border: none;
}
.el-popper[x-placement^="top"] {
  background: #192f41;
  border: none;
}
#boxImg {
  position: absolute;
  background: none;
  border: 1px solid red;
  pointer-events: none;
}
</style>
