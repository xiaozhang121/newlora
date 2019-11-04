<template>
  <div class="sample-detail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="info">
      <div class="top">
        <div>样本详情</div>
        <div :style="{backgroundImage:background}">
          <i class="iconfont icon-shanchu"></i>删除样本
        </div>
      </div>
      <div class="infoDetail">
        <div class="infoLeft">
          <el-image :src="require('@/assets/noPic.png')" placeholder>
            <img slot="placeholder" :src="require('@/assets/noPic.png')" />
          </el-image>
          <div class="infoNews">
            <div>图片编号15465564</div>
            <p>大小：108KB</p>
            <p>分辨率：1920*1080</p>
            <p>导入时间：2019-10-01 15:45:45</p>
            <p>导入类型：手动导入</p>
          </div>
        </div>
        <div class="infoRight">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="设备组件">
              <el-cascader :data="cascaderData" :load-data="loadData"></el-cascader>
            </el-form-item>
            <el-form-item label="变电站名">
              <el-select v-model="form.substationName" placeholder="请选择">
                <el-option
                  v-for="(item,index) in substationData"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="摄像头名">
              <el-select v-model="form.cameraName" placeholder="请选择">
                <el-option
                  v-for="(item,index) in cameraData"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电压区域">
              <el-select v-model="form.diviceName" placeholder="请选择">
                <el-option
                  v-for="(item,index) in diviceData"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <survey :monitor="form.monitor"></survey>
            <div class="submit">
              <span>删除</span>
              <span>确认</span>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="top">
        <div>标定结果列表</div>
        <div :style="{backgroundImage:background}">
          <i class="el-icon-plus"></i>新增标定
        </div>
      </div>
      <duno-tables-tep
        class="table_abnormalInfo"
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
import Breadcrumb from "_c/duno-c/Breadcrumb";
import survey from "_c/duno-c/survey";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
export default {
  name: "sample-detail",
  mixins: [mixinViewModule],
  components: {
    Breadcrumb,
    DunoTablesTep,
    survey
  },
  data() {
    const that = this;
    return {
      mixinViewModuleOptions: {
        activatedIsNeed: true,
        getDataListURL: "/lenovo-alarm/api/alarm/history"
      },
      form: {
        cameraName: ""
      },
      substationData: [
        { value: "0", label: "练塘站" },
        { value: "1", label: "朱光站" }
      ],
      cameraData: [
        { value: "0", label: "新视界-练塘站-1000KV-4号主变" },
        { value: "1", label: "新视界-练塘站-500KV-4号主变" }
      ],
      diviceData: [
        { value: "0", label: "1000KV" },
        { value: "1", label: "500KV" }
      ],
      cascaderData: [
        {
          value: "beijing",
          label: "北京",
          children: [],
          loading: false
        },
        {
          value: "hangzhou",
          label: "杭州",
          children: [],
          loading: false
        }
      ],
      background: "url(" + require("@/assets/images/btn/moreBtn.png") + ")",
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/platformMonitor", name: "缺陷库管理" },
        { path: "", name: "样本详情" }
      ],
      columns: [
        {
          title: "序号",
          type: "index",
          width: 90,
          align: "center"
        },
        {
          title: "识别类型",
          key: "monitorDeviceName",
          minWidth: 180,
          align: "center",
          tooltip: true
        },
        {
          title: "起始点位",
          key: "part",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "结束点位",
          key: "content",
          minWidth: 90,
          align: "center",
          tooltip: true
        },
        {
          title: "标记时间",
          key: "alarmValue",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "标记图片",
          key: "id",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let newArr = [];
            newArr.push([
              h("img", {
                class: "imgOrMv",
                attrs: { src: params.row.pic },
                draggable: false,
                on: {
                  click: () => {
                    // that.isEnlarge = true;
                    // that.srcData = params.row;
                  }
                }
              })
            ]);
            return h("div", newArr);
          }
        },
        {
          title: " ",
          key: "id",
          width: 90,
          align: "center",
          render: (h, params) => {
            const that = this;
            let newArr = [];
            newArr.push([
              h(
                "el-button",
                {
                  class: "table_link",
                  style: { marginRight: "20px" },
                  props: { type: "text" },
                  on: {
                    click: () => {}
                  }
                },
                "删除"
              )
            ]);
            return h(
              "div",
              {
                class: "flexPos"
              },
              newArr
            );
          }
        }
      ]
    };
  },
  methods: {
    loadData(item, callback) {
      item.loading = true;
      let url = "/lenovo-sample/api/sample/getPart";
      let query = {
        mainDevice: item.value
      };
      postAxiosData(url).then(res => {
        let data = res.data;
        data.forEach(el => {
          el.children = [];
          el.loading = false;
        });
        item.children = data;
      });
      item.loading = false;
      callback();
    }
  }
};
</script>

<style lang='scss'>
.sample-detail {
  .info,
  .list {
    margin-top: 10px;
    .top {
      display: flex;
      justify-content: space-between;
      font-size: 18px;
      color: #ffffff;
      line-height: 40px;
      margin-bottom: 10px;
      & > :nth-child(2) {
        width: 139px;
        cursor: pointer;
        text-align: center;
        i {
          padding-right: 5px;
        }
      }
    }
  }
  .info {
    &Detail {
      height: 320px;
      padding: 20px 40px;
      background: rgba(20, 40, 56, 0.8);
      display: flex;
      justify-content: space-between;
      .infoLeft {
        display: flex;
        justify-content: flex-start;
        width: 50%;
        color: #ffffff;
        .el-image {
          height: 100%;
          .el-image__inner {
            height: 100%;
          }
        }
        .infoNews {
          margin-left: 10%;
          width: 30%;
          div {
            line-height: 60px;
            border-bottom: 2px solid #305e83;
            font-size: 20px;
          }
          p {
            margin-top: 10px;
          }
          p:nth-child(even) {
            margin-top: 25px;
          }
        }
      }
      .infoRight {
        width: 50%;
        .el-form {
          margin-top: 50px;
          display: flex;
          justify-content: flex-start;
          flex-wrap: wrap;
          .el-form-item {
            padding-left: 5%;
            margin-bottom: 30px;
            width: 50%;
            .el-select {
              width: 100%;
            }
            .el-form-item__label {
              color: #c7c7c7;
              padding: 0 30px 0 0;
            }
            .ivu-input,
            .el-input__inner {
              background: rgba(32, 62, 82, 0.8);
              border: none;
            }
            .diviceSelect {
              .el-input__inner {
                background: #fff;
                border: none;
              }
            }
            .el-select-dropdown {
              border: none;
            }
          }
          .submit {
            width: 50%;
            text-align: right;
            span {
              display: inline-block;
              color: #ffffff;
              cursor: pointer;
              margin-left: 5px;
              text-align: center;
              width: 68px;
              line-height: 32px;
              border-radius: 16px;
              background-color: #3a81a1;
            }
          }
        }
      }
    }
  }
  //-------------------表格样式
  .ivu-table {
    font-size: 16px;
  }
  .ivu-table th {
    color: #fff;
    border: none;
    height: 60px;
    background-color: #2d5980 !important;
    font-size: 18px;
    font-weight: normal;
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
  .ivu-table-wrapper {
    tr {
      td {
        height: 48px;
      }
    }
    tr:nth-child(odd) {
      td {
        background: rgba(0, 0, 0, 0) !important;
      }
    }
    tr:nth-child(even) {
      td {
        background-color: #2a526c;
      }
    }
  }
  .ivu-select-dropdown {
    background: white !important;
  }
  .ivu-table-small td {
    background: black;
  }
  //------------------
}
</style>
