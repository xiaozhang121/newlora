<template>
  <div class="ballControlM">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="topTitle">
      <!-- <div>{{ dataForm.monitorDeviceName }}</div> -->
      <div>布控球</div>
      <div class="Battery">
        <div :style="{visibility: isMonitor?'hidden':'visible'}">正在巡视中</div>
        <pattery />
      </div>
    </div>
    <div class="Main_contain">
      <div class="content">
        <div class="left nr">
          <div class="item">
            <div class="camera_surveillanceDetail">
              <div class="contain">
                <key-monitor
                  :monitorInfo="{ monitorDeviceId: dataForm.monitorDeviceId }"
                  paddingBottom="56%"
                  class="monitor"
                  :autoplay="playerOptions.autoplay"
                  :streamAddr="playerOptions.streamAddr"
                  :showBtmOption="false"
                  :Initialization="true"
                ></key-monitor>
              </div>
            </div>
            <div class="control">
              <div class="controBtnContain">
                <contro-btn
                  :controlAble="controlAble"
                  url="/lenovo-device/api/monitor/ptz/direction-adjust/{cmd}/{step}/{flag}/{id}"
                  :disabledOption="disabled"
                  ref="controBtnRef"
                  :deviceId="dataForm.monitorDeviceId"
                />
              </div>
              <!-- <div class="controlTitle">
                <div v-if="isControl =='1'" class="controlT">
                  <span>云台控制中</span>
                  <span @click="getControl">获取控制权</span>
                </div>
                <div v-if="isControl =='2'" class="controlT">
                  <span>已获取云台控制</span>
                  <span @click="getControl">结束控制</span>
                </div>
                <div v-if="isControl =='3'" class="controlT">
                  <span>结束控制倒计时</span>
                  <i>{{ currentTime }} s</i>
                  <span @click="getControl">结束控制</span>
                </div>
              </div>-->
            </div>
          </div>
          <control-check
            @on-disable="onDisable"
            ref="controlCheckRef"
            v-if="dataForm.monitorDeviceId && lockPress"
            :deviceType="1"
            :deviceId="dataForm.monitorDeviceId"
            class="controlCheck"
          />
        </div>
        <div class="right nr contain">
          <div class="right-main">
            <div class="right-explain">当前识别类型</div>
            <div class="right-title">未设定</div>
            <div class="right-info">
              <div>当前布控球未进行设定</div>
              <div>请选择类别后设定布控球的监测区域</div>
            </div>
            <div class="right-btn">
              <button-custom class="right-btn-item" title="周界入侵监测" @click.native="toArea()"/>
              <button-custom class="right-btn-item" title="表计识别监测"  @click.native="toClock()"/>
            </div>
          </div>
        </div>
      </div>
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">动态环境视频记录</div>
          <div class="btn">
            <div class="dateChose">
              <el-date-picker
                      v-model="dataTimeD"
                      @change="changeDate"
                      type="date"
                      placeholder="选择日期"
              ></el-date-picker>
            </div>
          </div>
        </div>
        <div class="reportList">
          <div class="contentNR">
            <div class="tableList">
              <div class="reportTable"  v-for="(item,index) in videoList" :key="index">
                <!--<cover />-->
                <img  :src="item['pic']?item['pic']:''" :onerror="defaultImg"/>
                <!--v-if="item['pic']"-->
                <i  v-if="item['pic']" class="iconfont icon-bofang" @click="handleShow(item)"></i>
                <span>{{ item['startTime'] }}-{{ item['endTime'] }}</span>
              </div>
             <!-- <ReportTable
                      v-for="(item) in ['','','','','','','']"
              />-->
            </div>
          </div>
          <div class="iconfont icon-zuo position" :class="{'route': turnFlag, 'isVisible': !isVisible}" @click="toMove()"></div>
        </div>
      </div>
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">动态环境异常记录</div>
          <div class="select">
            <div>
              <duno-btn-top
                style="visibility: hidden"
                @on-select="onSelect"
                :zIndex="1"
                class="dunoBtnTo"
                :isCheck="false"
                :dataList="allDataKind"
                :title="titleTypeL"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
            <div>
              <duno-btn-top
                style="visibility: hidden"
                @on-select="onSelect"
                :zIndex="1"
                class="dunoBtnTop"
                :isCheck="false"
                :dataList="allDataLevel"
                :title="titleTypeR"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
          </div>
          <div class="btn">
            <div class="dateChose">
              <el-date-picker
                unlink-panels
                v-model="dataTime"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="onChangeHis"
              ></el-date-picker>
            </div>
            <div>
              <div @click="clickExcel" class="clickBtn">
                <i class="iconfont icon-daochu1"></i>
                导出表格
              </div>
            </div>
          </div>
        </div>
        <duno-tables-tep
          class="table_abnormalInfo"
          :columns="columns"
          :data="dataList"
          :totalNum="totalNum"
          :pageSize="pageRows"
          :current="pageIndex"
          :border="true"
          :showSizer="true"
          @on-select="dataListSelectionChangeHandle"
          @clickPage="pageCurrentChangeHandle"
          @on-page-size-change="pageSizeChangeHandle"
        />
      </div>
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">设备监测记录</div>
          <div class="select">
            <div>
              <duno-btn-top
                      style="visibility: hidden"
                      @on-select="onSelect"
                      :zIndex="1"
                      class="dunoBtnTo"
                      :isCheck="false"
                      :dataList="allDataKind"
                      :title="titleTypeL"
                      :showBtnList="false"
              ></duno-btn-top>
            </div>
            <div>
              <duno-btn-top
                      style="visibility: hidden"
                      @on-select="onSelect"
                      :zIndex="1"
                      class="dunoBtnTop"
                      :isCheck="false"
                      :dataList="allDataLevel"
                      :title="titleTypeR"
                      :showBtnList="false"
              ></duno-btn-top>
            </div>
          </div>
          <div class="btn">
            <div class="dateChose">
              <el-date-picker
                      unlink-panels
                      v-model="dataTimeD"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      @change="onChangeHisD"
              ></el-date-picker>
            </div>
            <div>
              <div @click="clickExcel" class="clickBtn">
                <i class="iconfont icon-daochu1"></i>
                导出表格
              </div>
            </div>
          </div>
        </div>
        <duno-tables-tep
                class="table_abnormalInfo"
                :columns="columnsR"
                :data="dataListR"
                :totalNum="totalNumR"
                :pageSize="pageRowsR"
                :current="pageIndexR"
                :border="true"
                :showSizer="true"
                @clickPage="pageChange"
        />
      </div>
    </div>
    <wraning :popData="popData" :visible="visible" detailsType="alarm" @handleClose="handleClose" />
    <Remarks :isShow="dialogVisible" :alarmId="alarmId" @beforeClose="beforeClose" />
    <enlarge
      :isShow="isEnlarge"
      :pushCamera="false"
      :srcData="srcData"
      @closeEnlarge="closeEnlarge"
    />
  </div>
