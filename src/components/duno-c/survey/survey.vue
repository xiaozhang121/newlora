<template>
  <el-form-item label="被监测设备" class="survey-dropDown">
    <el-input
      v-model="monitorValue"
      placeholder="请选择（非必选）"
      :disabled="isEdit"
      @focus="show3 = true"
    ></el-input>
    <!-- @blur="show3 = false" -->
    <i class="el-icon-arrow-down dropDown-i" :class="{rotate:show3}" @click="changeDrop"></i>
    <el-collapse-transition>
      <div class="diviceSelect" v-show="!isEdit&&show3">
        <el-input placeholder="请输入内容" v-model="diviceSelect" @input="search" clearable></el-input>
        <div class="drop-scroll">
          <!--数据格式 [{title:"1000千伏区域",data:[{},{},{}]},{title:"500千伏区域",data:[{},{},{}]},] -->
          <el-collapse v-model="value1" v-for="(item,index) in dataList" :key="index">
            <el-panel :name="index+'1'">
              {{item.areaName}}区域
              <el-checkbox-group v-model="checkList" @change="handleCheck(index)" slot="content">
                <el-checkbox v-for="(data,i) in item.deviceList" :key="i" :label="data.deviceName"></el-checkbox>
              </el-checkbox-group>
            </el-panel>
          </el-collapse>
        </div>
      </div>
    </el-collapse-transition>
  </el-form-item>
</template>

<script>
import {
  getAxiosData,
  postAxiosData,
  putAxiosData,
  deleteDataId
} from "@/api/axiosType";
export default {
  name: "survey",
  props: {
    monitor: {
      type: String,
      default: () => {
        return "";
      }
    },
    isEdit: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  watch: {
    monitor(now) {
      this.diviceValue = now;
    }
  },
  data() {
    return {
      monitorValue: "",
      show3: false,
      diviceSelect: "",
      dataList: [],
      allData: [],
      checkList: [],
      value1: ["1", "2", "3"]
    };
  },
  methods: {
    changeDrop() {
      this.show3 = !this.show3;
    },
    initDevice() {
      let url = "/lenovo-device/api/device/area/list";
      getAxiosData(url).then(res => {
        this.dataList = res.data;
        this.allData = res.data;
        let len = this.dataList.length;
      });
    },
    handleCheck(index) {
      console.log(index);
      console.log(this.checkList);
    },
    search() {
      let title = this.diviceSelect;
      let data = this.dataList;
      let len = data.length;
      let selectData = [];
      let deviceData = [];
      if (title == "") {
        this.dataList = this.allData;
      } else {
        for (let i = 0; i < len; i++) {
          data[i].deviceList.forEach(el => {
            if (el["deviceName"].indexOf(title) > -1) {
              deviceData.push(el);
            }
          });
          if (deviceData.length > 0) {
            selectData.push({
              areaId: data.areaId,
              areaName: data.areaName,
              deviceList: deviceData
            });
          }
        }
        this.dataList = selectData;
      }
    }
  },
  mounted() {
    this.initDevice();
  }
};
</script>

<style lang='scss'>
.survey-dropDown {
  position: relative;
  .dropDown-i {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #c0c4cc;
    cursor: pointer;
    display: inline-block;
  }
  .rotate {
    transform: rotate(-180deg);
    transition: All 0.4s;
  }
  .diviceSelect {
    position: absolute;
    z-index: 10;
    width: 340px;
    margin-top: 5px;
    background: #eee;
    border-radius: 5px;
    padding: 10px 20px;
    .el-input__inner {
      border-radius: 20px;
    }
    & > div:nth-child(2) {
      height: 200px;
      overflow-y: auto;
    }
    .drop-scroll {
      .ivu-collapse {
        border: none;
        background-color: rgba(0, 0, 0, 0);
      }
      .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
        padding-left: 0;
      }
      .ivu-collapse
        > .ivu-collapse-item.ivu-collapse-item-active
        > .ivu-collapse-header {
        border: none;
      }
      .ivu-collapse-content {
        background-color: rgba(0, 0, 0, 0);
      }
      .ivu-collapse-content > .ivu-collapse-content-box {
        padding: 0;
      }
      .el-checkbox {
        display: block;
        margin-left: 20px;
        margin-right: 100%;
      }
    }
  }
}
.drop-scroll::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.drop-scroll::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #979797;
}
.drop-scroll::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
</style>
