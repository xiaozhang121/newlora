<template>
  <div class="createTask" v-if="visibleOption">
    <el-dialog
      v-dialogDrag
      :model="true"
      class="elDialogClass"
      :visible.sync="visibleOption"
      width="700px"
      center
      @close="handleClose"
    >
      <div slot="title">创建新的任务配置</div>
      <div class="main">
        <!-- <div class="steps">
          <steps :step="stepValue" />
        </div>-->
        <first-panel
          :rowData="rowData"
          ref="panel[0]"
          v-show="stepValue == 1"
          class="panel"
          @getchoseType="choseType"
          :type="type"
        />

        <second-panel
          :rowData="rowData"
          :list="dataObjList['0']"
          ref="panel[1]"
          v-show="stepValue == 2"
          class="panel"
        />

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
          title="编辑"
        />
      </span>
    </el-dialog>
  </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import firstPanel from "_c/duno-m/createTask2/components/panel/first.vue";
import secondPanel from "_c/duno-m/createTask2/components/panel/second.vue";
import secondPanelpro from "_c/duno-m/createTask2/components/panel/second.vue";
import thirdPanel from "_c/duno-m/createTask2/components/panel/third.vue";
import steps from "_c/duno-m/steps";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
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
      getType: 0
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
    Dateformate(fmt, date) {
      let ret;
      let opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
    choseType(value) {
      console.log(value);
      this.getType = value;
      if (this.getType != "5") {
        this.$emit("gettype", this.getType);
        return;
      }
    },
    toEdit() {
      this.toSubmit("/lenovo-plan/api/plan/edit");
    },
    toSubmit() {
      var deviceJson = [];
      var datalist = this.$refs["panel[0]"].$data.dataList;
      for (var i = 0; i <= datalist.length - 1; i++) {
        for (var j = 0; j <= datalist[i].children.length - 1; j++) {
          if (datalist[i].children[j].isCheck) {
            deviceJson.push(datalist[i].children[j]);
          }
        }
      }

      var handheldInfraredDevices = [];
      this.$refs["panel[1]"].dataList.map(res => {
        handheldInfraredDevices.push(res.id);
      });
      var query = {
        planDate: {
          planCycle: this.$refs["panel[2]"].$data.value,
          value: [
            {
              startTime: this.Dateformate(
                "HH:MM:SS",
                this.$refs["panel[2]"].$data.value3
              )
            }
          ]
        },
        planType: 5,
        planName: this.$refs["panel[0]"].$data.form.taskName,
        handheldInfraredDevices: handheldInfraredDevices.join(","),
        deviceJson: deviceJson,
        startTime: this.Dateformate(
          "YYYY-mm-dd",
          this.$refs["panel[2]"].$data.value3
        )
      };
      var that=this
      postAxiosData("/lenovo-plan/api/handheldinfrared/planCreate", query).then(
        res => {
          debugger
          console.log(res);
          if (res.errorCode != 200||res.code!=200) {
            this.$message(res.msg);
              that.cancel();
          }
        }
      );
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

