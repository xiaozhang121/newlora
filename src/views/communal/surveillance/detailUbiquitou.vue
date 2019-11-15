<template>
  <div class="detailUbiquitou">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="topTitle">泛在盒子</div>
    <div class="video">
      <key-monitor
        :monitorInfo="{ monitorDeviceId: dataForm.monitorDeviceId }"
        paddingBottom="56%"
        class="monitor"
        :autoplay="playerOptions.autoplay"
        :streamAddr="playerOptions.streamAddr"
        :showBtmOption="false"
        :Initialization="true"
        :isLive="false"
        :isNav="true"
      ></key-monitor>
    </div>
    <div class="dynamic">
      <div class="top">
        <div>动态环境监测记录</div>
        <div>
          <duno-btn-top
            @on-select="onSelect"
            class="dunoBtnTo"
            :isCheck="false"
            :dataList="regionList"
            :title="titleType"
            :showBtnList="false"
          ></duno-btn-top>
          <!-- <el-date-picker v-model="dataTime" @change="onChange" type="date" placeholder="选择日期"></el-date-picker> -->
        </div>
      </div>
      <div class="dy-concent">
        <div>
          <div class="videoItem" v-for="(item,index) in videoList" :key="index">
            <cover :srcData="item" :isSecond="false"></cover>
            <p>{{ item['startTime'] }}-{{ item['endTime'] }}</p>
          </div>
        </div>
        <el-pagination
          v-if="videoList.length>0"
          :current-page="pageParam['pageIndex']"
          layout="pager"
          :total="pageParam['totalRows']"
          @current-change="sizeChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import enlarge from "_c/duno-c/enlarge";
import cover from "_c/duno-c/cover";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
import moment from "moment";
export default {
  name: "detailUbiquitou",
  components: {
    dunoBtnTop,
    Breadcrumb,
    KeyMonitor,
    enlarge,
    cover
  },
  data() {
    return {
      dataForm: {},
      titleType: "选择日期",
      timeData: "",
      monitorDeviceId: "",
      videoList: [],
      regionList: [],
      dataBread: [{ name: "摄像头详情" }],
      pageParam: { pageIndex: 1, totalRows: 1 },
      playerOptions: { streamAddr: "", autoplay: true }
    };
  },
  methods: {
    onSelect(item) {
      this[item.title] = item["describeName"];
    },
    getRegion() {
      const that = this;
      getAxiosData("/lenovo-device/device/video/record/date/select-list", {
        monitorDeviceId: that.$route.query.monitorDeviceId
      }).then(res => {
        const resData = res.data;
        const map = resData.map(item => {
          const obj = {
            describeName: item.label,
            monitorDeviceType: item.value,
            monitorDeviceId: item.value,
            title: "titleType"
          };
          return obj;
        });
        this.regionList = map;
      });
    },
    sizeChange(item) {
      this.getVideo(item);
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
    initCamera() {
      const that = this;
      if (this.dataForm.monitorDeviceId) {
        const url =
          "/lenovo-visible/api/visible-equipment/sdk/rtmp/" +
          this.dataForm.monitorDeviceId;
        getAxiosData(url, {}).then(res => {
          that.playerOptions.streamAddr = res.data;
        });
      }
    },
    onChange(data) {
      let startTime = "";
      let endTime = "";
      if (data) {
        startTime = moment(data[0]).format("YYYY-MM-DD 00:00:00");
        endTime = moment(data[1]).format("YYYY-MM-DD 23:59:59");
      }
      this.dataForm.startTime = startTime;
      this.dataForm.endTime = endTime;
      this.getDataList();
    }
  },
  mounted() {
    this.initCamera();
    this.getVideo();
    this.getRegion();
  },
  created() {
    this.dataForm.monitorDeviceId = this.$route.query.monitorDeviceId;
  }
};
</script>

<style lang='scss'>
.detailUbiquitou {
  .topTitle {
    margin: 10px 0;
    color: #fff;
    font-size: 18px;
  }
  .video {
    background: rgba(20, 40, 56, 0.8);
    & > div {
      margin: 0 auto;
    }
  }
  .dynamic {
    .top {
      color: #fff;
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
      .dunoBtnTo {
        width: 180px;
        display: inline-flex;
        padding-bottom: 0;
        .btnList {
          top: inherit !important;
          width: 180px;
          z-index: 110;
          .title {
            padding: 8px 20px;
          }
        }
      }
    }
    .dy-concent {
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
.el-popper[x-placement^="bottom"] {
  background: #192f41;
  border: none;
}
.el-popper[x-placement^="top"] {
  background: #192f41;
  border: none;
}
</style>
