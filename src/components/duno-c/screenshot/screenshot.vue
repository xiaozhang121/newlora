<template>
  <div class="screenshot">
    <el-dialog :show-close="false" :visible.sync="dialogVisible" width="30%" :center="true">
      <div class="dialog-content">
        <div
          class="shotImg"
          @click="cricle"
          @mousedown="getFirstCode"
          @mouseup="getEndCode"
          @mousemove="getCircle"
        >
          <img :src="this.imgsrc" alt />
          <div ref="box" id="box1"></div>
          <div v-if="isCalibrat" class="calibrat" @click="addTag">手动标定</div>
          <div v-if="!isCalibrat" class="clearCalibrat" @click="delTag">清除</div>
        </div>
        <div v-if="isCalibrat" class="shotInput">
          <div>
            <el-cascader
              placeholder="自动关联（对应样本库2-4级目录）"
              :options="platOptions"
              @active-item-change="handleItemChange"
              :props="props"
            ></el-cascader>
          </div>
          <div>
            <el-select v-model="selectValue" placeholder="自动关联（对应样本库5级目录）">
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
        <div v-if="!isCalibrat" class="shotInput">
          <div>
            <el-cascader
              placeholder="选择设备-部件-类型"
              v-model="cascadeValue"
              :options="options"
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
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消并删除图像</el-button>
        <el-button type="primary" @click="dialogVisible = false">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import {
  sampleMark,
  getMainDevice,
  getPart,
  getPartSub,
  getRecognizeType
} from "@/api/configuration/configuration.js";
export default {
  name: "screenshot",
  props: {
    isShow: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  data() {
    return {
      dialogVisible: true,
      value: "",
      optionsFirst: [],
      options: [],
      platOptions: [],
      cascadeValue: "",
      selectValue: "",
      textarea: "",
      isCalibrat: true,
      startPointX: 0,
      endPointX: 0,
      startPointY: 0,
      endPointY: 0,
      clickFlage: 0,
      imgInfo: {},
      picFilePath: "",
      imgsrc: "",
      props: {
        lazy: true
      }
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
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

        this.$refs.box.style.width = width - 10 + "px";
        this.$refs.box.style.height = height - 10 + "px";
      }
    },
    getFirstCode(e) {
      if (this.clickFlage == 0) {
        this.$refs.box.style.width = 0;
        this.$refs.box.style.height = 0;

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
      let query = {
        x0: this.startPointX,
        y0: this.startPointY,
        x1: this.endPointX,
        y1: this.endPointY
      };
      sampleMark(query).then(res => {
        this.$message({
          type: "sucess",
          message: "标定成功"
        });
      });
    },
    //清除标定
    delTag() {
      let query = {};
      let url = "";
    },
    //框选图片
    getImgInfo() {
      var query = {
        picFilePath: this.picFilePath
      };
      var url = "/lenovo-sample/api/mark/pic-flow";
      getAxiosData(url, query).then(res => {
        console.log(res);
        this.imgsrc = res.data;
      });
    },
    getSelect() {
      let query = {};
      getMainDevice(query).then(res => {
        this.platOptions = res.data;
        this.platOptions.map((item, index, array) => {
          this.$set(array[index], "child", []);
        });
      });
    },
    //自动关联（五级目录）
    getFiveSelect() {
      let url = "";
      let query = {};
      getAxiosData(url, query).then(res => {
        this.options = res.data;
      });
    },
    handleSubmit() {
      this.dialogVisible = false;
      let url = "";
      let query = {};
      postAxiosData(url, query).then(res => {
        this.$message({
          type: "success",
          message: "保存成功"
        });
      });
    }
  },
  mounted() {
    this.getImgInfo();
    this.getSelect();
  }
};
</script>

<style lang="scss">
.screenshot {
  .el-dialog {
    background-color: #e0e0e0;
    box-shadow: 8px 8px 20px 0px rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    .el-dialog__body {
      padding-top: 0;
      padding-bottom: 20px;
    }
    .dialog-content {
      .shotImg {
        // width: 400px;
        width: 100%;
        height: 225px;
        background: #fff;
        position: relative;
        img {
          display: block;
        }
        div {
          position: absolute;
          bottom: 10px;
          right: 10px;
          text-align: center;
          color: #fff;
          line-height: 32px;
          opacity: 0.5;
        }
        .calibrat {
          width: 80px;
          background-color: #ff9000;
        }
        .clearCalibrat {
          width: 60px;
          background-color: #ff9000;
        }
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
#box1 {
  position: absolute;
  background: none;
  border: 1px solid red;
}
</style>


