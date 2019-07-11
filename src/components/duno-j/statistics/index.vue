<template>
  <div>
    <statistics-show :img="imgBack" :allWarningCount="allWarningCount" :warningList="warningList" />
    <alert :visible="visible" @handleClose="closeDia" @handleSubmit="submitChange" />
  </div>
</template>
<script>
import statisticsShow from "./components/statistticsShow";
import alert from "./components/alert";
export default {
  components: {
    statisticsShow,
    alert
  },
  props: {
    img: {
      type: String
    }
  },
  data() {
    return {
      visible: false,
      allWarningCount: 112,
      imgBack: "",
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
        },
        {
          type: "red",
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
  },
  mounted() {
    this.imgBack = this.img;
    console.log(this.imgBack)
  }
};
</script>

