<template>
  <div class="duno-inspection" id="drawPic">
    <duno-btn-top @on-active="deviceShowHandle" @on-diagram="changDiagram" />
    <duno-main style="width: 100%; height: calc(100% - 60px)">
      <img :src="all" alt="" id="picTarget">
      <div class="duno-box">
        <div class="duno-btnBox">
          <div class="duno-btnList">
            <duno-button
                    btnType="region"
                    title="设备每日记录表"
                    :showIcon="false"
                    :isOpenBtn="activeNo === 'recordList'"
                    @onClick="onClick('recordList')"
            />
            <duno-button
                    btnType="region"
                    title="巡检记录"
                    :showIcon="false"
                    :isOpenBtn="activeNo === 'record'"
                    @onClick="onClick('record')"
            />
          </div>
          <div class="duno-btnList">
            <duno-button-list
                    btnType="region"
                    :title="btnListE"
                    :isShowChild="areaList"
                    :isIcon="btnListShow"
                    :isOpenBtn="btnListShow"
                    @onClick="areaList = !areaList"
            >
              <duno-button
                      btnType="region"
                      title="巡视路径一"
                      icon="icon-tingzhi"
                      :isIcon="true"
                      :isOpenBtn="activeNo === 'region'"
                      @onClick="onClick('region')"
              />
              <duno-button
                      btnType="region"
                      title="机器人路径"
                      icon="icon-tingzhi"
                      :isIcon="true"
                      :isOpenBtn="activeNo === 'rebort'"
                      @onClick="onClick('rebort')"
              />
            </duno-button-list>
            <duno-button
                    btnType="region"
                    title="自定义巡检"
                    icon="icon-tingzhi"
                    :isIcon="true"
                    :isOpenBtn="activeNo === 'region2'"
                    @onClick="onClick('region2')"
            />
          </div>
        </div>
        <div v-if="activeNo == 'region'">
          <div class="duno-dotItem" v-if="activeNo == 'region'" @click="onClickItem('one')"></div>
          <div class="duno-dotItem two" v-if="activeNo == 'region'" @click="onClickItem('two')"></div>
          <div style="border-left: 5px dashed yellow; height: 18%;position: absolute; left: 57.5%; top: 24%"></div>
          <div style="border-top: 5px dashed yellow; height: 10%;width:17%;position: absolute; left: 57.5%; top: 23%"></div>
          <div class="duno-dotItem" style="left: 57% " @click="showPanel(1)"></div>
          <red-panel style="position: absolute; left: 60%" :initShow="showFlag == 1"></red-panel>
          <div class="duno-dotItem" style="left: 57%; top: 29% "  @click="showPanel(2)"></div>
          <blue-panel style="position: absolute; left: 60%; top: 29%"  :initShow="showFlag == 2"></blue-panel>
          <div class="duno-dotItem" style="left: 57%; top: 38% "  @click="showPanel(3)"></div>
          <panel style="position: absolute; left: 60%; top: 38%;"  :initShow="showFlag == 3"></panel>
        </div>
        <div v-else-if="activeNo == 'rebort'">
          <div class="lineDD" style="width: 4px;height: 127px; position: absolute; left: 50%; top: 30%; border-left: 5px dashed #e48303"></div>
          <div class="lineDD" style="width: 127px;height: 4px; position: absolute; left: 50%; top: 45%; border-bottom: 5px dashed #e48303"></div>
          <div class="lineDD" style="width: 40px;height: 40px; position: absolute; left: 55%; top: 44%; background: #e48303"></div>
          <div class="panelOrange" >
            <div class="title">机器人一号
              <!--<i style="display:inline-block;float: right" class="el-icon-close"></i>-->
            </div>
            <div class="process">
              <span>工作中</span>
              <span>98%</span>
            </div>
            <div class="explain">
              <span>执行工作任务： xx巡检任务一</span>
              <span class="last"><span>工作时长： 2小时48分56秒</span><span>已巡视：7/15</span></span>
            </div>
          </div>
          <div class="lineDD" style="width: 4px;height: 197px; position: absolute; left: 56%; top: 45%; border-left: 5px solid #e48303"></div>
          <custom-box
                  class="border-path"
                  title="实时视频"
                  :initClose="false"
                  width="350px"
          >
            <div class="main">
              <div class="item">
                <div class="img">
                  <img :src="camera" />
                </div>
                <div class="explain">
                  <span>全屏</span>
                  <span>录像</span>
                  <span>存图</span>
                </div>
              </div>
              <div class="item">
                <div class="img">
                  <img :src="camera" />
                </div>
                <div class="explain">
                  <span>全屏</span>
                  <span>录像</span>
                  <span>存图</span>
                </div>
              </div>
            </div>
          </custom-box>
          <custom-box
                  class="border-pathd"
                  title="日志"
                  :initClose="false"
                  width="400px"
          >
            <div class="main" style="padding: 0 7px">
              <duno-table :noBottom="true" @on-close="closeTable('tableShow')" style="width: 380px; " v-for="(item, index) in dataListd" :title="item.title" :key="index"  :columns="columnsd" :dataList="item.dataList"/>
            </div>
          </custom-box>
          <camera-panel :showCamera="false"    class="dddddd"  style="position: absolute; right: 10px; bottom: 20px;width: 340px">

          </camera-panel>
        </div>
        <div v-else-if="activeNo == 'region2'">
          <custom-shap
                  style="position: absolute; left:20px"
                  @show-table="showTable"
          />
          <div>
            <duno-table v-if="tableShow" @on-close="closeTable('tableShow')" style="z-index: 9;width: 800px; position: absolute; left: 300px; top: 150px;" v-for="(item, index) in dataList" :title="item.title" :key="index"  :columns="columns" :dataList="item.dataList"/>
          </div>
        </div>
      </div>
      <div class="popup" v-if="popup">
        <span class="shut" @click="popup = false"><i class="iconfont icon-guanbi"></i></span>
        <h3 v-if="activeNo == 'region'  || activeNo == 'region2'">{{activeNo == 'region' ? '正在按照巡视路径一巡视' : activeNo == 'region2' ? '正在按照巡视路径二巡视' : ''}}</h3>
        <duno-image v-if="activeNo == 'region'" />
        <day-record v-if="activeNo == 'recordList'"/>
        <day-time-record v-if="activeNo == 'record'"/>
      </div>
    </duno-main>
  </div>
