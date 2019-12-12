<template>
  <div class="dunoMain">
    <transition-group  name="fade" class='demo'>
    <img key="1" v-show="isShow || !controlOver" :src="angle" class="angle">
    <img key="2" v-show="isShow || !controlOver" :src="angle" class="angle angle-top-right">
    <img key="3" v-show="isShow || !controlOver" :src="angle" class="angle angle-botton-left">
    <img key="4" v-show="isShow || !controlOver" :src="angle" class="angle angle-botton-right">
    </transition-group>
    <div class="dunoMain_nr" @mouseenter="mouseenter()" @mouseleave="mouseleave()">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import Icons from '_c/icons'
export default {
  name: 'dunoMain',
  data (){
    return {
      isShow: false,
      angle: require('@/assets/images/angle.png')
    }
  },
  components: {
    Icons
  },
  props: {
    controlOver:{
        type: Boolean,
        default: false
    }
  },
  computed: {

  },
  methods:{
      mouseenter(){
          this.isShow = true
      },
      mouseleave(){
          this.isShow = false
      }
  }
}
</script>

<style lang="scss">
img{
  /*z-index: 99!important;*/
}
.dunoMain{
  // border: 1px solid #fff;
  margin-top: 20;
  width: calc(100% - 43px);
  height: calc(100% - 80px);
  position: absolute;
  overflow: hidden;
  box-sizing: border-box;
  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }
  .angle {
    transform: translate(2px,2px);
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 25px;
    height: 25px;
    z-index: 0;
  }
  .angle-top-right {
    left: auto;
    right: 2px;
    top: 2px;
    transform:rotate(90deg);
  }
  .angle-botton-left {
    top: auto;
    left: 2px;
    bottom: 2px;
    transform:rotate(-90deg);
  }
  .angle-botton-right {
    left: auto;
    top: auto;
    bottom: 2px;
    right: 2px;
    transform:rotate(180deg);
  }
  .dunoMain_nr{
    position: relative;
    width: calc(100% - 6px);
    height: calc(100% - 7px);
    margin: 3px;
    background: #142838;
    background: rgba(20, 40, 56, 0.8);
    overflow: hidden;
  }
}
</style>
