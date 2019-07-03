<template>
  <div class="historicalwarning">
    <h3 class="title">{{title}}</h3>
    <div class="historicalwarningBox">
      <div class="historicalwarningItem" @mouseenter.stop="mouseenter(index)" @mouseleave.stop="mouseleave" v-for="(item, index) in dataList" :key="index">
        <transition name="el-zoom-in-center">
          <div class="picDetail" v-show="item.show">
            <img :src="item.alarmFileAddress"/>
          </div>
        </transition>
        <div>{{item.alarmTime}}</div>
        <div><span>温度：{{item.alarmValue}}℃</span><span class="threshold">超出阈值：{{item.threshold}}</span></div>
        <div>缺陷评估：<span :class="[item.alarmLevel == '1'?'general':(item.alarmLevel == '2'?'warning':'alarm')]">{{item.alarmLevelName}}</span></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'historicalwarning',
  data (){
      return{
          timer: null
      }
  },
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    dataList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    mouseleave(){
        this.timer = setTimeout(()=>{
            this.dataList.map(item=>{
                item['show'] = false
            })
        },500)
    },
    mouseenter(index){
        if(this.timer){
            clearTimeout(this.timer)
            this.timer = null
        }
       this.dataList.map(item=>{
           item['show'] = false
       })
       let item = this.dataList[index]
       item['show'] = true
       this.$forceUpdate()
    }
  }
}
</script>
<style lang="scss" scoped>
.historicalwarning {
  .historicalwarningBox{
    width: 136%;
    max-height: 400px;
    overflow-x: visible;
    overflow-y: auto;
    position: relative;
    left: -159px;
  }
  .historicalwarningItem{
    padding-left: 175px;
    background: linear-gradient(to right,transparent 26%, #203644 10%); /* 标准的语法（必须放在最后） */
    position: relative;
    .picDetail{
      position: absolute;
      width: 137px;
      height: 99px;
      left: 4px;
      margin-top: -10px;
      background: pink;
      img{
        width: 137px;
        height: 99px;
      }
    }
  }
  .title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }
  &Box {
    width: 100%;
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &Item {
    color: #fff;
    font-size: 18px;
    padding: 10px;
    background: rgba(32, 54, 68, 0.7);
    margin-bottom: 10px;
    border-radius: 4px;

    .threshold {
      margin-left: 1.5em;
    }
    .alarm {
      color: #d7203f;
    }
    .warning {
      color: #ff8300;
    }
    .general {
      color: #ffe828;
    }
  }
}
</style>