</template>
<script>
import DunoButton from '_c/duno-button'
import dunoMain  from '_c/duno-m/duno-main'
import redPanel from '_c/self_com/redPanel'
import DunoButtonList from '_c/duno-buttonList'
import bluePanel from '_c/self_com/bluePanel'
import cameraPanel from '_c/self_com/cameraPanel'
import dunoTable from './components/Table'
import panel from '_c/self_com/panel'
import customBox from '@/components/self_com/customBox'
import customShap from '_c/self_com/customShap'
import dunoImage from './components/image'
import dayRecord from './components/dayrecord'
import dayTimeRecord from './components/dayTimerecord'
import dunoBtnTop  from '_c/duno-m/duno-btn-top'
export default {
  name: 'dunoInspection',
  components: {dunoBtnTop,dunoMain, cameraPanel, DunoButton, dunoImage, dayRecord, dayTimeRecord, redPanel, bluePanel, panel, DunoButtonList, customShap, dunoTable, customBox},
  data () {
    return {
      all: require('@/assets/imgBack.png'),
      del:require('@/assets/images/btn/del.png'),
      camera:require('@/assets/camera.png'),
      cameraT:require('@/assets/camera2.png'),
      columns: [
          {
              title: '时间',
              key: 'time',
              align: 'center',
              minWidth: 100,
              tooltip: true
          },
          {
              title: '设备名称',
              key: 'name',
              align: 'center',
              minWidth: 100,
              tooltip: true
          },
          {
              title: '处理',
              key: 'deal',
              align: 'center',
              minWidth: 100,
              tooltip: true,
              render: (h, params) => {
                  let newArr = []
                  newArr.push(h('el-tooltip', {
                      props: {content: '去除'}
                  }, [
                      h('el-poptip', {
                          props: { confirm: true, placement: 'top-end', title: '您确定去除该检查点吗?', transfer: true },
                          on: { 'on-ok': () => { this.deleteHandled(params) } }
                      }, [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ this.del +')',backgroundSize:'cover'} }) ])
                  ]))
                  return h('div', newArr)
              }
          },
      ],
      dataList: [
          {
              title: '多选区域内巡视设备',
              dataList: [
                  {
                      time: '#4主变A相本体',
                      name: '油位表、压力表',
                      deal: '删除'
                  },
                  {
                      time: '#4主变A相本体',
                      name: '油位表、压力表',
                      deal: '删除'
                  },
                  {
                      time: '#4主变A相本体',
                      name: '油位表、压力表',
                      deal: '删除'
                  },
                  {
                      time: '#4主变A相本体',
                      name: '油位表、压力表',
                      deal: '删除'
                  },
                  {
                      time: '#4主变A相本体',
                      name: '油位表、压力表',
                      deal: '删除'
                  }
              ]
          }
      ],
      columnsd: [
            {
                title: '事件描述',
                key: 'time',
                align: 'center',
                minWidth: 100,
                tooltip: true
            },
            {
                title: '时间类型',
                key: 'name',
                align: 'center',
                minWidth: 100,
                tooltip: true
            },
            {
                title: '处理',
                key: 'deal',
                align: 'center',
                minWidth: 100,
                tooltip: true,
                render: (h, params) => {
                    return h('div', [
                            h('Button', {
                                style: {
                                    marginLeft:'8px',
                                    marginRight: '5px',
                                    background:'url('+ this.chakan +') no-repeat',
                                    border:'none',
                                    color: 'white',
                                    height:'21px'
                                },
                                on: {
                                    click: () => {
                                    }
                                }
                            },'查看')
                    ]);
                }
            },
        ],
      dataListd: [
          {
              dataList: [
                  {
                      time: 'xx用户在12：43分对机器人1号巡检',
                      name: '录像',
                      deal: '删除'
                  },
                  {
                      time: 'xx用户在12：43分对机器人1号巡检',
                      name: '油位表、压力表',
                      deal: '删除'
                  },
                  {
                      time: 'xx用户在12：43分对机器人1号巡检',
                      name: '油位表、压力表',
                      deal: '删除'
                  },
                  {
                      time: 'xx用户在12：43分对机器人1号巡检',
                      name: '油位表、压力表',
                      deal: '删除'
                  },
                  {
                      time: 'xx用户在12：43分对机器人1号巡检',
                      name: '油位表、压力表',
                      deal: '删除'
                  }
              ]
          }
      ],
      tableShow: false,
      activeNo: 'region',
      record: '',
      areaList: false,
      popup: false,
      showFlag: '',
      btnListE:'巡视路径一'
    }
  },
  computed:{
      btnListShow(){
          return (this.activeNo == 'rebort' || this.activeNo == 'region')
      }
  },
  watch:{
      tableShow(now){
          if(now){
          }
      },
      activeNo(now){
          for(let i=0; i<document.getElementsByClassName('addImage').length;i++){
                  document.getElementsByClassName('addImage')[i].remove()
          }
          document.getElementsByClassName('addImage')[0].remove()
          if(now == 'rebort'){
              this.btnListE = '机器人路径'
          }else if(now == 'region'){
              this.btnListE = '巡检路径一'
          }else if(now == 'region2'){

          }else {
              this.btnListE = '巡视路径一'
          }
      }
  },
  methods: {
    showTable(){
        this.tableShow = true
    },
    deleteHandled(param){
      let index = param.index
      this.dataList[0]['dataList'].splice(index,1)
      this.$forceUpdate()
    },
    closeTable(){
        this['tableShow'] = false
    },
    showPanel(type){
        this.showFlag = type
    },
    onClick (type) {
      this.activeNo = type
      if (type == 'recordList' || type == 'record') {
        this.popup = true
      }
    },
    onClickItem (type) {
      this.record = type
      this.popup = true
    }
  },
}
</script>
<style  lang="scss">
  .tablesTep {
    overflow-y: scroll;
    height: 100%;
    background-color: rgba(0, 0, 0, 0);
    .ivu-table-wrapper {
      margin-right: 15px;
      tr:nth-child(odd) {
        td {
          background-color: rgba(81, 89, 113, 0.7);
        }
      }
      border: none;
      .ivu-table {
        border: none !important;
        color: #fff;
        background-color: rgba(0, 0, 0, 0);
      }
      .ivu-table:before,
      .ivu-table:after {
        background-color: rgba(0, 0, 0, 0);
      }
      .ivu-table td,
      .ivu-table th {
        color: #fff;
        border: none;
        background-color: rgba(0, 0, 0, 0);
      }
    }
    .ivu-select-dropdown {
      background-color: #303544;
    }
  }
