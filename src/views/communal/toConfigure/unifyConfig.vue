<template>
  <div class="unfiyConfig">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="controlTitle">
      <div> 周界入侵监控 </div>
    </div>
    <div class="Main_contain">
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">历史监测记录</div>
          <div class="btn">
            <div class="dateChose">
         <!--     <el-date-picker
                      v-model="dataTimeEE"
                      @change="changeDate"
                      type="date"
                      placeholder="选择日期"
              ></el-date-picker>-->
              <button-custom title="统一配置页面" @click.native="toRouter" />
            </div>
          </div>
        </div>
        <div class="video">
          <div>
            <div class="videoItem" v-for="(item,index) in cameraList" :key="index">
              <key-monitor
                      :monitorInfo="item"
                      paddingBottom="56%"
                      class="monitor"
                      width="100%"
                      :autoplay="true"
                      :streamAddr="item['streamAddress']"
                      :kilovolt="item['monitorDeviceName']"
                      :showBtmOption="true"
                      :Initialization="true"
              >
                <img-line-panel :isLock="isLock" :transparent="true" :imgsrc="cameraInfo[index]['pic']" :picData="cameraInfo[index]['areaRect']"   v-if="cameraInfo[index]['areaRect']"  ref="imgLinePanel" :zIndex="index" pId="backImgK"/>
              </key-monitor>
            </div>
          </div>
        </div>
      </div>
      <div class="middle_table">
        <div class="top not-print">
          <div class="name">动态环境告警记录</div>
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
                      v-model="dataTimed"
                      type="daterange"
                      range-separator="-"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      @change="onChangeSecond"
              ></el-date-picker>
            </div>
            <div>
              <duno-btn-top
                @on-select="selectDownloadType"
                class="dunoBtnTo"
                :isCheck="false"
                :dataList="downLoadList"
                title="导出表格/PDF"
                :showBtnList="false"
              ></duno-btn-top>
            </div>
            <!-- <div>
              <div @click="clickExcel" class="clickBtn">
                <i class="iconfont icon-daochu1"></i>
                导出表格
              </div>
            </div> -->
          </div>
        </div>
        <duno-tables-tep
                class="table_abnormalInfo"
                :columns="tableColumns"
                :data="tableList"
                :totalNum="totalPage"
                :pageSize="pageRows"
                :current="pageIndex"
                :border="true"
                :showSizer="true"
                @clickPage="changePage"
        />
      </div>
    </div>
    <wraning :popData="popData" detailsType="alarm" :visible="visible" @handleClose="handleClose" />
    <enlarge :isShow="isEnlarge" :srcData="srcData" @closeEnlarge="closeEnlarge" />
    <Remarks :isShow="dialogVisible" :alarmId="alarmId" @beforeClose="beforeClose" />
  </div>
</template>

