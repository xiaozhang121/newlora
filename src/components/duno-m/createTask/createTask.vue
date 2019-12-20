<template>
  <div class="createTask" v-if="visibleOption">
    <el-dialog
      v-dialogDrag
      :model="true"
      class="elDialogClass"
      :visible.sync="visibleOption"
      :close-on-click-modal="false"
      width="700px"
      center
      @close="handleClose"
    >
      <div slot="title"><span v-if="rowDataLength == 0">创建新的</span><span v-if="rowDataLength != 0">编辑</span>任务配置</div>
      <div class="main">
        <div class="steps">
          <steps :step="stepValue" />
        </div>
        <first-panel
          :rowData="rowData"
          ref="panel[0]"
          v-show="stepValue == 1"
          class="panel"
           @getchoseType="getchoseType"
          :type="type"
        /> 
        <template v-if="choseType!=3">
            <second-panel
          :rowData="rowData"
          :list="dataObjList['0']"
          ref="panel[1]"
          v-show="stepValue == 2"
          class="panel"
        />
        </template>
          <template v-if="choseType==3">
            <second-panelpro
          :rowData="rowData"
          :list="dataObjList['0']"
          ref="panel[1]"
          v-show="stepValue == 2"
          class="panel"
        />
        </template>
        <third-panel
          :rowData="rowData"
          :list="dataObjList['1']"
          ref="panel[2]"
          v-show="stepValue == 3"
          class="panel"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <button-custom v-if="stepValue == 1" class="button" @click.native="cancel" title="取消" />
        <button-custom v-else="stepValue != 1" class="button" @click.native="toPre" title="上一步" />
        <button-custom v-if="stepValue!=3" class="button" @click.native="toNext" title="下一步" />
        <button-custom
          v-if="rowDataLength == 0 && stepValue == 3"
          class="button"
          @click.native="toSubmit()"
          title="确认"
        />
        <button-custom
          v-if="rowDataLength != 0 && stepValue == 3"
          class="button"
          @click.native="toEdit"
          title="完成编辑"
        />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import firstPanel from "_c/duno-m/createTask/components/panel/first.vue";
