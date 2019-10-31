<template>
  <div class="enlarge">
    <el-dialog
      v-if="isShow"
      :visible.sync="isShow"
      :show-close="false"
      :modal="true"
      :modal-append-to-body="modalBody"
      :width="width"
      top="5vh"
      :before-close="handleLarge"
    >
      <img
        :class="{'offsetImg': true}"
        class="enlargeImg"
        v-if="srcData.fileType=='1' ||fileType=='1'"
        :src="srcData.alarmFileAddress || srcData.pic  ||srcData.fileAddress||srcData.taskDeviceImg"
        alt
      />
      <KeyMonitor
        v-if="srcData.fileType=='2'"
        ref="monitor"
        width="100%"
        :autoplay='true'
        :pushCamera="pushCamera"
        :streamAddr="srcData.alarmFileAddress?srcData.alarmFileAddress:srcData.streamAddr"
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
  data() {
    return {
      isMax: false
    };
  },
  props: {
    modalBody: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    pushCamera: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
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
      /* this.width = "45%";*/
      this.isMax = true;
      document.querySelector(
        ".enlarge .el-dialog__wrapper"
      ).children[0].style.height =
        window.outerHeight * 0.826412614980289 + "px";
    }
    document.querySelector(
      ".enlarge .el-dialog__wrapper"
    ).children[0].style.height = window.outerHeight * 0.826412614980289 + "px";
  }
};
</script>

<style lang="scss">
.enlarge {
  img {
    width: 100%;
    display: block;
  }
  .offsetImg {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }
  .el-dialog__header,
  .el-dialog__body {
    padding: 0;
  }
}
</style>


