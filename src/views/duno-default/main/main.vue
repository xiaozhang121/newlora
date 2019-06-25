<template>
  <el-container style="height: 100%" class="main">
    <el-header class="main-header">
      <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
        <alarm-tip />  <!-- 告警消息 -->
        <user />  <!-- 用户基础操作 -->
      </header-bar>
    </el-header>
    <el-container class="mainAside">
      <el-aside hide-trigger collapsible :width="collapsed ? '64px' : '256px'" class="left-sider" :style="{overflow: 'hidden'}">
        <side-menu :unique-opened="true" ref="sideMenu" backgroundColor="#23262F" textColor="#fff" activeTextColor="#0A70F8" :default-active="defaultActive" :collapsed="collapsed" @select="turnToPage" :menu-list="menuList"></side-menu>
      </el-aside>
      <el-main class="main-content-con">
        <el-container class="main-layout-con">
          <el-main class="content-wrapper">
            <!--<custom-bread-crumb show-icon :list="breadCrumbList"></custom-bread-crumb>-->
            <keep-alive :include="cacheList">
              <router-view class="duno-cons"/>
            </keep-alive>
            <!--<duno-footer />-->
          </el-main>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { mapMutations, mapState } from 'vuex'
import { getNewTagList } from '@/libs/util'
import SideMenu from './components/side-menu' // 侧导航栏
import HeaderBar from './components/header-bar' // header
import customBreadCrumb from '_c/custom-bread-crumb'  // 面包屑导航
import User from './components/user' // 用户基础操作
import alarmTip from './components/alarm/alarm.vue' // 告警消息
import DunoFooter from '_c/duno-footer'
import './main.scss'
export default {
  name: 'Main',
  components: {
    SideMenu,
    HeaderBar,
    customBreadCrumb,
    User,
    alarmTip,
    DunoFooter
  },
  data () {
    return {
      collapsed: false,
      isFullscreen: false,
      bodyWidth: null,
      screenWidth: null
    }
  },
  computed: {
    defaultActive () {
      const that = this
      const active = that.$route.meta && that.$route.meta.active ? that.$route.meta.active : that.$route.name
      return active
    },
    ...mapState([
      'user'
    ]),
    tagNavList () {
      return this.$store.state.app.tagNavList
    },
    tagRouter () {
      return this.$store.state.app.tagRouter
    },
    cacheList () {
      return this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []
    },
    menuList () {
      return this.$store.getters.menuList
    },
    local () {
      return this.$store.state.app.local
    },
    breadCrumbList () {
      return this.$store.state.app.breadCrumbList
    }
  },
  methods: {
    ...mapMutations([
      'setBreadCrumb',
      'setTagNavList'
    ]),
    turnToPage (route) {
      let { name, params, query } = {}
      if (typeof route === 'string') name = route
      else {
        name = route.name
        params = route.params
        query = route.query
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1])
        return
      }
      this.$router.push({
        name,
        params,
        query
      })
    },
    handleCollapsedChange (state) {
      this.user.isCollapsed = state
      this.collapsed = state
    },
    sidebarHide (num) {
      if (num && num < 500) {
        this.user.isCollapsed = true
        this.collapsed = true
      } else {
        this.user.isCollapsed = false
        this.collapsed = false
      }
    },
    getWidth () {
      let that = this
      let ivuLayoutWidth = document.getElementsByClassName('el-aside')[0].clientWidth
      window.screenWidth = document.body.clientWidth
      that.screenWidth = window.screenWidth - ivuLayoutWidth
      that.bodyWidth = window.screenWidth
    }
  },
  watch: {
    '$route' (newRoute) {
      this.setBreadCrumb(newRoute.matched)
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute))
    },
    bodyWidth (now) {
      this.sidebarHide(now)
    },
    screenWidth (val) {
      let that = this
      if (!that.timer) {
        that.screenWidth = val
        if (val < 620) {
          that.user.isFormWidthTop = true
        } else {
          that.user.isFormWidthTop = false
        }
        that.timer = true
        setTimeout(function () {
          that.timer = false
        }, 400)
      }
    }
  },
  mounted () {
    /**
     * @description 初始化设置面包屑导航和标签导航
     */
    let that = this
    that.setTagNavList()
    that.getWidth()
    that.setBreadCrumb(this.$route.matched)
    window.addEventListener('resize', function () {
      that.getWidth()
    })
  }
}
</script>
<style lang="scss">
  .el-menu{
    border-right: none !important;
  }
  .el-submenu.is-active .el-submenu__title{
    border-left: 4px solid #0A70F8;
   }
  .el-menu-item.is-active{
    border-left: 4px solid #0A70F8;
  }
  .el-menu-item,.el-submenu__title,.el-submenu .el-menu-item{
    border-left: 4px solid transparent;
  }
</style>
