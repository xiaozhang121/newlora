<template>
  <div class="chosenList">
    <div class="title">
      <div>
        <span style="font-weight:700;font-size:18px">{{ title }}</span>
        <el-input   class="inputContent" placeholder="请输入内容" v-show="isInput" v-model="input" @input="inputChange" clearable><template slot="prepend"><i class="iconfont icon-sousuo"></i></template></el-input>
      </div>
      <span class="last" v-if="control" @click="toHide()">
        收起
        <i class="iconfont icon-xiala" :class="{'turnA': !collapse}"></i>
      </span>
    </div>
    <el-collapse-transition>
      <div class="contain" :class="{'overShow': dataLength>6}" v-show="collapse">
        <div v-for="(item,index) in dataList" class="outBox">
          <div class="item" :key="index">
            <el-checkbox v-model="item['isCheck']" @change="change(-1, index)">{{ item['title'] }}</el-checkbox>
            <template v-if="item['presetName']!=undefined&&item['presetName']!=null">
              <span class="datapick">
                <el-time-picker
                  is-range
                  v-model="item['time']"
                  range-separator="-"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  value-format="HH:mm:ss"
                  placeholder="选择时间范围"
                ></el-time-picker>
              </span>
            </template>
          </div>
          <div class="demo">
            <div v-for="(val,i) in item['listArr']" class="innerbox">
              <div class="item item2" :key="i">
                <el-checkbox v-model="val['isCheck']" @change="change(val,index)">{{ val['title'] }}</el-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-collapse-transition>
  </div>
</template>
<script>
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
  data() {
    return {
      title: "选择动态环境摄像头",
      control: false,
      dataList: [],
      collapse: true,
      checkList: [],
      alarmValue: "",
      input:'',
      alarmList: [
        { title: 123, id: "123", isCheck: false },
        { title: 123, id: "123", isCheck: true }
      ],
      listArr: []
    };
  },
  props: {
    isInput: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    titleOption: {
      type: String,
      default: ""
    },
    controlOption: {
      type: Boolean,
      default: () => {
        return false;
      }
    },
    dataListOption: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    dataList: {
      handler(now) {},
      immediate: true,
      deep: true
    },
    titleOption: {
      handler(now) {
        if (now) this.title = now;
      },
      immediate: true
    },

    controlOption: {
      handler(now) {
        if (now) this.control = now;
      },
      immediate: true
    },
    dataListOption: {
      handler(now) {
        //////错误内容///////////////
        // if (now.length) 
        this.dataList = now;
        var data = [];

        if (this.dataList.length > 0) {
          for (var i = 0; i <= this.dataList.length - 1; i++) {
            this.dataList["time"] = "";
            this.dataList["startTime"] = "";
            this.dataList["endTime"] = "";
            if (
              this.dataList[i].listArr != undefined &&
              this.dataList[i].listArr.length > 0
            ) {
              for (var j = 0; j <= this.dataList[i].listArr.length - 1; j++) {
                this.dataList[i].listArr[j].title = this.dataList[i].listArr[
                  j
                ].label;
              }
            }
          }
        }

        // 这datalist有2个
        this.$forceUpdate();
      },
      immediate: true
    }
  },
  computed: {
    dataLength() {
      let count = 0;
      this.dataList.forEach((item, index) => {
        if (item["monitorDeviceType"] == 1 && item["isCheck"]) {
          count += 3;
        } else {
          count++;
        }
      });
      return count;
    }
  },
  methods: {
    inputChange(item){
      this.$emit("inputChange", item);
    },
    change(val, i) {
      if(val == -1){
        let target = this.dataList[index]
        let data = this.dataList[index].children
        if(target.isCheck){
          data.map(item=>{
            item['isCheck'] = true
          })
        }else{
          data.map(item=>{
            item['isCheck'] = false
          })
        }
      }else{
        if (val.value == 0) {
          if (val.isCheck) {
            this.dataList[i].listArr.map(res => {
              res.isCheck = true;
            });
          }
        }else{
          this.dataList[i].listArr[0].isCheck=false;
        }
      }
      this.$forceUpdate();
      this.$emit("change", this.dataList);
    },
    getAlarmList() {
      var that = this;
      postAxiosData("/lenovo-plan/api/list/person-alarm-type").then(res => {
        that.checkList = res.data;
        that.checkList.unshift({
          label: "全选",
          value: "0",
          selected: "0",
          group: null
        });
        for (var i = 0; i <= that.checkList.length - 1; i++) {
          that.checkList[i].title = that.checkList[i].label;
          that.checkList[i].isCheck = false;
        }
      });
    },

    toHide() {
      this.collapse = !this.collapse;
    },
    onChangeTime() {}
  },
  created() {
    var that = this;
    this.getAlarmList();
  }
};
</script>

<style lang="scss" >
.chosenList .contain .outBox:nth-of-type(2n) .item{
  background: none;

}
.chosenList .contain .outBox:nth-of-type(2n) .innerbox:nth-of-type(2n+1){
  background: #c7c7c7
}
.chosenList .contain .outBox:nth-of-type(2n+1) .innerbox:nth-of-type(2n+1) .item{
  background: #e0e0e0
}



.datapick {
  float: right;
  input {
    background: none;
  }
  .el-date-editor--daterange.el-input,
  .el-date-editor--daterange.el-input__inner,
  .el-date-editor--timerange.el-input,
  .el-date-editor--timerange.el-input__inner {
    width: 170px;
  }
  .el-range-editor--small .el-range-input {
    width: 55px;
  }
  .el-input__inner {
    background: none;
    border: 0;
  }
  input::-webkit-input-placeholder {
    color: #000 !important;
    text-decoration: #000;
  }
}
.chosenList::-webkit-scrollbar {
  display: none;
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 10px;
}

.chosenList::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
  background: #979797 !important;
}
.chosenList::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
  border-radius: 10px;
  background: #e0e0e0 !important;
}
</style>
<style lang="scss">
.chosenList {
  overflow-y: scroll;
}
.inputContent{
  .el-input__clear{
    display: none !important;
  }
  input{
    border-radius: 20px;
    text-align: center;
    padding: 0;
    padding-left: 28px;
    width: 144px;
  }
  .el-input-group__prepend{
    position: absolute;
    background: transparent;
    border: none;
    top: 7px;
    left: -10px;
  }
}
.item2 {
  margin-left: 10px;
}
.chosenList {
  height: 100%;

  .turnA {
    transform: rotate(180deg);
    position: relative;
    top: -2px;
  }
  .title {
    display: flex;
    justify-content: space-between;
    span.last {
      color: #999999;
      margin-right: 10px;
      cursor: pointer;
      i {
        display: inline-block;
        font-size: 13px;
        color: #474747;
        margin-left: 7px;
        transition: all 0.3s;
      }
    }
  }
  .contain {
    max-height: 256px;
    &.overShow {
      overflow-y: auto;
    }
  }
  ::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 10px;
  }
  ::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
    background: #979797 !important;
  }
  ::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
    border-radius: 10px;
    background: #e0e0e0 !important;
  }
  .contain {
    .item:nth-child(2n + 1) {
      background: #c7c7c7;
    }
  }
  .item {
    padding: 0 10px;
    height: 43px;
    &.child {
      padding-left: 34px;
    }
  }
  .grey {
    background: #c7c7c7;
  }
}
.el-time-spinner__item.active:not(.disabled){
  color: #fff;
}
</style>