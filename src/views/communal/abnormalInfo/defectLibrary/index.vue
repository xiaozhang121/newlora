<template>
  <div class="defectLibrary">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div>{{ title }}</div>
      <div class="btn">
        <div class="arPic" @click="routerTo">
          <img :src="arPic" @mouseenter="changePic" @mouseleave="changePic" title="AR眼镜上传图片待导入"/>
        </div>
        <div>
          <duno-btn-top
            @on-select="onSelectType"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="typeList"
            :title="titleTypeR"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <!-- <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="regionList"
            :title="titleTypeL"
            :showBtnList="false"
          ></duno-btn-top>
        </div>-->
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
        <div class="exportExcel" @click="openImport">
          <i class="iconfont icon-daoru"></i>
          批量导入
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
        :isShowPage="mixinViewModuleOptions.isShowPage"
        @on-select="dataListSelectionChangeHandle"
        @clickPage="pageCurrentChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </duno-main>
    <sample-img v-if="visible" :visible="visible" @on-close="onClose" />
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import sampleImg from "./components/sampleImg.vue";
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
export default {
  name: "defectLibrary",
  mixins: [mixinViewModule],
  components: {
    Breadcrumb,
    dunoBtnTop,
    dunoMain,
    KeyMonitor,
    DunoTablesTep,
    sampleImg
  },
  data() {
    const that = this;
    return {
      arPic: require('@/assets/AR/arPic.png'),
      arPicHover: require('@/assets/AR/arPicHover.png'),
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-sample/api/sample/system/list"
        // exportURL: ""
      },
      taskId: "",
      dataForm: {
        importTimeStart: '',
        importTimeEnd: '',
        markType: ''
      },
      title: "缺陷库管理",
      totalNum: 20,
      pageRows: 20,
      value: "",
      // titleTypeL: "全部设备",
      titleTypeR: "全部类型",
      typeList: [
        {
          describeName: "手动导入",
          monitorType: "2"
        },
        {
          describeName: "摄像机标定",
          monitorType: "3"
        },
        {
          describeName: "识别结果",
          monitorType: "4"
        }
      ],
      regionList: [],
      visible: false,
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "", name: "缺陷库管理" }
      ],
      columns: [
        {
          title: "序号",
          type: "index",
          align: "center"
        },
        {
          title: "导入日期",
          key: "picImportTime",
          align: "center",
          tooltip: true
        },
        {
          title: "类型",
          key: "markType",
          align: "center",
          tooltip: true
        },
        {
          title: "设备组件",
          key: "monitorDeviceName",
          align: "center",
          tooltip: true
        },
        {
          title: "标注量",
          key: "markNum",
          align: "center",
          tooltip: true
        },
        {
          title: "电压区域",
          key: "areaName",
          align: "center",
          tooltip: true
        },
        {
          title: "被监控设备",
          key: "powerDeviceName",
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          key: "id",
          minWidth: 120,
          align: "center",
          render: (h, params) => {
            const that = this;
            let newArr = [];
            newArr.push([
              h(
                "div",
                {
                  class: "ta_link",
                  props: { type: "text" },
                  on: {
                    click: () => {
                      this.$router.push({
                        name: "sampleDetail",
                        query: {
                          id: params.row.id,
                          sampleId: params.row.sampleId,
                          picFileName: params.row.picFileName,
                          markType: params.row.markType
                        }
                      });
                    }
                  }
                },
                "样本详情"
              )
            ]);
            return h("div", newArr);
          }
        }
      ]
    };
  },
  mounted() {},
  created() {},
  methods: {
    routerTo(){
      this.$router.push({path: 'arList'})
    },
    changePic(e){
      let dom = e.target
      if(dom.srcType){
        dom.src = this.arPic
        dom.srcType = 0
      }else{
        dom.src = this.arPicHover
        dom.srcType = 1
      }
    },
    openImport() {
      this.visible = true;
      let url = "/lenovo-sample/api/sample/getConfInfo";
      getAxiosData(url).then(res => {
        this.taskId = res.data.taskId;
      });
    },
    onClose() {
      this.visible = false;
      this.getDataList()
    },
    // onSelect(item, index) {
    //   this.titleTypeL = item["describeName"];
    //   this.dataForm.monitorDeviceName = item.monitorDeviceType;
    //   this.getDataList();
    // },
    onSelectType(item, index) {
      this.titleTypeR = item["describeName"];
      this.dataForm.markType = item.monitorType;
      // this.getDataList();
      this.clickQuery(this.dataForm);
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.dataForm.importTimeStart = startTime;
      this.dataForm.importTimeEnd = endTime;
      // this.getDataList();
      this.clickQuery(this.dataForm);
    }
    // getRegion() {
    //   const that = this;
    //   const url = "";
    //   getAxiosData(url).then(res => {
    //     const resData = res.data;
    //     const map = resData.map(item => {
    //       const obj = {
    //         describeName: item.label,
    //         monitorDeviceType: item.value,
    //         title: "titleTypeL"
    //       };
    //       return obj;
    //     });
    //     map.unshift({
    //       describeName: "全部设备",
    //       monitorDeviceType: "",
    //       title: "titleTypeL"
    //     });
    //     this.regionList = map;
    //   });
    // }
  }
};
</script>

