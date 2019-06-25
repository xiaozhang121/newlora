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
    
    <el-card class="head-middle">
      <div class="head-middle-left">
        <el-button type="info" :loading="loading" :disabled="dataListSelections.length === 0" @click="unreadHandle()">标为已读</el-button>
      </div>
      <div class="head-middle-right" v-if="isAdd">
        <el-button type="primary" @click="addOrUpdateHandle('messageAdd')">新增</el-button>
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
        @on-sort-change="dataListSortChangeHandle"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </div>
  </div>
</template>

<script>
import DunoHeadSearch from '_c/duno-head-search'
import { DunoTablesTep } from '_c/duno-tables-tep'
import mixinViewModule from '@/mixins/view-module'
import { postAxiosData } from '@/api/axiosType'
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
        getDataListURL: '/venus/crud/SysMessage',
        deleteIsBatch: false,
        deleteURL: '/venus/crud/SysMessage/del' //  删除接口
      },
      from: [
        {
          'type': 'input', // 表单类型
          'title': '消息内容', // label名称
          'name': 'content', // 字段名称
          'initial': '' // 默认值
        },
        {
          'type': 'daterange',
          'title': '时间',
          'name': 'time',
          'initial': []
        },
        {
          'type': 'select',
          'title': '消息状态',
          'name': 'isRead',
          'transfer': false,
          'filterable': false,
          'multiple': false,
          'clearable': true,
          'entityName': 'VENUS_READ_STATE',
          'isDictionaries': true,
          'initial': ''
        }
      ],
      columns: [
        {
          type: 'selection',
          width: 60,
          fixed: 'left',
          align: 'center'
        },
        {
          type: 'index',
          title: '序号',
          width: 70,
          fixed: 'left',
          align: 'center'
        },
        {
          title: '路径',
          key: 'url',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '状态',
          key: 'isRead',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '内容',
          key: 'content',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '时间',
          key: 'createTime',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '操作',
          key: 'id',
          width: 100,
          fixed: 'right',
          align: 'center',
          render: (h, params) => {
            let newArr = []
            if (that.isDel) {
              newArr.push(h('el-poptip', {
                props: { confirm: true, title: '确定删除吗？', type: 'primary', size: 'small' },
                style: { margin: '0 2px' },
                on: { 'on-ok': () => { this.deleteHandle(params.row.id) } }
              }, [h('el-button', { props: { type: 'error', size: 'small' } }, '删除')]))
            }
            return h('div', newArr)
          }
        }
      ],
      isAdd: false,
      isEdit: false,
      isDel: false,
      loading: false
    }
  },
  watch: {},
  methods: {
    unreadHandle () {
      const that = this
      const url = '/venus/user/message/read'
      const query = {}
      if (that.dataListSelections.length <= 0) {
        return that.$message.warning({
          message: '请选择未读项',
          duration: 5
        })
      }
      query.id = that.dataListSelections.join(',')
      that.loading = true
      postAxiosData(url, query).then(res => {
        that.loading = false
        if (res.code !== 200) {
          return that.$message.error(res.msg)
        }
        that.$message.success(res.msg)
        that.getDataList()
      })
    }
  },
  mounted () {
    const that = this
    that.isAdd = that.getAuthority('12001020')
    that.isEdit = that.getAuthority('12001030')
    that.isDel = that.getAuthority('12001040')
  }
}
</script>
