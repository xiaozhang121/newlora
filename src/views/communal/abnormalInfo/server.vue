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
          <div class="tabList" v-for="(item,index) in tabdata" :key="index">
            <span
              class="tabFirst white"
              :class="{blue:item.active==0,gray:item.active==1,red:item.active==2,}"
            ></span>
            <span class="tabSecond">{{item.name}}</span>
            <i class="el-icon-caret-right"></i>
          </div>
        </div>
        <div class="right">
          <div class="chartsPie">
            <dunoPie></dunoPie>
          </div>
          <div class="btmm">
            <div class="chartsbar">
              <echartsRare ref="rare"></echartsRare>
            </div>
            <div class="serevice">
              <service></service>
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
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/platformMonitor", name: "异常信息" },
        { path: "", name: "服务器" }
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
              color: #3ed9c1;
              padding-right: 5px;
            }
            i {
              color: #3ed9c1;
            }
          }
        }
        .right {
          flex: 1;
          height: 100%;
          background-color: #041a27;
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
            }
          }
        }
      }
    }
  }
}
</style>