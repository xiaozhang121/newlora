<template>
  <el-submenu :index="`${parentName}`">
    <!--展开时一级菜单-->
    <template slot="title">
      <icons :type="parentItem.icon"/>
      <span slot="title" class="menu-title">{{ showTitle(parentItem) }}</span>
    </template>
    <template v-for="item in children">
      <template v-if="item.children && item.children.length === 1">
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <el-menu-item v-else :index="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
          <icons :type="item.children[0].icon"/>
          <span slot="title" class="menu-title">{{ showTitle(item.children[0]) }}</span>
        </el-menu-item>
      </template>
      <template v-else>
        <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <!--展开时二级菜单时的-->
        <el-menu-item v-else :index="getNameOrHref(item)" :key="`menu-${item.name}`">
          <icons :type="item.icon"/>
          <span slot="title" class="menu-title">{{ showTitle(item) }}</span>
        </el-menu-item>
      </template>
    </template>
  </el-submenu>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
  name: 'SideMenuItem',
  mixins: [ mixin, itemMixin ]
}
</script>
