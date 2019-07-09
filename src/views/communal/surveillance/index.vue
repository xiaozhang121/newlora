<template>
  <div class="surveillance">
     <div class="title">
       <i class="iconfont icon-zuoyoubuju" v-if="$store.state.app.format == '1'"></i>
       <i class="iconfont icon-shangxiabuju" v-else></i>
       <span class="nr">{{ layoutTypeName }}</span>
       <duno-btn-top @on-select="onSelect" class="dunoBtnTop" :isCheck="false" :dataList="dataList" title="切换布局" :showBtnList="false"></duno-btn-top>
     </div>
    <div class="main" :class="{widthA : $store.state.app.format == '2'}">
      <div class="left_main" :class="{widthA : $store.state.app.format == '2'}">
        <div class="left"  style="padding-bottom: 32%"  v-if="$store.state.app.format == '2'">
          <key-monitor  :showBtmOption="false" paddingBottom="32%" class="monitorM second"></key-monitor>
        </div>
        <div class="left" v-else>
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
      </div>
      <div class="right_main" v-if="$store.state.app.format != '2'" :class="{hidden : $store.state.app.format == '2'}">
        <div class="right">
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
        <div class="right">
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
        <div class="right">
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
      </div>
    </div>
    <div class="oltagevMain second" v-if="$store.state.app.format == '2'">
      <div class="item_main">
        <div class="item">
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
      </div>
    </div>
    <div class="title">
      <span class="nr">{{ oltagevLevel  }}</span>
      <duno-btn-top  class="dunoBtnTop" :isCheck="false" :dataList="oltagevLevelList" title="按电压等级" :showBtnList="false"></duno-btn-top>
    </div>
    <div class="oltagevMain">
      <div class="item_main">
        <div class="item">
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
      </div>
      <div class="item_main">
        <div class="item">
          <key-monitor :showBtmOption="false" class="monitorM"></key-monitor>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dunoBtnTop  from '_c/duno-m/duno-btn-top'
import KeyMonitor from '_c/duno-c/KeyMonitor'
import { mapState } from 'vuex'
export default {
  name: "surveillance",
  components: {
      dunoBtnTop,
      KeyMonitor
  },
  computed: {
      ...mapState([
          'app'
      ]),
      layoutTypeName(){
          return this.dataList[this.$store.state.app.format-1]['describeName']
      }
  },
  data() {
    return {
        dataList:[
            {
              describeName: '布局一',
              format: 1,
              isActive: true
            },
            {
              describeName: '布局二',
              format: 2,
              isActive: false
            }
        ],
        oltagevLevelList:[
            {
                describeName: '电压一',
                isActive: true
            },
            {
                describeName: '电压二',
                isActive: false
            }
        ],
        oltagevLevel: '所有区域',
        layoutType: 1
    }
  },
  methods:{
      onSelect(item, index){
          this.$store.state.app.format = item['format']
          sessionStorage.setItem('format', item['format'])
          this.layoutType = item['format']
      }
  }
};
</script>

<style lang="scss">
.surveillance {
  width: 100%;
  .monitorM{
    width: 100% !important; height: 100% !important;position: absolute
  }
  .widthA{
    width: 100% !important;
    position: relative;
  }
  .single{
    width: 100% !important;
    height: 50% !important;
  }
  .hidden{
    display: none;
  }
  .topHeight{
    padding-bottom: 34% !important;
  }
  .dunoBtnTop{
    width: 134px;
    display: inline-flex;
    padding-bottom: 0;
    .btnList{
      top: inherit !important;
      width: 134px;
      .title{
        font-size: 15px;
      }
    }
  }
  .title{
    color: white;
    display: flex;
    align-items: center;

    .icon-zuoyoubuju,.icon-shangxiabuju{
      font-size: 18px;
      margin-right: 7px;
    }
    .nr{
      font-size: 16px;
      margin-right: 10px;
    }
  }
  .main{
    display: flex;
    width: 99.5%;
    .left_main{
      width: 75.5%;
      .left{
        position: relative;
        width: 100%;
        padding-bottom: 56%;
      }
    }
    .right_main{
      width: 24.2%;
      .right{
        position: relative;
        width: 100%;
        padding-bottom: 56%;
        margin-left: 3.3%;
        margin-bottom: 3.3%;
      }
    }
  }
  .oltagevMain{
    width: 100%;
    zoom:1;
    &:after { clear:both;content:'';display:block;width:0;height:0;visibility:hidden; }
    &.second{
      margin-top: 1%;
      .item_main{
        margin-right: 1% !important;
      }
      .item_main:last-child{
        margin-right: 0 !important;
      }
    }
    .item_main{
      float: left;
      width: calc(98% / 3);
      margin-right: 1%;
      margin-bottom: 1%;
      .item{
        position: relative;
        width: 100%;
        padding-bottom: 56%;
      }
    }
    .item_main:nth-last-child(3n-1){
      margin-right: 0;
    }
  }
  .monitorM.second{
    .vjs-fluid{
      padding-top: 32%;
    }
  }
}
</style>
