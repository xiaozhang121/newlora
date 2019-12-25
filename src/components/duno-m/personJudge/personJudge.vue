<template>
  <div class="personJudge">
    <el-dialog
      v-dialogDrag
      title="人工判断"
      :close-on-click-modal="false"
      :modal="modal"
      :visible.sync="dialogVisible"
      width="500px"
      :before-close="handleClose"
    >
      <el-select
        class="itemInput"
        v-model="formData.select"
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
      <!-- v-if="!isTemperture" -->
      <el-input
        v-if="formData.select=='红外温度类'||formData.select=='表计类'||fourLabel=='表计类'||fourLabel=='红外温度类'"
        class="itemInput"
        type="number"
        v-model="formData.inputT"
        placeholder="机械判断数值"
      ></el-input>
      <el-select
        v-if="formData.alarmTypeValue=='设备缺陷类'&&((fourLabel==''&&formData.select=='设备状态类')||fourLabel=='设备状态类')"
        class="itemInput"
        v-model="formData.inputT"
        placeholder="开关类型"
        @change="handlerSelectT"
      >
        <el-option
          v-for="item in stateData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-select
        class="itemInput"
        v-model="formData.input"
        placeholder="机器判定结果，可修改"
        @change="handlerSelect"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <button-custom class="button" @click.native="handleClose" title="取消" />
        <button-custom class="button" @click.native="handleSubmit" title="确定" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import { getAxiosData, postAxiosData } from "../../../api/axiosType";
import { fiveSample, fourSample } from "@/api/configuration/configuration.js";
import { EDEADLK } from "constants";
export default {
  name: "personJudge",
  components: {
    buttonCustom
  },
  data() {
    return {
      value: "",
      fourValue: "",
      fourLabel: "",
      formData: {
        input: "",
        inputT: "",
        select: ""
      },
      saveTemplate: 0,
      optionsData: [],
      options: [],
      dialogVisible: false,
      isChange: false,
      query: null,
      stateData: [
        {
          value: "1",
          label: "合状态"
        },
        {
          value: "0",
          label: "分状态"
        }
      ]
    };
  },
  props: {
    modal: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    isTemperture: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    dataList: {
      type: Object,
      default: () => {
        return {};
      }
    },
    detailsType: {
      type: String,
      default: () => {
        return "task";
      }
    }
  },
  watch: {
    visible: {
      handler(now) {
        this.dialogVisible = now;
        if (!now) {
          this.$emit("on-alter");
        }
      }
    },
    dataList: {
      handler(now) {
        this.formData = JSON.parse(JSON.stringify(now));
        this.saveTemplate = this.formData.inputT
        console.log(this.formData);
      },
      deep: true,
      immediate: true
    }
  },
  computed: {},
  methods: {
    handlerSelectT(item) {},
    handleSubmit() {
      let url;
      console.log(this.formData);
      let isRobot = this.formData.isRobot;
      if (isRobot == "0" || isRobot == "1") {
        url = "/lenovo-plan/api/information/overview/change";
      } else if (this.formData.result == "正常") {
        url = "/lenovo-plan/api/task_result/change";
      } else {
        url = "/lenovo-alarm/api/alarm/result/change";
      }
      if (this.detailsType == "alarm") {
        url = "/lenovo-alarm/api/alarm/result/change";
      }
      if (this.formData.inputT == "合状态") {
        this.formData.inputT = "1";
      } else if (this.formData.inputT == "分状态") {
        this.formData.inputT = "0";
      }
      if (this.isChange) {
        this.query = {
          userName: this.$store.state.user.userName,
          alarmId: this.formData.alarmId,
          alarmDetailType: this.formData.input,
          alarmValue: this.formData.inputT,
          isRobot: this.formData.isRobot
        };
      } else {
        this.query = {
          userName: this.$store.state.user.userName,
          alarmId: this.formData.alarmId,
          alarmDetailType: this.formData.alarmDetailTypeCode,
          alarmValue: this.formData.inputT,
          isRobot: this.formData.isRobot
        };
      }
    /*  if(!this.query['alarmId'] || !this.query['alarmDetailType'] || !this.query['alarmValue']){
        this.$message.error('请将信息补充完整！')
        return
      }*/
      postAxiosData(url, this.query).then(res => {
        this.$message({
          type: "succsee",
          message: "修改成功"
        });
        this.$emit("on-close");
        this.$emit("on-alter");
      });
    },
    handleClose() {
      this.formData.input = this.dataList.input;
      this.formData.inputT = this.dataList.inputT;
      this.formData.select = this.dataList.select;
      this.$emit("on-close");
    },
    handlerSelectFour(val) {
      this.fourValue = val;
      this.optionsData.find(item => {
        if (item.value === val) {
          this.fourLabel = item.label;
        }
      });
      this.formData.input = "";
      this.formData.inputT = "";
      if(this.fourLabel == '红外温度类'){
        this.formData.inputT = this.saveTemplate
      }
      this.initFive(this.fourValue);
    },
    handlerSelect(item) {
      this.isChange = true;
      // this.formData.select = item.value;
    },
    //初始化下拉框
    initFour() {
      fourSample().then(res => {
        this.optionsData = res.data;
      });
      // this.optionsData.find(item => {
      //   if (item.value === this.formData.select) {
      //     this.fourLabel = item.label;
      //     console.log(this.fourLabel);
      //   }
      // });
    },
    initFive(query) {
      let data = {
        alarmType: this.fourValue
      };
      fiveSample(data).then(res => {
        this.options = res.data;
      });
    }
  },
  mounted() {
    this.initFour();
  }
};
</script>

<style lang="scss">
.personJudge {
  .el-input--small .el-input__inner{
    background-color: white !important;
    color: #606266 !important;
  }
  ::-webkit-input-placeholder { /* WebKit browsers */
    color: #606266 !important;
    font-size: 13px !important;
  }

  ::-moz-placeholder { /* Mozilla Firefox 19+ */
    color: #606266 !important;
    font-size: 14px !important;
  }

  :-ms-input-placeholder { /* Internet Explorer 10+ */
    color: #606266 !important;
    font-size: 14px !important;
  }
  .itemInput {
    margin-bottom: 20px;
    width: 100%;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-dialog {
    padding: 0 !important;
    background-color: #e0e0e0 !important;
  }
  .el-dialog__header,
  .el-dialog__body {
    background-color: #e0e0e0 !important;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    background-color: #e0e0e0 !important;
    color: #ffffff;
    .button {
      height: 37px;
      line-height: 31px;
      font-size: 14px;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  .el-input--small .el-input__inner {
    background-color: #fff !important;
    border: none;
    color: #606266 !important;
  }
}
.el-select-dropdown {
  background: #fff !important;
  color: #333;
}
.el-select-dropdown__empty,
.el-select-dropdown__item,
.el-select-dropdown__item.selected {
  color: #333;
}
</style>

