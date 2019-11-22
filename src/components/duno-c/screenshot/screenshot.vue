<template>
  <div class="screenshot">
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :show-close="false"
      @close="close"
      :visible.sync="isShow"
      width="500px"
      :top="top"
      :modal="false"
      :center="true"
    >
      <div class="dialog-content">
        <frame-selection :isVideo="isVideo" :shotData="shotData" @on-send="onSend"></frame-selection>
        <div class="shotInput">
          <div>
            <el-cascader
              placeholder="选择设备-部件-类型"
              @on-change="handleChange"
              :data="cascaderData"
              :load-data="loadData"
            ></el-cascader>
          </div>
          <div>
            <el-select v-model="selectValue" placeholder="选择识别结果">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-input type="textarea" :rows="2" placeholder="人工备注（选填）" v-model="textarea"></el-input>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deletSubmit">取消并删除图像</el-button>
        <el-button type="primary" @click="getImgInfo">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAxiosData,
  postAxiosData,
  putAxiosData,
  deleteDataId
} from "@/api/axiosType";
import {
  sampleMark,
  getMainDevice,
  getPart,
  getPartSub,
  getRecognizeType,
  snapshoot
} from "@/api/configuration/configuration.js";
import frameSelection from "_c/duno-c/frameSelection";
import moment from "moment";
export default {
  name: "screenshot",
  components: { frameSelection },
  props: {
    taskId: {
      type: String,
      default: () => {
        return "";
      }
    },
    isShow: {
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
    streamAddr: {
      type: String,
      default: () => {
        return "";
      }
    },
    shotData: {
      type: [Object, Array],
      default: () => {
        return {};
      }
    },
    monitorDeviceId: {
      type: [String, Number],
      default: () => {
        return "";
      }
    },
    top: {
      type: String,
      default: () => {
        return "15vh";
      }
    },
    isVideo: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  watch: {
    shotData(now) {
      this.imgsrc = `http://10.0.10.35:8100/lenovo-storage/api/storageService/file/imgFile?bucketName=${now.cephBucket}&fileName=${now.cephFileName}`;
    }
  },
  data() {
    let that = this;
    return {
      value: "",
      cascaderData: [],
      options: [],
      selectValue: "",
      textarea: "",
      picSize: "",
      powerDeviceId: "",
      imgInfo: {},
      imgsrc: "",
      mainDevice: "",
      imgFile: {},
      pointData: {}
    };
  },
  methods: {
    onSend(data, imgData) {
      this.pointData = data;
      this.imgFile = imgData;
    },
    getVoltage() {
      let url = "/lenovo-sample/api/sample/getMainDevice";
      postAxiosData(url).then(res => {
        let data = res.data;
        data.forEach(el => {
          el.children = [];
          el.loading = false;
        });
        this.cascaderData = data;
      });
    },
    loadData(item, callback) {
      item.loading = true;
      let index = item.__label.split(" / ").length - 1;
      let url = "";
      let query = {};
      if (index == 0) {
        url = "/lenovo-sample/api/sample/getPart";
        query = {
          mainDevice: item.value
        };
        this.mainDevice = item.value;
      } else {
        url = "/lenovo-sample/api/sample/getPartSub";
        query = {
          mainDevice: this.mainDevice,
          part: item.value
        };
      }
      postAxiosData(url, query).then(res => {
        let data = res.data;
        if (index == 0) {
          data.forEach(el => {
            el.children = [];
            el.loading = false;
          });
        }
        item.children = data;
        item.loading = false;
        callback();
      });
    },
    handleChange(value) {
      let query = {
        mainDevice: value[0],
        part: value[1],
        partSub: value[2]
      };
      getRecognizeType(query).then(res => {
        this.options = res.data;
        this.selectValue = "";
      });
    },
    handleSubmit() {
      this.$emit("closeShot");
      let photoTime = moment().format("YYYY-MM-DD HH:mm:ss");
      let query = {
        monitorDeviceId: this.monitorDeviceId,
        powerDeviceId: this.powerDeviceId,
        areaList: [
          {
            x0: this.pointData.x0,
            y0: this.pointData.y0,
            x1: this.pointData.x1,
            y1: this.pointData.y1,
            recognizeType: this.selectValue
          }
        ],
        fileName: this.shotData.cephFileName,
        picWigth: this.imgFile.width,
        picSize: this.picSize,
        picHeigh: this.imgFile.height,
        photoTime: photoTime
      };
      sampleMark(query).then(res => {
        this.$message({
          message: "标定成功",
          type: "success"
        });
      });
    },
    getImgInfo() {
      let that = this;
      if (that.isVideo) {
        let url = `http://10.0.10.35:8100/lenovo-storage/api/storageService/file/fileToBase64?bucketName=${this.shotData.cephBucket}&fileName=${this.shotData.cephFileName}`;
        getAxiosData(url).then(res => {
          let baseLen = res.data.length;
          this.picSize = parseInt(baseLen - (baseLen / 8) * 2);
          that.handleSubmit();
          this.$emit("closeShot");
        });
      } else {
        let url = "/lenovo-device/device/video/record/file/alarm";
        let data = [];
        data.push(that.selectValue);
        let query = {
          // powerDeviceId: that.powerDeviceId,
          monitorDeviceId: that.monitorDeviceId,
          alarmFileAddress: `http://10.0.10.35:8100/lenovo-storage/api/storageService/file/imgFile?bucketName=${this.shotData.cephBucket}&fileName=${this.shotData.cephFileName}`
          // recognizeType: data,
          // remake: this.textarea
        };
        postAxiosData(url, query).then(res => {
          this.$emit("closeShot");
          this.$message({
            message: "保存成功",
            type: "success"
          });
        });
      }
    },
    close() {
      this.$emit("closeShot");
    },
    deletSubmit() {
      this.$emit("closeShot");
      let url = `http://10.0.10.35:8100/lenovo-storage/api/storageService/file/deleteFile?bucketName=${this.shotData.cephBucket}&fileName=${this.shotData.cephFileName}`;
      deleteDataId(url).then(res => {
        this.$emit("closeShot");
        this.$message({
          type: "success",
          message: "删除成功"
        });
      });
    }
  },
  mounted() {
    this.getVoltage();
    this.imgsrc = `http://10.0.10.35:8100/lenovo-storage/api/storageService/file/imgFile?bucketName=${this.shotData.cephBucket}&fileName=${this.shotData.cephFileName}`;
  }
};
</script>

<style lang="scss">
.screenshot {
  .el-dialog {
    background-color: #e0e0e0;
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    border: none;
    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 20px;
      background-color: #e0e0e0;
    }
    .dialog-content {
      position: relative;
      .shotInput {
        & > div {
          margin-top: 20px;
        }
        .el-cascader--small {
          line-height: 40px;
          width: 100%;
        }
        .el-input--small .el-input__inner {
          height: 40px;
          line-height: 40px;
          background-color: #fff;
        }
        .el-select {
          width: 100%;
        }
        .el-input__inner {
          color: #707070;
          font-size: 16px;
        }
      }
    }
  }
}
.el-cascader-panel {
  .el-cascader-menu {
    overflow: hidden;
    padding-left: 10px;
  }
  .el-scrollbar__wrap {
    overflow: hidden;
    overflow-y: scroll;
  }
  .el-cascader-node {
    line-height: 2em;
    cursor: pointer;
    i {
      float: right;
      margin-right: 10px;
    }
  }
  .el-cascader-node:hover {
    background-color: #eee;
  }
}
.ivu-cascader-menu::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 1px;
}
.ivu-cascader-menu::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #979797;
}
.ivu-cascader-menu::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
</style>


