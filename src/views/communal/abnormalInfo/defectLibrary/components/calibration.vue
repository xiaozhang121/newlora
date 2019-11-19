<template>
  <div class="duno-calibrat">
    <el-dialog title="新增标定" :visible.sync="isShow" width="500px" :before-close="handleCancel">
      <div class="content">
        <!-- <el-input v-model="input" placeholder="图⽚编号058214新增标定-1（点击修改名称）"></el-input> -->
        <el-select v-model="value" placeholder="选择识别类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <frame-selection @on-send="onSend" :keepData="frameData"></frame-selection>
      </div>
      <span slot="footer" class="dialog-footer">
        <button-custom class="button" @click.native="handleCancel" title="取消" />
        <button-custom class="button" @click.native="handleSubmit" title="提交" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import frameSelection from "_c/duno-c/frameSelection";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
export default {
  name: "calibration",
  components: {
    buttonCustom,
    frameSelection
  },
  props: {
    isShow: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    dataList: {
      type: Object
    }
  },
  data() {
    return {
      input: "",
      value: "",
      options: [],
      mainDevice: "",
      part: "",
      partSub: "",
      frameData: {},
      imgFile: {},
      pointData: {}
    };
  },
  methods: {
    onSend(data, imgData) {
      this.pointData = data;
      this.imgFile = imgData;
    },
    handleSubmit() {
      let url = "/lenovo-sample/api/mark/add";
      let query = {
        mainDevice: this.mainDevice,
        part: this.part,
        partSub: this.partSub,
        recognizeType: this.value,
        sampleId: this.$route.query.sampleId,
        x1: this.pointData.x0,
        y1: this.pointData.y0,
        x2: this.pointData.x1,
        y2: this.pointData.y1
      };
      postAxiosData(url, query).then(res => {
        this.$message.success("新增成功");
        this.$emit("closeShot");
      });
    },
    handleCancel() {
      this.$emit("closeShot");
    },
    getTypelist() {
      let query = {
        sampleId: this.$route.query.sampleId
      };
      let url = "/lenovo-sample/api/mark/getRecognize";
      getAxiosData(url, query).then(res => {
        this.options = res.data.RecognizeList;
        this.mainDevice = res.data.mainDevice;
        this.part = res.data.part;
        this.partSub = res.data.partSub;
      });
    }
  },
  mounted() {
    this.getTypelist();
    this.frameData = this.dataList;
    this.value = this.dataList.recognizeType;
  }
};
</script>

<style lang='scss'>
.duno-calibrat {
  .el-dialog {
    background: #e0e0e0;
  }
  .el-dialog__header {
    text-align: center;
    font-size: 24px;
    font-weight: 600;
  }
  .el-dialog__body {
    padding: 10px 25px 10px;
    .el-input {
      margin-bottom: 20px;
    }
    .el-input__inner {
      height: 40px;
      line-height: 40px;
    }
    .el-select {
      width: 100%;
    }
  }
  .dialog-footer {
    color: #ffffff;
    display: flex;
    justify-content: center;
    .button {
      height: 37px;
      line-height: 31px;
      font-size: 14px;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
}
</style>
