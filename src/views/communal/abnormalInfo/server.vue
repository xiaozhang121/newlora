<template>
  <div class="duno-server">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div class="title">
      服务器
      <span>(40)</span>
    </div>
    <duno-main class="dunoMain">
      <div class="content">
        <div class="left">
          <div
            class="tabList active"
            @click="handleShow(index)"
            v-for="(item,index) in tabdata"
            :key="index"
          >
            <span
              class="tabFirst white"
              :class="{blue:item.active==0,gray:item.active==1,red:item.active==2,}"
            ></span>
            <span class="tabSecond" :class="{active:active===index}">{{item.name}}</span>
            <i v-show="active===index" class="el-icon-caret-right"></i>
          </div>
        </div>
        <div v-if="overview" class="right_all">
          <div class="tabServer">
            <div
              class="unchecked"
              :class="{selection:selection===index}"
              @click="selectServe(index)"
              v-for="(item,index) in tabServe"
              :key="index"
            >{{item.name}}</div>
          </div>
          <div>
            <div class="chartsPie">
              <dunoPie></dunoPie>
            </div>
            <div class="btmm">
              <div class="chartsbar">
                <echartsRare ref="rare"></echartsRare>
              </div>
              <div class="serevice">
                <service height="560px"></service>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="right_part">
          <div class="topMessage">
            <div class="fwq">
              <div class="fwq_top">
                <div>
                  <i class="iconfont icon-zuoyoubuju"></i>
                </div>
                <div>
                  <p>FWQ-001-识别</p>
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
                  <span>2</span>
                </p>
                <p>
                  <i class="iconfont icon-servise"></i>
                  Service数量：
                  <span>2</span>
                </p>
              </div>
            </div>
            <div class="system">
              <p>春江潮水连海平，海上明月共潮生。</p>
              <p>滟滟随波千万里，何处春江无月明！</p>
              <p>江流宛转绕芳甸，月照花林皆似霰。</p>
              <p>空里流霜不觉飞，汀上白沙看不见。</p>
              <p>江天一色无纤尘，皎皎空中孤月轮。</p>
              <p>江畔何人初见月？江月何年初照人？</p>
              <p>人生代代无穷已，江月年年只相似</p>
              <p>不知江月待何人，但见长江送流水。</p>
            </div>
          </div>
          <div class="conServer">
            <div class="server_top">
              <div
                :class="{selectPart:selectPart===index}"
                @click="selectPartServe(index)"
                v-for="(item,index) in tabServe"
                :key="index"
              >{{item.name}}</div>
            </div>
            <div class="server_con">
              <div class="serFirst">
                <div class="serChart">
                  <dunoPie paddingBottom="60%"></dunoPie>
                </div>
                <div class="tabSer">
                  <service height="160px"></service>
                </div>
              </div>
              <div class="serSecond">
                <echartsRare width="25%" paddingBottom="80%" ref="rare"></echartsRare>
              </div>
            </div>
          </div>
        </div>
      </div>
    </duno-main>
  </div>
</template>
<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import dunoPie from "_c/duno-c/dunoPie";
import service from "_c/duno-c/service";
import echartsRare from "_c/duno-c/echartsRare";
import dunoMain from "_c/duno-m/duno-main";
import DunoCharts from "_c/duno-charts/charts.vue";
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
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/platformMonitor", name: "平台状态" },
        { path: "", name: "服务器" }
      ],
      tabServe: [
        {
          name: "物理服务器"
        },
        {
          name: "虚拟服务器"
        }
      ],
      tabdata: [
        {
          name: "总览"
        },
        {
          active: 0,
          name: "FWQ-001-识别"
        },
        {
          active: 1,
          name: "FWQ-001-视频流"
        },
        {
          active: 2,
          name: "FWQ-001-表计数据"
        }
      ]
    };
  },
  methods: {
    handleShow(index) {
      this.active = index;
      if (index == 0) {
        this.overview = true;
      } else {
        this.overview = false;
      }
    },
    selectServe(index) {
      this.selection = index;
    },
    selectPartServe(index) {
      this.selectPart = index;
    }
  }
};
</script>
<style lang="scss" scoped>
.duno-server {
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
  .dunoMain {
    height: inherit;
    .dunoMain_nr {
      .content {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        .left {
          width: 250px;
          height: 100%;
          padding-top: 2%;
          .tabList {
            padding-left: 10%;
            height: 50px;
            display: flex;
            align-items: center;
            cursor: pointer;
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
            .red {
              background: #d0021b;
            }
            .tabSecond {
              padding-right: 5px;
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
          flex: 1;
          height: 100%;
          background-color: #041a27;
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
            margin-left: 5px;
            & > div {
              font-weight: 600;
              padding: 20px 10px;
              text-align: center;
              margin-top: 20px;
              cursor: pointer;
              box-sizing: border-box;
            }
            .selection {
              color: #3bd7c0 !important;
              border: 1px solid #27746b;
            }
            .unchecked {
              color: #8d979d;
            }
          }
        }
        .right_part {
          flex: 1;
          height: 100%;
          //   background-color: #041a27;
          .topMessage {
            display: flex;
            justify-content: space-between;
            background-color: #041a27;
            color: #fff;
            padding: 10px 50px 10px 10px;
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
            }
          }
          .conServer {
            margin-top: 10px;
            .server_top {
              display: flex;
              justify-content: flex-start;
              color: #fff;
              & > div {
                text-align: center;
                cursor: pointer;
                padding: 10px 40px;
              }
              .selectPart {
                border: 1px solid #34434c;
                background-color: #041a27;
              }
            }
            .server_con {
              border: 1px solid #34434c;
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
              .serSecond {
              }
            }
          }
        }
      }
    }
  }
}
</style>