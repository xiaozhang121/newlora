<template>
  <div class="dunoMain">
    <img :src="angle" class="angle">
    <img :src="angle" class="angle angle-top-right">
    <img :src="angle" class="angle angle-botton-left">
    <img :src="angle" class="angle angle-botton-right">
    <div class="dunoMain_nr">
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
      angle: require('@/assets/images/angle.png')
    }
  },
  components: {
    Icons
  },
  props: {

  },
  computed: {

  },
  methods:{

  }
}
</script>

<style lang="scss">
.dunoMain{
  margin-top: 20;
  width: calc(100% - 43px);
  height: calc(100% - 80px);
  position: absolute;
  overflow: hidden;
  box-sizing: border-box;
  .angle {
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
    right: 0;
    transform:rotate(90deg);
  }
  .angle-botton-left {
    top: auto;
    bottom: 0;
    transform:rotate(-90deg);
  }
  .angle-botton-right {
    left: auto;
    top: auto;
    bottom: 0;
    right: 0;
    transform:rotate(180deg);
  }
  .dunoMain_nr{
    position: relative;
    width: calc(100% - 6px);
    height: calc(100% - 6px);
    margin: 3px;
    background: #142838;
    background: rgba(20, 40, 56, 0.8);
  }
}
</style>
