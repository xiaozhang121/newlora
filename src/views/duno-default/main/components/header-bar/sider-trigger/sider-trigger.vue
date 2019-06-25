<template>
  <a @click="handleChange" type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']"> <i class="duno-iconfont duno-daohangshouqi-" :style="styles" /></a>
</template>
<script>
export default {
  name: 'siderTrigger',
  props: {
    collapsed: Boolean,
    icon: {
      type: String,
      default: 'navicon-round'
    },
    size: {
      type: Number,
      default: 26
    }
  },
  computed: {
    styles () {
      return {
        fontSize: `${this.size}px`
      }
    }
  },
  methods: {
    handleChange () {
      this.$emit('on-change', !this.collapsed)
    }
  }
}
</script>
<style lang="scss">
  @import './sider-trigger.scss';
</style>
