<template>
  <div class="frameSelection">
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
        <canvas id="myCanvas" width="450px"></canvas>
      </div>
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
  name: "frameSelection",
  props: {
    isShow: {
      type: Boolean,
      default: () => {
        return false;
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
      imgsrc: ""
    };
  },
  methods: {
    init() {
      let c = document.getElementById("myCanvas");
      let ctx = c.getContext("2d");
      let img = new Image();
      img.src =
        "https://img.iplaysoft.com/wp-content/uploads/2019/free-images/free_stock_photo.jpg"; // 设置图片源地址
      img.onload = function() {
        let w = img.width;
        let h = img.height;
        let ctxHeight = Math.round((h * 450) / w);
        c.height = ctxHeight;
        ctx.drawImage(img, 0, 0, 450, ctxHeight);
      };
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
    close() {
      this.$emit("closeShot");
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
    this.imgsrc = `http://10.0.10.35:8100/lenovo-storage/api/storageService/file/imgFile?bucketName=${this.shotData.cephBucket}&fileName=${this.shotData.cephFileName}`;
  }
};
</script>

<style lang="scss">
.frameSelection {
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
    }
  }
}
#box1 {
  position: absolute;
  background: none;
  border: 1px solid red;
}
</style>


