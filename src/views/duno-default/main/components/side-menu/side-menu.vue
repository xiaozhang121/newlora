<template>
  <div class="side-menu-wrapper">
    <slot></slot> 
    <el-menu ref="menu" :collapse="collapsed" :background-color="backgroundColor" :text-color="textColor" :active-text-color="activeTextColor" :default-active="defaultActive" :open="openedNames" :unique-opened="uniqueOpened" width="auto" @select="handleSelect">
      <template v-for="item in menuList">
        <!--有children，但数组长度为1 且是独立菜单-->
        <template v-if="item.children && item.children.length === 1 && item.meta.isAlone">
          <el-menu-item :index="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
            <icons :type="item.children[0].meta.icon"/>
            <span slot="title" class="menu-title">{{ showTitle(item) }}</span>
          </el-menu-item>
        </template>
        <!--children等于1 且不是独立菜单-->
        <template v-else-if="item.children && item.children.length === 1 && !(item.meta.isAlone)">
          <!--是否有三级级菜单-->
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
          <!--单菜单-->
          <el-menu-item v-else :index="getNameOrHref(item, true)" :key="`menu-${item.name}`">
            <icons :type="item.icon"/>
            <span slot="title" class="menu-title">{{ showTitle(item) }}</span>
          </el-menu-item>
        </template>

        <!--没有children，或者children长度大于1-->
        <template v-else>
          <!--是否有三级级菜单-->
          <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
          <!--没有children-->
          <el-menu-item v-else :index="getNameOrHref(item)" :key="`menu-${item.name}`">
            <icons :type="item.icon"/>
            <span slot="title" class="menu-title">{{ showTitle(item) }}</span>
          </el-menu-item>
        </template>
      </template>
    </el-menu>
  </div>
</template>
<script>
import SideMenuItem from './side-menu-item.vue' // 三级菜单
import { getUnion } from '@/libs/tools'
import mixin from './mixin'

export default {
  name: 'SideMenu',
  mixins: [ mixin ],
  components: {
    SideMenuItem
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return []
      }
    },
    collapsed: {
      type: Boolean,
      default: false
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 16
    },
    uniqueOpened: Boolean,
    defaultActive: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String
    },
    textColor: {
      type: String
    },
    activeTextColor: {
      type: String
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      openedNames: []
    }
  },
  methods: {
    handleSelect (name) {
      this.$emit('select', name)
    },
    getOpenedNamesByActiveName (name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name)
    },
    updateOpenName (name) {
      if (name === 'home') this.openedNames = []
      else this.openedNames = this.getOpenedNamesByActiveName(name)
    }
  },
  computed: {},
  watch: {
    defaultActive (name) {
      if (this.uniqueOpened) {
        this.openedNames = this.getOpenedNamesByActiveName(name)
        // console.log('展开菜单：', this.openedNames)
      } else {
        this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
      }
    },
    openNames (newNames) {
      this.openedNames = newNames
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
    })
  }
}
</script>
<style lang="scss">
@import './side-menu.scss';
</style>
