<template>
  <div class="duno-security">
    <div class="breadcrumb">
      <Breadcrumb />
    </div>
    <div class="dunoDrap">
      <div>重点检测区域</div>
      <div>
        <dunoBtnTop :showBtnList="showBtnList" :top="top" :right="right_r" />
      </div>
      <div>
        <dunoBtnTop :showBtnList="showBtnList" :top="top" :right="right_l" />
      </div>
    </div>
    <div class="monitorArea">
      <KeyMonitor />
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import KeyMonitor from "_c/duno-c/KeyMonitor";

export default {
  name: "security",
  components: {
    Breadcrumb,
    dunoBtnTop,
    KeyMonitor
  },
  data() {
    return {
      showBtnList: false,
      top: "37px",
      right_r: "20px",
      right_l: "230px"
    };
  }
};
</script>

<style lang="scss">
.duno-security {
  width: 100%;
  height: 100%;
  .dunoDrap {
    overflow: hidden;
    & > div:first-child {
      float: left;
      margin-top: 10px;
      color: #ffffff;
    }
    & > div:not(:first-child) {
      float: right;
      margin-top: 27px;
    }
    & > div:nth-child(2) {
      margin-left: 500px;
    }
    & > div:nth-child(3) {
      margin-left: 300px;
    }
  }
  .monitorArea {
    box-sizing: border-box;
    width: 100%;
    min-height: 491px;
    background-color: #142838;
    opacity: 0.8;
    padding: 21px 27px;
  }
}
</style>
