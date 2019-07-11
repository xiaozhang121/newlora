<template>
  <div>
    <el-dialog
      :title="warningID"
      :visible="newVisible"
      width="900px"
      center
      @close="handleClose"
    >
      <div class="monitor">
        <img :src="monitorUrl || newMonitorUrl" alt="">
      </div>
      <div class="info">
        <div>
          <p class="monitorTitle">判定结果</p>
          <p>{{judgeResult}}</p>
        </div>
        <div>
          <a href="javascript:;">结果修订</a>
          <span class="origin">{{'来源：' + origin}}</span>
        </div>
        <div>
          <p class="monitorTitle">处理结果</p>
          <p>{{handleResult}}</p>
        </div>
      </div>
      <div style="clear: both"></div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      newVisible: false,
      newMonitorUrl: require("@/assets/camera2.png") 
    };
  },
  props: {
    visible: {
      type: Boolean
    },
    monitorUrl: {
      type: String,
      default: () => {
        return ''
      }
    },
    warningID: {
      type: String,
      default: () => {
        return ''
      }
    },
    judgeResult: {
      type: String
    },
    origin: {
      type: String | Number,
      default: () => {
        return ''
      }
    },
    handleResult: {
      type: String
    }
  },
  watch: {
    visible(now) {
      this.newVisible = now
    }
  },
  methods: {
    handleClose() {
      this.newVisible = false;
      this.$emit('handleClose')
    }
  },
  mounted() {
    this.newVisible = this.visible
  }
};
</script>
<style lang="scss">
.monitor {
  width: 640px;
  height: 360px;
  background-color: #000;
  float: left;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
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

