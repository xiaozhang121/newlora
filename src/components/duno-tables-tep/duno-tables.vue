<template>
  <div class="tablesTep">
    <Table
            ref="tablesMain"
            :data="insideTableData"
            :columns="insideColumns"
            :stripe="stripe"
            :border="border"
            :height="height"
            :show-header="showHeader"
            v-loading="loadingOption"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            element-loading-text="加载中"
            :highlight-row="highlightRow"
            :row-class-name="rowClassName"
            :size="size"
            @on-select="onSelect"
            @on-select-cancel="onSelectCancel"
            @on-select-all="onSelectAll"
            @on-selection-change="onSelectionChange"
            @on-row-click="onRowClick"
            @on-row-dblclick="onRowDblclick"
            @on-expand="onExpand"
            @on-sort-change="onSortChange"
    >
    </Table>
    <el-row class="tablesTep-page" v-if="isShowPage">
      <el-col v-if="isShowCheckbox" :xs="24" :sm="4" style="text-align:left;">
        <el-popover placement="bottom" trigger="click">
          <el-button slot="reference" class="tablesTep-headerBtn">显示{{(checkList.length + lietNum) + '/' + columns.length}}列</el-button>
          <div class="tablesTep-checkbox">
            <el-checkbox-group v-model="checkList" @change="changeTableColumns">
              <div v-for="(item, index) in newColumns" :key="index"><el-checkbox :label="item.key">{{item.title}}</el-checkbox></div>
            </el-checkbox-group>
          </div>
        </el-popover>
      </el-col>
      <el-col :xs="24" :sm="isShowCheckbox ? 20 : 24">
        <Page
                :total="totalNum"
                :current="current"
                :page-size="pageSize"
                transfer
                show-total
                :show-sizer="showSizer"
                :page-size-opts="pageSizeOpts"
                @on-change="clickPage"
                @on-page-size-change="onPageSizeChange"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
    import { Page, Table } from 'iview'

    export default {
        name: 'Tables',
        components: { Page, Table },
        props: {
            columns: {
                type: Array,
                default () {
                    return []
                }
            },
            data: {
                type: Array,
                default () {
                    return []
                }
            },
            totalNum: {
                type: Number,
                default: 0
            },
            pageSize: {
                type: Number,
                default: 10
            },
            showSizer: {
                type: Boolean,
                default: false
            },
            isShowPage: {
                type: Boolean,
                default: true
            },
            height: {
                type: String | Number
            },
            pageSizeOpts: {
                type: Array,
                default: () => {
                    return [10, 20, 30, 40]
                }
            },
            current: {
                type: Number,
                default: 1
            },
            size: {
                type: String,
                default: 'small'
            },
            stripe: {
                type: Boolean,
                default: false
            },
            border: {
                type: Boolean,
                default: false
            },
            showHeader: {
                type: Boolean,
                default: true
            },
            isShowCheckbox: {
                type: Boolean,
                default: false
            },
            showCheckboxNum: {
                type: Number,
                default: () => {
                    return 4
                }
            },
            highlightRow: {
                type: Boolean,
                default: false
            },
            rowClassName: {
                type: Function,
                default: () => {
                    return ''
                }
            },
            loading: {
                type: Boolean,
                default: false
            },
            /**
             * @description 全局设置是否可编辑
             */
            editable: {
                type: Boolean,
                default: false
            },
            /**
             * @description 是否可搜索
             */
            searchable: {
                type: Boolean,
                default: false
            },
            /**
             * @description 搜索控件所在位置，'top' / 'bottom'
             */
            searchPlace: {
                type: String,
                default: 'top'
            }
        },
        /**
         * Events
         * @on-start-edit 返回值 {Object} ：同iview中render函数中的params对象 { row, index, column }
         * @on-cancel-edit 返回值 {Object} 同上
         * @on-save-edit 返回值 {Object} ：除上面三个参数外，还有一个value: 修改后的数据
         */
        data () {
            return {
                timer: null,
                loadingOption: true,
                insideColumns: [],
                insideTableData: [],
                edittingCellId: '',
                edittingText: '',
                searchValue: '',
                ajaxHistoryData: [],
                columnsHistoryData: [],
                checkList: [],
                lietNum:0
            }
        },
        computed: {
            newColumns () {
                const that = this
                const columns = []
                for (let i in that.columns) {
                    if (!that.columns[i].isCheck) {
                        columns.push(that.columns[i])
                    }
                }
                return columns
            }
        },
        methods: {
            handleColumns (columns) {
                this.insideColumns = columns.map((item, index) => {
                    let res = item
                    if (res.editable) res = this.suportEdit(res, index)
                    if (res.key === 'handle') res = this.surportHandle(res)
                    return res
                })
            },
            handleTableData () {
                this.insideTableData = this.data.map((item, index) => {
                    let res = item
                    res.initRowIndex = index
                    return res
                })
            },
            onSelect (selection, row) {
                this.$emit('on-select', selection, row)
            },
            onSelectCancel (selection, row) {
                this.$emit('on-select-cancel', selection, row)
            },
            onSelectAll (selection) {
                this.$emit('on-select-all', selection)
            },
            onSelectionChange (selection) {
                this.$emit('on-selection-change', selection)
            },
            onRowClick (row, index) {
                this.$emit('on-row-click', row, index)
            },
            onRowDblclick (row, index) {
                this.$emit('on-row-dblclick', row, index)
            },
            onExpand (row, status) {
                this.$emit('on-expand', row, status)
            },
            onSortChange (column, key, order) {
                this.$emit('on-sort-change', column, key, order)
            },
            onPageSizeChange (pageSize) {
                this.$emit('on-page-size-change', pageSize)
            },
            clickPage (index) {
                let that = this
                if (that.ajaxHistoryData.length) {
                    let _start = (index - 1) * that.pageSize
                    let _end = index * that.pageSize
                    that.insideTableData = that.ajaxHistoryData.slice(_start, _end)
                } else {
                    that.$emit('clickPage', index)
                }
            },
            handleListApproveHistory (data, size) {
                let that = this
                // 保存取到的所有数据
                that.ajaxHistoryData = data
                // 初始化显示，小于每页显示条数，全显，大于每页显示条数，取前每页条数显示
                if (that.isShowPage) {
                    if (size < that.pageSize) {
                        that.insideTableData = that.ajaxHistoryData
                    } else {
                        that.insideTableData = that.ajaxHistoryData.slice(0, that.pageSize)
                    }
                } else {
                    that.insideTableData = data
                }
            }, // 数据项分页
            isHeaderBtn () {
                const that = this
                const newColumns = []
                that.checkList = []
                that.lietNum = 0
                let num = 0
                for(let i = 0; i < that.columns.length; i++) {
                    if (that.columns[i].isCheck) {
                        that.lietNum++
                    }
                    if (num < that.showCheckboxNum || that.columns[i].isCheck) {
                        newColumns.push(that.columns[i])
                        if (!that.columns[i].isCheck && num < that.showCheckboxNum) {
                            that.checkList.push(that.columns[i].key)
                            num++
                        }
                    }
                }
                that.columnsHistoryData = newColumns
            },
            changeTableColumns (val) {
                const that = this
                const newColumns = []
                for (let i = 0; i < that.columns.length; i++) {
                    if (that.columns[i].isCheck) {
                        newColumns.push(that.columns[i])
                    }
                    for (let j = 0; j < val.length; j++) {
                        if (that.columns[i].key == val[j]) {
                            newColumns.push(that.columns[i])
                        }
                    }
                }
                that.columnsHistoryData = newColumns
            },
        },
        watch: {
            columns (columns) {
                if (!this.isShowCheckbox) {
                    this.handleColumns(columns)
                } else {
                    this.isHeaderBtn()
                }
            },
            columnsHistoryData (columns) {
                if (this.isShowCheckbox) {
                    this.handleColumns(columns)
                }
            },
            data (val) {
                this.handleTableData()
                clearTimeout(this.timer)
                this.loadingOption = false
                if (val.length > this.pageSize) {
                    this.handleListApproveHistory(val, val.length)
                } else {
                    this.ajaxHistoryData = []
                }
            }
        },
        mounted () {
            this.timer = setTimeout(()=>{
                this.loadingOption = false
            },10000)
            if (this.isShowCheckbox) {
                this.isHeaderBtn()
            } else {
                this.handleColumns(this.columns)
            }
            this.handleTableData()
        }
    }
</script>
<style lang="scss">
  @import './index.scss';
  .tablesTep{
    .el-loading-text{
      color: #969696   !important;
    }
  }
</style>