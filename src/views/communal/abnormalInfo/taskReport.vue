<template>
  <div class="taskReport">
    <breadcrumb :dataList="dataBread"/>
    <div class="title">
        xx全面巡视任务报告
    </div>
    <duno-main>
      <duno-tables-tep
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
export default {
  components: {
    Breadcrumb,
    dunoMain,
    DunoTablesTep
  },
  name: "server",
  data() {
    return {
      data10: [
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
              minWidth: 200,
              maxWidth: 200
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
              width: 200,
              height: 200
          }
      ],
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "", name: "报表详情" },
      ],
    };
  },
  methods:{
      addHeader(){
        $('.tablesTep .ivu-table-wrapper .ivu-table tr:first-child th:first-child').append(this.$refs.tableName)
      }
  },
  mounted(){
      this.$nextTick(()=>{
          this.addHeader()
      })
      this.tableHeight = window.innerHeight - this.$refs.table.$el.offsetTop - 206
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
    .tablesTep thead .ivu-table-wrapper .ivu-table td, .tablesTep   .ivu-table-wrapper .ivu-table th{
      border: 1px solid grey !important;
      height: 52px;
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
    .ivu-table-stripe .ivu-table-body tr.ivu-table-row-hover td{
      background-color: rgba(32, 54, 68, 0.7) !important;
    }
    .thead{
      tr{
        th{
          background-color: pink !important;
        }
      }
    }
      .title{
        color: white;
        margin: 16px 0;
        font-size: 17px;
      }
    .dunoMain{
      height: calc(100% - 119px) !important;
    }
  }
</style>