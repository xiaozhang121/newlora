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
        <el-input placeholder="请输入内容" v-model="diviceSelect" clearable></el-input>
        <div class="drop-scroll">
          <!--数据格式 [{title:"1000千伏区域",data:[{},{},{}]},{title:"500千伏区域",data:[{},{},{}]},] -->
          <el-collapse v-model="value1">
            <el-panel name="1">
              1000千伏区域
              <el-checkbox-group v-model="checkList" slot="content">
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>
              </el-checkbox-group>
            </el-panel>
          </el-collapse>
          <el-collapse v-model="value1">
            <el-panel name="2">
              500千伏区域
              <el-checkbox-group v-model="checkList" slot="content">
                <el-checkbox label="复选框 A"></el-checkbox>
                <el-checkbox label="复选框 B"></el-checkbox>
                <el-checkbox label="复选框 C"></el-checkbox>
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
        return true;
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
      checkList: [],
      value1: ["1", "2"]
    };
  },
  methods: {
    changeDrop() {
      this.show3 = !this.show3;
    }
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
