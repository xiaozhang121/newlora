<template>
  <div class="taskReport">
    <breadcrumb :dataList="dataBread"/>
    <div class="main">
      <div class="title">
        xx全面巡视任务报告
      </div>
      <div class="search">
        <duno-btn-top
                style="position: absolute;
                top: -30px;
                right: 356px;"
                zIndex="10"
                class="dunoBtnTop"
                :isCheck="false"
                :dataList="numberCameras"
                :title="titleValueL"
                :showBtnList="false"
        ></duno-btn-top>
        <div  class="clickBtn">
          <i class="iconfont icon-daochu1"></i>
          导出表格
        </div>
      </div>
    </div>
    <duno-main>
      <div class="tab">
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
          <el-tab-pane v-for="(item, index) in tabList" :key="index" :label="item" :name="'item'+index"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="table">
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
        />
        <div class="col_main">
          <template v-for="(item, index) in dataCol">
            <div class="col_table" v-if="'spaceLine' in item"></div>
            <div class="col_table" v-else>
              <template v-for="(value, key) in item">
                <div class="col">{{ value }}</div>
              </template>
            </div>
          </template>
        </div>
        <div class="tip">
          备注：状态识别显示“表计读数异常”/ “表计读数正常”/ “无法识别”
        </div>
      </div>
    </duno-main>
    <div ref="tableName" class="tableName">
      <div class="top">名称1</div>
      <div class="bottom">名称2</div>
    </div>
  </div>
</template>
<script>
import { DunoTablesTep } from "_c/duno-tables-tep";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoMain from "_c/duno-m/duno-main";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
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
      titleValueL: '监控摄像头数量',
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
      dataCol: [
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
              title: ' ',
              key: 'name',
              align: 'center',
              width: 200,
              fixed: 'left',
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
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "", name: "报表详情" },
      ],
    };
  },
  methods:{
      handleClick(){

      },
      addHeader(){
        $('.tablesTep .ivu-table-wrapper .ivu-table tr:first-child th:first-child').append(this.$refs.tableName)
      }
  },
  mounted(){
      this.$nextTick(()=>{
          this.addHeader()
      })
      // this.tableHeight = $('.dunoMain_nr').height() - $('.tab').height()-60
  }
};
</script>
<style lang="scss">
  .taskReport{
    .tableName{
      color: white;
      z-index: 9;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      text-align: center;
      .top{
        position: absolute;
        top: 17px;
        width: 64%;
        left: 72px;
      }
      .bottom{
        position: absolute;
        bottom: 0;
        width: 63%;
        top: 65px;
        left: -1px;
        text-align: center;
      }
    }
    tbody{
      display: none;
    }
    .tablesTep  .ivu-table-wrapper .ivu-table td, .tablesTep   .ivu-table-wrapper .ivu-table th{
      border: 1px solid grey !important;
    }
    .tablesTep thead .ivu-table-wrapper .ivu-table td, .tablesTep   .ivu-table-wrapper .ivu-table th{
      border: 1px solid grey !important;
      height: 52px;
      background-color: #2a5171;
    }
    .tablesTep   .ivu-table-wrapper .ivu-table tr:first-child th:first-child{
      position: relative;
      &:after{
        content: '';
        background: linear-gradient(27deg, transparent 49.5%, grey 49.5%, grey 50.5%, transparent 50.5%);
        width: 100%;
        display: block;
        height: 100%;
        position: absolute;
        top: 0;
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
      white-space: nowrap;
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
      }
      .search{
        position: relative;
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
    .clickBtn {
      line-height: 40px;
      position: absolute;
      width: 139px;
      background-image: url(../../../assets/images/btn/moreBtn.png);
      text-align: center;
      font-size: 18px;
      cursor: pointer;
      color: #ffffff;
      right: 0;
      bottom: -2px;
    }
  }
</style>