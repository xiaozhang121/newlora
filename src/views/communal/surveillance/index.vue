<template>
  <div class="surveillance">
    <div class="title" style="margin-bottom: 15px">
      <div>
        <span>视频监控</span>
        <span class="nr">( {{ layoutTypeName }} )</span>
      </div>
      <div class="btnSelect">
        <duno-btn-top
          @on-select="onSelect"
          class="dunoBtnTop"
          :isCheck="false"
          :dataList="dataList"
          :isLayout="true"
          :displayType="displayType"
          title="切换布局"
          :showBtnList="false"
        ></duno-btn-top>
        <btn-select ref="btnTopRef" :cameraList='cameraList' :displayType="displayType" @on-active="handleActiveBtn"></btn-select>
      </div>
    </div>
    <div class="first" v-if="displayType == '1'">
      <div class="left">
        <key-monitor
          :isPic="isPicAddr01"
          :monitorInfo="monitorInfo01"
          :kilovolt="$store.state.user.configInfo['camera01Name']"
          :autoplay="true"
          :isLive="false"
          :isNav="true"
          :pushCamera="false"
          width="100%"
          paddingBottom="75%"
          :streamAddr="streamAddr01"
          :showBtmOption="true"
          @change-video="changeVideo"
          class="monitorF child"
        ></key-monitor>
      </div>
      <div class="right">
        <div class="item">
          <key-monitor
            :isPic="isPicAddr02"
            :monitorInfo="monitorInfo02"
            :kilovolt="$store.state.user.configInfo['camera02Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            width="100%"
            paddingBottom="75%"
            :streamAddr="streamAddr02"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorF child"
          ></key-monitor>
        </div>
        <div class="item">
          <key-monitor
            :isPic="isPicAddr03"
            :monitorInfo="monitorInfo03"
            :kilovolt="$store.state.user.configInfo['camera03Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            width="100%"
            paddingBottom="75%"
            :streamAddr="streamAddr03"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorF child"
          ></key-monitor>
        </div>
        <div class="item">
          <key-monitor
            :isPic="isPicAddr04"
            :monitorInfo="monitorInfo04"
            :kilovolt="$store.state.user.configInfo['camera04Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            width="100%"
            paddingBottom="75%"
            :streamAddr="streamAddr04"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorF child"
          ></key-monitor>
        </div>
        <div class="item">
          <key-monitor
            :isPic="isPicAddr05"
            :monitorInfo="monitorInfo05"
            :kilovolt="$store.state.user.configInfo['camera05Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            width="100%"
            paddingBottom="75%"
            :streamAddr="streamAddr05"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorF child"
          ></key-monitor>
        </div>
      </div>
    </div>
    <div class="third" v-if="displayType == '3'">
      <div class="item_main">
        <div class="item">
          <key-monitor
            :isPic="isPicAddr01"
            :monitorInfo="monitorInfo01"
            :kilovolt="$store.state.user.configInfo['camera01Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            imgAdress
            paddingBottom="75%"
            :streamAddr="streamAddr01"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorM child"
          ></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor
            :isPic="isPicAddr02"
            :monitorInfo="monitorInfo02"
            :kilovolt="$store.state.user.configInfo['camera02Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            imgAdress
            paddingBottom="75%"
            :streamAddr="streamAddr02"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorM child"
          ></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor
            :isPic="isPicAddr03"
            :monitorInfo="monitorInfo03"
            :kilovolt="$store.state.user.configInfo['camera03Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            imgAdress
            paddingBottom="75%"
            :streamAddr="streamAddr03"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorM child"
          ></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor
            :isPic="isPicAddr04"
            :monitorInfo="monitorInfo04"
            :kilovolt="$store.state.user.configInfo['camera04Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            imgAdress
            paddingBottom="75%"
            :streamAddr="streamAddr04"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorM child"
          ></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor
            :isPic="isPicAddr05"
            :monitorInfo="monitorInfo05"
            :kilovolt="$store.state.user.configInfo['camera05Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            imgAdress
            paddingBottom="75%"
            :streamAddr="streamAddr05"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorM child"
          ></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor
            :isPic="isPicAddr06"
            :monitorInfo="monitorInfo06"
            :kilovolt="$store.state.user.configInfo['camera06Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            imgAdress
            paddingBottom="75%"
            :streamAddr="streamAddr06"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorM child"
          ></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor
            :isPic="isPicAddr07"
            :monitorInfo="monitorInfo07"
            :kilovolt="$store.state.user.configInfo['camera07Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            imgAdress
            paddingBottom="75%"
            :streamAddr="streamAddr07"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorM child"
          ></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor
            :isPic="isPicAddr08"
            :monitorInfo="monitorInfo08"
            :kilovolt="$store.state.user.configInfo['camera08Name']"
            :autoplay="true"
            :isLive="false"
            :isNav="true"
            :pushCamera="false"
            imgAdress
            paddingBottom="75%"
            :streamAddr="streamAddr08"
            :showBtmOption="true"
            @change-video="changeVideo"
            class="monitorM child"
          ></key-monitor>
        </div>
      </div>
    </div>
    <div class="title" style="margin: 0 0 15px;">
      <span>{{ oltagevLevel }}</span>
      <duno-btn-top
        @on-select="onSelectVol"
        class="dunoBtnTop powerLevelSelect"
        :isCheck="false"
        style="margin-left: 10px"
        :dataList="oltagevLevelList"
        :title="titleValue"
        :showBtnList="false"
      ></duno-btn-top>
    </div>
    <div v-if="isSwiper" class="oltagevMain">
      <div
        class="item_main"
        v-for="(item, index) in areaCameraList"
        :key="'camera'+index"
        :class="{noMarginRight:(index+1)%4 == 0}"
      >
        <div class="item">
          <key-monitor
            popInfo="点击查看该区域内所有摄像头"
            :autoplay="false"
            :noButton="false"
            :aggregate="true"
            :isLive="false"
            :isNav="true"
            :monitorInfo="{monitorDeviceId: item['monitorDeviceId']}"
            :imgAdress="item['pic']"
            :kilovolt="item['areaName']"
            :areaId="item['areaId']"
            :showType="activeAreaId"
            :powerDeviceId="item['powerDeviceId']"
            :streamAddr="item['streamAddr']"
            :showBtmOption="true"
            paddingBottom="75%"
            class="monitorM child"
          ></key-monitor>
        </div>
      </div>
    </div>
    <div v-else class="oltagevMainBig">
      <swiper :options="swiperOption">
        <swiper-slide v-for="(item, index) in areaCameraList" :key="'camera'+index">
          <key-monitor
            popInfo="点击查看该区域内所有摄像头"
            :autoplay="false"
            :noButton="false"
            :aggregate="true"
            :isLive="false"
            :isNav="true"
            :monitorInfo="{monitorDeviceId: item['monitorDeviceId']}"
            :imgAdress="item['pic']"
            :kilovolt="item['areaName']"
            :areaId="item['areaId']"
            :showType="activeAreaId"
            paddingBottom="75%"
            :powerDeviceId="item['powerDeviceId']"
            :streamAddr="item['streamAddr']"
            :showBtmOption="true"
            class="monitorM child"
          ></key-monitor>
        </swiper-slide>
        <div class="swiper-button-prev" slot="button-prev"></div>
        <div class="swiper-button-next" slot="button-next"></div>
      </swiper>
    </div>
    <div class="test"></div>
    <btn-select-click
      class="selectTop"
      ref="selectTop"
      :cameraData="cameraData"
      :displayType="displayType"
      :cameraList="cameraList"
      :userId="$store.state.user.configInfo['userId']"
      @change-camera='changeCamera'
    ></btn-select-click>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css";
