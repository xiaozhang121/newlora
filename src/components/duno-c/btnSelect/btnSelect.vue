<template>
  <div class="btn-selectV">
    <div class="top" @click="handleShow">
      <p>选择摄像头显示来源</p>
      <i class="iconfont icon-xiala"></i>
    </div>
    <el-collapse-transition>
      <div class="searchCon" v-show="showData">
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
        <el-radio-group v-model="checkedCities">
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
                <!-- <el-radio
                  :title="child['item']['describeName']"
                  :label="child['item']['monitorDeviceId']"
                  :key="child['item']['monitorDeviceId']"
                  @click.native="handleActive(child['item']['monitorDeviceId'], child['item'])"
                >{{child['item']['describeName']}}</el-radio>
                :disabled="(isDisabled(child['item']['monitorDeviceId']))"-->
                <el-checkbox
                  :label="child['item']['monitorDeviceId']"
                  :checked="child['item']['isSelected']=='1'"
                  :disabled="(isDisabled(child['item']['monitorDeviceId']))"
                  @click.stop.native="handleActive(child['item']['monitorDeviceId'], child['item'])"
                >{{child['item']['describeName']}}</el-checkbox>
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
import { putAxiosData } from "../../../api/axiosType";
export default {
  name: "btnSelect",
  props: {
    setDefault: {
      type: String
    },
    userId: {
      type: String
    }
  },
  data() {
    return {
      isClick: false,
      showData: false,
      titleMain: "",
      useListData: [],
      checkedCities: [],
      showDataBackUp: [],
      TypeData: [],
      maxLength: 0
    };
  },
  methods: {
    handleShow() {
      this.showData = !this.showData;
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
        userId: this.userId,
        setDefault: this.setDefault
      };
      getAxiosData(url, query).then(res => {
        if (res.data) {
          let data = res.data;
          data = data.filter(item => {
            return item["isSelected"] == true || item["isSelected"] == 1;
          });
          if (data.length) {
            let arr = [];
            data.forEach(item => {
              if (item["monitorDeviceId"] != null)
                arr.push(item["monitorDeviceId"]);
            });
            that.$nextTick(() => {
              that.checkedCities = arr;
              console.log(that.checkedCities);
            });
          } else {
            that.$nextTick(() => {
              that.checkedCities = [];
            });
          }
          let dataB = res.data;
          dataB.map(item => {
            if (item["isSelected"] == true || item["isSelected"] == 1)
              item["isActive"] = true;
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
    handleActive(index, flag) {
      let isClick = this.isDisabled(index);
      if (isClick) {
        return false;
      } else {
        if (flag["isActive"]) {
          this.checkedCities.forEach((item, i) => {
            if (item == index) {
              this.checkedCities.splice(i, 1);
            }
          });
          this.$emit("on-active", this.checkedCities, true);
        } else {
          let length = this.checkedCities.length;
          let obj = {};
          obj["cameraPos0" + (length + 1)] = index;
          this.$emit("on-active", obj, false);
        }
      }
    },
    isDisabled(id) {
      let length = this.checkedCities.length;
      if (length < 8) {
        return false;
      } else {
        if (this.checkedCities.indexOf(id) > -1) {
          return false;
        } else {
          return true;
        }
      }
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style lang='scss'>
.btn-selectV {
  flex: 1;
  margin-left: 10px;
  background-color: #192f41;
  color: #fff;
  position: relative;
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
      height: 250px;
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
      .el-checkbox__label {
        color: #fff;
      }
      // .el-checkbox__input.is-checked .el-checkbox__inner {
      //   background-color: #fff;
      //   border-color: #fff;
      // }
      // .el-checkbox__inner::after {
      //   border: 1px solid #000;
      //   border-left: 0;
      //   border-top: 0;
      // }
    }
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
