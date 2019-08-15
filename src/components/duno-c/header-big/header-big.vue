<template>
  <div class="headerBig">
    <div class="iconImg"></div>
    <div class="dateTime">
      <span class="timeDate">练塘站</span>
      {{ dateTime }}
      <alarm />
      <User />
    </div>
  </div>
</template>

<script>
import alarm from "@/views/duno-default/main/components/alarm";
import User from "@/views/duno-default/main/components/user";
import moment from "moment";
export default {
  name: "headerBig",
  components: {
    alarm,
    User
  },
  data() {
    return {
      dateTime: ""
    };
  },
  methods: {
    getDateTime() {
      const that = this;
      const date = new Date();
      let time = moment(date).format("YYYY.MM.DD HH:mm:ss");
      that.dateTime = time;
    }
  },
  mounted() {
    const that = this;
    setInterval(() => {
      that.getDateTime();
    }, 1000);
  }
};
</script>

<style lang="scss">
.headerBig {
  background-image: url("../../../assets/images/big-header-background.png");
  background-size: 100% 100%;
  overflow: hidden;
  height: 50px;
  position: relative;
  //   width: 100%;
  .iconImg {
    margin: 0 auto;
    background-image: url("../../../assets/images/header-title.png");
    background-repeat: no-repeat;
    margin-top: 5px;
    width: 300px;
    height: 40px;
  }
  .dateTime {
    position: absolute;
    right: 10px;
    top: 10px;
    line-height: 40px;
    color: #fff;
    opacity: 0.6;
  }
  .timeDate {
    color: #fff;
    // opacity: 0.6;
    float: left;
    font-size: 16px;
    margin-right: 20px;
  }
}
</style>


