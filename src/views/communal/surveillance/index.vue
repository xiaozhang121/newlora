<template>
  <div class="surveillance">
     <div class="title">
       <i class="iconfont icon-zuoyoubuju"></i>
       <span class="nr">{{ layoutType }}</span>
       <duno-btn-top @on-select="onSelect" class="dunoBtnTop" :isCheck="false" :dataList="dataList" title="切换布局" :showBtnList="false"></duno-btn-top>
     </div>
    <div class="main" :class="{widthA : layoutType == '布局二'}">
      <div class="left_main" :class="{widthA : layoutType == '布局二'}">
        <div class="left" :class="{topHeight : layoutType == '布局二'}"></div>
      </div>
      <div class="right_main" :class="{hidden : layoutType == '布局二'}">
        <div class="right"></div>
        <div class="right"></div>
        <div class="right"></div>
      </div>
    </div>
    <div class="oltagevMain second" v-if="layoutType == '布局二'">
      <div class="item_main">
        <div class="item"></div>
      </div>
      <div class="item_main">
        <div class="item"></div>
      </div>
      <div class="item_main">
        <div class="item"></div>
      </div>
    </div>
    <div class="title">
      <span class="nr">{{ oltagevLevel  }}</span>
      <duno-btn-top  class="dunoBtnTop" :isCheck="false" :dataList="oltagevLevelList" title="按电压等级" :showBtnList="false"></duno-btn-top>
    </div>
    <div class="oltagevMain">
      <div class="item_main">
        <div class="item"></div>
      </div>
      <div class="item_main">
        <div class="item"></div>
      </div>
      <div class="item_main">
        <div class="item"></div>
      </div>
      <div class="item_main">
        <div class="item"></div>
      </div>
    </div>
  </div>
</template>

<script>
import dunoBtnTop  from '_c/duno-m/duno-btn-top'
export default {
  name: "surveillance",
  components: {
      dunoBtnTop
  },
  data() {
    return {
        dataList:[
            {
              describeName: '布局一',
              isActive: true
            },
            {
              describeName: '布局二',
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
        layoutType: '布局一'
    }
  },
  methods:{
      onSelect(item, index){
          this.layoutType = item['describeName']
      }
  }
};
</script>

<style lang="scss">
.surveillance {
  width: 100%;
  .widthA{
    width: 100% !important;
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

    .icon-zuoyoubuju{
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
        width: 100%;
        background: grey;
        padding-bottom: 56%;
      }
    }
    .right_main{
      width: 24.2%;
      .right{
        width: 100%;
        background: grey;
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
      background: grey;
      margin-right: 1%;
      margin-bottom: 1%;
      .item{
        width: 100%;
        background: grey;
        padding-bottom: 56%;
      }
    }
    .item_main:nth-last-child(3n-1){
      margin-right: 0;
    }
  }
}
</style>
