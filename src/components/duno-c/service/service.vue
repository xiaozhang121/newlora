<template>
  <div class="duno-service">
    <p>Service</p>
    <div class="tabData" :style="{height:height}">
      <div
        class="square"
        :class="{gray:item.serviceStatus!=='passing'}"
        v-for="(item,index) in dataList"
        :key="index"
      >
        <span :style="{backgroundColor:item.serviceStatus=='passing'?'#7ed321':'#ee183b'}"></span>
        {{item.name}}
        <div v-if="isShow">{{item.countStatus}}{{item.serviceStatus}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { getAxiosData, postAxiosData } from "@/api/axiosType";
export default {
  name: "service",
  props: {
    height: {
      type: String,
      default: () => {
        return "";
      }
    },
    pieData: {
      type: Object,
      default: () => {
        return {};
      }
    }
  },
  data() {
    return {
      dataList: [],
      isShow: true
    };
  },
  watch: {
    pieData: {
      handler() {
        this.getConsul();
      },
      deep: true
    }
  },
  methods: {
    getConsul() {
      let that = this;
      let url = "/lenovo-mon/api/monitoring/host/zabbix/getConsulService";
      let query = {
        hostId: that.pieData.hostId,
        hostType: that.pieData.htype
      };
      getAxiosData(url, query).then(res => {
        that.dataList = res.data;
        this.$emit("on-length", that.dataList.length);
      });
    },
    getWidth() {
      let screen = window.screen.availWidth;
      if (screen > 3500) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    }
  },
  mounted() {
    this.getConsul();
  },
  created() {
    this.getWidth();
  }
};
</script>
<style lang="scss">
.duno-service {
  padding: 0 50px 0 30px;
  @media screen and (max-width: 1366px) {
    padding: 0 20px 0 10px;
  }
  p {
    text-align: center;
    font-size: 20px;
    color: #fff;
    margin-bottom: 20px;
  }
  .tabData {
    overflow-y: auto;
    & > div {
      color: #fff;
      display: flex;
      justify-content: space-around;
      padding: 10px 20px;
    }
    & > div:nth-child(odd) {
      background-color: #203e52;
    }
    .square {
      display: flex;
      justify-content: space-between;
      align-items: center;
      @media screen and (max-width: 1366px) {
        justify-content: flex-start;
      }
      span {
        display: block;
        height: 14px;
        width: 14px;
        border-radius: 50%;
        margin-right: 10px;
      }
    }
    .gray {
      color: #aaa;
    }
  }
}
</style>
