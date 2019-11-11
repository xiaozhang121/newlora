<template>
  <div class="taskReport">
    <breadcrumb :dataList="dataBread"/>
    <div class="main">
      <div class="title">
        {{ tableName }}
      </div>
      <div class="search">
        <el-date-picker
                v-model="timeRange"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
        </el-date-picker>
        <!--<duno-btn-top
                style="position: absolute;
                top: -30px;
                right: 356px;"
                zIndex="10"
                class="dunoBtnTop"
                :isCheck="false"
                :dataList="numberCameras"
                :title="titleValueL"
                :showBtnList="false"
        ></duno-btn-top>-->
        <div  class="clickBtn">
          <i class="iconfont icon-daochu1"></i>
          导出表格
        </div>
      </div>
    </div>
    <duno-main>
      <!--<div class="tab">
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item" :name="'item'+index"></el-tab-pane>
        </el-tabs>
      </div>-->
      <div class="table MainTable" :class="{'hasReMark': reMark}">
        <duno-tables-tep
                class="mainTable"
                ref="table"
                :columns="columns11"
                :data="data10"
                :border="true"
                :stripe="true"
                :loading="false"
                :isShowPage="false"
                :showSizer="true"
                :height="tableHeight"
        />
       <!-- <div class="col_main">
          <template v-for="(item, index) in dataCol">
            <div class="col_table" v-if="'spaceLine' in item"></div>
            <div class="col_table" v-else>
              <template v-for="(value, key) in item">
                <div class="col">{{ value }}</div>
              </template>
            </div>
          </template>
        </div>-->
        <div class="tip" v-if="reMark">
          备注：{{ reMarkInfo }}
        </div>
      </div>
    </duno-main>
    <div ref="tableName" class="tableName" v-if="splitHeaderVisible">
      <div class="top">{{ topName }}</div>
      <div class="bottom">{{ bottomName }}</div>
    </div>
  </div>
