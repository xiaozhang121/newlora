<template>
  <div class="alarmLog">
    <div class="img">
      <img :src="address" alt />
      <i class="iconfont icon-bofang"></i>
    </div>
    <div class="content">
      <div class="top">
        <p>
          机械判断:
          <span>{{mechanics}}</span>
        </p>
      </div>
      <div class="main">
        <div>
          拍摄时间:
          <span>{{time}}</span>
        </div>
        <div>
          <i>处理记录:</i>
          <p>
            <span v-for="(item,index) in remarksData.slice(0,2)" :key="index">{{item}}</span>
          </p>
        </div>
      </div>
      <div class="btn">
        <p>
          拍摄来源:
          <span>摄像头ID</span>
          <i>备注</i>
          <i @click="addReturn" :disabled="isDisabled">复归</i>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "AlarmLog",
  props: {
    mechanics: {
      type: String,
      default: "人员徘徊"
    },
    time: {
      type: String,
      default: "2019-07-08 19:32:00"
    },
    remarks: {
      type: Array,
      default: () => {
        return [
          "现场查询原因 (2019-07-08 19:32:00)",
          "现场原因 (2019-07-08 19:32:00)",
          "现场查询 (2019-07-08 19:32:00)",
          "查询原因 (2019-07-08 19:32:00)",
          "现查因 (2019-07-08 19:32:00)"
        ];
      }
    }
  },
  data() {
    return {
      address: "",
      isDisabled: true,
      remarksData: []
    };
  },
  methods: {
    addReturn() {
      if (this.isDisabled) {
        let strTime =
          "复归 (" + moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ")";
        this.remarksData.unshift(strTime);
        this.isDisabled = false;
      }
    }
  },
  watch: {
    remarks(now) {
      this.remarksData = now;
    }
  },
  mounted() {
    this.remarksData = this.remarks;
  }
};
</script>


<style lang="scss">
.alarmLog {
  float: left;
  margin-bottom: 20px;
  width: calc(50% - 10px);
  margin-left: 20px;
  height: 180px;
  background-color: #203644;
  border-radius: 2px;
  display: flex;
  justify-content: space-around;
  .img {
    width: 40%;
    height: 100%;
    position: relative;
    img {
      width: 100%;
    }
    i {
      position: absolute;
      top: 35%;
      left: 45%;
      font-size: 30px;
      color: #ffffff;
    }
  }
  .content {
    width: 60%;
    padding: 20px;
    .top {
      p {
        font-size: 18px;
        color: #ffffff;
        span {
          padding-left: 5px;
        }
      }
    }
    .main {
      margin-top: 10px;
      div {
        font-size: 14px;
        color: #ffffff;
        display: flex;
        justify-content: flex-start;
        & > span {
          padding-left: 10px;
        }
        i {
          font-style: normal;
        }
        p {
          padding-left: 10px;
          span {
            display: block;
          }
        }
      }
    }
    .btn {
      margin-top: 20px;
      line-height: 32px;
      p {
        font-size: 14px;
        color: #ffffff;
        span {
          cursor: pointer;
          color: #3baddf;
          padding-left: 5px;
        }
        i {
          cursor: pointer;
          float: right;
          font-style: normal;
          display: block;
          width: 68px;
          background-color: #3a81a1;
          border-radius: 16px;
          opacity: 0.68;
          margin-left: 10px;
          text-align: center;
        }
        i:last-child {
          background-color: #305e83;
        }
      }
    }
  }
}
</style>
