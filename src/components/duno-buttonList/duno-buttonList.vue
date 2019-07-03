<template>
  <div class="duno-buttonBox" :style="style" @click="onClick" style="position: relative; display: inline-flex">
    <span class="duno-title" style="padding-left: 10px; padding-right: 5px">{{ title }}</span>
    <i v-if="!isShowChild" style="color: white; text-align: right;flex: 1; padding-right: 14px" class="el-icon-caret-bottom"></i>
    <i v-else style="color: white; text-align: right;flex: 1; padding-right: 14px" class="el-icon-caret-top"></i>
    <div class="btnList-duno" v-if="isShowChild">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  name: 'DunoButton',
  data () {
    return {
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
    isShowChild: {
        type: Boolean,
        default: () => {
            return false
        }
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
.btnList-duno{
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 48px;
  .child-btn{

  }
}
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
  }
  &-dot {
    width: 10px;
    height: 10px;
    margin: 3px 3px 3px 26px;
    background: #fff;
    border-radius: 50%;
  }
  &-title {
    margin-left: 10px;
    color: #fff;
  }
}
.iconfont {
  margin-left: 26px;
  color: #fff;
}
</style>
