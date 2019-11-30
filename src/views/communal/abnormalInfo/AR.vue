<template>
  <div class="ARList">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="top not-print">
      <div class="title">AR眼镜上传图片</div>
      <div class="btnList">
         <div class="btn">
          <div @click="clickAlter">
            <i class="iconfont icon-xiugai"></i>
            批量修改
          </div>
        </div>
        <div class="btn">
          <div @click="clickInput">
            <i class="iconfont icon-daoru"></i>
            批量导入
          </div>
        </div>
      </div>
    </div>
    <duno-main class="dunoMain">
      <duno-tables-tep
        class="table_abnormalInfo"
        :columns="columns"
        :data="dataList"
        :totalNum="totalNum"
        :pageSize="pageRows"
        :rowClassName="rowClassName"
        :current="pageIndex"
        :border="true"
        :showSizer="true"
        :isShowPage="mixinViewModuleOptions.isShowPage"
        @on-select="onSelect"
        @clickPage="pageCurrentChangeHandle"
        @on-select-all="handleSelectAll(true)"
        @on-select-all-cancel="handleSelectAll(false)"
        @on-select-cancel="selectCancel"
        @on-page-size-change="pageSizeChangeHandle"
      />
    </duno-main>
    <ar-panel :title="panelTitle" :params="params"  :visible="panelVisible" @on-submit="onSubmit"  @on-close="onClose"/>
  </div>
</template>

