<template>
  <div class="sample-img">
    <el-dialog
      title="批量导入样本图片"
      :visible.sync="visible"
      width="600px"
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
        <el-form-item label="被监测设备">
          <el-select v-model="form.divice" placeholder="请选择"></el-select>
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
    handleClose() {
      this.$emit("on-close");
    },
    loadData(item, callback) {
      item.loading = true;
      setTimeout(() => {
        if (item.value === "beijing") {
          item.children = [
            {
              value: "talkingdata",
              label: "TalkingData"
            },
            {
              value: "baidu",
              label: "百度"
            },
            {
              value: "sina",
              label: "新浪"
            }
          ];
        } else if (item.value === "hangzhou") {
          item.children = [
            {
              value: "ali",
              label: "阿里巴巴"
            },
            {
              value: "163",
              label: "网易"
            }
          ];
        }
        item.loading = false;
        callback();
      }, 1000);
    }
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
    }
    .el-dialog__footer {
      background-color: #e0e0e0;
    }
  }
}
</style>
