/* 
表格组件使用的是iview ui组件
表格中使用的分页是iview ui组件
*/
export { default as DunoTablesTep } from './duno-tables.vue'

/* 
  使用方法

  import { DunoTablesTep } from '_c/duno-tables-tep'

  <duno-tables-tep
    :columns="columns"
    :data="dataList"
    :totalNum="totalNum"
    :pageSize="pageRows"
    :current="pageIndex"
    :border="true"
    :showSizer="true"
    @on-selection-change="dataListSelectionChangeHandle"
    @clickPage="pageCurrentChangeHandle"
    @on-page-size-change="pageSizeChangeHandle"
  />

  columns: [
    {
      type: 'index',
      title: '序号',
      width: 70,
      fixed: 'left',
      align: 'center'
    },
    {
      title: '通知时间',
      key: 'recordNoticeTime',
      align: 'center',
      minWidth: 100,
      tooltip: true
    },
    {
      title: '操作',
      key: 'id',
      width: 130,
      fixed: 'right',
      align: 'center',
      render: (h, params) => {
        let newArr = []
        if (that.isView) {
          newArr.push(h('el-tooltip', {
            props: { content: '查看' }
          }, [
              h('el-button', {
                class:'tableBtnName', style: {backgroundImage:'url('+ this.chakan +')'},
                on: { click: () => { this.addOrUpdateHandle('__informSetView', params.row.id) } }
              })
          ]))
        }
        if (that.isEdit) {
          newArr.push(h('el-tooltip', {
            props: { content: '编辑' }
          }, [
              h('el-button', {
                class:'tableBtnName', style: {backgroundImage:'url('+ this.bianji +')'},
                on: { click: () => { this.addOrUpdateHandle('__informSetEdit', params.row.id) } }
              })
          ]))
        }
        if (that.isDel) {
          newArr.push(h('el-tooltip', {
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
  ]
*/