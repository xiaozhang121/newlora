<template>
  <div class="alarmLog">
    <div class="img">
      <img :src="remarkData.alarmFileAddress" alt />
      <i class="iconfont icon-bofang"></i>
    </div>
    <div class="content">
      <div class="top">
        <p>
          机械判断:
          <span>{{remarkData.machineJudge}}</span>
        </p>
      </div>
      <div class="main">
        <div>
          拍摄时间:
          <span>{{remarkData.alarmTime}}</span>
        </div>
        <div>
          <i>处理记录:</i>
          <p>
            <span v-for="(item,index) in dealList" :key="index">{{item}}</span>
          </p>
        </div>
      </div>
      <div class="btn">
        <p v-if="isShow">
          拍摄来源:
          <span>{{remarkData.monitorDeviceId}}</span>
          <i>备注</i>
          <i @click="addReturn" :disabled="isDisabled">复归</i>
        </p>
        <p v-else>
          拍摄来源:
          <span>{{remarkData.monitorDeviceId}}</span>
          <i>查看详情></i>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { constants } from "crypto";
import { dealRemarks } from "@/api/configuration/configuration.js";
export default {
  name: "AlarmLog",
  props: {
    isShow: {
      type: Boolean,
      default: () => {
        return true;
      }
    },
    remarkData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      address: "",
      isDisabled: true,
      dealList: []
    };
  },
  methods: {
    addReturn() {
      const that = this;
      let query = {
        alarmId: that.remarkData.alarmId,
        type: "1"
      };
      dealRemarks(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
      });
      //   if (this.isDisabled) {
      //     let strTime =
      //       "复归 (" + moment(new Date()).format("YYYY-MM-DD HH:mm:ss") + ")";
      //     this.dealList.unshift(strTime);
      //     this.isDisabled = false;
      //   }
    }
  },
  mounted() {
    if (!this.remarkData.dealList) {
      return;
    }
    this.remarkData.dealList.forEach(el => {
      let str = el.dealType + " (" + el.dealTime + ")";
      this.dealList.push(str);
    });
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
      display: block;
      height: 100%;
      width: 100%;
    }
    i {
      position: absolute;
      top: 39%;
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
      margin-top: 10px;
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
          //   width: 68px;
          padding: 0 20px;
          background-color: #3a81a1;
          border-radius: 16px;
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
