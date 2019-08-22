<template>
  <div class="personJudge">
    <el-dialog
      v-dialogDrag
      title="人工判断"
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
          v-for="item in optionsData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        v-if="!isTemperture"
        class="itemInput"
        v-model="formData.inputT"
        placeholder="机械判断数值"
      ></el-input>
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
        <button-custom class="button" @click.native="handlecancle" title="取消" />
        <button-custom class="button" @click.native="handleSubmit" title="确定" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import { getAxiosData, postAxiosData } from "../../../api/axiosType";
import { fiveSample, fourSample } from "@/api/configuration/configuration.js";
export default {
  name: "personJudge",
  components: {
    buttonCustom
  },
  data() {
    return {
      value: "",
      fourValue: "",
      formData: {
        input: "",
        inputT: "",
        select: ""
      },
      optionsData: [],
      options: [],
      dialogVisible: false
    };
  },
  props: {
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
    }
  },
  watch: {
    visible: {
      handler(now) {
        this.dialogVisible = now;
      },
      immediate: true
    },
    dataList: {
      handler(now) {
        this.formData = now;
      },
      deep: true,
      immediate: true
    }
  },
  computed: {},
  methods: {
    handleClose() {
      this.$emit("on-close");
    },
    handleSubmit() {
      this.dialogVisible = false;
      this.$emit("on-close");
      let url = "/lenovo-alarm/api/alarm/result/change";
      let query = {
        alarmId: this.formData.alarmId,
        alarmDetailType: this.formData.input,
        alarmValue: this.formData.inputT
      };
      postAxiosData(url, query).then(res => {
        this.$message({
          type: "succsee",
          message: "修改成功"
        });
      });
    },
    handlecancle() {
      this.dialogVisible = false;
      this.formData.input = this.dataList.input;
      this.formData.inputT = this.dataList.inputT;
      this.formData.select = this.dataList.select;
      console.log(this.formData);
      this.$emit("on-close");
    },

    handlerSelectFour(item) {
      this.fourValue = item;
      this.initFive(this.fourValue);
    },
    handlerSelect(item) {
      // this.formData.select = item.value;
    },
    //初始化下拉框
    initFour() {
      fourSample().then(res => {
        this.optionsData = res.data;
      });
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
  .itemInput {
    margin-bottom: 20px;
    width: 100%;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
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
}
</style>

