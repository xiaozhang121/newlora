<template>
  <historical-documents
    class="popuponeinfoBox"
    width="400px"
    :title="itemData.powerDeviceName"
    :isShowTab="false"
    :dialogTableVisible="visible"
    @close="onClose"
  >
    <div class="popuponeinfo">
      <el-row>
        <!-- <el-col :span="24">
          <p class="itemTitle">
            设备名称：
            <span>{{itemData.powerDeviceName}}</span>
          </p>
        </el-col>-->
        <el-col :span="24">
          <p class="itemTitle">
            当前状态：
            <span>{{itemData.status}}</span>
          </p>
        </el-col>
        <el-col :span="24">
          <p class="itemTitle">
            缺陷评估：
            <span
              :class="[itemData.alarmLevel == '1'?'general':(itemData.alarmLevel == '2'?'warning':'alarm')]"
            >{{itemData.alarmLevelName}}</span>
          </p>
        </el-col>
        <el-col :span="12">
          <p class="itemTitle">
            <span>{{itemData.alarmTime}}</span>
          </p>
        </el-col>
      </el-row>
      <div>
        <div class="imgBox">
          <img
            v-if="itemData['alarmFileType'] == 1"
            :src="itemData.alarmFileAddress"
            style="width: 100% !important;"
          />
          <video-player
            v-else-if="itemData['alarmFileType'] == 2"
            class="vjs-custom-skin realtime_video"
            :options="{
            width:160,
            height: 120,
            sources: [{
              type: 'rtmp/flv',
              src: itemData['alarmFileAddress']
            }],
            techOrder: ['flash'],
            autoplay: true,
            controls: false
            }"
          ></video-player>
          <!--<p class="itemTitle itemBottomTitle">位置：{{itemData.deviceAddress}}</p>-->
        </div>
      </div>
      <el-row>
        <el-col :span="24">
          <p class="itemTitle">
            来源：
            <span style="color: #366590">{{itemData.source}}</span>
          </p>
        </el-col>
      </el-row>
      <el-row style="position: relative; top: -12px; margin-top: 20px">
        <!--<el-col :span="15"><h5 class="itemTitle time">{{itemData.alarmTime}}</h5></el-col>-->
        <el-col :span="17">
          <div class="buttonAll">
            <el-button type="info" round @click="restoration('1')" style="margin-right: 25px">复归</el-button>
            <el-button type="success" round @click="restoration('0')">备注</el-button>
          </div>
        </el-col>
      </el-row>
      <div class="remarks">
        <el-dialog
          title="备注"
          :center="true"
          top="20vh"
          :visible.sync="dialogVisible"
          :modal="false"
          width="30%"
        >
          <el-input
            type="textarea"
            placeholder="请输入备注内容"
            :autosize="{ minRows: 3}"
            v-model="textarea"
          ></el-input>
          <span slot="footer" class="dialog-footer">
            <button-custom class="button" @click.native="dialogVisible = false" title="取消" />
            <button-custom class="button" @click.native="clickRemarks" title="确定" />
          </span>
        </el-dialog>
      </div>
    </div>
  </historical-documents>
</template>
<script>
import HistoricalDocuments from "_c/duno-c/HistoricalDocuments";
import buttonCustom from "_c/duno-m/buttonCustom";
import videojs from "video.js";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import "videojs-flash";
import { truncate } from "fs";
import SWF_URL from "videojs-swf/dist/video-js.swf";
videojs.options.flash.swf = SWF_URL;
export default {
  name: "popuponeinfo",
  components: { HistoricalDocuments, videoPlayer, buttonCustom },
  data() {
    return {
      itemData: {},
      textarea: "",
      dialogVisible: false
    };
  },
  props: {
    itemDataOption: {},
    itemId: {
      type: String | Number
    },
    visible: {
      type: Boolean,
      default: () => {
        return false;
      }
    }
  },
  watch: {
    itemDataOption: {
      handler(now) {
        this.itemData = now;
        this.$forceUpdate();
        /*  if(now){
                this.getData()
            }*/
      },
      deep: true,
      immediate: true
    },
    visible(now) {
      /*  if (now)
          this.getData()*/
    }
  },
  created() {
    // if (this.visible) this.getData()
  },
  methods: {
    restoration(type) {
      if (type == "0") {
        this.dialogVisible = true;
      }
      this.$store.state.user.isAlarm = false;
      console.log(type == "1" ? "复归" : "备注");
      // const url = type == '1' ? "/lenovo-alarm/api/alarm/reset" : '/lenovo-alarm/api/alarm/save'
      const url = "/lenovo-alarm/api/alarm/deal";
      const query = {
        alarmId: this.itemData.alarmId,
        type: type
      };
      postAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          return this.$message.error(res.msg);
        }
        this.$emit("onRestoration", type);
        this.onClose(false);
        this.$message.success(res.msg);
      });
    },
    getData() {
      const that = this;
      const url = "/lenovo-alarm/api/alarm/unhandel-list";
      const query = {
        pageIndex: 1,
        pageRows: 1,
        isDeal: "0",
        powerDeviceId: that.itemData["powerDeviceId"]
      };
      getAxiosData(url, query).then(res => {
        // if (res.code !== 200 || (res.data.tableData && res.data.tableData.length == 0)) {
        /* that.onClose(false)
          return that.$message.error(res.msg)*/
        // }
        // that.itemData = res.data.tableData[0]
        that.itemData = res.data[0];
      });
    },
    onClose(data) {
      this.$emit("onClose", data);
    },
    clickRemarks() {
      const that = this;
      that.dialogVisible = false;
      let query = {
        alarmId: that.remarkData.alarmId,
        type: "2",
        content: that.textarea
      };
      dealRemarks(query).then(res => {
        if (res.data.isSuccess) that.$message.success(res.msg);
        else that.$message.error(res.msg);
        this.$emit("handleListData");
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.popuponeinfo {
  font-size: 20px;
  font-weight: normal;
  .itemTitle {
    color: #fff;
    font-size: 18px;
    padding: 5px 0;
    .alarm {
      color: #d7203f;
      font-size: 22px;
    }
    .warning {
      color: #ff8300;
      font-size: 22px;
    }
    .general {
      color: #ffe828;
      font-size: 22px;
    }
  }
  .itemBottomTitle {
    font-size: 16px !important;
    padding: 5px 10px;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .time {
    font-size: 16px;
  }
  .imgBox {
    width: 100%;
    height: 0;
    margin: 20px auto;
    padding-bottom: 100%;
    position: relative;
    img {
      width: 100%;
      left: 0;
      bottom: 0px;
      position: absolute;
    }
  }
  .buttonAll {
    text-align: right;
  }
}
</style>
<style lang="scss">
.popuponeinfoBox {
  .realtime_video > div {
    transform: scale(2.2095, 2.8) !important;
  }
}
.popuponeinfoBox .el-dialog__body {
  padding: 0 20px;
}
.remarks {
  background-color: #333;
  .dialog-footer {
    color: #ffffff;
    display: flex;
    justify-content: center;
    .button {
      height: 37px;
      line-height: 31px;
      font-size: 14px;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
}
</style>