</style>

<style lang="scss" scoped>
  #drawPic{
    width: 100%;
    height: 100%;
    position: relative;
    .border-path{
      position: absolute;
      left: 0;
      top: 120px;
      .main{
        .item{
          padding: 0 10px;
          margin-bottom: 10px;
          .img{}
          .explain{
            display: flex;
            span{
              flex: 1;
              color: white;
              text-align: center;
              cursor: pointer;
            }
          }
        }
      }
    }
    .border-pathd{
      right: 10px;
      left: inherit;
      position: absolute;
    }
    .panelOrange{
      display: flex;
      flex-direction: column;
      border: 1px solid #ed8703;
      width: 380px;
      position: absolute;
      left: 60%;
      top: 40%;
      color: white;
      line-height: 25px;
      padding: 5px;
      background: rgba(237,135,3,0.3);
      .title{
        font-size: 20px;
        display: inline-block;
      }
      .process{
        display: flex;
        span{
          margin-right: 20px;
        }
      }
      .explain{
        .last{
          display: flex;
          span{
            margin-right: 20px;
          }
        }
      }
    }
  }
  .duno-dotItem.active{
    background: red;
  }
 .duno {
  &-inspection {
    width: 100%;
    height: 100%;
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }
  }
  &-box {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
  }
  &-btnBox {
    width: 300px;
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    z-index: 2;
  }

  &-dotItem {
    position: absolute;
    top: 22%;
    left: 71%;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #53fec0;
  }
}
.two {
  top: 57%;
  left: 71%;
  background: #ff5eb9;
}
.popup {
  width: 60%;
  height: 80%;
  overflow-y: auto;
  overflow-x: hidden;
  border-radius: 5px;
  position: fixed;
  z-index: 1000;
  top: 10%;
  left: 20%;
  border: 1px solid #008290;
  border-radius: 15px;
  padding: 20px;
  background: rgba(0, 130, 144, 0.3);

  .shut {
    position: absolute;
    top: 7px;
    right: 12px;
    
    i {
      color: #fff;
      font-size: 20px;
    }
  }

  h3 {
    color: #fff;
  }

}
</style>