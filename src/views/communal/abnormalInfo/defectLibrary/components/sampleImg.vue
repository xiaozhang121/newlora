<template>
  <div class="sample-img">
    <el-dialog
      title="批量导入样本图片"
      :visible.sync="visible"
      width="500px"
      :close-on-click-modal="false"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="设备组件">
          <el-cascader :data="cascaderData" @on-change="handleChange" :load-data="loadData"></el-cascader>
        </el-form-item>
        <el-form-item label="电压区域">
          <el-select v-model="form.areaName" placeholder="请选择（非必选）">
            <el-option
              v-for="(item,index) in diviceData"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <survey :monitor="form.monitor"></survey>
        <el-form-item label="上传图片">
          <el-upload
            class="upload-demo"
            action="/lenovo-sample/api/sample/pic-upload"
            :before-remove="beforeRemove"
            accept="image/*"
            :multiple="false"
            :limit="1"
            :on-exceed="handleExceed"
            :on-change="changeUpload"
            :file-list="fileList"
          >
            <el-input :readonly="true" :style="{cursor:'pointer'}" placeholder="点击上传图片"></el-input>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button-custom class="button" @click.native="handleClose" title="取 消" />
        <button-custom class="button" @click.native="handleSubmit" title="确 定" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import survey from "_c/duno-c/survey";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
export default {
  name: "sampleImg",
  components: {
    buttonCustom,
    survey
  },
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  data() {
    return {
      form: {
        areaName: "",
        monitor: ""
      },
      mainDevice: "",
      part: "",
      partSub: "",
      fileList: [],
      diviceData: [
        {
          label: "1000KV",
          value: "0"
        },
        {
          label: "500KV",
          value: "1"
        },
        {
          label: "220KV",
          value: "2"
        },
        {
          label: "110KV",
          value: "3"
        },
        {
          label: "35KV",
          value: "4"
        },
        {
          label: "10KV",
          value: "5"
        }
      ],
      cascaderData: [
        {
          value: "beijing",
          label: "北京",
          children: [],
          loading: false
        },
        {
          value: "hangzhou",
          label: "杭州",
          children: [],
          loading: false
        }
      ]
    };
  },
  methods: {
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 1 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    changeUpload() {},
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleChange(value) {
      this.mainDevice = value[0];
      this.part = value[1];
      this.partSub = value[2];
    },
    handleSubmit() {
      let query = {
        taskId: this.taskId,
        mainDevice: this.mainDevice,
        part: this.part,
        partSub: this.partSub,
        areaName: this.form.areaName,
        stationId: this.stationId //变电站
        // picFilePath: JSON.stringify(this.picFilePath),
        // imgsInfo: JSON.stringify(arr)
      };
      this.$emit("on-close");
    },
    handleClose() {
      this.$emit("on-close");
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
    }
  },
  mounted() {
    this.getVoltage();
  }
};
</script>

<style lang='scss'>
.sample-img {
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
  .el-dialog {
    background-color: #e0e0e0;
    border: none;
    .el-dialog__header {
      background-color: #e0e0e0;
      text-align: center;
      .el-dialog__title {
        font-weight: 600;
      }
    }
    .el-dialog__body {
      background-color: #e0e0e0;
      padding: 30px 40px 50px 20px;
      .el-select,
      .el-upload {
        width: 100%;
      }
      .ivu-input {
        padding: 0 15px;
      }
      .el-form-item {
        margin-bottom: 24px;
      }
    }
    .el-dialog__footer {
      background-color: #e0e0e0;
    }
  }
}
</style>
