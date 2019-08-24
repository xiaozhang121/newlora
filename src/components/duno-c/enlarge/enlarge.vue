<template>
  <div class="enlarge">
    <el-dialog
      :visible.sync="isShow"
      :show-close="false"
      :modal="true"
      width="80%"
      top="5vh"
      :before-close="handleLarge"
    >
      <img
        v-if="srcData.fileType=='1'"
        :src="srcData.alarmFileAddress || srcData.pic  ||srcData.fileAddress"
        preview
        preview-text="描述文字"
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
// import preview from "vue-photo-preview";
// import "vue-photo-preview/dist/skin.css";
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
      type: Object || Array,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {};
  },
  methods: {
    handleLarge() {
      this.$emit("closeEnlarge");
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


