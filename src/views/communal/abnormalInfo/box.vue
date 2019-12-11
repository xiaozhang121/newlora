<template>
  <div class="abnormalInfod">
    <div class="breadcrumb">
      <Breadcrumb :dataList="dataBread" />
    </div>
    <div style="width:100%;height:100%">
      <div class="title">泛在盒子</div>
      <div class="card healthCard">
        <div class="cardTop">
          <img src="./img/line.png" alt />
          <div class="cardTitle">服务器连接数</div>
        </div>
        <div class="center health">
          <div id="mountNode" ref="mountNode"></div>
        </div>
        <div class="warn" style="text-align:center">
          <div class="mountText">
            <p>正常</p>
            <h3>{{ (ubiquitousData.normal / ubiquitousData.total)*100 }}%</h3>
            <div style="color:#fff">正常连接数:40</div>
            <!-- <div style>2019-01-01</div> -->
          </div>
        </div>
      </div>
      <div class="card power">
        <div class="cardTop">
          <img src="./img/line.png" alt />
          <div class="cardTitle">电源</div>
        </div>
        <div class="box">
          <span>基本信息</span>
          <table>
            <tr>
              <td>内部温度:</td>
              <td>
                <span>{{pow. inner}}</span> °C
              </td>
            </tr>
            <tr>
              <td>输出功率:</td>
              <td>
                <span>{{pow.output}}</span> W
              </td>
            </tr>
            <tr>
              <td>输出电压:</td>
              <td>
                <span>{{pow.voltage}}</span> V
              </td>
            </tr>
            <tr>
              <td>输出电流:</td>
              <td>
                <span>{{pow.current}}</span> A
              </td>
            </tr>
          </table>
        </div>
        <div class="box box2">
          <span>运行信息</span>
          <table>
            <tr>
              <td>在位状态:</td>
              <td>
                <span v-if="pow.rstatus==1">正常</span>
                <span v-if="pow.rstatus==2">异常</span>
              </td>
            </tr>
            <tr>
              <td>槽位: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              <td>
                <span>{{pow.slot}}</span>
              </td>
            </tr>
            <tr>
              <td>运行状态:</td>
              <td>
                <span v-if="pow.status==1">开启</span>
                <span v-if="pow.status==2">关闭</span>
              </td>
            </tr>
            <tr>
              <td>运行时间:</td>
              <td>
                <span>{{pow.rtime}}</span> h
              </td>
            </tr>
          </table>
        </div>
      </div>
      <div class="card UPS">
        <div class="cardTop">
          <img src="./img/line.png" alt />
          <div class="cardTitle">UPS</div>
        </div>
        <div class="upsContent">
          <div class="echartbox">
            <div id="mountNode2"></div>
            <div class="mountText">
              <p>负载率</p>
              <h3>{{ fuzai*100 }}%</h3>
            </div>
          </div>
          <div class="rightBox">
            <table>
              <tr>
                <td>机内温度:</td>
                <td>
                  <span>{{ups.inner}}</span>°C
                </td>
              </tr>
              <tr>
                <td>通讯情况:</td>
                <td class="colorClass">
                  <span v-if="ups.comm==1">正常</span>
                  <span v-if="ups.comm==2">异常</span>
                </td>
              </tr>
              <tr>
                <td>开机状态:</td>
                <td class="colorClass">
                  <span v-if="ups.bstatus==1">睡眠</span>
                  <span v-if="ups.bstatus==2">浮充</span>
                  <span v-if="ups.bstatus==3">均充</span>
                  <span v-if="ups.bstatus==4">未充电</span>
                  <span v-if="ups.bstatus==5">未知</span>
                </td>
              </tr>
              <tr>
                <td>在位状态:</td>
                <td class="colorClass">
                  <span v-if="ups.rstatus==1">在位</span>
                  <span v-if="ups.rstatus==2">不在</span>
                </td>
              </tr>
            </table>
            <div class="powerTitle">
              <div>电池信息</div>
              <table class="box2">
                <tr>
                  <td>
                    <img src="./img/ico_voltage.png" alt />
                  </td>
                  <td>
                    <div>{{ups.voltage}}V</div>
                    <div style="font-size:14px">电压</div>
                  </td>
                  <td>
                    <img src="./img/ico_electricity.png" alt />
                  </td>
                  <td>
                    <div>{{ups.current}}A</div>
                    <div style="font-size:14px">电流</div>
                  </td>
                </tr>
                <tr style="height:20px"></tr>
                <tr>
                  <td>
                    <img src="./img/ico_status.png" alt />
                  </td>
                  <td>
                    <div v-if="ups.bstatus==1">睡眠</div>
                    <div v-if="ups.bstatus==2">浮充</div>
                    <div v-if="ups.bstatus==3">均充</div>
                    <div v-if="ups.bstatus==4">未充电</div>
                    <div v-if="ups.bstatus==5">未知</div>
                    <div style="font-size:14px">电池状态</div>
                  </td>
                  <td>
                    <img src="./img/ico_capacity.png" alt />
                  </td>
                  <td>
                    <div>{{ups.remain}}%</div>
                    <div style="font-size:14px">电池容量</div>
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div class="card air">
        <div class="cardTop">
          <img src="./img/line.png" alt />
          <div class="cardTitle">空调 {{fans.name}}</div>
        </div>
        <table>
          <tr>
            <td rowspan="2" style="width:152px">
              <div class="box">
                <img src="./img/ico_conditioner_a.png" alt />
                <div class="title" v-if="fans.status==2">开机</div>
                <div class="title" v-if="fans.status==1">关机</div>
                <div class="des">机组开机状态</div>
              </div>
            </td>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">制冷输出</td>
            <td class="border numTd">
              <span>{{fans.coolOut}}</span>%
            </td>
          </tr>
          <tr>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">风机输出</td>
            <td class="border numTd">
              <span>{{fans.fanOut}}</span>%
            </td>
          </tr>
          <tr>
            <td></td>
            <td class="pointTd">
              <div class="point"></div>
            </td>
            <td class="desTd">制冷状态</td>
            <td class="numTd">
              <span v-if="fans.coolStatus==1">开启</span>
              <span v-if="fans.coolStatus==0">关闭</span>
            </td>
          </tr>
          <tr>
            <td rowspan="2" style="width:152px">
              <div class="box">
                <img src="./img/ico_temperature_a.png" alt />
                <span class="title">{{fans.currentTemp}}</span>°C
                <div class="des">当前温度</div>
              </div>
            </td>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">除湿状态</td>
            <td class="border numTd">
              <span v-if="fans.dehumidStatus==2">开启</span>
              <span v-if="fans.dehumidStatus==1">关闭</span>
            </td>
          </tr>
          <tr>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">露点温度</td>
            <td class="border numTd">
              <span>{{fans.tDewpoint}}</span>°C
            </td>
          </tr>
          <tr>
            <td></td>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">电源电压</td>
            <td class="border numTd">
              <span>{{fans.voltage}}</span>V
            </td>
          </tr>

          <tr>
            <td rowspan="2" style="width:152px">
              <div class="box">
                <img src="./img/ico_humidity_b.png" alt />
                <div class="title">{{fans.currentHumid}}%RH</div>
                <div class="des">当前湿度</div>
              </div>
            </td>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">电源频率</td>
            <td class="border numTd">
              <span>{{fans.frequency}}</span>HZ
            </td>
          </tr>
          <tr>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">辅源电压</td>
            <td class="border numTd">
              <span>{{fans.assistVoltage}}</span>V
            </td>
          </tr>
        </table>
      </div>
      <div class="card air air2">
        <div class="cardTop">
          <img src="./img/line.png" alt />
          <div class="cardTitle">空调 {{fans2.name}}</div>
        </div>
        <table>
          <tr>
            <td rowspan="2" style="width:152px">
              <div class="box">
                <img src="./img/ico_conditioner_a.png" alt />
                <div class="title" v-if="fans2.status==2">开机</div>
                <div class="title" v-if="fans2.status==1">关机</div>
                <div class="des">机组开机状态</div>
              </div>
            </td>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">制冷输出</td>
            <td class="border numTd">
              <span>{{fans2.coolOut}}</span>%
            </td>
          </tr>
          <tr>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">风机输出</td>
            <td class="border numTd">
              <span>{{fans2.fanOut}}</span>%
            </td>
          </tr>
          <tr>
            <td></td>
            <td class="pointTd">
              <div class="point"></div>
            </td>
            <td class="desTd">制冷状态</td>
            <td class="numTd">
              <span v-if="fans2.coolStatus==1">开启</span>
              <span v-if="fans2.coolStatus==0">关闭</span>
            </td>
          </tr>
          <tr>
            <td rowspan="2" style="width:152px">
              <div class="box">
                <img src="./img/ico_temperature_a.png" alt />
                <span class="title">{{fans2.currentTemp}}</span>°C
                <div class="des">当前温度</div>
              </div>
            </td>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">除湿状态</td>
            <td class="border numTd">
              <span v-if="fans2.dehumidStatus==2">开启</span>
              <span v-if="fans2.dehumidStatus==1">关闭</span>
            </td>
          </tr>
          <tr>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">露点温度</td>
            <td class="border numTd">
              <span>{{fans2.tDewpoint}}</span>°C
            </td>
          </tr>
          <tr>
            <td></td>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">电源电压</td>
            <td class="border numTd">
              <span>{{fans2.voltage}}</span>V
            </td>
          </tr>

          <tr>
            <td rowspan="2" style="width:152px">
              <div class="box">
                <img src="./img/ico_humidity_b.png" alt />
                <div class="title">{{fans2.currentHumid}}%RH</div>
                <div class="des">当前湿度</div>
              </div>
            </td>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">电源频率</td>
            <td class="border numTd">
              <span>{{fans2.frequency}}</span>HZ
            </td>
          </tr>
          <tr>
            <td class="border pointTd">
              <div class="point"></div>
            </td>
            <td class="border desTd">辅源电压</td>
            <td class="border numTd">
              <span>{{fans2.assistVoltage}}</span>V
            </td>
          </tr>
        </table>
      </div>
      <div class="card video">
        <div class="cardTop">
          <img src="./img/line.png" alt />
          <div class="cardTitle">视频监控</div>
        </div>
        <div class="videobox">
          <div v-for="(item,index) in stream" :key="index">
            <key-monitor
              :autoplay="true"
              :isLive="false"
              :isNav="true"
              :monitorInfo="{monitorDeviceId: item.deviceId}"
              imgAdress
              :kilovolt="item.name"
              :streamAddr="item.url"
              :showBtmOption="true"
              width="100%"
            ></key-monitor>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import G2 from "@antv/g2";
