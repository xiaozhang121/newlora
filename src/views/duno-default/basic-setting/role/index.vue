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
    <el-card class="head-middle" v-if="isAdd">
      <div class="head-middle-right">
        <el-button type="primary" @click="addOrUpdateHandle('roleAuthorityAdd')">新增</el-button>
      </div>
    </el-card>

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
        :isShowCheckbox="true"
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
  name: 'RoleIndex',
  components: {
    DunoHeadSearch,
    DunoTablesTep
  },
  data () {
    const that = this
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: '/venus/crud/SysRole',
        deleteIsBatch: false,
        deleteURL: '/venus/crud/SysRole/del' //  删除接口
      },
      from: [
        {
          'type': 'input', // 表单类型
          'title': '角色名称', // label名称
          'name': 'roleName', // 字段名称
          'initial': '' // 默认值
        }
      ],
      columns: [
        {
          type: 'index',
          title: '序号',
          width: 70,
          fixed: 'left',
          isCheck: true,
          align: 'center'
        },
        {
          title: '角色名称',
          key: 'roleName',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '备注',
          key: 'remark',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '创建时间',
          key: 'createTime',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '操作',
          key: 'id',
          width: 110,
          fixed: 'right',
          isCheck: true,
          align: 'center',
          render: (h, params) => {
            let newArr = []
            if (that.isEdit) {
              newArr.push(h('Tooltip', {
                props: { content: '编辑' }
              }, [
                  h('el-button', {
                      class:'tableBtnName', style: {backgroundImage:'url('+ this.bianji +')'},
                      on: { click: () => { this.addOrUpdateHandle('roleAuthorityEdit', params.row.id) } }
                  })
              ]))
            }
            if (that.isDel) {
              newArr.push(h('Tooltip', {
                  props: {content: '删除'}
              }, [
                  h('el-poptip', {
                      props: { confirm: true, placement: 'top-end', title: '您确定删除数据吗?', transfer: true },
                      on: { 'on-ok': () => { this.deleteHandle(params.row.id) } }
                  }, [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ this.del +')'} }) ])
              ]))
            }
            return h('div', newArr)
          }
        }
      ],
      isAdd: false,
      isEdit: false,
      isDel: false
    }
  },
  watch: {},
  methods: {},
  mounted () {
    const that = this
    that.isAdd = that.getAuthority('10001020')
    that.isEdit = that.getAuthority('10001030')
    that.isDel = that.getAuthority('10001040')
  }
}
</script>