<style lang="scss">
@import "@/style/tableStyle.scss";
.defectLibrary {
  width: 100%;
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
    @media screen and (min-width: 3500px) {
      font-size: 15px;
      height: 50px;
    }
  }
  .ivu-table-cell {
    @media screen and (min-width: 3500px) {
      padding-left: 10px;
      padding-right: 10px;
    }
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
        @media screen and (min-width: 3500px) {
          height: 50px;
          font-size: 13px;
        }
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
  .el-button--text {
    border-color: transparent !important;
    background: transparent;
  }
  .ta_link {
    // white-space: nowrap;
    // text-overflow: ellipsis;
    // overflow: hidden;
    // display: inline-block;
    // width: 140px;
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .table_abnormalInfo {
    padding: 36px 18px;
  }
  .top {
    color: #ffffff;
    height: 40px;
    margin-top: 20px;
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    @media screen and (min-width: 3500px) {
      height: 35px;
    }
    & > div:first-child {
      font-size: 20px;
      line-height: 40px;
      @media screen and (min-width: 3500px) {
        font-size: 16px;
        line-height: 35px;
      }
    }
    .btn {
      display: flex;
      justify-content: space-between;
      .arPic{
        img{
          width: 48px;
          position: relative;
          top: -5px;
          margin-right: 15px;
          cursor: pointer;
        }
      }
      & > div:nth-child(2) {
        margin-left: 10px;
        .dunoBtnTop {
          width: 250px;
          display: inline-flex;
          padding-bottom: 0;
          .btnList {
            top: inherit !important;
            width: 250px;
            .title {
              padding: 8px 20px;
              @media screen and (min-width: 3500px) {
                height: 35px;
              }
            }
          }
        }
      }
      & > div:not(:nth-child(2)) {
        margin-left: 10px;
        .dunoBtnTop {
          width: 150px;
          display: inline-flex;
          padding-bottom: 0;
          .btnList {
            top: inherit !important;
            width: 150px;
            .title {
              padding: 8px 20px;
              @media screen and (min-width: 3500px) {
                height: 35px;
              }
            }
          }
        }
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
            @media screen and (min-width: 3500px) {
              font-size: 14px;
            }
          }
          .el-range-input {
            color: #fff;
          }
        }
        .el-range-editor--small.el-input__inner {
          height: 40px !important;
          @media screen and (min-width: 3500px) {
            height: 35px !important;
            width: 250px;
          }
        }
        .el-range-editor--small .el-range__icon,
        .el-range-editor--small .el-range__close-icon {
          line-height: 35px;
        }
        .el-range-editor--small .el-range-input {
          font-size: 16px;
          @media screen and (min-width: 3500px) {
            font-size: 14px;
          }
        }
      }
      .exportExcel {
        line-height: 40px;
        cursor: pointer;
        width: 139px;
        background-image: url(../../../../assets/images/btn/moreBtn.png);
        text-align: center;
        font-size: 18px;
        color: #ffffff;
      }
    }
  }
  .icon-xiala {
    color: white;
    font-size: 13px;
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
