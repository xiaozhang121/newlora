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
            <el-select
                    class="itemInput"
                    v-model="formData.alarmType"
                    placeholder="数据类型"
                    @change="handlerSelectFour"
            >
              <el-option
                      v-for="(item,index) in optionsData"
                      :key="index"
                      :label="item.label"
                      :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-select
                    class="itemInput"
                    v-model="formData.alarmDetailType"
                    placeholder="判定结果"
                    @change="handlerSelect"
            >
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
import { fiveSample, fourSample } from "@/api/configuration/configuration.js";
import frameSelection from "_c/duno-c/frameSelection";
import moment from "moment";
export default {
  name: "screenshot",
  components: { frameSelection },
  props: {
    taskId: {
      type: String | Number,
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
      formData: {
        alarmType: '',
        alarmDetailType: '',
      },
      isChange: false,
      fourValue: "",
      optionsData: [],
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
      pointData: {
        x0: "",
        y0: "",
        x1: "",
        y1: ""
      }
    };
  },
  methods: {
    getMapping(arr, id){
      let label = ''
      arr.forEach(item=>{
        if(item['value'] == id){
          label = item['label']
        }
      })
      return label
    },
    handlerSelect(item) {
      this.isChange = true;
      // this.formData.select = item.value;
    },
    handlerSelectFour(val) {
      this.fourValue = val;
      this.formData.alarmDetailType = "";
      this.initFive(this.fourValue);
    },
    initFive() {
      let data = {
        alarmType: this.fourValue
      };
      fiveSample(data).then(res => {
        this.options = res.data;
      });
    },
    initFour(){
      fourSample({type: 2}).then(res => {
        this.optionsData = res.data;
      });
    },
    onSend(data, imgData) {
      this.pointData = data;
      this.imgFile = imgData;
    },
    getVoltage() {
      let url = "/lenovo-sample/api/sample/getMainDevice";
      postAxiosData(url).then(res => {
        let data = res.data;
        if (this.isVideo) {
          data = data.slice(0, data.length - 2);
        } else {
          data = data.slice(-2);
        }
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
        photoTime: photoTime,
        remark: this.textarea
      };
      sampleMark(query).then(res => {
        this.$message({
          message: "截图已保存至缺陷库",
          type: "success"
        });
        this.$emit("closeShot");
      });
    },
    getImgInfo() {
      let that = this;
      if (this.isVideo && (this.pointData.x0 == "" || this.selectValue == "")) {
        this.$message.warning("请选择或标定区域");
        return;
      }
      if (!this.isVideo && (this.formData.alarmType == "" || this.formData.alarmDetailType == "")) {
        this.$message.warning("请选择");
        return;
      }
      if (that.isVideo) {
        let url = `/lenovo-storage/api/storageService/file/fileToBase64?bucketName=${this.shotData.cephBucket}&fileName=${this.shotData.cephFileName}`;
        getAxiosData(url).then(res => {
          let baseLen = res.data.length;
          this.picSize = parseInt(baseLen - (baseLen / 8) * 2);
          that.handleSubmit();
        });
      } else {
        let url = "/lenovo-alarm/alarm/security/record/add";
        let data = [];
        data.push(that.selectValue);
        let query = {
          // powerDeviceId: that.powerDeviceId,
          monitorDeviceId: that.monitorDeviceId,
          monitorDeviceName: that.monitorInfo['monitorDeviceName']?that.monitorInfo['monitorDeviceName']:that.$route.query.monitorDeviceName,
          alarmType: that.formData.alarmType,
          alarmDetailType: that.formData.alarmDetailType,
          alarmContent: that.getMapping(that.options, that.formData.alarmDetailType),
          alarmFileAddress: `http://10.0.10.35:8100/lenovo-storage/api/storageService/file/imgFile?bucketName=${this.shotData.cephBucket}&fileName=${this.shotData.cephFileName}`,
          // recognizeType: data,
          remark: this.textarea
        };
        postAxiosData(url, query).then(res => {
          this.$emit("closeShot");
          this.$message({
            message: "已保存至历史异常记录",
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
    this.initFour()
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


