<template>
  <div class="duno-buttonBox" :style="style" @click="onClick">
    <span class="duno-dot" v-if="!isIcon && showIcon" :style="'background:' + dotColor" />
    <i v-if="isIcon && showIcon" :class="['iconfont', icon]" :style="'color:' + dotColor"></i>
    <span class="duno-title">{{ title }}</span>
    <span class="alarmNum" v-if="alarmNum"  :style="'background:' + dotColor">{{ alarmNum }}</span>
  </div>
</template>
<script>
export default {
  name: 'DunoButton',
  data () {
    return {
      ball: require('@/assets/images/border/ball.png'),
      handRed: require('@/assets/images/border/handRed.png'),
      lock: require('@/assets/images/border/lock.png'),
      glasses: require('@/assets/images/border/glasses.png'),
      alarm: require('@/assets/images/border/alarm.png'),
      infrared: require('@/assets/images/border/infrared.png'),
      robot: require('@/assets/images/border/robot.png'),
      visible: require('@/assets/images/border/visible.png'),
      region: require('@/assets/images/border/region.png'),
      bottomColour: require('@/assets/images/border/bottomColour.png'),
    }
  },
  props: {
    alarmNum: {

    },
    btnType: {
      type: String // 可选值  glasses  alarm  infrared  robot  visible  region
    },
    title: {
      type: String
    },
    isIcon: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    icon: {
      type: String,
      default: () => {
        return 'icon-icon-'
      }
    },
    isOpenBtn: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    showIcon: {
      type: Boolean,
      default: () => {
        return true
      }
    }
  },
  computed: {
    style () {
      let btnType = ''
      if (!this.isOpenBtn) {
        btnType = this.bottomColour
      } else if (this.btnType == 'glasses') {
        btnType = this.glasses
      } else if (this.btnType == 'alarm') {
        btnType = this.alarm
      } else if (this.btnType == 'infrared') {
        btnType = this.infrared
      } else if (this.btnType == 'robot') {
        btnType = this.robot
      } else if (this.btnType == 'visible') {
        btnType = this.visible
      } else if (this.btnType == 'region') {
        btnType = this.region
      }else if (this.btnType == 'ball') {
          btnType = this.ball
      }else if (this.btnType == 'handRed') {
          btnType = this.handRed
      }else if (this.btnType == 'lock') {
          btnType = this.lock
      }
      let style = 'background-image: url(' + btnType + ');'
      if (!this.showIcon) {
        style += 'justify-content: center'
      }
      return style
    },
    dotColor () {
      let color = ""
      if (!this.isOpenBtn) {
        if(this.alarmNum)
          color = "#a8a8a8"
        else
          color = "#fff"
      } else if (this.btnType == 'glasses') {
        color = "#53fec0"
      } else if (this.btnType == 'alarm') {
        color = "#ee183b"
      } else if (this.btnType == 'infrared') {
        color = "#ff5eb9"
      } else if (this.btnType == 'robot') {
        color = "#ff9000"
      } else if (this.btnType == 'visible') {
        color = "#00b4ff"
      } else if (this.btnType == 'region') {
        color = "#00fefe"
      }else if (this.btnType == 'ball') {
          color = "#5777f8"
      }else if (this.btnType == 'handRed') {
          color = "#ba6af7"
      }else if (this.btnType == 'lock') {
          color = "#f7c427"
      }
      return color
    }
  },
  methods: {
    onClick () {
      this.$emit('onClick')
    }
  }
}
</script>
<style lang="scss" scoped>
.duno {
  &-buttonBox {
    width: 150px;
    height: 47px;
    background-repeat: no-repeat;
    background-position: top left;
    background-size: 100% 100%;
    display: -webkit-inline-flex;
    display: inline-flex;
    align-items: center;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .alarmNum{
        color: white;
        background: grey;
        width: 20px;
        height: 20px;
        margin-left: 3px;
        font-size: 13px;
        text-align: center;
        border-radius: 50%;
    }
  }
  &-dot {
    width: 10px;
    height: 10px;
    margin: 3px 3px 3px 26px;
    background: #fff;
    border-radius: 50%;
  }
  &-title {
    margin-left: 7px;
    color: #fff;
  }
}
.iconfont {
  margin-left: 26px;
  color: #fff;
}
</style>
