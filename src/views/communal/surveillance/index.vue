<template>
  <div class="surveillance">
     <div class="title">
       <i class="iconfont icon-zuoyoubuju"></i>
       <span class="nr">{{ layoutType }}</span>
       <duno-btn-top @on-select="onSelect" class="dunoBtnTop" :isCheck="false" :dataList="dataList" title="切换布局" :showBtnList="false"></duno-btn-top>
     </div>
    <div class="main">
      <div class="left"></div>
      <div class="right"></div>
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
    .left{
      width: 60%;
      background: pink;
      padding-bottom: 20%;
    }
    .right{
      width: 40%;
      background: grey;
      padding-bottom: 20%;
    }
  }
}
</style>
