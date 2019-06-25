<template>
  <div class="custom-bread-crumb">
    <el-breadcrumb :style="{fontSize: `${fontSize}px`}">
      <el-breadcrumb-item v-for="item in openedList" :key="`bread-crumb-${item.name}`">
        <icons style="margin-right: 4px;" :type="item.icon"/>
        {{ showTitle(item) }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>
<script>
import { showTitle } from '_c/common/util'
import Icons from '_c/icons'
import './custom-bread-crumb.scss'
export default {
  name: 'customBreadCrumb',
  components: { Icons },
  data () {
    return {
      openedList: []
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    fontSize: {
      type: Number,
      default: 14
    },
    showIcon: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    list (now) {
      this.pushList(now)
    }
  },
  methods: {
    showTitle (item) {
      return showTitle(item, this)
    },
    isCustomIcon (iconName) {
      return iconName.indexOf('_') === 0
    },
    getCustomIconName (iconName) {
      return iconName.slice(1)
    },
    pushList (list) {
      const newList = JSON.parse(JSON.stringify(list))
      if (newList.length > 1) {
        const name = newList[newList.length - 1].meta && newList[newList.length - 1].meta.title ? newList[newList.length - 1].meta.title : null
        const name1 = newList[newList.length - 2].meta && newList[newList.length - 2].meta.title ? newList[newList.length - 2].meta.title : null
        if (name && name1 && name === name1) {
          newList[newList.length - 1].meta.title = '列表'
        }
      }
      this.openedList = newList
    }
  },
  mounted () {
    this.pushList(this.list)
  }
}
</script>
