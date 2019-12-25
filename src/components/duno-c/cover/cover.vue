<template>
  <div class="cover">
    <div>
      <img :src="srcData.pic" alt />
      <i class="iconfont icon-bofang" @click="handleShow"></i>
    </div>
    <el-tooltip effect="dark" content="点击查看摄像头详情" placement="top">
      <div v-if="isSecond" @click="getJump" class="explainy">
        <div class="text">
          <span>{{srcData.monitorDeviceName}}</span>
          <span>{{ srcData.interval?srcData.interval.replace(/至/,'-'):"" }}</span>
        </div>
        <span>
          <i class="iconfont icon-jiantou"></i>
        </span>
      </div>
    </el-tooltip>
    <enlarge
      :pushCamera="false"
      :isShow="isEnlarge"
      :modalBody="false"
      :srcData="srcData"
      @closeEnlarge="closeEnlarge"
      @on-end="toNext"
    ></enlarge>
  </div>
</template>

<script>
import enlarge from "_c/duno-c/enlarge";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
  name: "cover",
  data() {
    const that = this;
    return {};
  },
  components: {
    enlarge
  },
  watch: {
    monitorInfo: {
      handler(now) {
        this.monitorInfoR = now;
      },
      deep: true,
      immediate: true
    }
  },
  props: {
    videoList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    keyIndex: {
      type: Number | String,
      default: 0
    },
    aggregate: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    monitorInfo: {
      type: Object | Array,
      default() {
        return {};
      }
    },
    pushCamera: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    isSecond: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    srcData: {
      type: [Object, Array],
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      monitorInfoR: {},
      isEnlarge: false
    };
  },
  methods: {
    findIndex() {
      let addr = this.srcData.alarmFileAddress
        ? this.srcData.alarmFileAddress
        : this.srcData.streamAddr;
      return this.videoList.indexOf(addr);
    },
    toNext() {
      if (this.videoList.length) {
        let index = this.findIndex();
        index++;
        if (index == this.videoList.length) {
          return;
        }
        this.srcData.streamAddr = this.videoList[index];
        this.$forceUpdate();
      }
    },
    handleShow() {
      console.log(this.srcData);
      this.isEnlarge = true;
    },
    closeEnlarge() {
      this.isEnlarge = false;
    },
    getJump() {
      if (this.aggregate) {
        this.$router.push({
          path: "/surveillancePath/areaVideo",
          query: {
            areaId: this.areaId,
            showType: this.showType,
            powerDeviceId: this.powerDeviceId
          }
        });
        return;
      }
      console.log(this.monitorInfoR);
      getAxiosData("/lenovo-device/api/preset/type", {
        monitorDeviceId: this.monitorInfoR["monitorDeviceId"]
      }).then(res => {
        let supportPreset = res.data["supportPreset"];
        let monitorDeviceType = res.data["monitorDeviceType"];
        if (monitorDeviceType == 1 || monitorDeviceType == 5) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailLight",
              query: {
                monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                monitorDeviceName: this.monitorInfoR["monitorDeviceName"]
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailLightN",
              query: {
                monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                monitorDeviceName: this.monitorInfoR["monitorDeviceName"]
              }
            });
          }
        } else if (monitorDeviceType == 2) {
          if (supportPreset) {
            this.$router.push({
              path: "/surveillancePath/detailRed",
              query: {
                monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                monitorDeviceName: this.monitorInfoR["monitorDeviceName"],
                typeId: res.data["typeId"]
              }
            });
          } else {
            this.$router.push({
              path: "/surveillancePath/detailRedN",
              query: {
                monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
                monitorDeviceName: this.monitorInfoR["monitorDeviceName"],
                typeId: res.data["typeId"]
              }
            });
          }
        } else if (monitorDeviceType == 3 || monitorDeviceType == 9) {
          this.$router.push({
            path: "/surveillancePath/detailEnv",
            query: {
              monitorDeviceId: this.monitorInfoR["monitorDeviceId"],
              monitorDeviceName: this.monitorInfoR["monitorDeviceName"]
            }
          });
        } else if (monitorDeviceType == 6) {
          this.$router.push({
            path: "/surveillancePath/detailUbiquitou",
            query: {
              monitorDeviceId: this.monitorInfoR["monitorDeviceId"]
            }
          });
        }
      });
    }
  }
};
</script>

<style lang='scss'>
.cover {
  width: 100%;
  height: 100%;
  position: relative;
  & > div:first-child {
    padding-bottom: 56%;
    position: relative;
  }
  img {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    display: block;
  }
  .icon-bofang {
    cursor: pointer;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
    color: #fff;
    z-index: 10;
  }
  .explainy {
    color: #fff;
    // height: 32px;
    line-height: 25px;
    background-color: #213848;
    font-size: 12px;
    padding-left: 10px;
    padding-right: 10px;
    width: 100%;
    bottom: -3px;
    display: flex;
    justify-content: space-between;
    span {
      display: flex;
      flex: none !important;
      align-items: center;
      text-align: right !important;
      cursor: pointer;
    }
    .demonstration {
      margin-left: 0;
      margin-right: 2%;
    }
    i {
      font-size: 15px;
      margin-right: 10px;
    }
    .text {
      overflow: hidden;
      display: block;
      justify-content: flex-start;
      width: 100%;
      span {
        padding-right: 10px;
        font-size: 14px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: block;
        white-space: nowrap;
        text-align: left !important;
      }
      // span:nth-child(2) {
      //   padding-right: 10px;
      //   font-size: 12px;
      //   color: #a0a0a0;
      // }
    }
  }
}
</style>
