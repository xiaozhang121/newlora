<template>
  <div class="robotF">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="title">
      <span>机器人一</span>
      <button-custom class="moreTask" title="更多任务>" />
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
        <rou-tine-inspection></rou-tine-inspection>
      </div>
      <div class="bottom">
        <div class="title">最新巡视报告</div>
        <div class="main">
          <template v-for="(item, index) in newsReportLength">
            <div class="item" :key="index">
              <report-table v-if="newsReport[index]">{{ newsReport[index] }}</report-table>
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
import ReportTable from '_c/duno-c/ReportTable'
import rouTineInspection from '_c/duno-m/rouTineInspection'
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
      buttonCustom
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
        newsReport: [1,2,3,4,5],
        dataBread: ['操作中台','机器人巡视','机器人一']
    }
  },
  watch: {

  },
  methods: {

  },
  created(){

  },
  mounted () {

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
    font-size: 18px;
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
