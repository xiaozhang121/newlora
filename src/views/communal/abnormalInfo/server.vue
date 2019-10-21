<template>
  <div class="duno-server">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="title">服务器</div>
    <!-- <duno-main class="dunoMain"> -->
    <div class="content">
      <div class="left">
        <div class="select">
          <div class="select-fr">{{selectTitle}}</div>
          <el-dropdown trigger="click">
            <span class="el-dropdown-link">
              （{{selectHost}}{{tabdata.length}}）
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in hostData"
                :key="index"
                @click.native="selectType(item,index)"
              >{{ item['name'] }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="leftTab">
          <div
            class="tabList active"
            @click="handleShow(item,index)"
            v-for="(item,index) in tabdata"
            :key="index"
          >
            <div>
              <span
                class="tabFirst white"
                :class="{blue:item.serviceStatus==0,gray:item.serviceStatus==1}"
              ></span>
              <span
                class="tabSecond"
                :class="{active:active===index,red:item.serviceStatus==1}"
              >{{item.realName}}</span>
            </div>
            <i v-show="active===index" class="el-icon-caret-right"></i>
          </div>
        </div>
      </div>
      <div v-if="overview" class="right_all">
        <div class="tabServer">
          <div
            class="unchecked"
            :class="{selection:selection===0}"
            v-if="serve==''||serve=='0'"
            @click="selectServe(0)"
          >物理服务器</div>
          <div
            class="unchecked"
            :class="{selection:selection===1}"
            v-if="serve==''||serve=='1'"
            @click="selectServe(1)"
          >虚拟服务器</div>
        </div>
        <div>
          <div class="chartsPie">
            <dunoPie :pieData="pieData"></dunoPie>
          </div>
          <div class="btmm">
            <div class="chartsbar">
              <echartsRare :pieData="pieData" :serve="serve" ref="rare"></echartsRare>
            </div>
            <div class="serevice">
              <service :pieData="pieData" height="560px"></service>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="right_part">
        <div class="topMessage">
          <div class="fwq">
            <div class="fwq_top">
              <div>
                <i class="iconfont icon-fuwuqi1"></i>
              </div>
              <div>
                <p>{{pieData.realName}}</p>
                <p>
                  型号：
                  <span>SR650</span>
                  品牌：
                  <span>联想</span>
                </p>
              </div>
            </div>
            <div class="fwq_btm">
              <p>
                <i class="iconfont icon-fuwuqi"></i>
                虚拟服务器数量：
                <span>{{virtualData.length}}</span>
              </p>
              <p>
                <i class="iconfont icon-servise"></i>
                Service数量：
                <span>{{serviceLength}}</span>
              </p>
            </div>
          </div>
          <div class="system">
            <p>SR650 2*Intel Xeon Silver 4116 12C 85W 2.1GHz 处理器</p>
            <p>2*64GB TruDDR4 2666 MHz</p>
            <p>RAID 730-8i 2GB 闪存 PCIe 12Gb</p>
            <p>4* 1.2TB 10K 12Gbps SAS 2.5" G4HS</p>
            <p>2*ThinkSystem 2.5 英寸 5200 480GB 入门级 SATA 6Gb 热插拔固态硬盘</p>
            <p>2*千兆网口</p>
            <p>2* 750W（230/115V）白金级热插拔电源模块</p>
          </div>
        </div>
        <div class="conServer">
          <div class="server_top">
            <div
              class="unchecked"
              :class="{selection:selectPart===index}"
              @click="selectPartServe(item,index)"
              v-for="(item,index) in tabServe"
              :key="index"
            >{{item.name}}</div>
          </div>
          <div class="server_con">
            <div class="serFirst">
              <div class="serChart">
                <dunoPie :pieData="pieData" paddingBottom="60%" ref="dunoPie"></dunoPie>
              </div>
              <div class="tabSer">
                <service :pieData="pieData" @on-length="onLength" ref="dunoService" height="160px"></service>
              </div>
            </div>
            <div class="serSecond">
              <echartsRare
                ref="dunoRare"
                :pieData="pieData"
                :serve="serve"
                width="25%"
                paddingBottom="80%"
              ></echartsRare>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </duno-main> -->
  </div>
</template>
<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoPie from "_c/duno-c/dunoPie";
import service from "_c/duno-c/service";
import echartsRare from "_c/duno-c/echartsRare";
import dunoMain from "_c/duno-m/duno-main";
import DunoCharts from "_c/duno-charts/charts.vue";
import { getAxiosData, postAxiosData } from "@/api/axiosType";
export default {
  components: {
    Breadcrumb,
    dunoMain,
    dunoPie,
    DunoCharts,
    echartsRare,
    service
  },
  name: "server",
  data() {
    return {
      active: 0,
      selection: 0,
      selectPart: 0,
      overview: true,
      serve: "",
      serviceLength: "",
      selectTitle: "选择服务器",
      selectHost: "全部",
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/platformMonitor", name: "平台监控" },
        { path: "", name: "服务器" }
      ],
      pieData: {},
      tabServe: [],
      hostData: [
        {
          name: "全部",
          hostType: "",
          serve: ""
        },
        {
          name: "主机",
          hostType: "0",
          serve: "0"
        },
        {
          name: "虚拟机",
          hostType: "1",
          serve: "1"
        }
      ],
      virtualData: [],
      tabdata: []
    };
  },
  methods: {
    onLength(length) {
      this.serviceLength = length;
    },
    getVirtual() {
      let url = "/lenovo-mon/api/monitoring/host/zabbix/host/virtual";
      let query = {
        hostId: this.pieData["hostId"]
      };
      this.tabServe = [];
      this.tabServe.push({
        name: "物理服务器",
        hostid: this.pieData["hostId"]
      });
      getAxiosData(url, query).then(res => {
        this.virtualData = res.data;
        let data = res.data;
        data.forEach((item, index) => {
          let obj = {
            name: `虚拟服务器${index + 1}`,
            hostid: item["hostid"]
          };
          this.tabServe.push(obj);
        });
      });
    },
    getService(item) {
      let url = "/lenovo-mon/api/monitoring/host/zabbix/getService";
      let query = {
        hostType: item["hostType"]
      };
      getAxiosData(url, query).then(res => {
        this.tabdata = res.data;
        let obj = {
          realName: "总览",
          hostId: "",
          hType: "",
          serviceStatus: ""
        };
        this.tabdata.unshift(obj);
      });
    },
    selectType(item, index) {
      this.selectHost = item["name"];
      this.active = 0;
      this.overview = true;
      this.pieData = {
        hostId: "",
        htype: item["hostType"]
      };
      this.serve = item["serve"];
      if (index == 1) {
        this.selection = 0;
        this.serve = "0";
      } else if (index == 2) {
        this.selection = 1;
        this.serve = "1";
      } else if (index == 0) {
        this.selection = 0;
        this.serve = "";
      }
      this.getService({ hostType: item["hostType"] });
    },
    handleShow(item, index) {
      this.pieData = item;
      this.active = index;
      this.selectPart = 0;
      if (index == 0) {
        this.overview = true;
      } else {
        this.overview = false;
        this.getVirtual();
      }
    },
    selectServe(index) {
      this.selection = index;
      this.pieData = {
        hostId: "",
        htype: index
      };
    },
    selectPartServe(item, index) {
      this.selectPart = index;
      this.$refs.dunoPie.getPie();
      this.$refs.dunoService.getConsul();
      this.$refs.dunoRare.getBar();
    }
  },
  mounted() {
    this.getService({ hostType: "" });
  }
};
</script>
<style lang="scss" scoped>
.duno-server {
  height: 100%;
  overflow: hidden;
  .breadcrumb {
    .duno-breadcrumb {
      padding-top: 0;
    }
  }
  .title {
    margin: 10px 0;
    color: #fff;
    font-size: 20px;
    span {
      font-size: 16px;
    }
  }
  // .dunoMain {
  //   height: inherit;
  //   .dunoMain_nr {
  .content {
    width: 100%;
    height: calc(100vh - 80px);
    display: flex;
    justify-content: flex-start;
    .left {
      width: 300px;
      overflow-y: auto;
      padding: 0 20px 20px 20px;
      background-color: #0f222f;
      .select {
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .select-fr {
          font-size: 16px;
          color: #fff;
        }
        .el-dropdown {
          cursor: pointer;
          color: #fff;
          i {
            font-weight: 600;
          }
        }
      }
      .leftTab {
        overflow-y: auto;
        & > div:nth-child(odd) {
          background-color: #203e52;
        }
      }
      .tabList {
        padding-left: 10px;
        padding-right: 20px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;
        & > div {
          display: flex;
          align-items: center;
        }
        .tabFirst {
          display: block;
          height: 16px;
          width: 16px;
          border-radius: 50%;
          margin-right: 20px;
        }
        .white {
          background: #fff;
        }
        .blue {
          background: #7ed321;
        }
        .gray {
          background: #9b9b9b;
        }
        .tabSecond {
          color: #fff;
          font-size: 14px;
          padding-right: 5px;
        }
        .red {
          color: #aaaaaa;
        }
        .tabSecond:hover {
          color: #3ed9c1;
        }
        i {
          color: #3ed9c1;
        }
        .active {
          color: #3ed9c1;
        }
      }
    }
    .right_all {
      border: 2px solid #204f57;
      flex: 1;
      height: 100%;
      background-color: #041a27;
      margin-left: 10px;
      display: flex;
      justify-content: flex-start;
      & > div:nth-child(2) {
        flex: 1;
      }
      .chartsPie {
        width: 100%;
      }
      .btmm {
        display: flex;
        justify-content: flex-start;
        .chartsbar {
          width: 70%;
        }
        .serevice {
          width: 30%;
          .tabData {
            height: 580px;
          }
        }
      }
      .tabServer {
        width: 40px;
        margin-top: -2px;
        margin-left: -2px;
        & > div {
          font-weight: 600;
          padding: 20px 10px;
          text-align: center;
          cursor: pointer;
          box-sizing: border-box;
        }
        .selection {
          color: #3bd7c0 !important;
          border: 2px solid #27746b !important;
        }
        .unchecked {
          color: #8d979d;
          border: 2px solid #9d9ea0;
        }
      }
    }
    .right_part {
      flex: 1;
      height: 100%;
      margin-left: 10px;
      .topMessage {
        display: flex;
        justify-content: space-between;
        background-color: #041a27;
        border: 2px solid #204f57;
        color: #fff;
        padding: 20px;
        .fwq {
          .fwq_top {
            display: flex;
            justify-content: flex-start;
            i {
              font-size: 30px;
            }
            & > div:nth-child(2) {
              padding-top: 5px;
              padding-left: 10px;
              & > p:nth-child(1) {
                font-size: 20px;
              }
              & > p:nth-child(2) {
                margin-top: 10px;
                span {
                  padding-right: 50px;
                }
              }
            }
          }
          .fwq_btm {
            margin-top: 10px;
            p {
              padding-left: 10px;
              i {
                padding-right: 5px;
              }
            }
          }
        }
        .system {
          font-size: 12px;
          text-align: right;
        }
      }
      .conServer {
        margin-top: 10px;
        border: 2px solid #204f57;
        .server_top {
          display: flex;
          justify-content: flex-start;
          background-color: #041a27;
          color: #fff;
          & > div {
            text-align: center;
            cursor: pointer;
            padding: 8px 40px;
            margin-top: -2px;
            margin-left: -2px;
          }
          .selection {
            color: #3bd7c0 !important;
            border: 2px solid #27746b !important;
          }
          .unchecked {
            color: #8d979d;
            border: 2px solid #9d9ea0;
          }
        }
        .server_con {
          background-color: #041a27;
          .serFirst {
            display: flex;
            justify-content: flex-start;
            height: 50%;
            .serChart {
              width: 75%;
            }
            .tabSer {
              width: 25%;
            }
          }
        }
      }
    }
  }
  //   }
  // }
}
</style>
