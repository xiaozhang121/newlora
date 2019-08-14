<template>
  <div class="areaVideo">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top">
      <div>
        <span>1000千伏</span>
      </div>
      <div>
        <el-checkbox-group v-model="checkList" @change="change">
          <el-checkbox label="可见光"></el-checkbox>
          <el-checkbox label="红外固定热像仪"></el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div class="main-video">
      <KeyMonitor
        v-for="(item,index) in areaCameraList"
        :key="index"
        :autoplay="true"
        :width="width"
        :showBtmOption="true"
        :monitorInfo="{monitorDeviceId: item['monitorDeviceId']}"
        :imgAdress="item['pic']"
        :kilovolt="item['areaName']"
        :streamAddr="item['streamAddr']"
        patrol
      />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import KeyMonitor from "_c/duno-c/KeyMonitor";
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
        { path: "/surveillancePath/list", name: "1000kv" },
        { path: "", name: "摄像头详情" }
      ]
    };
  },
  methods: {
    getList() {
      const that = this;
      let query = {
        areaId: this.$route.query.areaId
      };
      getAxiosData("/lenovo-device/api/monitor/vol-list", query).then(res => {
        if (res.code == 200) {
          let data = res.data;
          that.areaCameraList = data;
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
    & > div {
      margin-right: 20px;
      float: left;
    }
    & > div:nth-child(4n) {
      margin-right: 0;
    }
  }
}
</style>


