<template>
  <i v-if="type" :class="`iconfont ${iconVerify}`" :style="styles"></i>
</template>

<script>
export default {
  name: 'Icons',
  props: {
    type: {
      type: String
    },
    color: {
      type: String
    },
    size: {
      type: Number,
      default: 16
    }
  },
  computed: {
    styles () {
      return {
        fontSize: `${this.size}px`,
        color: this.color
      }
    },
    iconVerify () {
      let icon = this.type
      if (icon.indexOf('icon-') !== 0) {
        icon = 'icon-' + icon
      }
      return icon
    }
  }
}
</script>

<style>

</style>