<script>
    import enlarge from "_c/duno-c/enlarge";
    import dunoBtnTop from "_c/duno-m/duno-btn-top";
    import buttonCustom from "_c/duno-m/buttonCustom";
    import KeyMonitor from "_c/duno-c/KeyMonitor";
    import Breadcrumb from "_c/duno-c/Breadcrumb";
    import echarts from "_c/duno-c/echarts";
    import controBtn from "_c/duno-m/controBtn";
    import mixinViewModule from "@/mixins/view-module";
    import inspection from "_c/duno-m/inspection";
    import Remarks from "_c/duno-c/Remarks";
    import { DunoTablesTep } from "_c/duno-tables-tep";
    import warningSetting from "_c/duno-j/warningSetting";
    import wraning from "_c/duno-j/warning";
    import imgLinePanel from '_c/duno-m/imgLinePanel'
    import {
        getVLIght,
        getVType,
        getVGrade,
        getVPreset,
        getVEcharts,
        getPosition,
        dealRemarks
    } from "@/api/configuration/configuration.js";
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    import moment from "moment";
    export default {
        name: "surveillanceDetail",
        mixins: [mixinViewModule],
        components: {
            dunoBtnTop,
            KeyMonitor,
            Breadcrumb,
            controBtn,
            inspection,
            DunoTablesTep,
            echarts,
            warningSetting,
            wraning,
            enlarge,
            Remarks,
            buttonCustom,
            imgLinePanel
        },
        data() {
            const that = this;
            return {
                updateTimer: null,
                dataTimeEE: "",
                alarmId: 0,
                dialogVisible: false,
                envPageIndex: 1,
                envTotalNum: 1,
                envDataList: [],
                downLoadList: [
                  {
                    describeName: "导出表格",
                    monitorDeviceType: "1"
                  },
                  {
                    describeName: "导出PDF",
                    monitorDeviceType: "2"
                  }
                ],
                tableColumns: [
                    {
                        title: "拍摄时间",
                        key: "alarmTime",
                        minWidth: 100,
                        align: "center",
                        tooltip: true,
                        render: (h, params) => {
                            return h("div", [
                                h(
                                    "Tooltip",
                                    {
                                        props: {
                                            placement: "top",
                                            content: params.row.alarmTime,
                                            transfer: true
                                        },
                                        style: {
                                            display: "inline-block",
                                            width: "100%",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap"
                                        }
                                    },
                                    params.row.alarmTime
                                )
                            ]);
                        }
                    },
                    {
                        title: "警告类型",
                        key: "alarmType",
                        minWidth: 120,
                        align: "center",
                        tooltip: true
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
                                    h("img", {
                                        class: "imgOrMvV",
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
                            }
                            return h("div", newArr);
                        }
                    },
                    {
                        title: "自动/手动",
                        key: "machineJudge",
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
                            newArr.push();
                            return h("div", newArr);
                        }
                    },
                    {
                        title: " ",
                        width: 90,
                        align: "center",
                        render: (h, params) => {
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
                allDataK: [],
                addOrEdit: "添加",
                titleTypeK: "全部识别类型",
                disabled: false,
                mixinViewModuleOptions: {
                    getDataListURL: "/lenovo-plan/api/task/result/list",
                    exportURL: "/lenovo-alarm/api/security/history/export"
                },
                titleTypeL: "全部数据类型",
                titleTypeR: "全部异常类型",
                videoList: [
                    {streamAddr: 'rtmp://202.69.69.180:443/webcast/bshdlive-pc', monitorDeviceId: '110', source: '123'},
                    {streamAddr: 'rtmp://202.69.69.180:443/webcast/bshdlive-pc', monitorDeviceId: '110', source: '123'},
                    {streamAddr: 'rtmp://202.69.69.180:443/webcast/bshdlive-pc', monitorDeviceId: '110', source: '123'}
                    ],
                isControl: "1",
                currentTime: 10,
                timeOut: null,
                srcData: [],
                echartTitle: "",
                isEnlarge: false,
                queryForm: {},
                dataForm: {},
                secondForm: {},
                echartForm: {},
                echartData: [],
                typeList: [],
                value: "",
                alarmLevel: "",
                visible: false,
                visibleSettingOption: false,
                popData: {},
                columns: [
                    {
                        title: "时间",
                        key: "executeTime",
                        minWidth: 100,
                        align: "center",
                        tooltip: true,
                        render: (h, params) => {
                            let timeDay = params.row.executeTime.slice(5);
                            return h("div", timeDay);
                        }
                    },
                    {
                        title: "对象",
                        key: "monitorDeviceName",
                        minWidth: 180,
                        align: "center",
                        tooltip: true
                    },
                    {
                        title: "部件/相别",
                        key: "part",
                        minWidth: 120,
                        align: "center",
                        tooltip: true
                    },
                    {
                        title: "描述",
                        key: "content",
                        minWidth: 90,
                        align: "center",
                        tooltip: true
                    },
                    {
                        title: "缺陷等级",
                        key: "alarmLevelName",
                        minWidth: 120,
                        align: "center",
                        tooltip: true,
                        render: (h, params) => {
                            const that = this;
                            let newArr = [];
                            if (params.row.isAlarm == "1") {
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
                                                        h("span", this.cutOut(params.row.alarmLevelName), {
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
                                newArr.push("/");
                            }
                            return h("div", newArr);
                        }
                    },
                    {
                        title: "数据",
                        key: "alarmValue",
                        minWidth: 120,
                        align: "center",
                        tooltip: true
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
                unit: "",
                echartsKind: 0,
                presetName: "",
                allDataKind: [],
                allDataLevel: [],
                dataTime: "",
                dataTimed: "",
                totalPage: 1,
                pageIndex: 1,
                dataBread: [{ name: "摄像头详情" }],
                timeData: "",
                cameraList: [],
                cameraInfo: [],
                tableList: [],
                isLock: 0,
                isInit: false
            };
        },
        props: {
            deviceId: {
                type: [String, Number],
                default: "54"
            }
        },
        methods: {
            getCameraInfo(){
                getAxiosData('/lenovo-plan/api/unified/plan/task/detail',{planId: this.dataForm.planId}).then(res=>{
                    this.isLock = Number(res.data.planStatus)
                    let data = res.data.cameraList
                    data.map(item=>{
                        if(!this.isLock){
                            item['areaRect'] = ""
                        }
                    })
                    this.cameraInfo = data
                    if(!this.isInit)
                      this.initCameraM()
                })
            },
            initData(){
                const that = this
                this.getCameraInfo()
            },
            initCameraM(){
                const that = this
                let obj = {pageIndex: that.pageIndex, pageRows: 10, planId: this.dataForm.planId}
                getAxiosData('/lenovo-plan/api/unified/plan/camera/list', {...obj, ...that.secondForm}).then(res=>{
                    if(!this.cameraList.length)
                        that.cameraList = res.data.cameraList
                    let data = res.data.tableData.tableData
                    data.map(item=>{
                        item['pic'] = ''
                    })
                    that.tableList = data
                    data.forEach((item, index) => {
                        postAxiosData("/lenovo-alarm/api/info/video/pic", {
                            videoPath: item["alarmFileAddress"],
                            positionIndex: index
                        }).then(res => {
                            this.tableList[res.data["positionIndex"]]["pic"] = res.data.pic;
                            this.$forceUpdate();
                        });
                    })
                    that.totalPage = res.data.tableData.pageParam.totalRows
                    that.isInit = true
                })
            },
            toRouter(){
                this.$router.push({path: "perimeterMonitor", query:{'planId': this.dataForm.planId}})
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
            addReturn(row) {
                const that = this;
                const query = {
                    alarmId: row.alarmId,
                    type: "1"
                };
                dealRemarks(query).then(res => {
                    if (res.data.isSuccess) that.$message.success(res.msg);
                    else that.$message.error(res.msg);
                    this.getEnvData();
                });
            },
            beforeClose() {
                this.dialogVisible = false;
            },
            restoration(row) {
                const url = "/lenovo-alarm/api/alarm/deal";
                const query = {
                    alarmId: row.alarmId,
                    type: "1"
                };
                postAxiosData(url, query).then(res => {
                    if (res.code !== 200) {
                        return this.$message.error(res.msg);
                    }
                    this.envDataList[row._index].isReturn = "1";
                    this.$message.success(res.msg);
                });
            },
            changePage(val) {
                this.pageIndex = val;
                this.initData();
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
                    // this.videoList = data;
                    this.pageParam = res.data.pageParam;
                });
            },
            closeEnlarge() {
                this.isEnlarge = false;
            },
            initCamera() {
                const that = this;
                that.disabled = true;
                const url =
                    "/lenovo-visible/api/visible-equipment/sdk/rtmp/" +
                    this.dataForm.monitorDeviceId;
                getAxiosData(url, {}).then(res => {
                    that.playerOptions.streamAddr = res.data;
                    that.$nextTick(() => {
                        setTimeout(() => {
                            this.$refs.controBtnRef.viewCamera(5, false).then(res => {
                                setTimeout(() => {
                                    this.$refs.controBtnRef.viewCamera(5, true).then(res => {
                                        that.disabled = false;
                                    });
                                }, 5000);
                            });
                        }, 500);
                    });
                });
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
            onChangeSecond(data) {
                let startTime = "";
                let endTime = "";
                if (data) {
                    startTime = moment(data[0]).format("YYYY-MM-DD");
                    endTime = moment(data[1]).format("YYYY-MM-DD");
                }
                this.secondForm.startTime = startTime;
                this.secondForm.endTime = endTime;
                this.initData();
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

                getAxiosData("/lenovo-device/api/recognize-type/select-list", {
                    monitorDeviceId: this.dataForm.monitorDeviceId
                }).then(res => {
                    const resData = res.data;
                    const map = resData.map(item => {
                        const obj = {
                            describeName: item.label,
                            monitorDeviceType: item.value,
                            title: "titleTypeK"
                        };
                        return obj;
                    });
                    map.unshift({
                        describeName: "全部识别类型",
                        monitorDeviceType: "",
                        title: "titleTypeK"
                    });
                    this.allDataK = map;
                });
            },
            selectDownloadType(item) {
              const that = this;
              that.queryForm.type = item.monitorDeviceType;
              that.queryForm.planId = this.$route.query.planId;
              that.exportHandle();
            },
            // clickExcel() {
            //     const that = this;
            //     that.queryForm.monitorDeviceId = this.$route.query.monitorDeviceId;
            //     that.exportHandle();
            // },
            handleClose() {
                this.popData = {};
                this.visible = false;
            },
        },
        created() {
            this.dataForm.planId = this.$route.query.planId;
            this.initData()
        },
        mounted() {
            document.querySelector(".mainAside").style.height = "inherit";
            document.querySelector(".mainAside").style.minHeight = "100%";
            this.updateTimer = setInterval(()=>{
                this.getCameraInfo()
            },4000)
        },
        beforeDestroy() {
            clearImmediate(this.updateTimer)
            document.querySelector(".mainAside").style.height = "calc(100% - 80px)";
            document.querySelector(".mainAside").style.minHeight = "inherit";
        }
    };
</script>

<style lang="scss">
  @import "@/style/tableStyle.scss";
  .el-popper[x-placement^="bottom"] {
    background: #192f41 !important;
    border: none !important;
  }
  .el-popper[x-placement^="top"] {
    background: #192f41 !important;
    border: none !important;
  }
  .mainAside {
    /*min-height: 100%;*/
  }
  .unfiyConfig {
    width: 100%;
    min-height: 100%;
    padding-bottom: 100px;
    /*overflow-y: hidden;*/
    .imgLinePanel{
      height: 100%;
      position: relative;
      #canvas{
        background: transparent;
      }
    }
    .el-button:hover {
      background: transparent !important;
    }
    .dateChose {
      .el-input--small .el-input__inner {
        border-radius: 5px;
        width: 100%;
        line-height: 40px;
        color: #fff;
        height: 40px;
        border: none;
        background-color: #192f41;
      }
    }
    .icon-xiala {
      /* width: 12px;
      height: 15px;*/
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
    .el-input--small .el-input__inner {
      border-radius: 0;
      width: 100%;
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
    .imgOrMvV{
      width: auto;
      height: 35px;
      position: relative;
      top: 2px;
    }
    .flexPos {
      /*.el-button {*/
      /*background: rgba(0, 0, 0, 0);*/
      /*border: none;*/
      /*}*/
    }
    .table_link {
      font-size: 16px;
      color: #5fafff !important;
      text-decoration: underline;
      background: transparent;
      border: none;
    }
    .table_select {
      cursor: pointer;
      // color: #1d1f26;
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
                // line-height: 30px;
                width: 160px;
                .title {
                  // font-size: 16px;
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
          .dunoBtnTop {
              width: 150px;
              position: relative;
              left: 10px;
              display: inline-flex;
              padding-bottom: 0;
              .btnList {
                top: inherit !important;
                width: 150px;
                .title {
                  padding: 8px 20px;
                }
              }
            }
          // & > div:nth-child(2) {
          //   & > div {
          //     width: 140px;
          //     line-height: 40px;
          //     text-align: center;
          //     background-color: #192f41;
          //     cursor: pointer;
          //   }
          // }
          // & > div:last-child {
          //   font-size: 22px;
          // }
          // .clickBtn {
          //   line-height: 40px;
          //   width: 139px;
          //   background-image: url(../../../assets/images/btn/moreBtn.png);
          //   text-align: center;
          //   font-size: 18px;
          //   color: #ffffff;
          // }
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
          /*overflow: hidden;*/
        }
        .videoItem {
          float: left;
          width: calc(33.3% - 20px);
          margin-right: 20px;
          margin-bottom: 20px;
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
    .controlTitle {
      overflow: hidden;
      color: #fff;
      margin-bottom: 10px;
      & > div {
        float: left;
      }
      & > div:first-child {
        font-size: 20px;
        width: 52%;
      }
      .control {
        font-size: 18px;
        span {
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
  .el-popper[x-placement^="bottom"] {
    background: #192f41;
    border: none;
  }
</style>
