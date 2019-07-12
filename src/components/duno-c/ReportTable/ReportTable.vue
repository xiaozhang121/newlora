<template>
  <div class="reportTable">
    <div>
      <img :src="reportData.img" />
    </div>
    <div class="content">
      <h3>
        任务ID:
        <span>{{reportData.taskID}}</span>
      </h3>
      <p>
        类型:
        <span>{{reportData.typa}}</span>
      </p>
      <p>
        日期:
        <span>{{reportData.date}}</span>
      </p>
      <p>
        时长:
        <span>{{reportData.duration}}</span>
      </p>
      <p>
        异常信息数量:
        <span>{{reportData.abnormal}}</span>
      </p>
      <p>
        来源:
        <span v-for="(item,index) in reportData.origin" :key="index">{{item}}</span>
      </p>
    </div>
    <div class="btn">
      <div>
        <i class="iconfont icon-xiazai"></i>
        <span>下载报告</span>
      </div>
      <div>
        <i class="iconfont icon-chakan"></i>
        <span>查看报告</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ReportTable",
  props: {
    reportData: {
      type: Object,
      default: () => {
        return {
          img: require("@/assets/demo/110kv.png"),
          taskID: "54654564564541",
          typa: "全面巡视",
          date: "2019-07-12 14:45:20",
          duration: "03:23:12",
          abnormal: "0",
          origin: ["机器人1,", "机器人2,", "机器人3"]
        };
      }
    }
  }
};
</script>

<style lang="scss">
.reportTable {
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
  background-color: #213848;
  opacity: 0.8;
  color: #ffffff;
  img {
    width: 100%;
    display: block;
  }
  .content {
    padding: 20px 20px 10px 20px;
    h3 {
      font-size: 16px;
      //   font-weight: normal;
      margin-bottom: 10px;
      span {
        padding-left: 10px;
      }
    }
    p {
      font-size: 14px;
      span {
        padding-left: 10px;
      }
    }
    & > p:last-child {
      margin-top: 15px;
      span {
        color: #3baddf;
        padding-left: 0;
      }
    }
  }
  .btn {
    overflow: hidden;
    & > div {
      box-sizing: border-box;
      float: left;
      width: 50%;
      line-height: 40px;
      text-align: center;
      font-size: 16px;
      background-color: #2b516f;
      span{
          padding-left: 5px;
      }
    }
    & > div:first-child {
      border-right: 1px solid #ffffff;
    }
  }
}
</style>

