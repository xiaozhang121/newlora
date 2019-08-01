<template>
  <div class="personJudge">
    <el-dialog
      v-dialogDrag
      title="人工判断"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-select
        class="itemInput"
        v-model="formData.input"
        placeholder="请选择"
        @change="handlerSelectFour"
      >
        <el-option
          v-for="item in optionsData"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input v-if="isTemperture" class="itemInput" v-model="formData.inputT" placeholder="请输入内容"></el-input>
      <el-select
        class="itemInput"
        v-model="formData.select"
        placeholder="请选择"
        @change="handleSelect"
        @click="clickhandle"
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
        // isTemperture: true
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
        return true;
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    data: {
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
    },
    handlecancle() {
      this.dialogVisible = false;
      this.$emit("on-close");
    },
    handlerSelectFour(item) {
      postAxiosData("/lenovo-device/api/select/list/fourth").then(res => {
        this.optionsData = res.data;
      });
      this.fourValue = item.value;
      this.handlerSelectFour(this.fourValue);
    },
    handleSelect(query) {
      postAxiosData("/lenovo-device/api/select/list/fifth", query).then(res => {
        this.options = res.data;
      });
    },
    clickhandle() {
      this.handleSelect();
    }
  },
  mounted() {
    this.formData = this.data;
    this.handleSelect();
    // this.handlerSelectFour();
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