// import insertCss from 'insert-css';
import { DunoCharts } from "_c/duno-charts";
import dunoBtnTop from "_c/duno-m/duno-btn-top";
import dunoMain from "_c/duno-m/duno-main";
import moment from "moment";
import KeyMonitor from "_c/duno-c/KeyMonitor";
import Breadcrumb from "_c/duno-c/Breadcrumb";
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
import mixinViewModule from "@/mixins/view-module";
import { DunoTablesTep } from "_c/duno-tables-tep";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
import screenfull from "screenfull";
import { debuglog } from "util";
export default {
  name: "abnormalInfo",
  mixins: [mixinViewModule],
  components: {
    DunoCharts,
    Breadcrumb,
    KeyMonitor
  },
  data() {
    const that = this;
    return {
      isChange: false,
      dataBread: [
        { path: "/abnormalInfoPath/home", name: "功能卡片" },
        { path: "/abnormalInfoPath/box", name: "泛在盒子" }
      ],
      gServeData: [],
      ubiquitousData: [],
      istrue: -1,
      chart: "",
      timer: null,
      seriesData: [
        {
          name: "访问来源",
          type: "pie",
          radius: "80%",
          center: ["50%", "50%"],
          data: [
            { value: 335, name: "直接访问" },
            { value: 310, name: "邮件营销" }
          ].sort(function(a, b) {
            return a.value - b.value;
          }),
          roseType: "radius",
          label: {
            normal: {
              show: false,
              position: "center"
            }
          },
          labelLine: {
            normal: {
              lineStyle: {
                color: "rgba(255, 255, 255, 0.3)"
              },
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {
            // normal: {
            //     // color: '#c23531',
            //     shadowBlur: 200,
            //     shadowColor: 'rgba(0, 0, 0, 0.5)'
            // }
          },

          animationType: "scale",
          animationEasing: "elasticOut",
          animationDelay: function(idx) {
            return Math.random() * 200;
          }
        }
      ],
      item: {},
      pow: {},
      ups: {},
      fans: {},
      fans2: {},
      fuzai: 0,
      series: [
        {
          name: "业务指标",
          type: "gauge",
          detail: { formatter: "{value}%", fontSize: "16px", color: "#fff" },
          data: [{ value: 50, name: "" }],
          axisLine: {
            // 坐标轴线
            lineStyle: {
              // 属性lineStyle控制线条样式
              color: [[0.3, "lime"], [0.7, "#1e90ff"], [1, "red"]],
              width: 10
            }
          },
          splitLine: {
            show: false, // 分隔线
            length: 0 // 属性length控制线长
          },
          axisTick: {
            //刻度线样式（及短线样式）
            length: 0
          },
          axisLabel: {
            //文字样式（及“10”、“20”等文字样式）
            color: "none"
          },
          itemStyle: {
            width: 10
          }
        }
      ],
      stream: [{}, {}, {}]
    };
  },
  methods: {
    getUbiquitous() {
      let url = "/lenovo-mon/api/monitoring/rack/zabbix/rack-health";
      getAxiosData(url).then(res => {
        let ubiquitousData = res.data;
        this.ubiquitousData = ubiquitousData;
        console.log(this.ubiquitousData);
        this.gauge(ubiquitousData);
      });
    },
    gauge(ubiquitousData) {
      var Shape = G2.Shape;
      Shape.registerShape("point", "pointer", {
        drawShape: function drawShape(cfg, group) {
          var point = cfg.points[0];
          var center = this.parsePoint({
            x: 0,
            y: 0
          });
          var target = this.parsePoint({
            x: point.x,
            y: 0.9
          });
          var dir_vec = {
            x: center.x - target.x,
            y: center.y - target.y
          };
          //normalize
          var length = Math.sqrt(dir_vec.x * dir_vec.x + dir_vec.y * dir_vec.y);
          dir_vec.x *= 1 / length;
          dir_vec.y *= 1 / length;
          //rotate dir_vector by -90 and scale
          var angle1 = -Math.PI / 2;
          var x_1 = Math.cos(angle1) * dir_vec.x - Math.sin(angle1) * dir_vec.y;
          var y_1 = Math.sin(angle1) * dir_vec.x + Math.cos(angle1) * dir_vec.y;
          //rotate dir_vector by 90 and scale
          var angle2 = Math.PI / 2;
          var x_2 = Math.cos(angle2) * dir_vec.x - Math.sin(angle2) * dir_vec.y;
          var y_2 = Math.sin(angle2) * dir_vec.x + Math.cos(angle2) * dir_vec.y;
          //polygon vertex
          var path = [
            ["M", target.x + x_1 * 1, target.y + y_1 * 1],
            ["L", center.x + x_1 * 3, center.y + y_1 * 3],
            ["L", center.x + x_2 * 3, center.y + y_2 * 3],
            ["L", target.x + x_2 * 1, target.y + y_2 * 1],
            ["Z"]
          ];
          group.addShape("line", {
            attrs: {
              x1: center.x,
              y1: center.y + 10,
              x2: cfg.x,
              y2: cfg.y,
              stroke: cfg.color,
              lineWidth: 2,
              lineCap: "round"
            }
          });
          return group.addShape("circle", {
            attrs: {
              x: center.x,
              y: center.y + 10,
              r: 2,
              stroke: cfg.color,
              lineWidth: 2,
              fill: "#fff"
            }
          });
        }
      });

      var data = [
        {
          type: "正常",
          value: ubiquitousData.normal / ubiquitousData.total
        }
      ];
      var chart = this.chart;
      chart = new G2.Chart({
        container: "mountNode",
        forceFit: true,
        // this.$refs.mountNode.innerHeight
        height: this.$refs.mountNode.offsetHeight,
        padding: "auto"
      });
      chart.source(data);
      chart.coord("polar", {
        startAngle: (-10 / 8) * Math.PI,
        endAngle: (2 / 8) * Math.PI,
        radius: 0.75
      });
      chart.scale("value", {
        min: 0,
        max: 1,
        tickInterval: 1,
        nice: false
      });
      chart.axis(false);
      chart.facet("rect", {
        fields: ["type"],
        showTitle: false,
        eachView: function eachView(view, facet) {
          var data = facet.data[0];
          //指针
          view
            .point()
            .position("value*1")
            .shape("pointer")
            .color("#d8d8d8")
            .active(false);
          //仪表盘背景
          view.guide().arc({
            zIndex: 0,
            top: false,
            start: [0, 1],
            end: [1, 1],
            style: {
              stroke: "#ebedf0",
              lineWidth: 10
            }
          });
          //仪表盘前景
          view.guide().arc({
            zIndex: 1,
            start: [0, 1],
            end: [data.value, 1],
            style: {
              stroke: "#53FEC0",
              lineWidth: 10
            }
          });
          //仪表盘信息
          // let percent = parseInt(data.value * 100);
          // view.guide().html({
          //   position: ["50%", "75%"],
          //   html:
          //     '<div class="g2-guide-html"><p class="title">' +
          //     data.type +
          //     '</p><p class="value">' +
          //     percent +
          //     "%</p></div>"
          // });
        }
      });
      chart.render();
    },
    gauge2() {
      var Shape = G2.Shape;
      Shape.registerShape("point", "pointer", {
        drawShape: function drawShape(cfg, group) {
          var point = cfg.points[0];
          var center = this.parsePoint({
            x: 0,
            y: 0
          });
          var target = this.parsePoint({
            x: point.x,
            y: 0.9
          });
          var dir_vec = {
            x: center.x - target.x,
            y: center.y - target.y
          };
          //normalize
          var length = Math.sqrt(dir_vec.x * dir_vec.x + dir_vec.y * dir_vec.y);
          dir_vec.x *= 1 / length;
          dir_vec.y *= 1 / length;
          //rotate dir_vector by -90 and scale
          var angle1 = -Math.PI / 2;
          var x_1 = Math.cos(angle1) * dir_vec.x - Math.sin(angle1) * dir_vec.y;
          var y_1 = Math.sin(angle1) * dir_vec.x + Math.cos(angle1) * dir_vec.y;
          //rotate dir_vector by 90 and scale
          var angle2 = Math.PI / 2;
          var x_2 = Math.cos(angle2) * dir_vec.x - Math.sin(angle2) * dir_vec.y;
          var y_2 = Math.sin(angle2) * dir_vec.x + Math.cos(angle2) * dir_vec.y;
          //polygon vertex
          var path = [
            ["M", target.x + x_1 * 1, target.y + y_1 * 1],
            ["L", center.x + x_1 * 3, center.y + y_1 * 3],
            ["L", center.x + x_2 * 3, center.y + y_2 * 3],
            ["L", target.x + x_2 * 1, target.y + y_2 * 1],
            ["Z"]
          ];
          group.addShape("line", {
            attrs: {
              x1: center.x,
              y1: center.y + 10,
              x2: cfg.x,
              y2: cfg.y,
              stroke: cfg.color,
              lineWidth: 2,
              lineCap: "round"
            }
          });
          return group.addShape("circle", {
            attrs: {
              x: center.x,
              y: center.y + 10,
              r: 2,
              stroke: cfg.color,
              lineWidth: 2,
              fill: "#fff"
            }
          });
        }
      });

      var data = [
        {
          type: "负载率",
          value: this.fuzai //赋值取，满值1，
        }
      ];
      var chart = this.chart;
      chart = new G2.Chart({
        container: "mountNode2",
        forceFit: true,
        height: this.$refs.mountNode.offsetHeight,
        padding: "auto"
      });
      chart.source(data);
      chart.coord("polar", {
        startAngle: (-10 / 8) * Math.PI,
        endAngle: (2 / 8) * Math.PI,
        radius: 0.75
      });
      chart.scale("value", {
        min: 0,
        max: 1,
        tickInterval: 1,
        nice: false
      });
      chart.axis(false);
      chart.facet("rect", {
        fields: ["type"],
        showTitle: false,
        eachView: function eachView(view, facet) {
          var data = facet.data[0];
          //指针
          view
            .point()
            .position("value*1")
            .shape("pointer")
            .color("#d8d8d8")
            .active(false);
          //仪表盘背景
          view.guide().arc({
            zIndex: 0,
            top: false,
            start: [0, 1],
            end: [1, 1],
            style: {
              stroke: "#ebedf0",
              lineWidth: 10
            }
          });
          //仪表盘前景
          view.guide().arc({
            zIndex: 1,
            start: [0, 1],
            end: [data.value, 1],
            style: {
              stroke: "#00FEFE",
              lineWidth: 10
            }
          });
          //仪表盘信息
          // var percent = parseInt(data.value * 100);
          // view.guide().html({
          //   position: ["50%", "75%"],
          //   html:
          //     '<div class="g2-guide-html"><p class="title">' +
          //     data.type +
          //     '</p><p class="value" style="text-align:center">' +
          //     percent +
          //     "%</p></div>"
          // });
        }
      });
      chart.render();
    },
    chose(index) {
      this.istrue = index;
    },
    getUpsLoad() {
      var that = this;
      getAxiosData("/lenovo-mon/api/monitoring/rack/zabbix/rack-ups").then(
        res => {
          console.log(res);
          that.ups = res.data.data;
          that.fuzai = that.ups.load.loadData[0] / that.ups.load.total;
          // this.fuzai=this.fuzai.toFixed(2);
          this.gauge2();
        }
      );
    },
    getpow() {
      var that = this;
      getAxiosData("/lenovo-mon/api/monitoring/rack/zabbix/rack-pow").then(
        res => {
          this.pow = res.data.data;
        }
      );
    },
    getfans() {
      var that = this;
      getAxiosData("/lenovo-mon/api/monitoring/rack/zabbix/rack-fans").then(
        res => {
          this.fans = res.data.data[0];
          this.fans2 = res.data.data[1];
        }
      );
    },
    getstream() {
      var that = this;
      getAxiosData("/lenovo-mon/api/monitoring/rack/zabbix/rack-stream").then(
        res => {
          console.log(res);
          that.stream = res.data.data;
          console.log(that.stream[0].url);
        }
      );
    },
    initTimer() {
      let that = this;
      that.timer = setInterval(function() {
        // that.gauge();
        that.getstream();
        that.getUpsLoad();
        that.getpow();
        that.getfans();
      }, 120000);
    }
  },

  mounted() {
    console.log(this.$refs.mountNode);
    // this.gauge();
    this.getUbiquitous();
    this.getstream();
    this.getUpsLoad();
    this.getpow();
    this.getfans();
    this.initTimer();
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="scss" scoped>
#mountNode2 {
  top: 5%;
}
.abnormalInfod {
  width: 100%;
  height: 100%;
  position: relative;
}
#mountNode {
  position: relative;
  width: 100%;
  height: 100%;
}
#mountNode2 {
  position: relative;
  width: 100%;
  height: 100%;
}
.g2-guide-html {
  @media screen and (max-width: 1366px) {
    margin-top: 15px;
  }
}
//  .g2-guide-html {
//         width: 80px;
//         height: 80px;
//         vertical-align: middle;
//         text-align: center;
//         line-height: 0.4
//     }

//     .g2-guide-html .title {
//         font-size: 14px;
//         color: #8c8c8c;
//         font-weight: 300;
//     }

//     .g2-guide-html .value {
//         font-size: 24px;
//         color: #000;
//         font-weight: bold;
//     }
.active {
  color: #00b4ff !important;
}
.pullBox {
  width: 100%;
  height: 190px;
  overflow-y: scroll;
  table {
    width: 100%;
    text-align: left;
    border: 0;
    .point {
      width: 14px;
      height: 14px;
      background: #00b4ff;
      border-radius: 50%;
      float: left;
      margin-left: 10px;
    }
    tr {
      cursor: pointer;
    }
    tr:nth-of-type(2n + 1) {
      background: #203e52;
    }
    td:nth-of-type(1) {
      width: 10%;
    }
    td:nth-of-type(2) {
      width: 45%;
    }
    td:nth-of-type(3) {
      width: 45%;
    }
  }
}
.charts {
  position: absolute;
  width: 100%;
  height: 100%;
}
.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.title {
  font-size: 20px;
  color: #fff;
  margin-top: 12px;
}

.card {
  background: rgba(16, 35, 48, 0.8);
  width: 15.6%;
  height: 28%;
  float: left;
  padding-left: 10px;
  position: relative;
  .health {
    // top: 50px;
    width: 200px;
    height: 200px;
    .text {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9;
      top: 140px;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
    }
  }
}
.video {
  height: 62%;
  width: 48.4%;
  background: #142838;
  margin-left: 20px;
  margin-top: 20px;
  .videobox {
    padding-top: 20px;
    padding-left: 10%;
    padding-right: 10%;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    & > div {
      width: calc(50% - 10px);
    }
    & > div:first-child {
      margin-right: 20px;
    }
    & > div:last-child {
      margin-top: 50px;
    }
  }
}

.air {
  background: #203e52;
  width: 23.6%;
  height: 62%;
  float: left;
  position: relative;
  margin-top: 20px;
  table {
    height: 70%;
    position: relative;
    margin-right: 10px;
    top: 6%;
    left: 50%;
    transform: translateX(-50%);
    border-collapse: collapse;
    td {
      height: 8%;
      color: #fff;
      font-size: 14px;
    }
  }
  .pointTd {
    padding-left: 10px;
    width: 58px;
  }
  .desTd {
    width: 106px;
  }
  .numTd {
    width: 90px;
    span {
      color: #00fefe;
    }
  }
  .point {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
  }
  .border {
    border-bottom: 1px solid rgba(255, 255, 255, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.3);
  }
  .box {
    width: 100px;
    text-align: center;
    .title {
      font-size: 20px;
      color: #fff;
      margin: 0;
    }
    .des {
      font-size: 14px;
      color: #999;
    }
    img {
      display: block;
      margin: auto;
    }
  }
}
.air2 {
  margin-left: 20px;
  background: #142838;
}
.UPS {
  margin-left: 20px;
  width: 48.4%;
  background: #203e52;
  .colorClass {
    color: #00fefe;
  }
  // .echartbox {
  //   width: 17.2%;
  //   height: 176px;
  //   //  margin-top: 40px;
  //   float: left;
  // }
  // .rightBox {
  //   height: 100%;
  //   .powerTitle {
  //     float: right;
  //     margin-right: 27%;
  //     // text-align: center;
  //   }
  //   .box2 {
  //     margin: 0;
  //     border: 0;
  //     width: 49%;
  //     height: 60%;
  //     text-align: center;
  //     font-size: 20px;
  //     img {
  //       float: right;
  //     }
  //     tr {
  //       height: 35.7%;
  //       td {
  //         text-align: left;
  //         padding-left: 40%;
  //       }
  //     }
  //   }
  // }
  .upsContent {
    height: 100%;
    display: flex;
    justify-content: flex-start;
    .echartbox {
      width: 17.2%;
      height: 176px;
      .mountText {
        width: 100%;
        font-weight: normal;
        color: #fff;
        font-size: 14px;
        text-align: center;
        margin-top: -30px;
      }
    }
    .rightBox {
      width: 82.8%;
      .powerTitle {
        & > div:first-child {
          text-align: right;
          margin-right: 30%;
          color: #999;
        }
        .box2 {
          border: 0;
          width: 55%;
          margin-top: 25px;
          margin-left: 5%;
          tr {
            td {
              text-align: center;
              & > div:first-child {
                font-size: 18px;
              }
            }
          }
        }
      }
    }
  }
  table {
    float: left;
    color: #fff;
    font-size: 14px;
    margin-top: 50px;
    text-align: center;
    width: 35%;
    height: 47.8%;
    border-right: 1px dotted #fff;
    tr {
      height: 16.2%;
      span {
        font-size: 18px;
        color: #00fefe;
      }
    }
    td:nth-of-type(2n) {
      text-align: left;
    }
  }
}
.power {
  width: 31.77%;
  background: #1a3749;
  margin-left: 20px;
  .box {
    text-align: center;
    width: 50%;
    font-size: 14px;
    float: left;
    span {
      color: #999;
    }
    table {
      tr {
        span {
          font-size: 18px;
          color: #00b4ff;
          font-weight: 700;
        }
      }
      td:nth-of-type(2n) {
        text-align: left;
      }
    }
  }
  .box2 {
    table {
      border-left: 1px dotted #fff;
      tr {
        span {
          color: #53fec0;
        }
        td:nth-of-type(2n) {
          text-align: left;
        }
      }
    }
  }
  table {
    width: 100%;
    color: #fff;
    margin-top: 35px;
    tr {
      height: 14.2%;
    }
  }
  .title {
    font-size: 22px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 10px;
  }
  .circle {
    width: 10px;
    height: 10px;
    background: #53cbc3;
    display: inline-block;
  }
  .used {
    background: #1b6697;
  }
  .outerbox {
    position: relative;
    width: 33%;
    float: left;
    .echartBox {
      width: 145px;
      height: 145px;
      margin-left: 40px;
    }
    .textBox {
      position: absolute;
      right: 30px;
      float: left;
      font-size: 14px;
      top: 70px;
    }
  }
}
.cardTop {
  height: 24px;
  width: calc(100% - 10px);
  padding-left: 5px;
  // border: 1px dotted #00fefe;
  // float: left;
  margin-top: 5px;
  border-right: 0;
  border-top: 0;
  border-bottom: 0;
  div {
    float: left;
  }
  img {
    float: left;
    margin-top: 5px;
    margin-right: 10px;
  }
}
.center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
.cardTitle {
  font-size: 16px;
  color: #fff;
  // font-weight: 700;
}
.health {
  top: 31px;
  .insideText {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
  }
}
.healthCard {
  .warn {
    position: absolute;
    width: 200px;
    bottom: 10px;
    left: 50%;
    overflow: hidden;
    transform: translateX(-50%);
    .mountText {
      float: left;
      width: 100%;
      font-weight: normal;
      color: #fff;
      font-size: 14px;
    }
  }
  .center {
    width: 100%;
    height: 71%;
  }
}
.camera {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>

