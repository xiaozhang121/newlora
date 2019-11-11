<template>
  <div class="duno-calibrat">
    <el-dialog title="新增标定" :visible.sync="isShow" width="500px" :before-close="handleClose">
      <div class="content">
        <el-input v-model="input" placeholder="图⽚编号058214新增标定-1（点击修改名称）"></el-input>
        <el-select v-model="value" placeholder="选择识别类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <frame-selection></frame-selection>
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
    }
  },
  data() {
    return {
      input: "",
      value: "",
      options: []
    };
  },
  methods: {
    handleSubmit() {
      this.$emit("closeShot");
    },
    handleCancel() {
      this.$emit("closeShot");
    }
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