<script>
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import buttonCustom from "_c/duno-m/buttonCustom"
import dunoMain from "_c/duno-m/duno-main";
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import screenfull from "screenfull";
import ArPanel from "../../../components/duno-m/arPanel/arPanel";
export default {
  name: "abnormalInfo",
  mixins: [mixinViewModule],
  components: {
    ArPanel,
    dunoBtnTop,
    KeyMonitor,
    dunoMain,
    DunoTablesTep,
    Breadcrumb,
    buttonCustom
  },
  data() {
    const that = this;
    return {
      idS: [],
      loading: null,
      params: {},
      panelTitle: '',
      panelVisible: false,
      handleNotes: [],
      alarmType: "",
      mixinViewModuleOptions: {
        _disabled: true,
        activatedIsNeed: true,
        getDataListURL: "/lenovo-sample/api/sample/ar/list",
        exportURL: "/lenovo-alarm/api/alarm/history/export"
      },
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/defectLibrary", name: "缺陷库管理" },
        { path: "", name: "AR眼镜上传图片" }
      ],
      isFileType: false,
      visibleSettingOption: false,
      visible: false,
      isEnlarge: false,
      totalNum: 20,
      pageRows: 20,
      selectInfo: "更多",
      serious: false,
      commonly: false,
      danger: false,
      srcData: [],
      value: "",
      columns: [
        {
          title: "全选",
          type: 'selection',
          width: 60,
          align: 'center'
        },
        {
          title: "序号",
          key: "_keyIndex",
          align: "center"
        },
        {
          title: "上传日期",
          key: "createTime",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "设备组件",
          key: "mainDevice",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            return h("div", [
              h(
                  "Tooltip",
                  {
                    props: {
                      placement: "top",
                      content: params.row.monitorDeviceName,
                      transfer: true
                    },
                    style: {
                      display: "inline-block",
                      width: "100%",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap"
                    }
                  },
                  params.row.monitorDeviceName
              )
            ]);
          }
        },
        {
          title: "电压区域",
          key: "areaName",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "被监测设备",
          key: "powerDeviceName",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: " ",
          key: "id",
          minWidth: 80,
          align: "center",
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h(
                  "el-button",
                  {
                    class: "table_link",
                    style: { marginRight: "20px" },
                    props: { type: "text" },
                    on: {
                      click: () => {
                        this.panelVisible = true
                        this.panelTitle = '修改图片'
                        this.params = params.row
                      }
                    }
                  },
                  "修改"
              )
            ]);
            if(params.row.isImport != 1){
              newArr.push([
                h(
                  "el-button",
                  {
                    class: "table_link",
                    style: { marginRight: "20px" },
                    props: { type: "text" },
                    on: {
                      click: () => {
                        this.clickInput(params.row.id)
                      }
                    }
                  },
                  "导入主库"
                )
              ]);
            }
            return h(
                "div",
                {
                  class: "flexPos"
                },
                newArr
            );
          }
        }
      ],
      typeList: [],
      regionList: [],
      statusList: [],
      popData: {},
      clcikQueryData: {},
      alarmLevel: "",
      rowList: []
    };
  },
  created() {

  },
  mounted(){
    this.addText()
  },
  methods: {
    onSubmit(query){
      if(!query.id){
        query.id = this.idS.join(',')
      }
      postAxiosData('/lenovo-sample/api/sample/ar/edit', query).then(res=>{
        if(res.code == 200){
          this.$message.info(res.msg)
        }else
          this.$message.error(res.msg)
        this.onClose()
        this.getDataList()
      })
    },
    onLoading(){
       this.loading = this.$loading({
        customClass: "loadingCustom",
        target: "el-loading-spinner",
        lock: true,
        text: '请稍后, 正在导入中...',
        background: 'rgba(0, 0, 0, 0.7)'
      });
    },
    closeLoading(){
      this.loading.close()
    },
    onClose(){
      this.panelVisible = false
      this.idS = []
      this.params = {}
    },
    addText(){
      this.$nextTick(()=>{
        let node = document.createElement("div")
        node.className = 'labelNContain'
        node.innerHTML = "<label class='labelName'>全选</label>"
        document.querySelector('.ivu-table-cell-with-selection').append(node)
      })
    },
    onSelect(selection, row){
      this.selectCancel(selection, row, true)
    },
    rowClassName (row, index) {
      if(this.rowList.indexOf(row._keyIndex) > -1){
        return '_highlight'
      }
      return '';
    },
    getSelected(){
      let data = this.dataList
      let arr = data.filter(item=>{
        return item['_checked']
      })
      return arr
    },
    selectCancel(selection, row, flag = false){
      let data = this.dataList
      for(let i=0; i<data.length; i++){
        if(JSON.stringify(data[i]) == JSON.stringify(row)){
            data[i]['_checked'] = flag
        }
      }
      this.setActiveClass(data)
    },
    setActiveClass(data){
      let chosenArr = this.groupArrData(data, '_keyIndex')
      this.rowList = chosenArr
    },
    handleSelectAll(flag){
      let data = this.dataList
      data.map(item=>{
        if(!item['_disabled'])
          item['_checked'] = flag
      })
      this.setActiveClass(data)
    },
    groupArrData(data, key){
      let arr = []
      data.forEach(item=>{
        if(item['_checked'])
          arr.push(item[key])
      })
      return arr
    },
    clickAlter(){
      let arr = this.getSelected()
      console.log(arr)
      let data = this.groupArrData(arr, 'initRowIndex')
      this.panelTitle = '批量修改图片'
      if(!data.length){
        this.$message.info('请先勾选图片，再进行批量处理！')
        return
      }
      this.idS = this.groupArrData(arr, 'id')
      this.panelVisible = true
    },
    breakF(){
      this.$message.info('请先勾选图片，再进行批量导入！')
    },
    clickInput(id){
      let arr = this.getSelected()
      console.log(arr)
      let data = this.groupArrData(arr, 'initRowIndex')
      if(id && typeof(id) == 'object'){
        if(!data.length){
          this.breakF()
          return
        }
      }else if(!id){
        this.breakF()
        return
      }
      let ids = ''
      id && typeof(id) != 'object'?ids = id:ids = this.groupArrData(arr, 'id').join(',')
      this.onLoading()
      postAxiosData('/lenovo-sample/api/sample/ar/storage/import', {id: ids}).then(res=>{
        if(res.code == 200){
          this.$message.info(res.msg)
        }else
          this.$message.error(res.msg)
        this.closeLoading()
        this.getDataList()
      })
    }
  }
};
</script>
<style lang="scss">
.loadingCustom{
  .el-loading-text{
    font-size: 18px !important;
    color: white !important;
    margin-top: 34px;
  }
}
</style>
<style lang="scss">
@import "@/style/tableStyle.scss";
.ARList {
  .el-checkbox__label{
    color: white !important;
    margin-left: 5px;
    letter-spacing: 1px;
  }
  .ivu-checkbox-checked .ivu-checkbox-inner{
    border-color: white;
    background-color: white;
  }
  .ivu-checkbox-checked .ivu-checkbox-inner:after{
    border-color: #007684;
  }
  .el-select-dropdown {
    background: linear-gradient(
      210deg,
      rgba(48, 107, 135, 0.9),
      rgba(28, 50, 64, 0.7) 60%
    ) !important;
    border: none !important;
    margin-top: 1px !important;
    margin-left: 0px;
    border-radius: 0;
    min-width: 153px !important;
  }
  .el-select-dropdown__item,
  .el-select-dropdown__empty,
  .el-select-dropdown__item.selected {
    color: white;
  }
  .el-select-dropdown__list {
    position: relative;
    top: -5px;
  }
  .el-popper[x-placement^="bottom"] .popper__arrow {
    display: none;
  }
  .main .content-wrapper {
    padding-top: 0;
  }
  .el-picker-panel {
    background-color: rgba(27, 59, 71, 0.7);
    color: #fff;
    border: none;
    .el-picker-panel__body-wrapper {
      .el-picker-panel__body {
        .in-range {
          div {
            background-color: rgba(81, 89, 112, 0.7);
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.ARList {
  width: 100%;
  .btnClass {
    border-radius: 15px;
    background: #3a81a1;
    margin: auto;
    border: none;
    &.grey {
      background: #979797;
      color: #767676;
    }
  }
  //-------------------表格样式
  .dunoMain {
    height: inherit;
    margin-bottom: 20px;
  }
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    background-color: #2d5980 !important;
    font-size: 18px;
    font-weight: normal;
    @media screen and (min-width: 3500px) {
      height: 50px;
      font-size: 16px;
    }
  }
  .ivu-page {
    text-align: center;
    .ivu-page-total {
      display: none;
    }
    .ivu-page-item-jump-next:after,
    .ivu-page-item-jump-prev:after {
      color: white;
    }
    .ivu-page-next,
    .ivu-page-prev {
      background: transparent;
      display: none;
      border: none;
    }
    .ivu-page-item {
      background: transparent !important;
      border: none !important;
      min-width: 16px;
      height: 28px;
      a {
        color: white;
      }
    }
    .ivu-page-options {
      display: none;
    }
    .ivu-page-item-active {
      border-bottom: 1px solid #2d8cf0 !important;
      border-radius: 0;
      a {
        color: #2d8cf0;
      }
    }
  }
  .ivu-table {
    font-size: 16px;
    // @media screen and (min-width: 3500px) {
    //   font-size: 14px;
    // }
  }
  .ivu-table-wrapper {
    tr {
      td {
        height: 60px;
        // @media screen and (min-width: 3500px) {
        //   height: 50px;
        //   font-size: 14px;
        // }
      }
    }
    tr:nth-child(odd) {
      td {
        background: rgba(0, 0, 0, 0);
      }
    }
    tr:nth-child(even) {
      td {
        background-color: #2a526c;
      }
    }
  }
  .ivu-table-cell {
    @media screen and (min-width: 3500px) {
      padding-left: 10px;
      padding-right: 10px;
    }
  }
  .ivu-select-dropdown {
    background: white !important;
  }
  .ivu-table-small td {
    background: black;
  }
  //------------------
  .el-button--text {
    border-color: transparent !important;
    background: transparent !important;
  }
  .flexPos {
    display: flex;
    align-items: center;
  }
  .imgOrMv {
    width: 80%;
    height: 45px;
    position: relative;
    top: 2px;
  }
  .table_link {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: block;
    width: 140px;
    font-size: 16px;
    color: #5fafff !important;
    text-decoration: underline;
  }
  .table_abnormalInfo {
    padding: 36px 18px;
  }
  .table_select {
    cursor: pointer;
    color: #1d1f26;
    span {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 30px;
      border-radius: 20px;
    }
    &.serious {
      span {
        background: #f4a723;
      }
    }
    &.commonly {
      span {
        background: #5eb0fc;
      }
    }
    &.danger {
      span {
        background: #d0011b;
      }
    }
  }
  .top {
    color: #ffffff;
    height: 40px;
    margin-bottom: 10px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .title{
      color: #fff;
      font-size: 20px;
      line-height: 40px;
    }
    .btnList {
      display: flex;
      justify-content: space-between;
      width: 244px;
      .btn{
        background: linear-gradient(185deg, rgba(48, 107, 135, 0.6), rgba(28, 50, 64, 0.9) 42%);
        border: 2px solid #606465;
        line-height: 35px;
        padding: 0 14px;
        cursor: pointer;
      }
    }
  }
  .icon-xiala {
    color: white;
    font-size: 13px;
  }
  .dropSelf {
    .icon-xiala {
      font-size: 9px;
      position: absolute;
    }
  }
  ._highlight{
    .ivu-table-column-center{
      background: #03404d !important;
    }
  }
  .labelNContain{
    position: absolute;
    left: 52px;
    top: 19px;
    font-size: 17px;
  }
}
.setting {
  cursor: pointer;
  i {
    font-size: 25px;
    position: relative;
    top: 3px;
    padding-right: 5px;
  }
}
</style>
