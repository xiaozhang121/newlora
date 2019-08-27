<template>
  <div class="screenshot">
    <el-dialog
      :show-close="false"
      @close="close"
      :visible.sync="isShow"
      width="500px"
      :modal="false"
      :center="true"
    >
      <div class="dialog-content">
        <div class="shotImg" @mousedown="getFirstCode" @mouseup="getEndCode" @mousemove="getCircle">
          <img :src="this.imgsrc" ref="image" alt />
          <div ref="box" id="box1"></div>
        </div>
        <div v-show="isCalibrat" class="calibrat" @click="addTag">手动标定</div>
        <div v-show="!isCalibrat" class="clearCalibrat" @click="delTag">清除</div>
        <div class="shotInput">
          <div>
            <el-cascader placeholder="选择设备-部件-类型" @change="handleChange" :props="props"></el-cascader>
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
        <!--
        <div v-if="!isCalibrat" class="shotInput">
          <div>
            <el-cascader
              placeholder="选择设备-部件-类型"
              @getCheckedNodes="getCheckedNodes"
              v-model="cascadeValue"
              :options="platOptions"
              @change="handleChange"    
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
        -->
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
import moment from "moment";
export default {
  name: "screenshot",
  props: {
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
      type: Object,
      default: () => {
        return {};
      }
    },
    monitorDeviceId: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  watch: {
    shotData(now) {
      this.imgsrc = `http://10.0.10.35:8100/lenovo-storage/api/storageService/file/imgFile?bucketName=${now.cephBucket}&fileName=${now.cephFileName}`;
    }
    // monitorInfo(now) {
    //   this.getPowerDeviceId();
    // }
  },
  data() {
    let that = this;
    return {
      // dialogVisible: false,
      value: "",
      optionsFirst: [],
      options: [],
      //   platOptions: [],
      //   cascadeValue: "",
      selectValue: "",
      textarea: "",
      picWigth: "",
      picHeigh: "",
      picSize: "",
      powerDeviceId: "",
      isCalibrat: true,
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
    handleChange(value) {
      let query = {
        mainDevice: value[0],
        part: value[1],
        partSub: value[2]
      };
      getRecognizeType(query).then(res => {
        this.options = res.data;
      });
    },
    getCircle(e) {
      if (this.clickFlage == 1) {
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
      this.isCalibrat = false;
    },
    //清除标定
    delTag() {
      this.isCalibrat = true;
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
      this.$refs.box.style.width = null;
      this.$refs.box.style.height = null;
      this.isCalibrat = true;
      this.selectValue = "";
      this.textarea = "";
      this.props.lazyLoad = null;
    },
    getImgInfo() {
      let that = this;
      let url = `/lenovo-storage/api/storageService/file/fileToBase64?bucketName=${this.shotData.cephBucket}&fileName=${this.shotData.cephFileName}`;
      getAxiosData(url).then(res => {
        let baseLen = res.data.length;
        this.picSize = parseInt(baseLen - (baseLen / 8) * 2);
        that.handleSubmit();
      });
    },
    getPowerDeviceId() {
      let url = "/lenovo-device/api/monitor/power-device";
      let query = {
        monitorDeviceId: this.monitorDeviceId
      };
      getAxiosData(url, query).then(res => {
        this.powerDeviceId = res.data[0].value;
      });
    },
    close() {
      this.$emit("closeShot");
      this.clearCan();
    },
    deletSubmit() {
      this.$emit("closeShot");
      let url = `/lenovo-storage/api/storageService/file/deleteFile?bucketName=${this.shotData.cephBucket}&fileName=${this.shotData.cephFileName}`;
      deleteDataId(url).then(res => {
        this.$message({
          type: "success",
          message: "删除成功"
        });
      });
      this.clearCan();
    }
  },
  mounted() {
    // this.getPowerDeviceId();
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
        height: 225px;
        background: #fff;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .calibrat,
      .clearCalibrat {
        position: absolute;
        top: 185px;
        right: 10px;
        text-align: center;
        color: #fff;
        line-height: 32px;
        opacity: 0.5;
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


