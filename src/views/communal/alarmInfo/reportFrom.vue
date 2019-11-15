<template>
  <div class="duno-reportFrom">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="dunoDrap">
      <div>巡检任务报表</div>
      <div class="selectBtn">
        <div style="position: relative">
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="inspectionData"
            :title="titleValue"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
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
      </div>
    </div>
    <duno-main
      class="dunoMain"
      style="position: relative; top: -5px"
      v-loading="loading"
       element-loading-background="rgba(0, 0, 0, 0)"
      element-loading-text="请稍后，正在加载数据…"
    >
      <div class="task">
        <ReportTable
          v-for="(item,index) in dataList.tableData"
          :url="url"
          :key="index"
          :reportData="item"
        />
      </div>
      <el-pagination layout="pager" :total="totalRows" @current-change="sizeChange"></el-pagination>
    </duno-main>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoMain from "_c/duno-m/duno-main";
import ReportTable from "_c/duno-c/ReportTable";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
// import mixinViewModule from "@/mixins/view-module";
import moment from "moment";
import { getPlayType } from "@/api/configuration/configuration.js";
import { getAxiosData } from "@/api/axiosType";
export default {
  // mixins: [mixinViewModule],
  name: "ReportFrom",
  components: {
    Breadcrumb,
    dunoBtnTop,
    ReportTable,
    dunoMain
  },
  data() {
    return {
      timer: null,
      loading: false,
      pageIndex: 1,
      totalRows: 1,
      dataList: [],
      // mixinViewModuleOptions: {
      //   activatedIsNeed: true,
      //   getDataListURL: "/lenovo-plan/api/statistics/plan/list"
      // },
      url: "/lenovo-plan/api/statistics/plan/download",
      dataBread: [
        { path: "/realEnv/list", name: "操作中台" },
        { path: "/report/list", name: "所有报表" },
        { path: "", name: "巡检任务报表" }
      ],
      titleValue: "所有巡检报表",
      value: "",
      dataForm: {},
      inspectionData: []
    };
  },
  watch: {
    dataList: {
      handler(now) {
        if (now.length || now.length == 0) {
          this.loading = false;
          clearTimeout(this.timer);
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    init() {
      let url = "/lenovo-plan/api/statistics/plan/list";
      let query = {
        pageIndex: this.pageIndex,
        pageRows: 10,
        ...this.dataForm
      };
      getAxiosData(url, query).then(res => {
        this.dataList = res.data;
        this.totalRows = Number(res.data.pageParam.totalRows);
        this.loadingOption = false;
        this.loading = false;
        this.$forceUpdate();
      });
    },
    sizeChange(item) {
      this.pageIndex = item;
      this.loading = true;
      this.init();
    },
    onSelect(item) {
      this.titleValue = item["describeName"];
      this.dataForm.planType = item["monitorType"];
      this.init();
    },
    onChangeTime(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.dataForm.startTime = startTime;
      this.dataForm.endTime = endTime;
      this.init();
    },
    getPlayTypeData() {
      getPlayType().then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorType: item.value,
            title: "titleType"
          };
          return obj;
        });
        map.unshift({
          describeName: "所有类型",
          monitorType: "",
          title: "titleType"
        });
        this.inspectionData = map;
      });
    }
  },
  mounted() {
    this.loading = true;
    this.timer = setTimeout(() => {
      this.loading = false;
    }, 1000000000);
    this.getPlayTypeData();
    this.init();
  }
};
</script>

<style lang="scss">
.duno-reportFrom {
  width: 100%;
  height: 100%;
  .dunoMain {
    // border: 1px solid #fff;
    width: 100%;
  }
  .el-loading-text {
    color: #969696 !important;
  }
  .dunoDrap {
    display: flex;
    justify-content: space-between;
    & > div:first-child {
      margin-top: 20px;
      margin-bottom: 20px;
      font-size: 20px;
      color: #ffffff;
    }
    .selectBtn {
      display: flex;
      justify-content: space-between;
      width: 545px;
      margin-top: 14px;
      height: 50px;
      .dunoBtnTop {
        width: 185px;
        display: inline-flex;
        padding-bottom: 0;
        height: 40px;
        .btnList {
          top: inherit !important;
          width: 185px;
          .title {
            padding: 8px 20px;
          }
          .btnNr {
            color: white;
          }
        }
      }
      .dateChose {
        height: 40px;
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
          height: 40px;
        }
        .el-range-editor--small .el-range-input {
          font-size: 16px;
        }
      }
    }
  }
  .dunoMain {
    margin-bottom: 15px;
    height: inherit !important;
  }
  .task {
    padding: 20px 0 20px 20px;
    width: 100%;
    overflow: hidden;
    & > div {
      width: calc(20% - 20px);
      float: left;
      height: 425px;
      margin-right: 20px;
      img {
        height: 100%；;
      }
    }
  }
  //分页--
  .el-pagination {
    color: #fff;
    display: flex;
    justify-content: center;
  }
  .el-pagination .btn-prev,
  .el-pagination .btn-next {
    background-color: rgba(0, 0, 0, 0);
    color: #142838;
  }
  .el-pager li {
    background-color: rgba(0, 0, 0, 0);
  }
  .el-pager li.active {
    color: #5fafff;
  }
  .el-pager li.btn-quicknext,
  .el-pager li.btn-quickprev {
    color: #fff;
  }
  //--
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

