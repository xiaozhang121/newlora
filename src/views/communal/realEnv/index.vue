<template>
  <div>
    <duno-btn-top></duno-btn-top>
    <duno-main>
     
    </duno-main>
  </div>
</template>

<script>
import DunoHeadSearch from '_c/duno-head-search'
import { DunoTablesTep } from '_c/duno-tables-tep'
import { postAxiosData } from '@/api/axiosType'
import dunoBtnTop  from '_c/duno-m/duno-btn-top'
import dunoMain  from '_c/duno-m/duno-main'
import drappable  from '_c/duno-m/drappable'
export default {
  name: 'RoleIndex',
  components: {
      dunoBtnTop,
      dunoMain,
      drappable
  },
  data () {
    const that = this
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: '/venus/crud/SysMessage',
        deleteIsBatch: false,
        deleteURL: '/venus/crud/SysMessage/del' //  删除接口
      },
      isAdd: false,
      isEdit: false,
      isDel: false,
      loading: false
    }
  },
  watch: {},
  methods: {
  },
  mounted () {
    const that = this
    that.isAdd = that.getAuthority('12001020')
    that.isEdit = that.getAuthority('12001030')
    that.isDel = that.getAuthority('12001040')
  }
}
</script>
