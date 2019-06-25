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
        <el-button type="primary" @click="addOrUpdateHandle('accountListAdd')">新增</el-button>
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
        getDataListURL: '/venus/crud/SysUser',
        deleteIsBatch: false,
        deleteURL: '/venus/crud/SysUser/del' //  删除接口
      },
      from: [
        {
          'type': 'input', // 表单类型
          'title': '登录名', // label名称
          'name': 'account', // 字段名称
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
          title: '登录名',
          key: 'account',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '昵称',
          key: 'username',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '角色',
          key: 'role',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '电话',
          key: 'phone',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '邮箱',
          key: 'email',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '账号创建时间',
          key: 'createTime',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '操作',
          key: 'id',
          width: 140,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            let newArr = []
            if (!that.isReset) {
              newArr.push(h('Tooltip', {
                  props: {content: '重置'}
              }, [
                  h('el-poptip', {
                      props: { confirm: true, title: '您确定确定重置吗?', transfer: true },
                      on: { 'on-ok': () => { this.resetPassword(params.row.id) } }
                  }, [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ this.reset +')'} }) ])
              ]))
            }
            if (that.isEdit) {
              newArr.push(h('Tooltip', {
                props: { content: '编辑' }
              }, [
                  h('el-button', {
                    class:'tableBtnName', style: {backgroundImage:'url('+ this.bianji +')'},
                    on: { click: () => { this.addOrUpdateHandle('accountListEdit', params.row.id) } }
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
      isDel: false,
      isReset: false
    }
  },
  watch: {},
  methods: {},
  mounted () {
    const that = this
    that.isAdd = that.getAuthority('10002020')
    that.isEdit = that.getAuthority('10002030')
    that.isDel = that.getAuthority('10002040')
    that.isReset = that.getAuthority('10002050')
  }
}
</script>
