<template>
  <div class="btnSelectClick" ref="btnSelectClick" style="display: none">
    <div class="top">
      <p>切换摄像头</p>
    </div>
    <el-collapse-transition>
      <div class="searchCon">
        <div class="searchContain">
          <i class="iconfont icon-sousuo"></i>
          <input
            class="inputSearch selfInput checkbox"
            ref="selfInput"
            @keyup="onKeyup($event)"
            placeholder="搜索摄像头名称"
            v-model="titleMain"
          />
        </div>
        <el-radio-group v-model="checkedCities" @change="handleRadio">
          <div class="checkbox" v-for="(item,index) in useListData" :key="index">
            <div class="noCheck selectItem">
              <el-checkbox @click.native="showHide($event, item)">
                <div class="selectD" :class="{'routeR':item['isShow']}">
                  <i class="iconfont icon-xiala"></i>
                  <span>{{ item['type'] }}</span>
                </div>
              </el-checkbox>
            </div>
            <div class="groupCheck" :class="{'hideGroup':!item['isShow']}">
              <div class="selectItem" v-for="(child, Cindex) in item['children']" :key="Cindex">
                <el-radio
                  @click.native="hideSelect"
                  :title="child['item']['describeName']"
                  :label="child['item']['monitorDeviceId']"
                  :key="child['item']['monitorDeviceId']"
                >{{child['item']['describeName']}}</el-radio>
              </div>
            </div>
          </div>
        </el-radio-group>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import { getAxiosData, postAxiosData } from "@/api/axiosType";
