<template>
    <div class="robotTask">
      <el-dialog
              v-dialogDrag
              :model="true"
              class="elDialogClass"
              :visible.sync="visible"
              width="700px"
              center
              @close="handleClose"
      >
        <div slot="title">新建轨道机器人任务</div>
        <div class="task_Top">
          <label>巡视名称</label>
          <el-input
                  placeholder="请输入巡视名称"
                  v-model="inspectionName">
          </el-input>
        </div>
        <div class="task_title">
          <div>请选择需要巡视的设备</div>
          <div><el-checkbox v-model="allDevice">全部设备</el-checkbox></div>
        </div>
        <div class="task_input">
          <el-input
                  placeholder="搜索设备名称"
                  v-model="filterText">
          </el-input>
          <i class="iconfont icon-sousuo"></i>
        </div>
        <div class="elTree">
          <div class="backList">
            <div v-for="(item,index) in labelLength" class="backItem" :key="index">
            </div>
          </div>
          <el-tree
                  show-checkbox
                  class="filter-tree"
                  :data="data2"
                  @check='currentChange'
                  default-expand-all
                  :filter-node-method="filterNode"
                  ref="tree2">
          </el-tree>
        </div>
      </el-dialog>
    </div>
</template>
<script>
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
  name: "robotTask",
  components: {
  },
  props: {
    isShow:{
      type:Boolean,
      default:()=>{
        return false
      }
    },
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    list: {}
  },
  computed: {
    labelLength(){
        return JSON.stringify(this.data2).split('label').length
    },
    rowDataLength() {
      return Object.keys(this.rowData).length;
    },
    Ids() {
      let arr = [];
      this.rowData["devicemonitors"].forEach((item, index) => {
        arr.push(item["powerDeviceId"]);
      });
      return arr;
    }
  },
  watch: {
    isShow(now){
      this.visible = now;
    },
    filterText(val) {
        this.$refs.tree2.filter(val);
    },
    list: {
      handler(now) {},
      deep: true
    }
  },
  data() {
    return {
        visible: false,
        filterText: '',
        allDevice: false,
        inspectionName: '',
        data2: [{
            id: 1,
            label: '一级 1',
            children: [{
                id: 4,
                label: '二级 1-1',
                children: [{
                    id: 9,
                    label: '三级 1-1-1'
                }, {
                    id: 10,
                    label: '三级 1-1-2'
                }]
            }]
        }, {
            id: 2,
            label: '一级 2',
            children: [{
                id: 5,
                label: '二级 2-1'
            }, {
                id: 6,
                label: '二级 2-2'
            }]
        }, {
            id: 3,
            label: '一级 3',
            children: [{
                id: 7,
                label: '二级 3-1'
            }, {
                id: 8,
                label: '二级 3-2'
            }]
        }],
    };
  },
  methods: {
    currentChange(data,node,children){
      console.log(data,node,children)
    },
    handleClose(){
      this.$emit('on-close')
    },
    filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
    },
    chosenAll(){

    },
    inputChange(item) {

    },
    onChange(value) {

    },
    initData() {

    }
  },
  mounted() {
    this.initData();
    this.visible = this.isShow
  }
};
</script>
<style lang="scss">
.robotTask {
  .el-tree{
    background: transparent;
  }
  .el-tree-node__content:hover{
    background: inherit;
  }
  .el-tree-node:focus > .el-tree-node__content{
    background: inherit;
  }
  .el-tree-node__content{
    height: 40px;
  }
  .elTree{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .el-tree-node__expand-icon{
      color: #707070;
    }
    .el-tree-node__expand-icon.is-leaf{
      color: transparent;
    }
    .backList{
      position: absolute;
      width: 100%; height: 100%;
      .backItem{
        width: 100%; height: 40px;
        &:nth-child(2n+1){
          background: #c7c7c7;
        }
      }
    }
  }
  .task_Top{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 38px;
    margin-top: 11px;
    label{
      width: 91px;
    }
  }
  .task_title{
    display: flex;
    justify-content: space-between;
    margin-bottom: 22px;
  }
  .task_input{
    position: relative;
    input{
      padding-left: 33px;
    }
    .iconfont{
      position: absolute;
      left: 10px;
      top: 4px;
      color: #979797;
    }
    margin-bottom: 10px;
  }
  .el-dialog__header {
    font-size: 17px;
    color: #333333;
    font-weight: bold;
  }
  .el-input--small .el-input__inner {
    /*text-align: center;*/
  }
  .el-dialog--center {
    background: #e0e0e0;
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    color: #ffffff;
    .button {
      height: 37px;
      line-height: 31px;
      font-size: 14px;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  .el-dialog__headerbtn {
    right: 14px !important;
    top: 6px !important;
  }
  .el-dialog__body {
    margin-top: -15px;
  }
  .chosenListV .contain .item{
    display: flex;
    align-items: center;
  }
  .el-select {
    width: 100%;
  }
  .selectAll{
    position: absolute;
    right: 48px;
  }
}
.el-input--small .el-input__inner {
  background-color: #fff;
}
</style>