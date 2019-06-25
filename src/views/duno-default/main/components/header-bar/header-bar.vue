<template>
  <div class="header-bar">
    <div class="logo-con">
      <img v-show="!collapsed" :src="maxLogo" key="max-logo" />
      <img v-show="collapsed" :src="minLogo" key="min-logo" />
    </div>
    <!--<sider-trigger :collapsed="collapsed" @on-change="handleCollpasedChange"></sider-trigger>-->
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>
<script>
import siderTrigger from './sider-trigger'
import './header-bar.scss'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/logo.png'

export default {
  name: 'HeaderBar',
  components: {
    siderTrigger
  },
  data () {
    return {
      minLogo,
      maxLogo
    }
  },
  props: {
    collapsed: Boolean
  },
  computed: {
    
  },
  methods: {
    handleCollpasedChange (state) {
      this.$emit('on-coll-change', state)
    }
  }
}
</script>
