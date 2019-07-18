<template>
  <div class="abnormalInfo">
    <div class="top">
      <div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="regionList"
            :title="titleTypeL"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="statusList"
            :title="titleTypeC"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="typeList"
            :title="titleTypeR"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
      </div>
      <div class="btn">
        <div class="dateChose">
          <el-date-picker
            unlink-panels
            v-model="value"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="onChangeTime"
          ></el-date-picker>
        </div>
        <div>
          <div @click="clickExcel">导出Excel</div>
        </div>
        <div class="setting" @click="showSetting">
          <i class="iconfont icon-ico_menu__systemsettings"></i>
        </div>
      </div>
    </div>
    <duno-main class="dunoMain">
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
    </duno-main>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning :discriminate="false" :hasSelect="true" :alarmLevel="alarmLevel" :visible="visible" warningID="20190711002" :monitorUrl="popData.alarmFileAddress || ''" :judgeResult="popData.alarmContent || ''" :origin="popData.monitorDeviceId" :handleResult="popData.dealRecord || ''" @handleClose="handleClose" />
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import { getAxiosData, postAxiosData, putAxiosData } from '@/api/axiosType'
export default {
  name: "abnormalInfo",
  mixins: [mixinViewModule],
  components: {
    dunoBtnTop,
    KeyMonitor,
    dunoMain,
    DunoTablesTep,
    warningSetting,
    wraning
  },
  data() {
    const that = this;
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/alarm/history",
        exportURL: "/lenovo-alarm/api/alarm/history/export"
      },
      visibleSettingOption: false,
      visible: false,
      totalNum: 500,
      pageRows: 20,
      selectInfo: "更多",
      serious: false,
      commonly: false,
      danger: false,
      value: "",
      titleTypeL: "所有区域",
      titleTypeC: "所有状态",
      titleTypeR: "所有来源",
      columns: [
        {
          title: "时间",
          key: "alarmTime",
          minWidth: 100,
          align: "center",
          tooltip: true
        },
        {
          title: "报警对象",
          key: "powerDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "报警部位",
          key: "alarmPart",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "区域",
          key: "areaName",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "报警内容",
          key: "alarmContent",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "警告级别",
          key: "alarmLevelName",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push(
              h(
                "i-dropdown", {
                  props: { trigger: "click", placement: "bottom-start" },
                  style: {marginLeft: "5px"},
                  on: {"on-click": value => { console.log(value)}}
                },[
                  h( "div", {class: { member_operate_div: true }},
                    [h("div",{
                          class: { table_select: true,serious: params.row.alarmLevel === '2',commonly: (params.row.alarmLevel === '1'),danger: params.row.alarmLevel === '3'}
                        },
                        [h("span", this.cutOut(params.row.alarmLevelName), {
                            class: {member_operate_div: true}
                          }),
                          h("i", {
                            style: {marginLeft: "5px"},
                            class: {"iconfont icon-xiala": true}
                          })
                        ]
                      )
                    ]
                  ),
                  h( "i-dropdownMenu", {slot: "list"},
                    [h("i-dropdownItem", {}, [
                        h("div",{
                            class: {alarmLevel: true},
                            on: {click: () => {that.onClickDropdown(params.row, '一般', '1')}}
                          }, "一般")
                      ]),
                      h("i-dropdownItem", {}, [
                        h("div",{
                            class: {alarmLevel: true},
                            on: {click: () => {that.onClickDropdown(params.row, '严重', '2')}}
                          },"严重")
                      ]),
                      h("i-dropdownItem", {}, [
                        h("div",{
                            class: {alarmLevel: true},
                            on: {click: () => {that.onClickDropdown(params.row, '危急', '3')}}
                          },"危急")
                      ])
                    ]
                  )
                ]
              )
            );
            return h("div", newArr);
          }
        },
        {
          title: "信息来源",
          key: "monitorDeviceId",
          minWidth: 150,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h("a",{
                  class: "table_link",
                  props: { type: "text" },
                  on: {click: () => {console.log("摄像头ID：", params.row.monitorDeviceId) }}
                }, params.row.monitorDeviceId)
            ]);
            return h(
              "div", {class: {member_operate_div: true}},
              newArr
            );
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
            if (params.row.fileType == '1') {
              newArr.push([h("img", { class: "imgOrMv", attrs: {src: params.row.alarmFileAddress}, draggable: false })]);
            } else if (params.row.fileType == '2') {
              newArr.push([h("video", { class: "imgOrMv", attrs: {src: params.row.alarmFileAddress}, draggable: false })]);
            }
            return h("div", newArr);
          }
        },
        {
          title: "处理记录",
          key: "dealRecord",
          width: 120,
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          key: "id",
          width: 220,
          align: "center",
          render: (h, params) => {
            let newArr = []
            if (params.row.isReturn == '0') {
              newArr.push([
                h("el-button", {
                    class: "table_link",
                    style: { marginRight: "20px" },
                    props: { type: "text" },
                    on: {
                      click: () => {
                        that.restoration(params.row);
                      }
                    }
                  },"复归")
              ]);
            }
            newArr.push([
              h("el-button",{
                  class: "table_link",
                  style: { marginRight: "20px" },
                  props: { type: "text" },
                  on: {
                    click: () => {
                      that.popData = params.row
                      that.alarmLevel = params.row.alarmLevel
                      that.visible = true;
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
      typeList: [],
      regionList: [],
      statusList: [],
      popData: {},
      clcikQueryData: {},
      alarmLevel: ''
    };
  },
  created() {
    this.getRegion()
    this.getStart()
    this.getType()
  },
  methods: {
    cutOut (data) {
      if (data) {
        const index = data.indexOf('缺陷')
        if (index > -1) {
          data = data.substring(0, index)
        }
        return data
      } else {
        return '更多'
      }
    },
    onClickDropdown(row, type, No) {
      const index = row._index
      this.dataList[index].alarmLevelName = type
      this.dataList[index].alarmLevel = No
      this.psotAlarmData(row, No)
    },
    psotAlarmData(row, No) {
      const that = this
      const url = '/lenovo-alarm/api/alarm/level-edit'
      const query = {
        id: row.id,
        alarmLevel: No
      }
      putAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          this.dataList[index].alarmLevel = row.alarmLevel
          this.dataList[index].alarmLevelName = row.alarmLevelName
          return that.$message.error(res.msg)
        }
        that.$message.success(res.msg)
      }, error => {
        this.dataList[index].alarmLevel = row.alarmLevel
        this.dataList[index].alarmLevelName = row.alarmLevelName
      })
    },
    onClose() {
      this.visibleSettingOption = false;
    },
    showSetting() {
      this.visibleSettingOption = true;
    },
    onSelect(item, index) {
      this[item.title] = item["describeName"]
      if (item.title == 'titleTypeL') {
        this.clcikQueryData.areaId = item.monitorDeviceType
      } else if (item.title == 'titleTypeC') {
        this.clcikQueryData.status = item.monitorDeviceType
      } else if (item.title == 'titleTypeR') {
        this.clcikQueryData.source = item.monitorDeviceType
      }
      this.clickQuery(this.clcikQueryData)
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD");
        endTime = moment(data[1]).format("YYYY-MM-DD");
      }
      this.clcikQueryData.startTime = startTime
      this.clcikQueryData.endTime = endTime
      this.clickQuery(this.clcikQueryData)
    },
    handleClose() {
      this.popData = {}
      this.visible = false;
    },
    restoration (row) {
      const url = "/lenovo-alarm/api/alarm/deal"
      const query = {
        alarmId: row.alarmId,
        type: '1'
      }
      postAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.msg)
        }
        this.dataList[row._index].isReturn = '1'
        this.$message.success(res.msg)
      })
    },
    clickExcel() {
      const that = this
      that.exportHandle()
    },
    getRegion() {
      const that = this
      const url = '/lenovo-device/api/area/select-list'
      postAxiosData(url).then(res => {
        const resData = res.data
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: 'titleTypeL'
          }
          return obj
        })
        map.unshift({
          describeName: '所有区域',
          monitorDeviceType: '',
          title: 'titleTypeL'
        })
        this.regionList = map
      })
    },
    getStart() {
      const that = this
      const url = "/lenovo-device/api/monitor/status"
      postAxiosData(url).then(res => {
        const resData = res.data
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: 'titleTypeC'
          }
          return obj
        })
        map.unshift({
          describeName: '所有状态',
          monitorDeviceType: '',
          title: 'titleTypeC'
        })
        this.statusList = map
      })
    },
    getType() {
      const that = this
      const url = "/lenovo-plan/api/list/monitor-device-type"
      postAxiosData(url).then(res => {
        const resData = res.data
        let mapList = resData.filter(item => item.label != '请选择')
        const map = mapList.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            title: 'titleTypeR'
          }
          return obj
        })
        map.unshift({
          describeName: '所有来源',
          monitorDeviceType: '',
          title: 'titleTypeR'
        })
        this.typeList = map
      })
    }
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.abnormalInfo {
  width: 100%;
  //-------------------表格样式
  .dunoMain{
    height: inherit;
  }
  .ivu-table{
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
        height: 60px;
      }
    }
    tr:nth-child(odd) {
      td {
        background: rgba(0, 0, 0, 0)!important;
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
  .el-button--text {
    border-color: transparent !important;
    background: transparent !important;
  }
  .flexPos {
    display: flex;
    align-items: center;
  }
  .imgOrMv {
    width: 80%;
    height: 45px;
    position: relative;
    top: 2px;
  }
  .table_link {
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .table_abnormalInfo {
    padding: 36px 18px;
  }
  .table_select {
    cursor: pointer;
    color: #1d1f26;
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
  .top {
    color: #ffffff;
    height: 40px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      display: flex;
      justify-content: space-between;
      & > div {
        margin-right: 10px;
        .dunoBtnTop {
          width: 120px;
          display: inline-flex;
          padding-bottom: 0;
          .btnList {
            top: inherit !important;
            // line-height: 30px;
            width: 120px;
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
      justify-content: space-between;
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
      & > div:last-child {
        font-size: 22px;
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
  .icon-xiala {
    color: white;
    font-size: 13px;
  }
}
.setting {
  cursor: pointer;
  i {
    font-size: 30px;
    padding-right: 5px;
  }
}
.el-picker-panel {
  background-color: rgba(27, 59, 71, 0.7);
  color: #fff;
  border: none;
  .el-picker-panel__body-wrapper {
    .el-picker-panel__body {
      .in-range {
        div {
          background-color: rgba(81, 89, 112, 0.7);
        }
      }
    }
  }
}
</style>