import { editConfig } from "@/api/currency/currency.js";
import { mapState } from "vuex";
export default {
  name: "btnSelectClick",
  props: {
    userId: {
      type: String
    },
    displayType: {
      type: String | Number
    },
    cameraList: {
      type: Array
    },
    cameraData: {
      type: Object
    }
  },
  watch:{
    userId(now){
      this.init()
    }
  },
  data() {
    return {
      titleMain: "",
      useListData: [],
      checkedCities: "",
      showDataBackUp: [],
      TypeData: [],
      maxLength: 0,
      cameraListId: []
    };
  },
  computed: {
    ...mapState(["user"])
  },
  watch: {
    cameraData(now) {
      this.checkedCities = Number(now["monitorDeviceId"]);
    }
  },
  methods: {
    hideSelect(){
      this.$refs.btnSelectClick.style.display = "none";
    },
    showHide(event, item) {
      item["isShow"] = !item["isShow"];
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    onKeyup(event) {
      let that = this;
      let value = this.titleMain;
      if (event) {
        this.maxLength = 0;
      }
      this.maxLength++;
      if (this.maxLength < 50) {
        if (value != "") {
          let data = this.TypeData;
          let arr = [];
          let indexList = [];
          data.forEach((item, index) => {
            if (
              item["describeName"] &&
              item["describeName"].indexOf(value) > -1
            ) {
              indexList.push(index);
            }
          });
          let info = that.findInArray(that.showDataBackUp, indexList);
          this.useListData = info;
        } else {
          this.useListData = this.showDataBackUp;
        }
      }
    },
    findInArray(arr, indexList) {
      let data = [];
      for (let i = 0; i < arr.length; i++) {
        let type = arr[i]["type"];
        let isShow = arr[i]["isShow"];
        let children = arr[i]["children"].filter(item => {
          return indexList.indexOf(item["index"]) > -1;
        });
        if (children.length)
          data.push({ type: type, isShow: true, children: children });
      }
      return data;
    },
    init() {
      let that = this;
      let url = "/lenovo-device/api/monitor/all/select-list";
      let query = {
        userId: this.userId
      };
      getAxiosData(url, query).then(res => {
        if (res.data) {
          let dataB = res.data;
          dataB.map(item => {
            item["describeName"] = item["monitorDeviceName"];
          });
          let info = that.handleData(dataB);
          that.useListData = info;
          that.showDataBackUp = info;
          that.TypeData = dataB;
        }
      });
    },
    handleData(arr) {
      let data = [];
      arr.forEach((item, index) => {
        if (!this.inArrayType(data, item["type"], item, index)) {
          data.push({
            type: item["type"],
            isShow: true,
            children: [{ item: item, index: index }]
          });
        }
      });
      return data;
    },
    inArrayType(arr, type, item, index) {
      if (type == null) {
        return true;
      }
      let i = 0;
      for (i = 0; i < arr.length; i++) {
        if (arr[i]["type"] == type) {
          arr[i]["children"].push({ item: item, index: index });
          break;
        }
      }
      if (i == arr.length) {
        return false;
      } else {
        return true;
      }
    },
    handleRadio(id) {
      console.log(id);
      let that = this;
      console.log(this.cameraData["monitorDeviceId"]);
      this.cameraList.forEach((item, index) => {
        console.log(item["monitorDeviceId"]);
        if (this.cameraData["monitorDeviceId"] == item["monitorDeviceId"]) {
          let query = {
            ["cameraPos0" + (index + 1)]: id,
            userId: this.$store.state.user.configInfo["userId"],
            id: this.$store.state.user.configInfo.id
          };
          editConfig(query).then(res => {
            that.$store.state.app.isPush = true;
            if (res.data.isSuccess) {
              that.$message.success("切换成功");
              this.$parent.initConfigure(this.displayType);
            } else that.$message.error(res.msg);
          });
        }
      });
    },
    bindEvent(event) {
      const that = this;
      console.log(event);
      let path = event.path || (event.composedPath && event.composedPath());
      for (let i = 0; i < path.length; i++) {
        if (
          path[i].classList &&
          path[i].classList.length &&
          (path[i].classList.contains("selectTop") ||
            path[i].classList.contains("video-player") ||
            path[i].classList.contains("videoPlayer"))
        ) {
          return;
        }
      }
      if (that.$refs.btnSelectClick)
        that.$refs.btnSelectClick.style.display = "none";
    },
    onScroll(event) {
      console.log(event);
      if (!(event.target.className.indexOf("el-radio-group") > -1)) {
        if (this.$refs.btnSelectClick)
          this.$refs.btnSelectClick.style.display = "none";
      }
    }
  },
  beforeDestroy() {
    const that = this;
    window.removeEventListener("click", that.bindEvent);
    window.removeEventListener("scroll", that.onScroll);
  },
  mounted() {
    const that = this;
    window.addEventListener("click", that.bindEvent);
    window.addEventListener("scroll", that.onScroll, true);
    this.init();
  }
};
</script>

<style lang='scss'>
.btnSelectClick {
  z-index: 10;
  flex: 1;
  margin-left: 10px;
  background-color: #192f41;
  width: 300px;
  color: #fff;
  position: absolute;
  .top {
    cursor: pointer;
    line-height: 38px;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    i {
      cursor: pointer;
    }
  }
  .searchCon {
    padding: 10px;
    position: absolute;
    z-index: 10;
    width: 100%;
    background: linear-gradient(
      210deg,
      rgba(48, 107, 135, 0.9),
      rgba(28, 50, 64, 0.7) 60%
    );
    .el-radio-group {
      height: 200px;
      overflow-y: auto;
      width: 100%;
    }
    .searchContain {
      color: #fff;
      margin-bottom: 10px;
      display: flex;
      position: relative;
      i {
        position: absolute;
        left: 15px;
        top: 4px;
        color: white;
      }
      .inputSearch {
        padding-left: 40px;
        flex: 1;
        background: #6d8289;
        border: none;
        outline: none;
        text-align: center;
        border-radius: 15px;
        line-height: 31px;
        font-size: 14px;
        color: white;
      }
      ::placeholder {
        color: #fff;
      }
    }
    .selectItem {
      margin: 12px 0;
    }
    .noCheck {
      margin-bottom: 5px;
      .selectD {
        &.routeR {
          .icon-xiala {
            transform: rotate(180deg);
          }
        }
        .icon-xiala {
          transition: all 0.5s;
          position: absolute;
          left: 0;
          top: 0;
          width: 17px;
          height: 18px;
        }
        span {
          margin-left: 15px;
        }
      }
      .el-checkbox__input {
        display: none;
      }
      .el-checkbox__label {
        color: #fff;
      }
    }
    .groupCheck {
      max-height: 9999px;
      position: relative;
      overflow: hidden;
      transition: max-height 1s ease-in;
      margin-left: 25px;
      &.hideGroup {
        max-height: 0;
        transition: max-height 0.5s ease-out;
      }
      .el-radio {
        color: #fff;
      }
      .radio__label {
        color: #fff !important;
      }
      .el-checkbox__label {
        color: #fff;
      }
    }
  }
  .el-radio__input.is-checked + .el-radio__label {
    color: #fff;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background-color: #515970 !important;
    border-color: #515970 !important;
  }
  .el-radio-group::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .el-radio-group::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 20px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(255, 255, 255, 0.5);
  }
  .el-radio-group::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: rgba(0, 0, 0, 0);
  }
}
</style>
