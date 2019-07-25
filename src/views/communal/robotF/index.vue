<template>
  <div class="robotF">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="title">
      <span>{{ robotName }}</span>
      <button-custom class="moreTask" title="更多任务>" @click.native="$router.push({'name': 'robot-detail'})"/>
    </div>
    <div class="content">
      <div class="top">
        <div class="item">
          <div class="nr">
            <KeyMonitor
              class="keyMonitor"
              streamAddr="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
            />
          </div>
        </div>
        <div class="item">
          <div class="nr">
            <KeyMonitor
                class="keyMonitor"
                streamAddr="http://clips.vorwaerts-gmbh.de/big_buck_bunny.mp4"
            />
          </div>
        </div>
      </div>
      <div class="middle">
        <rou-tine-inspection :taskStatus="taskStatus" :robotStatus="robotStatus">
          <div class="reportData">
            <report-data :taskCurreny="taskCurreny" :analysisResult="taskCurreny['valueState']" :dataType="taskCurreny['dataType']" :deviceName="taskCurreny['deviceName']" :stepCount="taskCurreny['doneStepsCnt']"></report-data>
          </div>
        </rou-tine-inspection>
      </div>
      <div class="bottom">
        <div class="title">最新巡视报告</div>
        <div class="main">
          <template v-for="(item, index) in newsReportLength">
            <div class="item" :key="index">
              <report-table path="report" :url="{downloadUrl: '/robot/rest/reportDownload'}" kind="robot" :reportData="newsReport[index]" v-if="newsReport[index]"></report-table>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import mixinViewModule from '@/mixins/view-module'
import KeyMonitor from "_c/duno-c/KeyMonitor";
import cameraPanel from '_c/duno-m/cameraPanel'
import controBtn from '_c/duno-m/controBtn'
import buttonCustom from '_c/duno-m/buttonCustom'
import reportData from '_c/duno-m/reportData'
import ReportTable from '_c/duno-c/ReportTable'
import rouTineInspection from '_c/duno-m/rouTineInspection'
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import { mapState } from 'vuex'
export default {
  mixins: [mixinViewModule],
  name: 'RoleIndex',
  components: {
      Breadcrumb,
      cameraPanel,
      controBtn,
      rouTineInspection,
      KeyMonitor,
      ReportTable,
      buttonCustom,
      reportData
  },
  computed:{
    ...mapState([
        'user'
    ]),
    newsReportLength(){
        if(this.newsReport.length % 5 !=0){
            let base = parseInt(this.newsReport.length / 5)
            return (base+1) * 5
        }else{
            return this.newsReport.length
        }
    }
  },
  data () {
    const that = this
    return {
        taskId: '',
        taskCurreny: '',
        robotStatus: '',
        taskStatus: '',
        reportsList: [],
        robotName:'',
        routeName: '',
        newsReport: [],
        dataBread: ['操作中台','机器人巡视','机器人一'],
        baseUrl: process.env.NODE_ENV === 'development' ? that.$config.baseUrl.dev : that.$config.baseUrl.pro
    }
  },
  watch: {
      '$route' (to) {
          this.routeName = to.name
      },
      routeName(now){
         if(now == 'robot-twoList'){
             this.$set(this.dataBread,2,'机器人二')
             this.robotName = '机器人二'
         }else{
             this.dataBread[2] = '机器人一'
             this.robotName = '机器人一'
             this.$set(this.dataBread,2,'机器人一')
         }
      }
  },
  methods: {
      initData(){
          const that = this
          postAxiosData('/robot/rest/taskStatus',{substationId: '1', robotId: '9'}).then(res=>{
              that.taskStatus = res.data
          })
          postAxiosData('/robot/rest/robotStatus',{substationId: '1', robotId: '9'}).then(res=>{
              that.robotStatus = res.data
          })
          postAxiosData('/robot/rest/reports',{substationId: '1', robotId: '9',length: 10}).then(res=>{
              that.reportsList = res.data
              let data = res.data
              data = data.reportList
              data.map(item=>{
                  item['pic'] = that.baseUrl+'/'+item['RoadImgPath']
                  item['planId'] = item['TaskID']
                  if(item['TaskName'] == '1501')
                    item['name'] = '全面巡视'
                  else if(item['TaskName'] == '1502')
                    item['name'] = '例行巡视'
                  else if(item['TaskName'] == '1503')
                      item['name'] = '专项巡视'
                  else if(item['TaskName'] == '1504')
                      item['name'] = '特殊巡视'
                  else
                      item['name'] = '暂无数据'
                  item['date'] = item['PlanStartTime']
                  item['alarmNum'] = item['AlarmCount']
                  item['timeLong'] = item['AlarmCount']
              })
              debugger
              that.newsReport = data
          })
          postAxiosData('/robot/rest/taskCurLink',{substationId: '1', robotId: '9',taskRunHisId: that.taskStatus['taskRunHisId']}).then(res=>{
              that.taskCurreny = res.data
          })
      }
  },
  created(){
      this.initData()
  },
  mounted () {
    this.routeName = this.$route.name
  }
}
</script>
<style lang="scss">
.robotF{
  color: white;
  width: 100%;
  height: 100%;
  .breadcrumb{
    margin-bottom: 15px;
  }
  .title{
    display: flex;
    font-size: 20px;
    margin-bottom: 15px;
    justify-content: space-between;
    align-items: center;
    .moreTask{
      transform: scale(0.8);
    }
  }
  .content{
    .top{
      display: flex;
      .item{
        width: 100%;
        background: grey;
        &:last-child{
          margin-left: 1%;
        }
        .nr{
          position: relative;
          padding-bottom: 56%;
          width: 100%;
          background: grey;
          .keyMonitor{
            width: 100% !important;
            height: 100%;
            position: absolute;
          }
        }
      }
    }
    .middle{
      margin-top: 1%;
      background: #142838;
      .reportData{
        position: relative;
        margin-right: 50px;
        margin-left: 44px;
      }
    }
    .bottom{
      .title{
        margin: 15px 0;
      }
      .main{
         .item{
           display: inline-block;
           margin-right: 1.5%;
           width: calc( 94% / 5);
           &:nth-last-child(5n+1){
             margin-right: 0;
           }
         }
      }
    }
  }
}
</style>