</template>
<script>
import { DunoTablesTep } from "_c/duno-tables-tep";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoMain from "_c/duno-m/duno-main";
import moment from 'moment'
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import {getAxiosData} from "../../../api/axiosType";
export default {
  components: {
    Breadcrumb,
    dunoMain,
    DunoTablesTep,
    dunoBtnTop
  },
  name: "server",
  data() {
    return {
      tableName: 'xx全面巡视任务报告',
      reMark: false,
      reMarkInfo: '',
      topName: '',
      bottomName: '',
      timeRange: '',
      titleValueL: '监控摄像头数量',
      splitHeaderVisible: true,
      numberCameras: [
            {
                circleColor: "#00B4FF",
                describeName: "两个摄像头",
                style: "calc(50% - 10px)",
                widthType: 2,
                count: 2,
                isActive: true
            },
            {
                circleColor: "#FF5EB9",
                describeName: "四个摄像头",
                style: "calc(50% - 10px)",
                widthType: 2,
                count: 4,
                isActive: true
            },
            {
                circleColor: "#4FF2B7",
                describeName: "六个摄像头",
                style: "calc(100%/3 - 14px)",
                count: 6,
                widthType: 3,
                isActive: true
            },
            {
                circleColor: "#FF9000",
                describeName: "八个摄像头",
                style: "calc(25% - 15px)",
                count: 8,
                widthType: 4,
                isActive: true
            }
  ],
      tabList:[
          '金属氧化物避雷器-MOA红外6',
          '金属氧化物避雷器-MOA红外7',
          '金属氧化物避雷器-MOA红外8',
          '金属氧化物避雷器-MOA红外12',
          '金属氧化物避雷器-MOA红外13',
          '金属氧化物避雷器-MOA红外14',
          '金属氧化物避雷器-MOA红外15',
      ],
      activeName2: 'item0',
      data10: [
          {
              name:'123',
              age: '132',
              Address: '123',
              caddress: '123',
              cname: '123',
              gender: '123'
          },
          {
              name:'123',
              age: '132',
              Address: '123',
              caddress: '123',
              cname: '123',
              gender: '123'
          },
          {
              name:'123',
              age: '132',
              Address: '123',
              caddress: '123',
              cname: '123',
              gender: '123'
          },
          {
              spaceLine: ''
          },
          {
              name:'123',
              age: '132',
              Address: '123',
              caddress: '123',
              cname: '123',
              gender: '123'
          },
          {
              name:'123',
              age: '132',
              Address: '123',
              caddress: '123',
              cname: '123',
              gender: '123'
          },
          {
              name:'123',
              age: '132',
              Address: '123',
              caddress: '123',
              cname: '123',
              gender: '123'
          },
          {
              name:'123',
              age: '132',
              Address: '123',
              caddress: '123',
              cname: '123',
              gender: '123'
          },
          {
              name:'123',
              age: '132',
              Address: '123',
              caddress: '123',
              cname: '123',
              gender: '123'
          },
          {
              name:'123',
              age: '132',
              Address: '123',
              caddress: '123',
              cname: '123',
              gender: '123'
          },
          {
              name:'123',
              age: '132',
              Address: '123',
              caddress: '123',
              cname: '123',
              gender: '123'
          }
      ],
      tableHeight: '',
      columns11: [
          {
              title: '4546',
              key: 'name',
              align: 'center',
              width: 200,
          },
          {
              title: 'Other',
              align: 'center',
              children: [
                  {
                      title: 'Age',
                      key: 'age',
                      align: 'center',
                  },
                  {
                      title: 'Address',
                      align: 'center',
                      key: 'Address',
                  }
              ]
          },
          {
              title: 'Company',
              align: 'center',
              children: [
                  {
                      title: 'Company Address',
                      key: 'caddress',
                      align: 'center',
                  },
                  {
                      title: 'Company Name',
                      key: 'cname',
                      align: 'center',
                  }
              ]
          },
          {
              title: 'Gender',
              key: 'gender',
              align: 'center',
              width: 200
          }
      ],
      keys: [],
      searchData: {
          startDate: '',
          endDate: '',
          templateIds: '626719305252552704'
      },
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "", name: "报表详情" },
      ],
    };
  },
  watch: {
      timeRange:{
         handler(now){
             this.searchData.startDate = moment(now[0]).format('YYYY-MM-DD')
             this.searchData.endDate = moment(now[1]).format('YYYY-MM-DD')
         },
         immediate: true
      }
  },
  methods:{
      noSplit(){
        this.splitHeaderVisible = false
        document.querySelector('.tablesTep   .ivu-table-wrapper .ivu-table tr:first-child th:first-child').classList.add('no-split')
      },
      handleClick(){

      },
      addHeader(){
        $('.tablesTep .ivu-table-wrapper .ivu-table tr:first-child th:first-child').append(this.$refs.tableName)
      },
      getAllKey(columns, data){
          for(let i=0; i<columns.length; i++){
              if('children' in columns[i]){
                  this.getAllKey(columns[i].children, data)
              }else{
                  if('key' in columns[i]){
                      data.push(columns[i]['key'])
                  }
              }
          }
      },
      handleData(data, keys){
        let arr = []
        for(let i=0; i<data.length; i++){
          let obj = {}
          let child = data[i]
          let length = JSON.stringify(child).split(',').length
          for(let j=0; j<length; j++){
            obj[keys[j]] = child[j+1]
          }
          arr.push(obj)
        }
        this.data10 = arr
      },
      getReportView(){
        /*  getAxiosData('/lenovo-plan/api/report/view', { ...this.searchData }).then(res=>{
              debugger
          })*/
          let data = []
          Array(30).fill(0).forEach(item=>{
              let obj = {}
              Array(12).fill(0).forEach((child, index)=>{
                  obj[index+1] = 'index: '+ index +  "<br/>" +Math.random()*1000
              })
              data.push(obj)
          })
          this.handleData(data, this.keys)
      },
      initDate(){
          let date = new Date()
          this.timeRange = [ date, date ]
      },
      bindEvent(){
        const that = this
        this.tableHeight = $('.dunoMain_nr').height() - 60
        window.addEventListener('resize', function () {
          that.tableHeight = $('.dunoMain_nr').height() - 60
        })
      },
      initTable(){
          this.data10 = []
          this.columns11 = []
          this.$nextTick(()=>{
            this.addHeader()
          })
        // let tableData = require(`@/static/tableConfig/${this.searchData.templateIds}.js`)
          let tableFn = require(`@/static/tableJson/mapping.js`)
          let key = tableFn.getTable('626719305252552740')
          let tableData = require(`@/static/tableConfig/${key}.js`)
          this.columns11 = tableData.columns
          this.topName = tableData.topName
          this.bottomName = tableData.bottomName
          this.reMark = tableData.reMark?tableData.reMark: false
          if(this.reMark)
            this.reMarkInfo = tableData.reMarkInfo
          this.getAllKey(this.columns11, this.keys)
          this.getReportView()
          this.$forceUpdate()
      },
  },
  created(){
      this.initDate()
      this.initTable()
  },
  mounted(){
      this.bindEvent()
      // 140
/*     document.querySelectorAll('.ivu-table-tbody .ivu-table-row')[3].children[0].setAttribute("style","border-left: 1px solid grey !important")
     document.querySelectorAll('.ivu-table-tbody .ivu-table-row')[3].children[0].setAttribute("style","border:none !important; border-left: 1px solid grey !important")
  */
      setTimeout(()=>{
             // 第二列    第二行   占三列
             // this.mergeRow(1, 1, 3)

            //  第二行    第二列   合并三行
            //   this.mergeCol(1, 1, 3)
      },3000)
      this.$nextTick(()=>{
          // this.noSplit()
        /*  this.noSplit()
          this.mergeRow(1, 1, 3)
          this.mergeRow(2, 1, 3)
          this.mergeRow(3, 1, 3)
          this.mergeCol(1, 1, 3)*/
      })
  }
};
</script>
<style lang="scss">
  .taskReport{
    .el-range-editor--small.el-input__inner{
      background: #102332;
      border: none;
    }
    .el-range-editor--small .el-range-input{
      background: #102332;
      color: white;
    }
    .el-picker-panel  {
      background: #152e3a !important;
      border: none !important;
    }
    .el-date-table td.disabled div{
      color: 	#606266  !important;
      background-color: rgba(27, 59, 71, 0.7)  !important;
    }
    .el-time-panel{
      border: solid 1px rgba(27, 59, 71, 0.7)  !important;
      background-color: rgba(27, 59, 71, 0.7)  !important;
    }
    .el-time-panel__footer{
      border-top:none
    }
    .el-time-panel__btn,
    .el-time-panel__btn.confirm{
      color:#fff;
    }
    .ivu-table-overflowY{
      padding-bottom: 3px;
    }
    .hasReMark .ivu-table-overflowY{
      padding-bottom: 55px !important;
    }
    .tableName{
      color: white;
      z-index: 9;
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      .top{
        position: absolute;
        top: 4%;
        /*width: 64%;*/
        /*left: 72px;*/
        right: 13px;
      }
      .bottom{
        position: absolute;
        bottom: 21%;
        /*width: 63%;*/
        /*top: 39%;*/
        left: 13px;
        text-align: center;
      }
    }
    tbody{
      /*display: none;*/
    }
    .taskReport .tablesTep .ivu-table-wrapper tr  td .ivu-table-cell span:empty{
        background-color: pink !important;
    }
    .tablesTep  .ivu-table-wrapper .ivu-table td, .tablesTep   .ivu-table-wrapper .ivu-table th{
      border: 1px solid grey !important;
    }
    .tablesTep thead .ivu-table-wrapper .ivu-table td, .tablesTep   .ivu-table-wrapper .ivu-table th{
      border: 1px solid grey !important;
      height: 52px;
      background-color: #2a5171;
    }
    .tablesTep thead th:empty{
      visibility: hidden;
    }
    .tablesTep   .ivu-table-wrapper .ivu-table tr:first-child th:first-child{
      position: relative;
      &:after{
        content: '';
        background: linear-gradient(
                        to top right,
                        rgba(0, 0, 0, 0) 0%,
                        rgba(0, 0, 0, 0) calc(50% - 1.5px),
                        rgba(128, 128, 128, 1) 50%,
                        rgba(0, 0, 0, 0) calc(50% + 1.5px),
                        rgba(0, 0, 0, 0) 100%
        );
        width: 100%;
        display: block;
        height: 100%;
        position: absolute;
        top: 0;
      }
      &.no-split:after{
        background: none;
      }
      /*background-color: pink !important;*/
    }
    .tablesTep .ivu-table-wrapper tr:nth-child(odd) td{
      background-color: #091b27;
      height: 60px;
    }
    .tablesTep .ivu-table-wrapper tr:nth-child(even) td{
      background-color: #1b3648;
      height: 60px;
    }
    .ivu-table-cell{
      /*white-space: nowrap;*/
      padding-left: 7px;
      padding-right: 7px;
    }
    .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td{
      background-color: rgba(32, 54, 68, 0.7) !important;
    }
    .el-tabs--card > .el-tabs__header{
      border-bottom: 0;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active{
      border-bottom-color: transparent;
      color: white;
      background-color: rgb(42, 81, 113) !important;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__nav{
      border: none;
    }
    .el-tabs__item{
      color: #6c7379;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item{
      border-left: 0;
      position: relative;
      &:after{
        content: '';
        height: 13px;
        width: 1px;
        background-color: #2b5d77;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        margin: auto;
      }
      &:first-child{
        &:after{
            display: none;
        }
      }
    }
    .el-icon-arrow-right:before{
      content:'▶';
      color: #1b6697;
    }
    .el-icon-arrow-left:before{
      content:'◀';
      color: #1b6697;
    }
    .thead{
      tr{
        th{
          background-color: pink !important;
        }
      }
    }
    .main{
      color: white;
      margin: 16px 0;
      display: flex;
      justify-content: space-between;
      .title{
        font-size: 17px;
        display: flex;
        align-items: center;
      }
      .search{
        position: relative;
        display: flex;
      /*  width: 200px;
        height: 0;
        position: relative;
        top: -27px;*/
      }
    }
    .dunoMain{
      height: calc(100% - 119px) !important;
      .tab{
        height: 60px;
        padding: 0 38px;
        padding-top: 8px;
        margin-bottom: 35px;
        /*background: grey;*/
      }
      .table{
        position: relative;
        padding: 0 37px;
        margin-top: 35px;
        .mainTable{
          width: 100%;
        }
        .tip{
          background: #1b374a;
          width: 100%;
          height: 60px;
          bottom: 53px;
          border: 1px solid grey;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          font-size: 14px;
          position: relative;
        }
        .col_main{
          height: calc(100vh - 498px);
          overflow-y: scroll;
          position: relative;
        }
        .col_table{
          width: 100%;
          height: 64px;
          border-left: 2px solid grey;
          /*background-color: pink;*/
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          box-sizing: border-box;
          &:nth-child(odd){
            background-color: #1a3548;
          }
          &:nth-child(even){
            background-color: #061924;
          }
          .col{
              box-sizing: border-box;
              flex: 1;
              width: 100%;
              height: 100%;
              display: flex;
              justify-content: center;
              align-items: center;
              border: 1px solid grey !important;
              color: white;
              &:first-child{
                flex-basis: 199px;
                flex-grow: 0;
              }
              &:last-child{
                flex-basis: 191px;
                flex-grow: 0;
                border-right: 1px solid transparent !important;
              }
          }
        }
      }
    }
    .el-range-separator{
      color: white;
    }
    .clickBtn {
      line-height: 40px;
      position: relative;
      width: 139px;
      background-image: url(../../../assets/images/btn/moreBtn.png);
      text-align: center;
      font-size: 18px;
      cursor: pointer;
      color: #ffffff;
      right: 0;
      bottom: 3px;
      transform: scale(0.9);
    }
  }
</style>