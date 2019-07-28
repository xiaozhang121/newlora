<template>
  <div class="screenshot">
    <el-dialog :show-close="false" :visible.sync="dialogVisible" width="30%" :center="true">
      <div class="dialog-content">
        <div class="shotImg">
          <img src alt />
          <div v-if="isCalibrat" class="calibrat">手动标定</div>
          <div v-if="!isCalibrat" class="clearCalibrat">清除</div>
        </div>
        <div v-if="isCalibrat" class="shotInput">
          <div>
            <el-cascader
              placeholder="自动关联（对应样本库2-4级目录）"
              v-model="cascadeValue"
              :options="options"
              @change="handleChange"
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
      options: [],
      cascadeValue: "",
      selectValue: "",
      textarea: "",
      isCalibrat: true
    };
  },
  methods: {
    handleChange(value) {
      console.log(value);
    }
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
        widows: 400px;
        height: 225px;
        background: #fff;
        position: relative;
        img {
          display: block;
        }
        div {
          position: absolute;
          bottom: 20px;
          right: 20px;

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
</style>


