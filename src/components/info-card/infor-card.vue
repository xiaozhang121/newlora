<template>
  <el-card :shadow="shadow" class="info-card-wrapper" :padding="0">
    <div class="content-con">
      <div class="left-area" :style="{background: color, width: leftWidth}">
        <icons class="icon" :type="icon" :size="iconSize" color="#fff"/>
      </div>
      <div class="right-area" :style="{width: rightWidth, left: leftWidth}">
        <div>
          <slot></slot>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
import Icons from '_c/icons'
export default {
  name: 'InforCard',
  components: {
    Icons
  },
  props: {
    left: {
      type: Number,
      default: 36
    },
    color: {
      type: String,
      default: '#2d8cf0'
    },
    icon: {
      type: String,
      default: ''
    },
    iconSize: {
      type: Number,
      default: 20
    },
    shadow: {
      type: String,
      default: 'always'
    }
  },
  computed: {
    leftWidth () {
      return `${this.left}%`
    },
    rightWidth () {
      return `${100 - this.left}%`
    }
  }
}
</script>

<style lang="scss">
.left-area, .right-area {
  position: absolute;
  top: 0px;
  height: 100%;
  display: table;
  text-align: center;
}
.info-card-wrapper, .content-con, .info-card-wrapper .el-card__body {
  width: 100%;
  height: 100%;
  padding: 0;
}
.middle-center{
  display: table-cell;
  vertical-align: middle;
}
.info-card-wrapper{
  overflow: hidden;

  .content-con{
    position: relative;
    .left-area{
      left: 0px;
      & > .icon{
        display: table-cell;
        vertical-align: middle;
      }
    }
    .right-area{
      & > div{
        display: table-cell;
        vertical-align: middle;
      }
    }
  }
}
</style>
