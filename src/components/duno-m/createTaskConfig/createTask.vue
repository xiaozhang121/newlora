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
        <!-- <div class="steps">
                   <steps :step="stepValue"/>
        </div>-->
        <first-panel
          :rowData="rowData"
          ref="panel[0]"
          v-show="stepValue == 1"
          class="panel"
          @getchoseType="choseType"
        />
        <second-panel
          :rowData="rowData"
          :list="dataObjList['0']"
          ref="panel[1]"
          v-show="stepValue == 2"
          class="panel"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <button-custom v-if="stepValue == 1" class="button" @click.native="cancel" title="取消" />
        <button-custom v-else="stepValue != 1" class="button" @click.native="toPre" title="上一步" />
        <button-custom v-if="stepValue==1" class="button" @click.native="toNext" title="下一步" />
        <button-custom
          v-if="rowDataLength == 0 && stepValue == 2"
          class="button"
          @click.native="toSubmit()"
          title="确认"
        />
        <button-custom
          v-if="rowDataLength != 0 && stepValue == 2"
          class="button"
          @click.native="toEdit"
          title="编辑"
        />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import firstPanel from "_c/duno-m/createTaskConfig/components/panel/first.vue";
import secondPanel from "_c/duno-m/createTaskConfig/components/panel/second.vue";
import thirdPanel from "_c/duno-m/createTaskConfig/components/panel/third.vue";
// import steps from '_c/duno-m/stepsConfig'
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
  name: "createTask",
  components: {
    buttonCustom,
    // steps,
    firstPanel,
    secondPanel,
    thirdPanel
  },
  data() {
    return {
      planId: '',
      dataObjList: {
        "0": [],
        "1": [],
        "2": []
      },
      visibleOption: false,
      stepValue: 1
    };
  },
  watch: {
    rowData:{
      handler(now){
          if(Object.keys(now).length){
              this.planId = now['planId']
              // this.planId = now['']
          }
      },
      deep: true
    },
    visible(now) {
      this.visibleOption = now;
      this.stepValue = 1;
    },
    stepValue(now, old) {
      this.dataObjList[old - 1] = this.$refs[`panel[${old - 1}]`].$data;
      this.$forceUpdate();
    }
  },
  props: {
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
    choseType(value) {
      console.log(value);
      this.getType = value;
      if (this.getType != "4") {
        this.$emit("gettype", this.getType);
        return;
      }
    },
    toEdit() {
      this.toSubmit("/lenovo-plan/api/environment/edit");
    },
    toSubmit(url) {
      let obj = {};
      var taskName = this.$refs["panel[0]"].form.taskName;
      var oldList = this.$refs["panel[1]"].dataList2.length;
      var that = this;
      console.log(this.$refs["panel[1]"].dataList2);
      var query = {
        planType: "4",
        // planName: "",
        deviceJson: []
      };
      var deviceJson = [];
      var list = this.$refs["panel[1]"].dataList2;
      for (var i = 0; i <= list.length - 1; i++) {
        for (var j = 0; j <= list[i].presets.length - 1; j++) {
          var arr = [];
          for (var t = 0; t <= list[i].presets[j].listArr.length - 1; t++) {
            if (
              list[i].presets[j].listArr[t].isCheck != undefined &&
              list[i].presets[j].listArr[t].isCheck != null &&
              list[i].presets[j].listArr[t].isCheck == true
            ) {
              arr.push(list[i].presets[j].listArr[t].value);
            }
          }
          if (list[i].presets[j].isCheck) {
            if (
              list[i].presets[j].time == undefined ||
              list[i].presets[j].time == null
            ) {
              this.$message("预置位时间不能为空");
              return;
            }
           /* if(!arr.join(",").length){
                this.$message("请选择");
                return;
            }*/
            deviceJson.push({
              monitorDeviceId: list[i].monitorDeviceId,
              monitorDeviceName: taskName,
              monitorDeviceType: "3",
              alarmValue: arr.join(","),
              psIndex: list[i].presets[j].psIndex,
              startTime: list[i].presets[j].time[0],
              endTime: list[i].presets[j].time[1]
            });
          }
        }
      }
      query.deviceJson = deviceJson;
      query.planName = taskName;
      try {
        let link = "/lenovo-plan/api/environment/planCreate"
        if(url){
            link = url
            query.planId = this.planId
        }
        postAxiosData(link, query).then(
          res => {
            if (res.code!= 200 && !res.data) {
              this.$message(res.msg);
            } else {
               this.$message(res.msg);
              that.cancel();
              
            }
          }
        );
      } catch {err}{
         this.$message(未知错误);
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
      this.stepValue++;
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

