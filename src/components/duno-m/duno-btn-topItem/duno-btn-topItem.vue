<template>
  <div class="dunoBtnTopItem">
    <div :class="['circle_outside',{'active': isActive}]">
      <div :class="['circle_inside']" :style="{'background': isActive?circleColor:'transparent'}"></div>
    </div>
    <div :class="['content',{'active': isActive}]">{{ describeName }}</div>
  </div>
</template>

<script>
import Icons from '_c/icons'
export default {
  name: 'dunoBtnTopItem',
  components: {
    Icons
  },
  props: {
    describeName:{
      type: String,
      default: '暂无数据'
    },
    circleColor:{
      type: String,
      default: 'pink'
    },
    isActive:{
      type: Boolean,
      default: false
    },
  },
  computed: {

  }
}
</script>

<style lang="scss">
.dunoBtnTopItem{
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  .circle_outside{
    border: 1px solid #999;
    border-radius: 300px;
    width: 13px;
    height: 13px;
    padding: 1.4px;
    .circle_inside{
      border-radius: 300px;
      background: pink;
      width: 100%;
      height: 100%;
    }
  }
  .circle_outside.active{
    border: 1px solid white;
  }
  .content{
    margin-left: 5px;
    color: #999;
    font-size: 17px;
  }
  .content.active{
    color: white;
  }
}
</style>
