<template>
  <div class="duno-reportFrom">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="dunoDrap">
      <div>{{ mainTitle }}</div>
      <div class="selectBtn">
        <div style="position: relative" :class="{'hidden': selectVisible}">
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTop"
            :isCheck="false"
            :dataList="inspectionData"
            :title="titleValue"
            :showBtnList="false"
          ></duno-btn-top>
        </div>
        <div class="dateChose" :class="{'hidden': selectVisible}">
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
      <div v-if="!loading&&isNull" class="noData">暂无数据</div>
      <div class="task taskN" v-if="planType == 9">
        <ReportTable
          v-for="(item,index) in dataList.tableData"
          :key="index"
          :noRobot="true"
          :queryData="queryData"
          :url="url"
          path="/abnormalInfoPath/taskReport"
          :reportData="item"
          :isAllInfo="false"
        />
      </div>
      <div class="task" v-else>
        <ReportTable
          v-for="(item,index) in dataList.tableData"
          :url="url"
          :queryData="queryData"
          :key="index"
          :reportData="item"
        />
      </div>
      <el-pagination
        v-if="!loading&&!isNull"
        :current-page="pageIndex"
        layout="pager"
        :total="totalRows"
        @current-change="sizeChange"
      ></el-pagination>
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
      queryData: {},
      mainTitle: '全面巡视报告',
      selectVisible: false,
      timer: null,
      isNull:false,
      loading: false,
      pageIndex: 1,
      totalRows: 1,
      planType: "",
      dataList: [],
      // mixinViewModuleOptions: {
      //   activatedIsNeed: true,
      //   getDataListURL: "/lenovo-plan/api/statistics/plan/list"
      // },
      url: "/lenovo-plan/api/statistics/plan/download",
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/taskForm", name: "报表" },
        { path: "", name:`${this.$route.query.planType?(this.$route.query.planType==9?"全面巡视报告":"其他巡视报告"):"历史巡检报告"}` }
      ],
      titleValue: "所有巡检报表",
      value: "",
      dataForm: {},
      dataUrl: "/lenovo-plan/api/statistics/plan/list",
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
      let url = this.dataUrl;
      let query = {
        pageIndex: this.pageIndex,
        pageRows: 10,
        planType: this.planType,
        ...this.dataForm
      };
      getAxiosData(url, query).then(res => {
        if (this.planType == 9) {
          res.data.tableData.map(item => {
            item["planName"] = item["label"];
            item["pic"] = require("@/assets/images/tablePic.png");
          });
        }
        this.dataList = res.data;
        if(this.dataList.tableData.length==0){
          this.isNull=true
        }else{
          this.isNull=false
        }
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
        let initSelect = 0
        let type = this.$route.query.type
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorType: item.value,
            title: "titleType"
          };
          if(type == obj['describeName']){
            initSelect = obj
          }
          return obj;
        });
        map.unshift({
          describeName: "所有类型",
          monitorType: "",
          title: "titleType"
        });
        for(let i=0; i<map.length; i++){
          if(map[i]['describeName'] == '全面巡检' || map[i]['describeName'] == '人员环境'){
            map.splice(i, 1)
            i--;
          }
        }
        this.inspectionData = map;
        if(initSelect){
          this.onSelect(initSelect)
        }
      });
    }
  },
  created() {
    if (this.$route.query.planType) {
      let planType = this.$route.query.planType;
      if (planType == 9) {
        this.selectVisible = true
        this.dataUrl = "/lenovo-plan/api/report/template/list";
        this.mainTitle = '全面巡视报告'
      }else if(planType == "2,3,4,5"){
        this.mainTitle = '其他巡视报告'
      }
      if(this.$route.query.nav == 2){
        this.dataBread =  [
          { path: "/abnormalInfoPath/home", name: "操作中台" },
          { path: "/configuration/list", name: "任务配置" },
          { path: "", name: "全面巡视报告" }
        ]
        this.queryData = {nav: 2}
        this.mainTitle = '全面巡视报告'
      }
    }else{
      this.mainTitle = '历史巡检报告'
    }
  },
  mounted() {
    this.loading = true;
    this.timer = setTimeout(() => {
      this.loading = false;
    }, 1000000000);
    if (this.$route.query.planType) {
      this.planType = this.$route.query.planType;
    }
    this.getPlayTypeData();
    this.init();
  }
};
</script>

<style lang="scss">
.duno-reportFrom {
  width: 100%;
  height: 100%;
  .hidden{
    visibility: hidden;
  }
  .dunoMain {
    // border: 1px solid #fff;
    width: 100%;
    .noData {
      width: 100%;
      min-height: 360px;
      color: #fff;
      font-size: 18px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
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
    height: auto !important;
  }
  .task {
    padding: 20px 0 20px 20px;
    width: 100%;
    overflow: hidden;
    & > div {
      width: calc(20% - 20px);
      float: left;
      height: 400px;
      margin-right: 20px;
      @media screen and(max-width: 1366px){
        height: 340px;
      }
      img {
        height: 100%；;
      }
    }
  }
  .taskN {
    & > div {
      height: 350px;
      @media screen and(max-width: 1366px){
        height: 250px;
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

