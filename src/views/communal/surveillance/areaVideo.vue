<template>
  <div class="areaVideo">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top">
      <div>
        <span>{{areaCameraList[0].areaName}}</span>
      </div>
      <div>
        <!-- <el-checkbox-group v-model="checkList" @change="change">
          <el-checkbox label="可见光"></el-checkbox>
          <el-checkbox label="红外固定热像仪"></el-checkbox>
        </el-checkbox-group> -->
      </div>
    </div>
    <div class="main-video">
      <KeyMonitor
        v-for="(item,index) in areaCameraList"
        :key="index"
        :autoplay="true"
        :width="width"
        :isRecord="false"
        :showBtmOption="true"
        :monitorInfo="{monitorDeviceId: item['monitorDeviceId']}"
        :imgAdress="item['pic']"
        :kilovolt="item['source']"
        :streamAddr="item['streamAddr']"
        :Initialization="true"
        :isLive='false'
        :isNav='true'
        :isAux='true'
      />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import { postAxiosData, getAxiosData } from "@/api/axiosType";
export default {
  name: "areaVideo",
  components: {
    Breadcrumb,
    KeyMonitor
  },
  data() {
    return {
      checkList: [],
      areaCameraList: [],
      width: "calc(25% - 15px)",
      dataBread: [
        { path: "/surveillancePath/list", name: "视频监控" },
        { path: "", name: "1000kv" }
      ]
    };
  },
  methods: {
    getList() {
      const that = this;
      let query = {
        areaId: this.$route.query.areaId,
        showType: this.$route.query.showType,
        powerDeviceId: this.$route.query.powerDeviceId,
      };
      getAxiosData("/lenovo-device/api/monitor/vol-list", query).then(res => {
        if (res.code == 200) {
          let data = res.data;
          that.areaCameraList = data;
          this.dataBread[1].name = data[0].areaName;
          that.$forceUpdate();
        }
      });
    },
    change() {}
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="scss">
.areaVideo {
  .keyMonitor .camera .explain .block{
    visibility: hidden;
  }
  .top {
    margin-top: 20px;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
    .el-checkbox {
      color: #ffffff;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #ffffff;
    }
  }
  .main-video {
    & > div:nth-child(-n + 4) {
      margin-top: 10px;
    }
    & > div {
      margin-right: 20px;
      margin-top: 50px;
      float: left;
    }
    & > div:nth-child(4n) {
      margin-right: 0;
    }
  }
}
</style>


