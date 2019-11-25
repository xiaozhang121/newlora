<template>
  <div class="sample-detail">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="info">
      <div class="top">
        <div>样本详情</div>
        <!--@click="deleteDetail"-->
        <div  :style="{backgroundImage:background}" @click="removeOK">
          <i class="iconfont icon-shanchu"></i>删除样本
        </div>
      </div>
      <div class="infoDetail">
        <div class="infoLeft">
          <el-image :src="src" fit="fill">
            <!-- <img slot="placeholder" :src="require('@/assets/noPic.png')" /> -->
          </el-image>
          <div class="infoNews">
            <div>{{sampleData.picFileName?sampleData.picFileName.substring(0,sampleData.picFileName.length-4):''}}</div>
            <p>大小：{{ this.sampleData.picSize }}kb</p>
            <p>分辨率：{{sampleData.picWigth}}*{{sampleData.picHeigh}}</p>
            <p>导入时间：{{sampleData.picImportTime}}</p>
            <p>导入类型：{{$route.query.markType}}</p>
          </div>
        </div>
        <div class="infoRight">
          <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="设备组件">
              <el-cascader
                 v-model="form.initCascader"
                :data="cascaderData"
                @on-change="handleChange"
                :placeholder="placeholder"
                :disabled="isEdit"
                :load-data="loadData"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="变电站名">
              <el-select
                v-model="form.stationName"
                :disabled="isEdit"
                @change="changeStation"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in substationData"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="摄像头名">
              <el-select
                v-model="form.monitorDeviceName"
                @change="changeMonitor"
                :disabled="isEdit"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in cameraData"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电压区域">
              <el-select
                v-model="form.areaName"
                @change="changeArea"
                :disabled="isEdit"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item,index) in diviceData"
                  :label="item.label"
                  :value="item.value"
                  :key="index"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item  label="被监测设备">
              <el-input :disabled="isEdit" v-model.trim="form.powerDeviceName" placeholder="请输入被监测设备名" />
            </el-form-item>
            <!--<survey :monitor="form.powerDeviceName" :isEdit="isEdit"></survey>-->
            <div class="submit">
              <span v-if="isEdit" @click="isEdit=false">编辑</span>
              <span v-if="!isEdit" @click="isEdit=true">取消</span>
              <span v-if="!isEdit" @click="handleSubmit">确认</span>
            </div>
          </el-form>
        </div>
      </div>
    </div>
    <div class="list">
      <div class="top">
        <div>标定结果列表</div>
        <div :style="{backgroundImage:background}" @click="addCalibration">
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
        :isShowPage="mixinViewModuleOptions.isShowPage"
        @clickPage="pageCurrentChangeHandle"
      />
    </div>
    <sure-submit ref="submit" :visible="sureVisible" @on-close="closeSubmit" @on-sure="onSure"></sure-submit>
    <calibration :imgUrl="src" :onlyShow="onlyShow" :isEdit="isEditPanel" v-if="isShow" :isShow="isShow" :dataList="calibratData" @closeShot="closeShot"></calibration>
  </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import sureSubmit from "_c/duno-m/sureSubmit";
