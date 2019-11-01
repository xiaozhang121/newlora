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
          <el-select v-model="form.divice" placeholder="请选择">
            <el-option
              v-for="(item,index) in diviceData"
              :label="item.label"
              :value="item.value"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="电压区域">
          <el-cascader :data="cascaderData" :load-data="loadData"></el-cascader>
        </el-form-item>
        <el-form-item label="被监测设备" class="dropDown">
          <el-input v-model="form.divice" placeholder="请选择" @focus="show3 = true"></el-input>
          <!-- @blur="show3 = false" -->
          <i class="el-icon-arrow-down dropDown-i" :class="{rotate:show3}"></i>
          <el-collapse-transition>
            <div class="diviceSelect" v-show="show3">
              <el-input placeholder="请输入内容" v-model="diviceSelect" clearable></el-input>
              <div class="drop-scroll">
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
        <el-form-item label="上传图片">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
          >
            <el-input :readonly="true" :style="{cursor:'pointer'}" placeholder="点击上传图片"></el-input>
            <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <button-custom class="button" @click.native="handleClose" title="取 消" />
        <button-custom class="button" @click.native="handleClose" title="确 定" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
export default {
  name: "sampleImg",
  components: {
    buttonCustom
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
        divice: ""
      },
      show3: false,
      diviceSelect: "",
      value1: ["1", "2"],
      fileList: [],
      checkList: [],
      diviceData: [
        {
          label: "设备组件",
          value: "0"
        },
        {
          label: "设备组件",
          value: "1"
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
    changeDrop() {
      this.show3 = !this.show3;
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      );
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
      let url = "/lenovo-sample/api/sample/getPart";
      let query = {
        mainDevice: item.value
      };
      postAxiosData(url).then(res => {
        let data = res.data;
        data.forEach(el => {
          el.children = [];
          el.loading = false;
        });
        item.children = data;
      });
      item.loading = false;
      callback();
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
      .dropDown {
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
    }
    .el-dialog__footer {
      background-color: #e0e0e0;
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
