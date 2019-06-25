<template>
  <div>
    <div>
      <!--搜索头部-->
      <duno-head-search
        v-if="from.length"
        :fromData="from"
        labelPosition="right"
        labelWidth="120px"
        :isLoad="false"
        @clcikSearch="clickQuery"
      />
    </div>

    <div>
      <!--表格-->
      <duno-tables-tep
        :columns="columns"
        :data="dataList"
        :totalNum="totalNum"
        :pageSize="pageRows"
        :current="pageIndex"
        :border="true"
        :showSizer="true"
        @on-select="dataListSelectionChangeHandle"
        @clickPage="pageCurrentChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </div>
  </div>
</template>

<script>
import DunoHeadSearch from '_c/duno-head-search'
import { DunoTablesTep } from '_c/duno-tables-tep'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  name: 'feedbackIndex',
  components: {
    DunoHeadSearch,
    DunoTablesTep
  },
  data () {
    const that = this
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: '/venus/crud/SysAdviceFeedback',
        deleteIsBatch: false,
        deleteURL: '/venus/crud/SysAdviceFeedback/del' //  删除接口
      },
      from: [
        {
          'type': 'input', // 表单类型
          'title': '联系方式', // label名称
          'name': 'phone', // 字段名称
          'initial': '' // 默认值
        },
        {
          'type': 'input', // 表单类型
          'title': '昵称', // label名称
          'name': 'username', // 字段名称
          'initial': '' // 默认值
        }
      ],
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 70,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '称呼',
          key: 'nickname',
          minWidth: 90,
          align: 'center',
          tooltip: true
        },
        {
          title: '联系方式',
          key: 'phone',
          minWidth: 90,
          align: 'center',
          tooltip: true
        },
        {
          title: '提交时间',
          key: 'submitTime',
          minWidth: 90,
          align: 'center',
          tooltip: true
        },
        {
          title: '提交用户',
          key: 'sysUserId',
          minWidth: 90,
          align: 'center',
          tooltip: true
        },
        {
          title: '操作',
          key: 'id',
          width: 120,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            let newArr = []
            if (that.isView) {
              newArr.push(h('Tooltip', {
                props: { content: '查看' }
              }, [
                  h('el-button', {
                    class:'tableBtnName', style: {backgroundImage:'url('+ that.chakan +')'},
                    on: { click: () => { that.addOrUpdateHandle('feedbackView', params.row.id) } }
                  })
              ]))
            }
            if (that.isDel) {
              newArr.push(h('Tooltip', {
                  props: {content: '删除'}
              }, [
                  h('el-poptip', {
                      props: { confirm: true, placement: 'top-end', title: '您确定删除数据吗?', transfer: true },
                      on: { 'on-ok': () => { that.deleteHandle(params.row.id) } }
                  }, [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ that.del +')'} }) ])
              ]))
            }
            return h('div', newArr)
          }
        }
      ],
      isView: false,
      isDel: false
    }
  },
  watch: {},
  methods: {},
  mounted () {
    const that = this
    that.isView = that.getAuthority('11001020')
    that.isDel = that.getAuthority('11001040')
  }
}
</script>