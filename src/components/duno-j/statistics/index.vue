<template>
  <div>
    <statistics-show :allWarningCount="112" :warningList="warningList" />
    <alert :visible="visible" @handleClose="closeDia" @handleSubmit="submitChange" />
  </div>
</template>
<script>
import statisticsShow from "./components/statistticsShow";
// import alert from "./components/alert";
export default {
  components: {
    statisticsShow,
    // alert
  },
  data() {
    return {
      visible: true,
      warningList: [
        {
          type: "#0f0",
          count: 46,
          msg: "安全帽佩戴"
        },
        {
          type: "red",
          count: 46,
          msg: "安全帽佩戴"
        },
        {
          type: "red",
          count: 6,
          msg: "安全帽佩戴"
        },
        {
          type: "red",
          count: 46,
          msg: "安全帽佩戴"
        }
      ]
    };
  },
  methods: {
    closeDia() {
      this.visible = false;
    },
    submitChange(info) {
      // 提交更改
      console.log(info);
    }
  }
};
</script>

