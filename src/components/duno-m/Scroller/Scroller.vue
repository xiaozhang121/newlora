<template>
  <div class="Scroller"  @mousemove="enterMove($event)">
      <scroller-item @on-enter="enterControl" @on-leave="leaveControl" :widthOption="setWidth" @save-width="saveWidth" class="scrollerItem" id="first" ref="first" style="position: absolute" v-if="visibleFlagF" idName="box"  index="1" @on-hide="onHide" @on-stop="onStop" @on-click="handleClick" :listOption="lists"></scroller-item>
      <scroller-item  @on-enter="enterControl" @on-leave="leaveControl"  :widthOption="setWidth" @save-width="saveWidth" class="scrollerItem" id="second" ref="second" style="position: absolute" v-if="visibleFlagS" idName="boxF" index="2" @on-hide="onHide" @on-stop="onStop" @on-click="handleClick" :listOption="lists"></scroller-item>
      <!--<div id="node">
                <div v-for="(item, index) in lists" class="node_item" :key="index">
                    <div class="name">
                        {{ item['alarmLevelName'] }}
                    </div>
                    <div class="time">
                        {{ item['alarmTime'] }}
                    </div>
                    <div class="mainDevice">
                        {{ item['mainDevice'] }}
                    </div>
                    <div class="powerDeviceName">
                        {{ item['powerDeviceName'] }}
                    </div>
                    <div class="nr">
                        {{ item.alarmValue?item.alarmValue:item.alarmDetailType }}
                    </div>
                </div>
      </div>-->
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning :popData="popData"  detailsType="alarm" :visible="visible" @handleClose="handleClose" />
  </div>
</template>

<script>
import warningSetting from "_c/duno-j/warningSetting";
import ScrollerItem from './ScrollerItem'
import wraning from "_c/duno-j/warning";
export default {
  name: "Scroller",
  components: {
    warningSetting,
    wraning,
    ScrollerItem
  },
  data() {
    return {
      setWidth: 0,
      count: 1,
      visibleFlagF: false,
      visibleFlagS: false,
      visibleSettingOption: false,
      visible: false,
      lists: [],
      popData: {},
      distance: 1,
      timer: null,
      text: "" // 数组文字转化后的字符串
    };
  },
  props: {
    listOption: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    visible(now){
      if(!now){
          this.leaveControl()
      }
    },
    listOption: {
      handler(now) {
        this.lists = now;
        if(now.length)
          this.visibleFlagF = true
      },
      deep: true,
      immediate: true
    }
  },
  computed: {},
  methods: {
   saveWidth(now){
      if(this.setWidth < now){
          this.setWidth = now
      }
   },
   enterControl(){
        if(this.$refs.first){
            this.$refs.first.enter()
        }
        if(this.$refs.second){
            this.$refs.second.enter()
        }
    },
    enterMove(e){
      const that = this
      if(document.querySelectorAll('.scrollerItem').length == 2){
          if(e.screenX<=1000){
              if(that.count % 2 == 0){
                  $('#second').css({'z-index': 99})
                  $('#first').css({'z-index': 0})
              }else{
                  $('#first').css({'z-index': 99})
                  $('#second').css({'z-index': 0})
              }
          }else{
              if(that.count % 2 == 0){
                  $('#first').css({'z-index': 99})
                  $('#second').css({'z-index': 0})
              }else{
                  $('#second').css({'z-index': 99})
                  $('#first').css({'z-index': 0})
              }
          }
      }else{
          $('#first').css({'z-index': 0})
      }
    },
    leaveControl(){
        if(!this.visible){
            if(this.$refs.first)
              this.$refs.first.leave()
            if(this.$refs.second)
              this.$refs.second.leave()
        }
    },
    onHide(index){
        this.count++
        if(index == 1){
            this.visibleFlagF = false
        }else{
            this.visibleFlagS = false
        }
    },
    onStop(index){
        if(index == 1){
            this.visibleFlagS = true
        }else{
            this.visibleFlagF = true
        }
    },
    onClose() {
      this.visibleSettingOption = false;
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    handleClick(index) {
      let that = this;
      that.popData = that.lists[index];
      that.visible = true;
    },
  },
  created() {},
  updated: function() {},
  beforeDestroy() {
    this.enterControl()
    // clearInterval(this.timer);
  },
  mounted() {
    /*this.$nextTick(() => {
      this.move(true);
    });*/
    /*   for (let i = 0; i < this.lists.length; i++) {
            this.text += ' ' + this.lists[i]
        }*/
  }
};
</script>

<style lang="scss">
.Scroller {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  position: relative;
  .wrap {
    overflow: hidden;
    color: #005bbe;
  }
  #box {
    /*width: 80%;*/
    height: 100%;
  }
  #box div {
    float: left;
  }
  #marquee {
    //margin: -5px 16px 0 20px;
    display: flex;
    white-space: nowrap;
  }
  .marquee_item,
  .node_item {
    cursor: pointer;
    margin-right: 15px;
    height: 54px;
    display: inline-flex;
    align-items: center;
    background-color: rgba(30, 70, 97, 0.9);
    border-radius: 30px;
    color: white;
    font-size: 16px;
    .name {
      align-items: center;
      margin-left: 30px;
      margin-right: 10px;
      width: 80px;
      height: 30px;
      display: inline-flex;
      justify-content: center;
      border-radius: 28px;
      align-items: center;
      color: #1d1f26;
      &.serious {
        background: #f4a723;
      }
      &.commonly {
        background: #5eb0fc;
      }
      &.danger {
        background: #d0011b;
      }
    }
    .time,
    .mainDevice,
    .powerDeviceName,
    .nr {
      margin-right: 20px;
    }
  }
  #node {
    position: absolute;
    z-index: -99;
    top: -99px;
    white-space: nowrap;
  }
}
</style>