import { swiper, swiperSlide } from "vue-awesome-swiper";
import { initConfigure } from "@/api/user";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import btnSelect from "_c/duno-c/btnSelect";
import btnSelectClick from "_c/duno-c/btnSelectClick";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
import mixinViewModule from "@/mixins/view-module";
import { editConfig, getAreaList } from "@/api/currency/currency.js";
import { mapState } from "vuex";
const MAXAJAX = 6;
export default {
  mixins: [mixinViewModule],
  name: "surveillance",
  components: {
    dunoBtnTop,
    KeyMonitor,
    swiper,
    swiperSlide,
    btnSelect,
    btnSelectClick
  },
  computed: {
    ...mapState(["user"]),
    isPush() {
      return this.$store.state.app.isPush;
    },
    displayType() {
      return this.$store.state.user.configInfo["displayType"];
    },
    monitorInfo01() {
      try {
        if (this.cameraList[0]["monitorDeviceId"])
          return {
            monitorDeviceId: this.cameraList[0]["monitorDeviceId"],
            monitorDeviceName: this.cameraList[0]["monitorDeviceName"]
          };
        else {
          return {};
        }
      } catch (e) {}
    },
    monitorInfo02() {
      try {
        if (this.cameraList[1]["monitorDeviceId"])
          return {
            monitorDeviceId: this.cameraList[1]["monitorDeviceId"],
            monitorDeviceName: this.cameraList[1]["monitorDeviceName"]
          };
        else {
          return {};
        }
      } catch (e) {}
    },
    monitorInfo03() {
      try {
        if (this.cameraList[2]["monitorDeviceId"])
          return {
            monitorDeviceId: this.cameraList[2]["monitorDeviceId"],
            monitorDeviceName: this.cameraList[2]["monitorDeviceName"]
          };
        else {
          return {};
        }
      } catch (e) {}
    },
    monitorInfo04() {
      try {
        if (this.cameraList[3]["monitorDeviceId"])
          return {
            monitorDeviceId: this.cameraList[3]["monitorDeviceId"],
            monitorDeviceName: this.cameraList[3]["monitorDeviceName"]
          };
        else {
          return {};
        }
      } catch (e) {}
    },
    monitorInfo05() {
      try {
        if (this.cameraList[4]["monitorDeviceId"])
          return {
            monitorDeviceId: this.cameraList[4]["monitorDeviceId"],
            monitorDeviceName: this.cameraList[4]["monitorDeviceName"]
          };
        else {
          return {};
        }
      } catch (e) {}
    },
    monitorInfo06() {
      try {
        if (this.cameraList[5]["monitorDeviceId"])
          return {
            monitorDeviceId: this.cameraList[5]["monitorDeviceId"],
            monitorDeviceName: this.cameraList[5]["monitorDeviceName"]
          };
        else {
          return {};
        }
      } catch (e) {}
    },
    monitorInfo07() {
      try {
        if (this.cameraList[6]["monitorDeviceId"])
          return {
            monitorDeviceId: this.cameraList[6]["monitorDeviceId"],
            monitorDeviceName: this.cameraList[6]["monitorDeviceName"]
          };
        else {
          return {};
        }
      } catch (e) {}
    },
    monitorInfo08() {
      try {
        if (this.cameraList[7]["monitorDeviceId"])
          return {
            monitorDeviceId: this.cameraList[7]["monitorDeviceId"],
            monitorDeviceName: this.cameraList[7]["monitorDeviceName"]
          };
        else {
          return {};
        }
      } catch (e) {}
    },
    isPicAddr01() {
      try {
        if (this.cameraList[0]["isPic"])
          return this.cameraList[0]["isPic"] == 1;
        else {
          return "";
        }
      } catch (e) {}
    },
    isPicAddr02() {
      try {
        if (this.cameraList[1]["isPic"])
          return this.cameraList[1]["isPic"] == 1;
        else {
          return "";
        }
      } catch (e) {}
    },
    isPicAddr03() {
      try {
        if (this.cameraList[2]["isPic"])
          return this.cameraList[2]["isPic"] == 1;
        else {
          return "";
        }
      } catch (e) {}
    },
    isPicAddr04() {
      try {
        if (this.cameraList[3]["isPic"])
          return this.cameraList[3]["isPic"] == 1;
        else {
          return "";
        }
      } catch (e) {}
    },
    isPicAddr05() {
      try {
        if (this.cameraList[4]["isPic"])
          return this.cameraList[4]["isPic"] == 1;
        else {
          return "";
        }
      } catch (e) {}
    },
    isPicAddr06() {
      try {
        if (this.cameraList[5]["isPic"])
          return this.cameraList[5]["isPic"] == 1;
        else {
          return "";
        }
      } catch (e) {}
    },
    isPicAddr07() {
      try {
        if (this.cameraList[6]["isPic"])
          return this.cameraList[6]["isPic"] == 1;
        else {
          return "";
        }
      } catch (e) {}
    },
    isPicAddr08() {
      try {
        if (this.cameraList[7]["isPic"])
          return this.cameraList[7]["isPic"] == 1;
        else {
          return "";
        }
      } catch (e) {}
    },
    streamAddr01() {
      try {
        if (this.cameraList[0]["streamAddr"])
          return this.cameraList[0]["streamAddr"];
        else {
          return "";
        }
      } catch (e) {}
    },
    streamAddr02() {
      try {
        if (this.cameraList[1]["streamAddr"])
          return this.cameraList[1]["streamAddr"];
        else {
          return "";
        }
      } catch (e) {}
    },
    streamAddr03() {
      try {
        if (this.cameraList[2]["streamAddr"])
          return this.cameraList[2]["streamAddr"];
        else {
          return "";
        }
      } catch (e) {}
    },
    streamAddr04() {
      try {
        if (this.cameraList[3]["streamAddr"])
          return this.cameraList[3]["streamAddr"];
        else {
          return "";
        }
      } catch (e) {}
    },
    streamAddr05() {
      try {
        if (this.cameraList[4]["streamAddr"])
          return this.cameraList[4]["streamAddr"];
        else {
          return "";
        }
      } catch (e) {}
    },
    streamAddr06() {
      try {
        if (this.cameraList[5]["streamAddr"])
          return this.cameraList[5]["streamAddr"];
        else {
          return "";
        }
      } catch (e) {}
    },
    streamAddr07() {
      try {
        if (this.cameraList[6]["streamAddr"])
          return this.cameraList[6]["streamAddr"];
        else {
          return "";
        }
      } catch (e) {}
    },
    streamAddr08() {
      try {
        if (this.cameraList[7]["streamAddr"])
          return this.cameraList[7]["streamAddr"];
        else {
          return "";
        }
      } catch (e) {}
    },
    layoutTypeName() {
      try {
        return this.dataList[
          this.$store.state.user.configInfo["displayType"] - 1
        ]["describeName"];
      } catch (e) {}
    }
  },
  watch: {
    isPush: {
      handler(now) {
        if (now) {
          // this.cameraList = this.$store.state.app.pushData;
          this.initData();
          this.initConfigure(1);
          this.$forceUpdate();
          this.$store.state.app.isPush = false;
        }
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    return {
      socketUrl: "10.0.0.164:8081",
      activeAreaId: "",
      dataForm: {},
      titleType: "选择摄像头显示来源",
      titleLayout: "切换布局",
      titleValue: "按电源回路",
      cameraList: [],
      TypeData: [],
      lastSelect: [],
      cameraData: {},
      isSwiper: true,
      swiperOption: {
        slidesPerView: 3,
        spaceBetween: 20,
        slidesPerGroup: 1,
        loop: true,
        loopFillGroupWithBlank: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev"
        }
      },
      dataList: [
        {
          describeName: "布局一",
          format: 1,
          isActive: true
        },
        {},
        // {
        //   describeName: "布局二",
        //   format: 2,
        //   isActive: false
        // },
        {
          describeName: "布局二",
          format: 3,
          isActive: false
        }
      ],
      areaCameraList: [],
      oltagevLevelList: [],
      oltagevLevel: "所有电压等级",
      layoutType: 1
      // setDefault: "1",
      // ajaxCount: 0
    };
  },
  methods: {
    handleActiveBtn(data) {
      let that = this;
      let type = that.displayType;
      let cameraPos0 = null;
      let obj = {};
      for (let i = 0; i < data.length; i++) {
        obj["cameraPos0" + (i + 1)] = data[i];
      }
      let query = {
        ...obj,
        userId: this.$store.state.user.configInfo["userId"],
        id: this.$store.state.user.configInfo.id
      };
      editConfig(query).then(res => {
        if (res.data.isSuccess) {
          that.initConfigure(type);
          that.initData()
          that.$forceUpdate();
        } else that.$message.error(res.msg);
      });
    },
    onDisabled(now) {
      let type = this.$store.state.user.configInfo["displayType"];
      let length = this.lastSelect.length;
      let lengthNow = now.length;
      if ((type == 1 || type == 2) && now.length > 3) {
        this.$refs.btnTopRef.disabled = true;
      } else if (type == 3 && now.length > 7) {
        this.$refs.btnTopRef.disabled = true;
      } else {
        this.$refs.btnTopRef.disabled = false;
      }
      this.lastSelect = now;
    },
    deviceShowHandle(arr) {
      const that = this;
      let type = this.$store.state.user.configInfo["displayType"];
      let target = arr.filter(item => {
        return item["isActive"] == true;
      });
      let data = [];
      target.forEach(item => {
        data.push(item["monitorDeviceId"]);
      });
      if ((type == 1 || type == 2) && data.length > 3) {
        this.$refs.btnTopRef.disabled = true;
      } else if (type == 3 && data.length > 7) {
        this.$refs.btnTopRef.disabled = true;
      } else {
        this.$refs.btnTopRef.disabled = false;
      }
      let cameraPos0 = null;
      let obj = {};
      for (let i = 0; i < data.length; i++) {
        obj["cameraPos0" + (i + 1)] = data[i];
      }
      // this.ajaxCount++;
      // if (this.ajaxCount > MAXAJAX) {
      //   this.setDefault = "0";
      // }
      let query = {
        ...obj,
        userId: this.$store.state.user.configInfo["userId"],
        id: this.$store.state.user.configInfo.id
        // setDefault: this.setDefault
      };
      editConfig(query).then(res => {
        if (res.data.isSuccess) {
          that.initConfigure(type);
          that.$forceUpdate();
        } else that.$message.error(res.msg);
      });
    },
    initConfigure(type) {
      const that = this;
      if (type != null) {
        initConfigure({
          userId: this.$store.state.user.userId,
          type: type
        }).then(res => {
          that.$store.state.user.configInfo = res.data;
        });
      }
    },
    getArea() {
      getAxiosData(
        "/lenovo-device/api/area-circuit/select-list"
      ).then(res => {
        let data = res.data;
        let arr = [];
        data.forEach(item => {
          arr.push({
            describeName: item["label"],
            areaId: item["value"],
            id: item["value"]
          });
        });
        this.oltagevLevelList = arr;
        if (arr[0]) this.titleValue = arr[0]["describeName"];
        this.getCamera(arr[0]["areaId"]);
        this.$forceUpdate();
      });
    },
    initData() {
      const that = this;
      getAxiosData("/lenovo-device/api/monitor/layout-list", {
        userId: this.$store.state.user.userId
      }).then(res => {
        that.cameraList = res.data;
        that.$forceUpdate();
        let Array = [];
        that.cameraList.forEach(el => {
          Array.push(el.monitorDeviceId);
        });
      });
    },
    onSelect(item, index) {
      this.$store.state.user.configInfo["displayType"] = item["format"];
      editConfig({
        id: this.$store.state.user.configInfo["id"],
        userId: this.$store.state.user.configInfo["userId"],
        displayType: item["format"]
      }).then(res => {
        sessionStorage.setItem("format", item["format"]);
        this.layoutType = item["format"];
        if (this.layoutType == 3 && this.lastSelect.length < 8) {
          this.$refs.btnTopRef.disabled = false;
        } else if (
          (this.layoutType == 1 || this.layoutType == 2) &&
          this.lastSelect.length < 4
        ) {
          this.$refs.btnTopRef.disabled = false;
        } else {
          this.$refs.btnTopRef.disabled = true;
        }
        this.$refs.btnTopRef.init();
        this.getCameraType();
        this.initConfigure(item["format"]);
      });
    },
    onSelectVol(item) {
      this.activeAreaId = item["areaId"];
      this.titleValue = item["describeName"];
      if (this.titleValue == "按电压等级") {
        this.oltagevLevel = "所有电压等级";
      } else {
        this.oltagevLevel = "所有电器回路";
      }
      this.getCamera(item["areaId"]);
    },
    getCameraType() {
      // this.ajaxCount++;
      // if (this.ajaxCount > MAXAJAX) {
      //   this.setDefault = "0";
      // }
      let that = this;
      let type = this.$store.state.user.configInfo["displayType"];
      let url = "/lenovo-device/api/monitor/all/select-list";
      let query = {
        userId: this.$store.state.user.configInfo["userId"]
        // setDefault: this.setDefault
      };
      getAxiosData(url, query).then(res => {
        if (res.data) {
          let data = res.data;
          data = data.filter(item => {
            return item["isSelected"] == true || item["isSelected"] == 1;
          });
          // console.log(data);
          let dataA;
          if ((type == 1 || type == 2) && data.length > 4) {
            dataA = data.slice(0, 3);
          } else {
            dataA = data;
          }
          if (dataA.length) {
            let arr = [];
            dataA.forEach(item => {
              if (item["monitorDeviceName"] != null)
                arr.push(item["monitorDeviceName"]);
            });
            that.$nextTick(() => {
              // that.$refs.btnTopRef.checkedCities = arr;
              that.onDisabled(arr);
            });
          } else {
            that.$nextTick(() => {
              // that.$refs.btnTopRef.checkedCities = [];
            });
          }
          let dataB = res.data;
          dataB.map(item => {
            if (item["isSelected"] == true || item["isSelected"] == 1)
              item["isActive"] = true;
            item["describeName"] = item["monitorDeviceName"];
          });
          that.TypeData = dataB;
        }
      });
    },
    getCamera(areaId) {
      const that = this;
      let query = {};
      if (areaId) {
        query["showType"] = areaId;
      }
      getAxiosData("/lenovo-device/api/monitor/vol-list", query).then(res => {
        if (res.code == 200) {
          let data = res.data;
          that.areaCameraList = data;
          that.$forceUpdate();
        }
      });
    },
    changeVideo(item, event) {
      this.cameraData = item;
      let pageX = Number(event.pageX);
      let pageY = Number(event.pageY);
      let dom = this.$refs.selectTop.$el;
      dom.style.left = pageX + "px";
      dom.style.top = pageY - 80 + "px";
      this.$refs.selectTop.$refs.btnSelectClick.style.display = "block";
      // this.$refs.selectTop.checkedCities = item["monitorDeviceId"];
    },
    changeCamera(){
      let that = this
      that.initConfigure(this.displayType);
      that.initData();
      that.$refs.btnTopRef.init()
    }
  },
  created() {
    if (document.documentElement.clientWidth < 1366) {
      this.isSwiper = false;
    }
    // this.getArea();
    this.initData();
    this.initConfigure(1);
    this.getCameraType();
  }
};
</script>

<style lang="scss">
.surveillance {
  .keyMonitor .camera .explain .block {
    visibility: hidden;
  }
  .keyMonitor .camera .explain .record {
    display: flex;
  }
  .noMarginRight {
    margin-right: 0 !important;
  }
  width: 100%;
  .cameraImg {
    z-index: 0 !important;
  }
  .monitorM {
    width: 100% !important;
    height: 100% !important;
    position: absolute;
  }
  .widthA {
    width: 100% !important;
    position: relative;
  }
  .single {
    width: 100% !important;
    height: 50% !important;
  }
  .hidden {
    display: none;
  }
  .topHeight {
    padding-bottom: 34% !important;
  }
  .dunoBtnTop {
    width: 155px;
    display: inline-flex;
    padding-bottom: 0;
    .btnList {
      top: inherit !important;
      width: 155px;
      .title {
        font-size: 15px;
      }
    }
  }
  .title {
    color: white;
    display: flex;
    height: 38px;
    // align-items: center;
    justify-content: space-between;
    .icon-zuoyoubuju,
    .icon-shangxiabuju {
      font-size: 18px;
      margin-right: 7px;
    }
    & > div:first-child {
      line-height: 38px;
    }
    .nr {
      font-size: 16px;
      margin-right: 10px;
    }
    .btnSelect {
      width: 551px;
      display: -webkit-box;
    }
  }
  .main {
    display: flex;
    width: 99.5%;
    .left_main {
      width: 80.7%;
      .left {
        position: relative;
        width: 100%;
        padding-bottom: 56%;
      }
    }
    .right_main {
      width: 24.2%;
      .right {
        position: relative;
        width: 100%;
        padding-bottom: 56%;
        margin-left: 3.3%;
        margin-bottom: 9.3%;
      }
    }
  }
  .oltagevMainBig {
    height: 380px;
    width: 100%;
    .swiper-container {
      height: 330px;
    }
  }
  .oltagevMain {
    // height: 400px;
    width: 100%;
    zoom: 1;
    &:after {
      clear: both;
      content: "";
      display: block;
      width: 0;
      height: 0;
      visibility: hidden;
    }
    &.second {
      margin-top: 3%;
      .item_main {
        margin-right: 1% !important;
      }
      .item_main:last-child {
        margin-right: 0 !important;
      }
    }
    .item_main {
      float: left;
      width: calc(97% / 4);
      margin-right: 1%;
      margin-bottom: 3%;
      .item {
        position: relative;
        width: 100%;
        padding-bottom: 80%;
        .swiper-slide {
          height: 100%;
        }
      }
    }
    // .item_main:nth-last-child(3n-1) {
    // }
  }
  .first {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 65px;
    @media screen and (max-width: 1366px) {
      margin-bottom: 40px;
    }
    @media screen and (min-width: 3500px) {
      margin-bottom: 40px;
    }
    .left {
      width: 50.9%;
      @media screen and (max-width: 1366px) {
        width: 51.9%;
      }
      @media screen and (min-width: 3500px) {
        width: 51.9%;
      }
    }
    .right {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      margin-left: 0.5%;
      .item {
        width: 49.5%;
      }
      & > div:nth-child(odd) {
        margin-right: 1%;
      }
      & > div:nth-child(n + 3) {
        margin-top: 40px;
      }
    }
  }
  .third {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    .item_main {
      width: calc(25% - 15px);
      position: relative;
      margin-bottom: 60px;
      .item {
        position: relative;
        .monitorM {
          position: relative !important;
        }
      }
    }
  }
  .monitorF.child {
    .vjs-fluid {
      padding-top: 75%;
    }
  }
  .monitorM.swip {
    .vjs-fluid {
      padding-top: 56%;
    }
  }
  .monitorM.child {
    .vjs-fluid {
      padding-top: 75%;
    }
  }
  .monitorM.first {
    .vjs-fluid {
      padding-top: 56%;
    }
  }
  .monitorM.second {
    .vjs-fluid {
      padding-top: 32%;
    }
  }
  .oltagevMain.second {
    .vjs-fluid {
      padding-top: 56%;
    }
  }
  .swiper-button-prev,
  .swiper-button-next {
    height: 50px;
    width: 50px;
    border-radius: 50%;
    background-color: rgba(42, 56, 63, 0.8);
    background-size: 50% 50%;
    font-size: 30px;
  }
  .swiper-button-next {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M27 22L5 44l-2.1-2.1L22.8 22 2.9 2.1 5 0l22 22z' fill='%23ffffff'/%3E%3C/svg%3E");
  }
  .swiper-button-prev {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M0 22L22 0l2.1 2.1L4.2 22l19.9 19.9L22 44 0 22z' fill='%23ffffff'/%3E%3C/svg%3E");
  }
  .powerLevelSelect {
    .selfInput {
      height: 0;
    }
    .icon-xiala {
      font-size: 9px;
      position: absolute;
      right: 20px;
      top: 1px;
      height: 37px;
    }
  }
}
</style>
