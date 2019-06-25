<template>
  <div class="dunoMain">
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
  background: #1D2027;
  margin-top: 20px;
  width: calc(100% - 43px);
  height: calc(100% - 96px);
  position: absolute;
  overflow: hidden;
  .dunoMain_nr{
    position: relative;
    width: 100%;
    height: 100%;
  }
}
</style>
