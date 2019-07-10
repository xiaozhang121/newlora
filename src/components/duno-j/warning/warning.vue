<template>
  <div>
    <el-dialog
      :title="'安全警告ID' + warningID"
      :visible="visible"
      width="900px"
      center
      @close="handleClose"
    >
      <div class="monitor"></div>
      <div class="info">
        <div>
          <p class="monitorTitle">判定结果</p>
          <p>{{judgeResult}}</p>
        </div>
        <div>
          <p class="monitorTitle2">人员徘徊</p>
          <a href="javascript:;">结果修订</a>
          <span class="origin">{{'来源：' + origin}}</span>
        </div>
        <div>
          <p class="monitorTitle">处理结果</p>
          <div class="handleResult"></div>
        </div>
      </div>
      <div style="clear: both"></div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    visible: {
      type: Boolean
    },
    warningID: {
      type: String,
      required: true
    },
    judgeResult: {
      type: String
    },
    origin: {
      type: String
    },
    handleResult: {
      type: String
    }
  },
  methods: {
    handleClose() {
      this.visible = false;
      this.$emit('handleClose')
    }
  }
};
</script>
<style lang="scss">
.monitor {
  width: 640px;
  height: 360px;
  background-color: #000;
  float: left;
}
.info {
  width: 200px;
  height: 360px;
  float: right;
  padding: 18px 0;
  color: #777;
  font-size: 12px;
  div {
    padding: 10px;
    .origin {
      float: right;
    }
    .monitorTitle {
      color: #777;
      font-size: 18px;
      line-height: 44px;
    }
    .monitorTitle2 {
      font-size: 20px;
      line-height: 44px;
      color: #000;
    }
    .handleResult {
      width: 100%;
      height: 100px;
      background-color: #ccc;
    }
  }
}
</style>