</template>

<script>
import { dealRemarks } from "@/api/configuration/configuration.js";
import ReportTable from "_c/duno-c/ReportTable";
import controlCheck from "_c/duno-m/controlCheck";
import buttonCustom from "_c/duno-m/buttonCustom";
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
const ITEMWIDTH = 342
export default {
  name: "ballControlM",
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
    buttonCustom,
    ReportTable
  },
  data() {
    const that = this;
    return {
      dataTimeD: '',
      dataListR: [],
      totalNumR: 1,
      pageRowsR: 10,
      pageIndexR: 1,
      defaultImg: 'this.src="' + require("@/assets/images/placeholder.png") + '"',
      turnFlag: false,
      nowPostion: 0,
      isVisible: false,
      lockPress: false,
      addOrEdit: "添加",
      disabled: false,
      mixinViewModuleOptions: {
        getDataListURL: "/lenovo-alarm/api/security/list",
        exportURL: "/lenovo-alarm/api/security/history/export"
      },
      videoList: [],
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
      columnsR: [
        {
          title: "时间",
          key: "executeTime",
          minWidth: 120,
          align: "center",
          tooltip: true,
        },
        {
          title: "对象",
          key: "powerDeviceName",
          minWidth: 180,
          align: "center",
          tooltip: true
        },
        {
          title: "部件/相别",
          key: "part",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h(
                "div",
                params.row.part ? params.row.part : params.row.phase
            );
          }
        },
        {
          title: "描述",
          key: "content",
          minWidth: 90,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let content;
            if (params.row.content) {
              content = params.row.content;
            } else if (params.row.description) {
              content = params.row.description;
            } else if (params.row.desc) {
              content = params.row.desc;
            }
            return h("div", { class: { member_operate_div: true } }, content);
          }
        },
        {
          title: "识别结果",
          key: "alarmDetailType",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            const content = params.row.monitorDevice['monitorDeviceType']
            return h("div", { class: { member_operate_div: true } }, content);
          }
        },
        {
          title: "缺陷等级",
          key: "alarmLevel",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            if (
                params.row.alarmLevel == "1" ||
                params.row.alarmLevel == "2" ||
                params.row.alarmLevel == "3"
            ) {
              newArr.push(
                  h(
                      "i-dropdown",
                      {
                        props: { trigger: "click", placement: "bottom-start" },
                        style: { marginLeft: "5px" },
                        on: {
                          "on-click": value => {
                            console.log(value);
                          }
                        }
                      },
                      [
                        h("div", { class: { member_operate_div: true } }, [
                          h(
                              "div",
                              {
                                class: {
                                  table_select: true,
                                  serious: params.row.alarmLevel === "2",
                                  commonly: params.row.alarmLevel === "1",
                                  danger: params.row.alarmLevel === "3"
                                }
                              },
                              [
                                h("span", that.cutOut(params.row.alarmLevelName), {
                                  class: { member_operate_div: true }
                                }),
                                h("i", {
                                  style: { marginLeft: "5px" },
                                  class: { "iconfont icon-xiala": true }
                                })
                              ]
                          )
                        ]),
                        h("i-dropdownMenu", { slot: "list" }, [
                          h("i-dropdownItem", {}, [
                            h(
                                "div",
                                {
                                  class: { alarmLevel: true },
                                  on: {
                                    click: () => {
                                      that.onClickDropdown(params.row, "一般", "1");
                                    }
                                  }
                                },
                                "一般"
                            )
                          ]),
                          h("i-dropdownItem", {}, [
                            h(
                                "div",
                                {
                                  class: { alarmLevel: true },
                                  on: {
                                    click: () => {
                                      that.onClickDropdown(params.row, "严重", "2");
                                    }
                                  }
                                },
                                "严重"
                            )
                          ]),
                          h("i-dropdownItem", {}, [
                            h(
                                "div",
                                {
                                  class: { alarmLevel: true },
                                  on: {
                                    click: () => {
                                      that.onClickDropdown(params.row, "危急", "3");
                                    }
                                  }
                                },
                                "危急"
                            )
                          ])
                        ])
                      ]
                  )
              );
            } else {
              newArr.push(h("div", "/"));
            }
            return h("div", newArr);
          }
        },
        {
          title: "视频/图片",
          key: "fileType",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            let sic =
                params.row.pic ||
                params.row.fileAddress ||
                params.row.alarmFileAddress;
            if (params.row.fileType == "1") {
              newArr.push([
                h("img", {
                  class: "imgOrMv",
                  attrs: { src: sic },

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
                  attrs: { src: sic },
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
      dataBread: [{ name: "摄像头详情" }],
      pageParam: {
        pageIndex: 1,
        totalRows: 1
      },
      isLock: 0,
      timeData: "",
      limit: false,
    };
  },
  watch: {
      isLock:{
          handler(now){
              if (now) {
                  this.controlAble = false;
                  this.isMonitor = false;
                  this.isShowBox = true;
                  this.isCamera = false;
              }
          },
          immediate: true
      }
  },
  props: {
    deviceId: {
      type: [String, Number],
      default: "54"
    }
  },
  methods: {
    toArea(){
        this.$router.push({
            path:'/surveillancePath/ballControl',
            query:{
                monitorDeviceId: this.dataForm.monitorDeviceId
            }
        })
    },
    toClock(){
        this.$router.push({
            path:'/surveillancePath/ballControlT',
            query:{
                monitorDeviceId: this.dataForm.monitorDeviceId
            }
        })
    },
    initTableData(){
      getAxiosData('/lenovo-plan/api/statistics/plan/view',{monitorDeviceId: this.dataForm.monitorDeviceId, pageIndex: this.pageIndexR, pageRows: this.pageRowsR, startTime: this.startTimeR, endTime: this.endTimeR}).then(res=>{
          this.dataListR = res.data.tableData
      })
    },
    pageChange (val) {
      this.pageIndexR = val
      this.initTableData()
    },
    handleShow(item){
      this.srcData = item
      this.isEnlarge = true
    },
    isShow(){
        if(document.querySelectorAll('.reportTable').length*ITEMWIDTH < $('.reportList')[0].offsetWidth-ITEMWIDTH){
            this.isVisible = false
        }else{
            this.isVisible = true
        }
    },
    toMove(){
        if(this.limit){
            this.nowPostion += 250
        }else{
            this.nowPostion -= 250
        }
        if(this.nowPostion * -1 >= document.querySelectorAll('.reportTable').length*ITEMWIDTH - $('.reportList')[0].offsetWidth+ITEMWIDTH){
            this.turnFlag = true
            this.limit = true
        }else if(this.nowPostion>=0){
            this.turnFlag = false
            this.limit = false
        }
        console.log(this.nowPostion)
        console.log(document.querySelectorAll('.reportTable').length*ITEMWIDTH/2)
        document.querySelector('.tableList').setAttribute('style',`transform: translateX(${this.nowPostion}px)`)
    },
    onDisable(flag) {
        this.controlAble = flag;
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
        pageRows: 15,
        monitorDeviceId: this.dataForm.monitorDeviceId
      }).then(res => {
        let data = res.data.tableData;
        this.videoList = data;
        this.$forceUpdate()
        data.forEach((item, index) => {
          postAxiosData("/lenovo-device/device/video/record/video/pic", {
            videoPath: item["streamAddr"],
            positionIndex: index
          }).then(res => {
            this.videoList[res.data["positionIndex"]]["pic"] = res.data.pic;
            this.isShow()
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
    onChangeHisD(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.startTimeR = startTime;
      this.endTimeR = endTime;
      this.initTableData();
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
    this.dataForm.monitorDeviceId = this.$route.query.monitorDeviceId;
    this.getMonitorDeviceName();
    this.getDataList();
    this.initCamera();
    this.getVideo();
    this.initTableData();
  },
  mounted() {
    this.getInit();
    this.getSelectType();
    this.getSelcetGrade();
    this.getSelectPreset();
    this.lockPress = this.getAuthority("10075002");
    window.addEventListener("onmousemove", this.endControl());
    document.querySelector(".mainAside").style.height = "inherit";
    document.querySelector(".mainAside").style.minHeight = "100%";
    this.isShow()
    window.addEventListener('resize', this.isShow)
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
.ballControlM {
  width: 100%;
  min-height: 100%;
  padding-bottom: 100px;
  .isVisible{
    visibility: hidden;
  }
  .route{
    transform: rotate(360deg) !important;
  }
  .reportList{
    height: 321px;
    background: #142838;
    padding: 20px;
    overflow: hidden;
    position: relative;
    padding-right: 80px;
    .position{
      position: absolute;
      font-size: 31px;
      bottom: 0;
      right: 21px;
      top: 0;
      margin: auto;
      height: 45px;
      color: #a6a6a6;
      cursor: pointer;
      transform: rotate(180deg);
    }
    .contentNR{
      width: 100%;
      height: 100%;
      white-space: nowrap;
      overflow: hidden;
      /*overflow-x: auto;*/
      .tableList{
        transition: all .5s;
        transform: translateX(0px);
        .reportTable{
          width: 342px;
          height: 281px;
          margin-right: 20px;
          display: inline-flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          background: transparent;
          .iconfont{
            position: absolute;
            font-size: 47px;
            z-index: 99;
            top: 30%;
          }
          & img{
            width: 100%;
            height: 236px;
            display: block;
          }
          & span{
            margin-top: 19px;
          }
        }
      }
    }
  }
  .reportTable .btn > div{
    background-image: none !important;
  }
  .reportTable .btn{
    margin-bottom: 0 !important;
  }
  .controlCheck {
    height: 30px;
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
    background: #132838;
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
      display: flex;
      margin-top: 2%;
      @media screen  and (max-width: 1606px){
        transform: scale(0.8);
        transform-origin: left top;
      }
      .right-main{
        .right-explain{
          color: #999999;
          font-size: 14px;
          margin-bottom: 30px;
        }
        .right-title{
          color: white;
          font-size: 21px;
          margin-bottom: 40px;
        }
        .right-info{
          color: #CCCCCC;
          font-size: 13px;
          margin-bottom: 46px;
        }
        .right-btn{
          display: flex;
          justify-content: flex-start;
          color: white;
          white-space: nowrap;
          .right-btn-item:first-child{
            margin-right: 15px;
          }
        }
      }
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
