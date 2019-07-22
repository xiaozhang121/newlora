<template>
  <div class="abnormalInfoHome">
    <div class="topNav">
      <scroller :listOption="messageList"></scroller>
    </div>
    <div class="middle">
      <div class="abnormalInfo">
          <duno-main class="contain"></duno-main>
      </div>
    </div>
  </div>
</template>

<script>
import Scroller from '_c/duno-m/Scroller'
import dunoMain  from '_c/duno-m/duno-main'
import { getAxiosData, postAxiosData, putAxiosData } from '@/api/axiosType'
export default {
  name: "abnormalInfo",
  components: {
      Scroller,
      dunoMain
  },
  data() {
    const that = this;
    return {
      messageList:[
          {alarmLevel: '1', alarmLevelName: '危机缺陷', alarmTime: '2019-09-04 12:14:15', mainDevice: '4号主变', powerDeviceName:'1000千伏', alarmDetailType: '表面污垢', alarmValue: '表面污垢'},
      ]
    }
  },
  created() {
      this.getData()
  },
  methods: {
      getData () {
          const that = this
          const url =  '/lenovo-alarm/api/alarm/list'
          const query = {
              pageIndex: 1,
              pageRows: 44321,
              isDeal: "0",
              deviceName: ""
          };
          getAxiosData(url, query).then(res => {
              if (res.code !== 200) {
                  that.messageList = [];
                  return false;
              }
               that.messageList = res.data.tableData
          })
      }
  }
};
</script>

<style lang="scss">
.abnormalInfoHome{
  .topNav{
    background-color: rgba(32, 62, 82, 0.8);
    height: 80px;
  }
  .middle{
    margin-top: 20px;
    .abnormalInfo{
      width: 50%;
      position: relative;
      padding-bottom: 28%;
      .contain{
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