import survey from "_c/duno-c/survey";
import calibration from "./components/calibration.vue";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import {
  getAxiosData,
  postAxiosData,
  deleteDataId,
  putAxiosData
} from "@/api/axiosType";
export default {
  name: "sample-detail",
  mixins: [mixinViewModule],
  components: {
    Breadcrumb,
    DunoTablesTep,
    survey,
    calibration,
    sureSubmit
  },
  data() {
    const that = this;
    return {
      onlyShow: false,
      isEditPanel: false,
      visible2: false,
      mainDevice: "",
      part: "",
      partSub: "",
      isShow: false,
      isEdit: true,
      src: require("@/assets/noPic.png"),
      // imgsrc: "",
      placeholder: "请选择",
      calibratData: {},
      dataList: [],
      ImgInfo: {},
      sampleData: {},
      // mixinViewModuleOptions: {
      //   activatedIsNeed: true,
      //   getDataListURL: "/venus/crud/PokerCustomer"
      // },
      form: {
        stationName: "",
        monitorDeviceName: "",
        areaName: "",
        powerDeviceName: "",
        initCascader: ""
      },
      substationData: [],
      cameraData: [
        // { value: "0", label: "新视界-练塘站-1000KV-4号主变" },
        // { value: "1", label: "新视界-练塘站-500KV-4号主变" }
      ],
      diviceData: [
        { label: "1000KV", value: "1" },
        { label: "500KV", value: "2" },
        { label: "220KV", value: "3" },
        { label: "110KV", value: "4" },
        { label: "35KV", value: "5" },
        { label: "10KV", value: "6" }
      ],
      cascaderData: [],
      background: "url(" + require("@/assets/images/btn/moreBtn.png") + ")",
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/defectLibrary", name: "缺陷库管理" },
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
          key: "recognizeType",
          minWidth: 180,
          align: "center",
          tooltip: true
        },
        {
          title: "起始点位",
          key: "x0",
          minWidth: 120,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let data = `${params.row.x0},${params.row.y0}`;
            return h("div", data);
          }
        },
        {
          title: "结束点位",
          key: "content",
          minWidth: 90,
          align: "center",
          tooltip: true,
          render: (h, params) => {
            let data = `${params.row.x1},${params.row.y1}`;
            return h("div", data);
          }
        },
        {
          title: "标记时间",
          key: "markTime",
          minWidth: 120,
          align: "center",
          tooltip: true
        },
        {
          title: "标记图片",
          key: "pic",
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
                    this.onlyShow = true
                    this.handleEdit(params.row);
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
          minWidth: 90,
          align: "center",
          render: (h, params) => {
            const that = this;
            let newArr = [];
            newArr.push(h('el-poptip', {
              props: { confirm: true, title: '确定删除吗？', type: 'primary', size: 'small' },
              style: { margin: '0 2px' },
              on: { 'on-ok': () => { this.deletItem(params.row) } }
            }, [h(
                "el-button",
                {
                  class: "tab_link",
                  style: { marginRight: "20px", background: "##305E83" },
                  props: { type: "text" },
                },
                "删除"
              )
            ]));
            newArr.push([
              h(
                "el-button",
                {
                  class: "tab_link",
                  style: { marginRight: "20px", background: "#3a81a1" },
                  props: { type: "text" },
                  on: {
                    click: () => {
                      this.isEditPanel = true
                      this.handleEdit(params.row);
                    }
                  }
                },
                "编辑"
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
      ],
      sureVisible: false
    };
  },
  methods: {
    onSure(){
      this.deleteDetail()
    },
    closeSubmit(){
      this.sureVisible = false
    },
    removeOK(){
      this.$refs.submit.visibleOption = true
    },
    getMapping(arr, id){
      let label = ''
      arr.forEach(item=>{
        if(item['value'] == id){
          label = item['label']
        }
      })
      return label
    },
    getCameraData(){
      getAxiosData('/lenovo-sample/api/sample/camera/list').then(res=>{
         this.cameraData = res.data
      })
    },
    handleEdit(params) {
      let url = "/lenovo-sample/api/mark/view";
      let query = {
        id: params.id
      };
      getAxiosData(url, query).then(res => {
        this.calibratData = res.data;
        this.isShow = true;
      });
    },
    changeStation(value) {
      this.sampleData.stationId = value;
    },
    changeMonitor(value) {
      // this.sampleData.stationId = value;
    },
    changeArea(value) {
      this.sampleData.areaId = value;
    },
    closeShot() {
      this.isShow = false;
      this.onlyShow = false
      this.isEditPanel = false
      this.calibratData = {}
      this.init()
    },
    addCalibration() {
      this.isShow = true;
      this.calibratData.picFilePath = this.sampleData.picFilePath;
    },
    loadData(item, callback) {
      item.loading = true;
      let index = item.__label.split(" / ").length - 1;
      let url = "";
      let query = {};
      if (index == 0) {
        url = "/lenovo-sample/api/sample/getPart";
        query = {
          mainDevice: item.value
        };
        this.mainDevice = item.value;
      } else {
        url = "/lenovo-sample/api/sample/getPartSub";
        query = {
          mainDevice: this.mainDevice,
          part: item.value
        };
      }
      postAxiosData(url, query).then(res => {
        let data = res.data;
        if (index == 0) {
          data.forEach(el => {
            el.children = [];
            el.loading = false;
          });
        }
        item.children = data;
        item.loading = false;
        callback();
      });
    },
    pageCurrentChangeHandle (val) {
      this.pageIndex = val
      this.init()
    },
    init() {
      // let url = "/lenovo-sample/api/mark/pic-flow";
      // let query = {
      //   picFilePath: this.$route.query.picFileName
      // };
      // getAxiosData(url, query).then(res => {
      //   this.imgsrc = res.data;
      // });
      let urlList = "/lenovo-sample/api/mark/list";
      let data = {
        pageIndex: this.pageIndex,
        pageRows: 10,
        sampleId: this.$route.query.sampleId
      };
      getAxiosData(urlList, data).then(res => {
        let data = res.data.tableData[0]
        data.map(item=>{
          item['pic'] = this.src
        })
        this.dataList = data;
        // this.ImgInfo = res.data.tableData[1];
        this.totalNum = res.data.pageParam.totalRows;
      });
    },
    handleSubmit() {
      if(!this.form.initCascader){
        this.$message.info('请选择设备组件！')
        return
      }
      let url = "/lenovo-sample/api/sample/system/edit";
      let query = {
        id: this.$route.query.id,
        mainDevice: this.mainDevice,
        part: this.part,
        partSub: this.partSub,
        stationId: this.form.stationName,
        stationName: this.getMapping(this.substationData, this.form.stationName),
        monitorDeviceId: this.form.monitorDeviceName,
        monitorDeviceName: this.getMapping(this.cameraData, this.form.monitorDeviceName),
        powerDeviceName: this.form.powerDeviceName,
        areaId: this.form.areaName,
        areaName: this.getMapping(this.diviceData, this.form.areaName)

        // markType: this.sampleData.markType,
        // picFilePath: this.sampleData.picFilePath,
        // powerDeviceId: this.sampleData.powerDeviceId,
        // powerDeviceName: this.form.powerDeviceName,
        // taskId: this.sampleData.taskId,
      };
      putAxiosData(url, query).then(res => {
        this.$message.info("修改成功");
      });
    },
    deleteDetail() {
      this.visible2 = false
      let url = "/lenovo-sample/api/sample/del";
      let query = {
        id: this.$route.query.id
      };
      deleteDataId(url, query).then(res => {
        // this.$message.success(res.errorMessage);
        this.$router.push({
          path: "/abnormalInfoPath/defectLibrary"
        });
      });
    },
    getVoltage() {
      let url = "/lenovo-sample/api/sample/getMainDevice";
      postAxiosData(url).then(res => {
        let data = res.data;
        data.forEach(el => {
          el.children = [];
          el.loading = false;
        });
        this.cascaderData = data;
      });
    },
    initDevice() {
      let url = "/lenovo-sample/api/sample/view";
      let query = {
        id: this.$route.query.id
      };
      getAxiosData(url, query).then(res => {
        this.sampleData = res.data.sample;
        let deviceData = res.data.sample;
        this.substationData = res.data.stationList;
        this.form.stationName = Number(deviceData.stationId);
        this.form.monitorDeviceName = deviceData.monitorDeviceId;
        this.form.areaName = deviceData.areaId;
        this.form.initCascader = [deviceData.mainDevice, deviceData.part, deviceData.partSub]
        this.handleChange(this.form.initCascader)
        this.form.powerDeviceName = deviceData.powerDeviceName;
        this.src = deviceData.picFilePath;
        this.init();
        // let picFilePath = deviceData.picFilePath;
        // picFilePath = picFilePath.replace(".", "");
        // picFilePath = picFilePath.replace(new RegExp(/\./g), "/");
        // let num = picFilePath.indexOf("/");
        // for (let i = 0; i < 2; i++) {
        //   num = picFilePath.indexOf("/", num + 1);
        // }
        // this.placeholder = picFilePath.substring(0, num);
      });
    },
    handleChange(value) {
      this.mainDevice = value[0];
      this.part = value[1];
      this.partSub = value[2];
    },
    // initImg() {
    //   let url = "/lenovo-sample/api/mark/pic-flow";
    //   let query = {
    //     picFilePath: this.$route.query.picFilePath
    //   };
    //   getAxiosData(url, query).then(res => {
    //     this.src;
    //   });
    // },
    deletItem(params) {
      let url = "/lenovo-sample/api/mark/del";
      let query = {
        id: params.id
      };
      deleteDataId(url, query).then(res => {
        this.init();
      });
    }
  },
  mounted() {
    this.getCameraData()
    this.initDevice();
    this.getVoltage();
  }
};
</script>

<style lang='scss'>
.sample-detail {
  .ivu-poptip-confirm .ivu-poptip-body-message{
    padding-left: 0;
    color: black;
    text-align: left;
    margin-left: -10px;
  }
  .el-input__inner, .ivu-input{
      color: white;
  }
  .el-input.is-disabled .el-input__inner{
      color: white;
  }
  .imgOrMv{
    width: 66px;
    margin-top: 8px;
  }
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
          width: 60%;
          .el-image__inner {
            height: 100%;
            width: 100%;
          }
        }
        .infoNews {
          margin-left: 7%;
          width: 40%;
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
  .tab_link {
    padding: 10px 20px;
    color: #ffffff;
    border-radius: 16px;
    font-size: 14px;
  }
  .tab_link:hover {
    background-color: rgba(0, 0, 0, 0);
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
