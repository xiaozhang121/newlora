<template>
  <div class="taskPanel">
    <el-form :model="form" label-width="80px" >
      <el-form-item label="任务名称">
        <el-input v-model="form.taskName" @input="checkSpecial"></el-input>
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="form.taskKind" @change="onChange">
          <el-option
            v-for="(item, index) in taskKindList"
            :key="index"
            :label="item['label']"
            :value="item['value']"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-checkbox  @change="chosenAll" class="selectAll">全选</el-checkbox>
      <!--<a href="javascript:void(0)" class="selectAll">全选</a>-->
      <chosen-list :isOver='isOver' :dataListOption="dataList" ref="choseChild" :isInput="true" @inputChange="inputChange" />
    </el-form>
  </div>
</template>
<script>
import chosenList from "_c/duno-m/chosenList";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
  name: "taskPanel",
  components: {
    chosenList
  },
  props: {
    rowData: {
      type: Object,
      default: () => {
        return {};
      }
    },
    list: {}
  },
  computed: {
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
    dataList: {
      handler(now) {
        if (this.rowDataLength && !("isChange" in this.rowData)) {
          now.forEach((item, index) => {
            if (
              !item["isCheck"] &&
              this.Ids.indexOf(item["powerDeviceId"]) > -1
            ) {
              this.rowData["devicemonitors"].map((_item, _index) => {
                if (_item["powerDeviceId"] == item["powerDeviceId"]) {
                  _item["powerDeviceId"] = "";
                }
              });
            }
          });
        }
      },
      deep: true
    },
    list: {
      handler(now) {},
      deep: true
    }
  },
  data() {
    return {
      form: {
        taskName: "",
        taskKind: ""
      },
      dataList: [],
      infoData: [],
      taskKindList: [],
      choseType:-1,
      isOver:true
    };
  },
  methods: {
    chosenAll(value){
        this.dataList.map((item, index)=>{
          item['isCheck'] = value
        })
        this.$forceUpdate()
    },
    inputChange(item) {
        let data = this.infoData;
        let selectData = [];
        console.log(data)
        if (item != "") {
            data.forEach(el => {
            if (el["title"].indexOf(item) > -1) {
                selectData.push(el);
            }
            });
            this.dataList = selectData;
        } else {
            this.dataList = this.infoData;
        }
    },
    onChange(value) {
       this.$emit('getchoseType',value)
        this.choseType=value;
        if(value!='1'){
          this.isOver = false;
        }else{
          this.isOver = true;
        }
      if (value) {
        const that = this;
        let query = { pageIndex: 1, pageRows: 888888 };
        query["planType"] = value;
        getAxiosData("/lenovo-plan/api/device/multi", query).then(res => {
          let data = res.data.tableData;
          let info = data.map(item => {
            let obj = {
              title: item["deviceName"],
              deviceId: item["deviceId"],
              deviceTypeId: item["deviceTypeId"],
              deviceType: item["deviceType"],
              isCheck: false
            };
            return obj;
          });
          this.$forceUpdate();
          this.rowData["isChange"] = true;
          this.dataList = info;
          this.infoData = info;
        });
      } else {
        const that = this;
        let query = { pageIndex: 1, pageRows: 888888 };
        query["planType"] = value;
        getAxiosData("/lenovo-plan/api/environment/list/camera", query).then(
          res => {
            let data = res.data;
            let info = data.map(item => {
              let obj = {
                title: item["monitorDeviceName"],
                deviceId: item["monitorDeviceId"],
                isCheck: false
              };
              return obj;
            });
            this.$forceUpdate();
            this.rowData["isChange"] = true;
            this.dataList = info;
            this.infoData = info;
          }
        );
      }
      this.$refs.choseChild.onClear()
    },
    initData() {
      const that = this;
      postAxiosData("/lenovo-plan/api/list/plan-type", {position: 3}).then(res => {
        this.taskKindList = res.data;
        if (!this.rowDataLength) that.form.taskKind = res.data[0].value;
        this.$forceUpdate();
        let query = { pageIndex: 1, pageRows: 888888 }; 
        query["planType"] = that.form.taskKind;
        getAxiosData("/lenovo-plan/api/device/multi", query).then(res => {
          let data = res.data.tableData;
          let info = data.map(item => {
            let obj = {
              title: item["deviceName"],
              deviceId: item["deviceId"],
              deviceTypeId: item["deviceTypeId"],
              deviceType: item["deviceType"],
              isCheck: false
            };
            return obj;
          });

          this.$forceUpdate();
          if (that.rowDataLength && !("isChange" in this.rowData)) {
            that.form["taskName"] = that.rowData["planName"];
            that.form["taskKind"] = that.rowData["planType"];
            let arrd = that.rowData["devicemonitors"];
            for (let i = 0; i < arrd.length; i++) {
              for (let j = 0; j < info.length; j++) {
                if (arrd[i]["powerDeviceId"] == info[j]["deviceId"]) {
                  info[j]["isCheck"] = true;
                  break;
                }
              }
            }
          }
          this.dataList = info;
          this.infoData = info;
        });
      });
    },
    checkSpecial(value) {
      let myreg =
        "[`_+@~!#$^&*()=|{}':;',\\[\\].<>/?~！%#￥……&*（）|{}【】‘；：”“'。，'、？]‘'";
      for (let i = 0; i < value.length; i++) {
        if (myreg.indexOf(value[i]) != -1) {
          this.form.taskName = value
            .replace(
              /[`~!！@#$%^&*()_\-\+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*——（）\-+={}|《》？：“”【】、；‘’，。、]/g,
              ""
            )
            .replace(/\s/g, "");
          this.$message({
            message: "不能包含特殊字符，请重新输入",
            type: "warning"
          });
        }
      }
      if(value.length>20){
        this.$message({
            message: "字符长度超出限制",
            type: "warning"
          });
          this.form.taskName=value.slice(0,20)
      }
    },
  },
  mounted() {
    this.initData();
  }
};
</script>
<style lang="scss">
.taskPanel {
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
