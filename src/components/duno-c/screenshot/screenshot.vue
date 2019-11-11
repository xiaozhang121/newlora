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
        <div
          class="shotImg"
          :style="{backgroundImage: 'url(' + imgsrc + ')', backgroundSize: '100%'}"
          @mousedown="getFirstCode"
          @mouseup="getEndCode"
          @mousemove="getCircle"
        >
          <div v-if="isCalibrat" ref="box" id="box1"></div>
        </div>
        <i v-if="!isVideo" class="iconfont icon-bofang"></i>
        <div
          v-show="!isCalibrat"
          v-if="isVideo"
          class="calibrat"
          @click="addTag"
          :style="{top:isInput?'48%':'84%'}"
        >手动标定</div>
        <div
          v-show="isCalibrat"
          v-if="isVideo"
          class="clearCalibrat"
          @click="delTag"
          :style="{top:isInput?'48%':'84%'}"
        >清除</div>
        <div class="shotInput" v-if="isInput">
          <div>
            <el-cascader
              placeholder="选择设备-部件-类型"
              @on-change="handleChange"
              :data="cascaderData"
              :load-data="loadData"
            ></el-cascader>
            <!-- <el-cascader placeholder="选择设备-部件-类型" @change="handleChange" :props="props"></el-cascader> -->
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
      <img :src="imgsrc" ref="image" alt :style="{display:'none'}" />
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
import moment from "moment";
export default {
  name: "screenshot",
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
      optionsFirst: [],
      options: [],
      selectValue: "",
      textarea: "",
      picWigth: "",
      picHeigh: "",
      picSize: "",
      powerDeviceId: "",
      isInput: false,
      isCalibrat: false,
      startPointX: null,
      endPointX: null,
      startPointY: null,
      endPointY: null,
      clickFlage: 0,
      x0: null,
      y0: null,
      x1: null,
      y1: null,
      imgInfo: {},
      picFilePath: "",
      imgsrc: "",
      mainDevice: "",
      props: {
        lazy: true,
        value: "value",
        lable: "lable",
        lazyLoad: (node, resolve) => {
          that.getSelect(node, resolve);
        }
      }
    };
  },
  methods: {
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
    getCircle(e) {
      if (this.clickFlage == 1) {
        console.log(e.offsetX, e.offsetY);
        let width = Math.abs(e.offsetX - this.startPointX);
        let height = Math.abs(e.offsetY - this.startPointY);
        if (e.offsetY - this.startPointY <= 0) {
          this.$refs.box.style.top = e.offsetY + "px";
        } else {
          this.$refs.box.style.top = this.startPointY + "px";
        }
        if (e.offsetX - this.startPointX <= 0) {
          this.$refs.box.style.left = e.offsetX + "px";
        } else {
          this.$refs.box.style.left = this.startPointX + "px";
        }
        this.$refs.box.style.width = width + "px";
        this.$refs.box.style.height = height + "px";
      }
    },
    getFirstCode(e) {
      if (this.clickFlage == 0 && this.isCalibrat) {
        this.$refs.box.style.width = null;
        this.$refs.box.style.height = null;
        this.startPointX = e.offsetX;
        this.startPointY = e.offsetY;
        this.$refs.box.style.left = this.startPointX + "px";
        this.$refs.box.style.top = this.startPointY + "px";
        this.clickFlage = 1;
      }
    },
    getEndCode(e) {
      if (this.clickFlage == 1) {
        this.endPointY = e.offsetY;
        this.endPointX = e.offsetX;
        this.clickFlage = 0;
      }
    },
    //手动标定
    addTag() {
      this.isCalibrat = true;
    },
    //清除标定
    delTag() {
      //   this.isCalibrat = false;
      this.$refs.box.style.width = null;
      this.$refs.box.style.height = null;
    },
    getSelect(node, resolve) {
      const { level, root, data } = node;
      let params = {};
      switch (level) {
        case 1:
          params = {
            mainDevice: data.value
          };
          this.mainDevice = data.value;
          break;
        case 2:
          params = {
            mainDevice: this.mainDevice,
            part: data.value
          };
          break;
      }
      if (level == 0) {
        getMainDevice().then(res => {
          const result = res.data.map(item => {
            return Object.assign(item, {
              leaf: level >= 2
            });
          });
          resolve(result);
        });
      } else if (level == 1) {
        getPart(params).then(res => {
          const result = res.data.map(item => {
            return Object.assign(item, {
              leaf: level >= 2
            });
          });
          resolve(result);
        });
      } else {
        getPartSub(params).then(res => {
          const result = res.data.map(item => {
            return Object.assign(item, {
              leaf: level >= 2
            });
          });
          resolve(result);
        });
      }
    },
    handleSubmit() {
      this.$emit("closeShot");
      //   this.picWigth = img.naturalWidth;
      //   this.picHeigh = img.naturalHeight;
      this.picWigth = this.$refs.image.naturalWidth;
      this.picHeigh = this.$refs.image.naturalHeight;
      let photoTime = moment().format("YYYY-MM-DD HH:mm:ss");
      let query = {
        monitorDeviceId: this.monitorDeviceId,
        powerDeviceId: this.powerDeviceId,
        areaList: [
          {
            x0: this.startPointX,
            y0: this.startPointY,
            x1: this.endPointX,
            y1: this.endPointY,
            recognizeType: this.selectValue
          }
        ],
        fileName: this.shotData.cephFileName,
        picWigth: this.picWigth,
        picSize: this.picSize,
        picHeigh: this.picHeigh,
        photoTime: photoTime
      };
      sampleMark(query).then(res => {
        this.$message({
          message: "标定成功",
          type: "success"
        });
        this.clearCan();
      });
    },
    clearCan() {
      this.imgsrc = "";
      this.options = [];
      this.$refs.box.style.width = null;
      this.$refs.box.style.height = null;
      this.isCalibrat = false;
      this.selectValue = "";
      this.textarea = "";
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
          this.clearCan();
        });
      }
    },
    getPowerDeviceId() {
      let url = "/lenovo-device/api/monitor/power-device";
      let query = {
        monitorDeviceId: this.monitorDeviceId
      };
      getAxiosData(url, query).then(res => {
        // this.powerDeviceId = res.data[0].value;
        if (res.data.length > 0 && this.isVideo) {
          this.isInput = true;
        } else {
          this.isInput = false;
        }
      });
    },
    close() {
      this.$emit("closeShot");
      this.clearCan();
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
      this.clearCan();
    }
  },
  mounted() {
    this.getPowerDeviceId();
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
      .shotImg {
        width: 100%;
        padding-bottom: 56.25%;
        height: 0;
        position: relative;
        background: #fff;
        img {
          width: 100%;
          height: 100%;
          position: absolute;
        }
      }
      .icon-bofang {
        cursor: pointer;
        color: #fff;
        font-size: 66px;
        position: absolute;
        top: 32%;
        left: 42%;
      }
      .calibrat,
      .clearCalibrat {
        position: absolute;
        // top: 48%;
        right: 10px;
        text-align: center;
        color: #fff;
        line-height: 32px;
        opacity: 0.5;
        z-index: 99;
        cursor: pointer;
      }
      .calibrat {
        width: 80px;
        background-color: #ff9000;
      }
      .clearCalibrat {
        width: 60px;
        background-color: #c43d77;
      }
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

#box1 {
  position: absolute;
  background: none;
  border: 1px solid red;
}
</style>


