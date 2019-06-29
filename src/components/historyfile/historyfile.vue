<template>
  <div>
    <h4>{{title}}</h4>
    <duno-tables-tep
      :columns="columns"
      :data="dataList"
      :totalNum="totalNum"
      :pageSize="pageRows"
      :current="pageIndex"
      :border="true"
      :showSizer="true"
      :isShowPage="false"
    />
    <historical-documents :isShowTab="false" title="详情" :dialogTableVisible="visible" @close="visible = !visible">
      <div class="viewBox">
        <div v-if="viewItem.fileTypeId == '1' || viewItem.fileTypeId == 1">
          <img :src="viewItem.fileAddress" class="viewContent">
        </div>
        <div v-else>
          <video autoplay controls :src="viewItem.fileAddress" class="viewContent"></video>
        </div>
      </div>
    </historical-documents>
  </div>
</template>
<script>
import { getAxiosData, deleteDataId, postAxiosData, putAxiosData } from '@/api/axiosType'
import { DunoTablesTep } from "_c/duno-tables-tep"
import HistoricalDocuments from "_c/duno-c/HistoricalDocuments"
import { error } from 'util';
export default {
  name: 'historyfile',
  components: {
    DunoTablesTep,
    HistoricalDocuments
  },
  data () {
    return {
      pageIndex: 1,
      pageRows: 44321,
      totalNum: 123,
      dataList: [],
      copyDataList: [],
      visible: false,
      viewItem: {},
      isView: true,
      isEdit: true,
      isDel: true,
      bianji: require('@/assets/images/btn/bianji.png'),
      chakan: require('@/assets/images/btn/chakan.png'),
      del: require('@/assets/images/btn/del.png'),
      columnsIndex: -1,
      columnsValue: '',
      columns: [
        {
          title: '文件名',
          key: 'fileName',
          align: 'center',
          minWidth: 100,
          tooltip: true,
          render: (h, params) => {
            if (this.columnsIndex == params.row._index) {
              let newArr = [
                h('i-input', {
                  class:'tableBtnName',
                  props: { value: params.row.fileName },
                  on: { 'on-blur': () => { this.tableBlur(params.row._index, params.row.id) }, 'on-focus': () => { this.columnsValue= params.row.fileName }, 'on-change': (event) => {this.tableChange(event, params.row._index)} }
                })
              ]

              return h('div', newArr)
            } else {
              return h('div', params.row.fileName)
            }
          }
        },
        {
          title: '类型',
          key: 'fileType',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '操作人',
          key: 'createUser',
          align: 'center',
          minWidth: 100,
          tooltip: true
        },
        {
          title: '处理',
          key: 'fileId',
          width: 140,
          align: 'center',
          render: (h, params) => {
            let newArr = []
            if (this.isView) {
              newArr.push(h('Tooltip', {
                props: { content: '查看' }
              }, [
                  h('el-button', {
                    class:'tableBtnName', style: {backgroundImage:'url('+ this.chakan +')'},
                    on: { click: () => { this.clickView(params.row) } }
                  })
              ]))
            }
            if (this.isEdit) {
              newArr.push(h('Tooltip', {
                props: { content: '编辑' }
              }, [
                  h('el-button', {
                    class:'tableBtnName', style: {backgroundImage:'url('+ this.bianji +')'},
                    on: { click: () => { this.editItem(params.row) } }
                  })
              ]))
            }
            if (this.isDel) {
              newArr.push(h('Tooltip', {
                  props: {content: '删除'}
              }, [
                  h('el-poptip', {
                      props: { confirm: true, placement: 'top-end', title: '您确定删除数据吗?', transfer: true },
                      on: { 'on-ok': () => { this.deleteHandle(params.row.fileId) } }
                  }, [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ this.del +')'} }) ])
              ]))
            }
            return h('div', newArr)
          }
        }
      ]
    }
  },
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    itemId: {
      type: String | Number,
      default: () => {
        return 1
      }
    }
  },
  methods: {
    editItem (item) {
      const that = this
      this.columnsIndex = item._index
    },
    tableBlur (index, id) {
      const that = this
      console.log('失焦:', index)
      that.columnsIndex = -1
      const columnsValue = JSON.parse(JSON.stringify(that.columnsValue))
      that.dataList[index].fileName = columnsValue
      const url = '/lenovo-data/api/file/edit'
      const query = {
        id: id,
        fileName: columnsValue
      }
      putAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          that.dataList[index].fileName = that.copyDataList[index].fileName
          return that.$message.error(res.msg)
        }
        that.$message.success(res.msg)
      },error => {
        that.dataList[index].fileName = that.copyDataList[index].fileName
          return that.$message.error('网络错误')
      })
    },
    tableChange (event, index) {
      const that = this
      const {value} = event.target
      this.columnsValue = value
    },
    clickView (item) {
      const that = this
      console.log(item)
      this.viewItem = item
      this.visible = true
    },
    deleteHandle(id) {
      const that = this
      const url = '/lenovo-data/api/file/delete'
      const query = {
        fileId: id
      }
      deleteDataId(url, query).then(res => {
        if (res.code !== 200) {
          return that.$message.error(res.msg)
        }
        that.$message.success(res.msg)
        that.getData()
      })
    },
    getData () {
      const that = this
      const url = '/lenovo-data/api/file/list'
      const query = {
        pageIndex: that.pageIndex,
        pageRows: that.pageRows,
        deviceId: that.itemId
      }
      getAxiosData(url, query).then(res => {
        const resData = res.data
        console.log(resData)
        const tableData = resData.tableData
        that.totalNum = resData.pageParam.totalRows
        that.dataList = tableData
        that.copyDataList = JSON.parse(JSON.stringify(tableData))
      })
    }
  },
  mounted() {
    this.getData()
  }
}
</script>
<style lang="scss" scoped>
.viewBox {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  > div {
    width: 100%;
    height: 100%;
    position: absolute;
  }
}
.viewContent {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
