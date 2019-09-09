<template>
  <div class="enlarge">
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="isShow"
      :show-close="false"
      :modal="true"
      :width="width"
      top="5vh"
      :before-close="handleLarge"
    >
      <img
        v-if="srcData.fileType=='1' ||fileType=='1'"
        :src="srcData.alarmFileAddress || srcData.pic  ||srcData.fileAddress||srcData.taskDeviceImg"
        alt
      />
      <KeyMonitor
        v-if="srcData.fileType=='2'"
        ref="monitor"
        width="100%"
        :streamAddr="srcData.alarmFileAddress"
      />
    </el-dialog>
  </div>
</template>

<script>
import KeyMonitor from "_c/duno-c/KeyMonitor";
export default {
  name: "enlarge",
  components: {
    KeyMonitor
  },
  props: {
    isShow: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    srcData: {
      type: [Object, Array],
      default: () => {
        return {};
      }
    },
    fileType: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      width: "80%"
    };
  },
  methods: {
    handleLarge() {
      this.$emit("closeEnlarge");
    }
  },
  mounted() {
    if (document.documentElement.clientWidth > 3000) {
      this.width = "45%";
    }
  }
};
</script>

<style lang="scss">
.enlarge {
  img {
    width: 100%;
    display: block;
  }
  .el-dialog__header,
  .el-dialog__body {
    padding: 0;
  }
}
</style>