import secondPanel from "_c/duno-m/createTask/components/panel/second.vue";
import secondPanelpro from "_c/duno-m/createTask/components/panel/second.vue";
import thirdPanel from "_c/duno-m/createTask/components/panel/third.vue";
import steps from "_c/duno-m/steps";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import { any } from 'bluebird';
export default {
  name: "createTask",
  components: {
    buttonCustom,
    steps,
    firstPanel,
    secondPanel,
    thirdPanel
  },
  data() {
    return {
      dataObjList: {
        "0": [],
        "1": [],
        "2": []
      },
      visibleOption: false,
      stepValue: 1,
      type: 0
    };
  },
  watch: {
    visible(now) {
      this.visibleOption = now;
      this.stepValue = 1;
    },
    stepValue(now, old) {
      this.dataObjList[old - 1] = this.$refs[`panel[${old - 1}]`].$data;
      this.$forceUpdate();
    },
    choseType:{
        handler(value){
          console.log(value)
          this.getType=value
          if(this.getType=='4'||this.getType=='5'){
            this.$emit('gettype',this.getType)
            return
          }
        },
        deep: true,
        immediate: true
    }
  },
  props: {
    choseType: {
      type: String | Number,
      // default: () => {
      //   return false;
      // }
    },
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    visible: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  computed: {
    rowDataLength() {
      return Object.keys(this.rowData).length;
    }
  },
  methods: {
    getchoseType(value){
      this.getType=value
          if(this.getType=='4'||this.getType=='5'){
            this.$emit('gettype',this.getType)
            return
          }
    },
    toEdit() {
      this.toSubmit("/lenovo-plan/api/plan/edit");
    },
    toSubmit(url) {
      let obj = {};
      let data = [];
      let house = (Number(new Date(this.$refs["panel[2]"].$data.value3).getHours()))<10?'0'+(Number(new Date(this.$refs["panel[2]"].$data.value3).getHours())).toString():(Number(new Date(this.$refs["panel[2]"].$data.value3).getHours())).toString()
      let minute = (Number(new Date(this.$refs["panel[2]"].$data.value3).getMinutes()))<10?'0'+(Number(new Date(this.$refs["panel[2]"].$data.value3).getMinutes())).toString():(Number(new Date(this.$refs["panel[2]"].$data.value3).getMinutes())).toString()
      let second = (Number(new Date(this.$refs["panel[2]"].$data.value3).getSeconds()))<10?'0'+(Number(new Date(this.$refs["panel[2]"].$data.value3).getSeconds())).toString():(Number(new Date(this.$refs["panel[2]"].$data.value3).getSeconds())).toString()
      obj["planDate"] = {
          ["planCycle"]: this.$refs["panel[2]"].$data.value,
          ["value"]: [
              {
                  startTime:
                  house+":" + minute + ":" +second
              }
          ]
      };
      obj["planType"] = this.$refs["panel[0]"].$data.form.taskKind;
      obj["deviceJson"] = [];
      data = this.$refs["panel[1]"].$data.dataList;
      for (let i = 0; i < data.length; i++) {
        data[i]["monitorDevices"].forEach(item => {
          if (item["isCheck"]) {
            let analyseType = "";
            let roiId = "";
            if (item["monitorDeviceType"] == 2) {
              roiId = item["roiId"];
            } else if (item["monitorDeviceType"] == 1) {
              analyseType = item["analyseType"];
            }
            obj["deviceJson"].push({
              deviceType: data[i]["powerDeviceType"],
              deviceId: data[i]["powerDeviceId"],
              deviceName: data[i]["powerDeviceName"],
              monitorDeviceId: item["monitorDeviceId"],
              monitorDeviceType: item["monitorDeviceType"],
              roiId: roiId,
              analyseType: analyseType
            });
          }
        });
      }
      obj["startnow"] = 2;
      obj["planName"] = this.$refs["panel[0]"].$data.form.taskName;
      obj["startTime"] =
        new Date(this.$refs["panel[2]"].$data.value3).getFullYear() +
        "-" +
        (new Date(this.$refs["panel[2]"].$data.value3).getMonth() * 1 + 1) +
        "-" +
        new Date(this.$refs["panel[2]"].$data.value3).getDate();
      let urlD = "";
      if (url) {
        urlD = url;
        obj["planId"] = this.rowData["planId"];
        putAxiosData(urlD, obj).then(res => {
          if (res.data.isSuccess) {
            this.$message.success("编辑成功");
            this.$emit("on-fresh");
            this.handleClose();
          } else {
            this.$message.error(res.msg);
          }
        }, error => {
          this.$message.error(error.response.data.errors[error.response.data.errors.length-1]['defaultMessage']);
        });
      } else {
        urlD = "/lenovo-plan/api/plan/create";
        postAxiosData(urlD, obj).then(res => {
          if (res.data.isSuccess) {
            this.$message.success("创建成功");
            this.$emit("on-fresh");
            this.handleClose();
          } else {
            this.$message.error(res.msg);
          }
        }, error => {
          this.$message.error(error.response.data.errors[error.response.data.errors.length-1]['defaultMessage']);
        });
      }
    },
    toPre() {
      this.stepValue--;
    },
    handleClose() {
      this.$emit("on-close");
    },
    cancel() {
      this.$emit("on-close");
    },
    toNext() {
      let data = this.$refs['panel[0]'].$data.infoData
      for(let i=0; i<data.length; i++){
        if(data[i].isCheck){
          this.stepValue++;
          return
        }
      }
      this.$message.info('提示：请先选择电力设备')
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.createTask {
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
  .main {
    line-height: 44px;
    .steps {
      width: 95%;
      margin: 0 auto;
    }
    .panel {
      margin-top: 20px;
    }
    p {
      font-size: 16px;
      color: #707070;
      &:last-child {
        display: flex;
        align-items: center;
      }
      .el-input--small {
        width: 71%;
        margin-left: 20px;
      }
    }
  }
}
</style>

