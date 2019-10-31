<template>
  <div class="connectState">
    <el-button type="primary" @click="connentSatus" round>{{title}}</el-button>
  </div>
</template>

<script>
import { getAxiosData, putAxiosData } from "@/api/axiosType";
export default {
  name: "connectState",
  props: {
    deviceId: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      title: "连接",
      status: "1",
      isShow: false
    };
  },
  watch: {
    deviceId: {
      handler(now) {
        if (now) {
          this.init();
        }
      },
      immediate: true
    }
  },
  methods: {
    init() {
      let url = `/lenovo-visible/api/visible-equipment/view/${this.deviceId}`;
      getAxiosData(url).then(res => {
        let status = res.data.status;
        let deviceType = res.data.cameraType;
        if (deviceType == "4") {
          this.isShow = true;
        } else {
          this.isShow = false;
        }
        this.$emit("on-show", this.isShow);
        this.status = res.data.status;
        if (status == "0") {
          this.title = "连接";
          this.status = "1";
        } else {
          this.title = "断开";
          this.status = "0";
        }
      });
    },
    connentSatus() {
      let url = `/lenovo-visible/api/visible-equipment/equip-connect/${this.deviceId}/${this.status}`;
      putAxiosData(url).then(res => {
        this.$message.success("操作成功");
        if (this.status == "1") {
          this.title = "断开";
          this.status = "0";
        } else {
          this.title = "连接";
          this.status = "1";
        }
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang='scss'>
.connectState {
  position: absolute;
  height: 30px;
  right: 250px;
  color: white;
  top: -40px;
  bottom: -66px;
}
</style>
