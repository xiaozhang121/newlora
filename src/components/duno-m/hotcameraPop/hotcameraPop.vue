<template>
    <div class="hotcameraPop" >
        <historical-documents  :itemId="itemData['monitorDeviceId']" :tabPaneData="tabPaneData" :showHeader="true"  :title="title"  width="770px" @on-show="changeCameraShow" @close="onClose" :dialogTableVisible="visible" class="historical vRed">
            <!-- <hot-camera :deviceId="itemData['monitorDeviceId']" :itemData="itemData" :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></hot-camera> -->
            <camera-hot ref="cameraHotRef" :deviceId="itemData['monitorDeviceId']" :itemData="itemData" :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></camera-hot>
            <polygonal-backup ref="polygonalRef" :timeStr='timeStr' :itemData="itemData" :yName="yName" @on-charts="onCharts"   @onChange="onChange" :isChange="isChange" :seriesData="seriesData" :xAxisData="xAxisData" :legendData="legendData" v-else-if="cameraFlag == 'fifth'"></polygonal-backup>
            <historyfile  :itemId="itemId" v-else-if="cameraFlag == 'sixth'"/>
            <historyfourth-backup  :itemId="itemId" :itemData="itemData" v-else-if="cameraFlag == 'fourth'"></historyfourth-backup>
        </historical-documents>
    </div>
</template>

<script>
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    import historyfile from "_c/historyfile"
    import historyfourth from "_c/historyfourth"
    import historyfourthBackup from "_c/historyfourthBackup"
    import PolygonalBackup from '_c/duno-c/PolygonalBackup'
    import cameraPanelBackUP from '_c/duno-m/cameraPanelBackUP'
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    import Polygonal from '_c/duno-c/Polygonal'
    import cameraHot from '_c/duno-m/cameraHot'
    import hotCamera from '_c/duno-m/hotCamera'
    import moment from 'moment'
    import cameraPanel from '_c/duno-m/cameraPanel'
    export default {
        name: 'cameraPop',
        components: {
            HistoricalDocuments,
            Polygonal,
            cameraPanel,
            cameraHot,
            hotCamera,
            historyfile,
            historyfourth,
            historyfourthBackup,
            PolygonalBackup,
            cameraPanelBackUP
        },
        data() {
            return {
                typeChosen:'Multiple',
                presetPos: [],
                yName: '',
                timeStr:"",
                tabPaneData:[
                    {
                        label: "实时监控",
                        name: "first"
                    },
                    {
                        label: "巡航",
                        name: "second"
                    },
                    {
                        label: "预置位",
                        name: "third"
                    },
                    {
                        label: "历史告警",
                        name: "fourth"
                    },
                    {
                        label: "历史数据",
                        name: "fifth"
                    }
                ],
                cameraFlag: 'first',
                title: '',
                monitorDeviceType: '',
                itemId: null,
                isChange: false,
                legendData: [],
                xAxisData: [],
                seriesData: [],
                isGetData: false,
                isInit: false
            }
        },
        props: {
            index:{},
            itemData:{
                type: Object,
                default: () => {
                    return {}
                }
            },
            visible:{
                type: Boolean,
                default: false
            }
        },
        computed: {

        },
        watch: {
            itemData: {
                handler(now) {
                    this.title = now.deviceMessage.name
                    if(now['realMonitorDeviceType']==7){
                        this.tabPaneData.splice(this.tabPaneData.length-1,1)
                        this.tabPaneData.splice(this.tabPaneData.length-1,1)
                    }else if(now['realMonitorDeviceType']==3){
                        this.tabPaneData.splice(this.tabPaneData.length-1,1)
                    }
                    this.disposeData(now)
                    let supportPreset = now.deviceMessage.supportPreset
                    let monitorDeviceType = now.monitorDeviceType
                    if(monitorDeviceType == 1 && monitorDeviceType){
                      this.typeChosen = 'Single'
                    }else if(monitorDeviceType == 2){
                      this.typeChosen = 'Multiple'
                    }
                },
                deep: true,
                immediate: true
            },
            cameraFlag (now) {
                // if (now == 'fifth' && this.itemData && this.isGetData) this.getHistoryData()
            },
            isGetData (now) {
                if (now)  this.getHistoryData()
            }
        },
        methods:{
            onCharts(now){
               if (this.cameraFlag == 'fifth'){
                 this.presetPos = now
                 this.getHistoryData()
               }
            },
            changeCameraShow(now){
                this.cameraFlag = now
                if(now == 'fifth'){
                    this.$emit('chang-Point', 1)
                }else{
                    this.$emit('chang-Point', -1)
                }
            },
            onClose(data){
                this.cameraFlag = -1
                this.$emit('onClose',data, this.index, 'cameraFlagVisible')
            },
            disposeData(data) {
                if (data && JSON.stringify(data) !== '{}') {
                    this.monitorDeviceType = data.monitorDeviceType
                    this.itemId = data.monitorDeviceId
                } else {
                    this.title = ''
                    this.itemId = null
                }
            },
            onChange (data) {
                const startTime = moment(data[0]).format('YYYY-MM-DD')
                const endTime = moment(data[1]).format('YYYY-MM-DD')
                this.startTime = JSON.parse(JSON.stringify(startTime))
                this.endTime = JSON.parse(JSON.stringify(endTime))
                if(this.isInit)
                    this.isGetData = true
            },
            getAxisData(data){
              let xAxisData = []
               data.forEach(item=>{
                 item['itemDataList'].forEach(el =>{
                   if(xAxisData.indexOf(el[0]) < 0)
                    xAxisData.push(el[0])
                 })
               })
              xAxisData.sort(function (a, b) {
                return a < b ? -1 : 1
              })
              return xAxisData
            },
            getHistoryData () {
                this.isInit = true
                this.isGetData = false
                const that = this
                const url = '/lenovo-plan/api/plan/history/new'
                const query = {
                    monitorDeviceId: that.itemId,
                    monitorDeviceType: that.monitorDeviceType,
                    startTime: `${this.startTime} 00:00:00`,
                    endTime: `${this.endTime} 23:59:59`,
                    presetId: this.presetPos.join(',')
                }
                getAxiosData(url, query).then( res => {
                  const dataList = res.data.dataList
                  console.log(dataList)
                  // let dataList = [
                  //   {
                  //     itemName: '项目名称（可见光为电网设备名称，热感为roi名称）222222222',
                  //     itemDataList: [
                  //       ['2019-01-01', '10'],
                  //       ['2019-01-02', '20'],
                  //       ['2019-01-06', '90']
                  //     ],
                  //     maxData: 100,
                  //     minData: 30,
                  //     unit: '单位',
                  //     flag: 0
                  //   },
                  //   {
                  //     itemName: '项目名称（可见光为电网设备名称，热感为roi名称）1111111111',
                  //     itemDataList: [
                  //       ['2019-01-01', 200],
                  //       ['2019-01-09', 40],
                  //       ['2019-01-20', 300]
                  //     ],
                  //     maxData: 100,
                  //     minData: 30,
                  //     unit: '单位123',
                  //     flag: 0
                  //   }
                  // ]
                  this.timeStr=dataList[0].timeStr
                  let xAxisData = that.getAxisData(dataList)
                  let domData = this.$refs.polygonalRef.$data
                  let dom = this.$refs.polygonalRef
                  domData.chartsType = this.typeChosen
                  if(this.typeChosen == 'Single'){
                    domData.chartsList = dataList
                    this.$refs.polygonalRef.changeActive(0)
                  }else{
                    this.$refs.polygonalRef.chartsList = []
                    domData.xAxisData = xAxisData
                    let legendData = []
                    let seriesData = []
                    for(let i=0; i<dataList.length; i++){
                      let obj = dom.handleData(i, dataList, true)
                      legendData.push(...obj.legendData)
                      seriesData.push(...obj.seriesData)
                    }
                    domData.legendData = legendData
                    domData.seriesData = seriesData
                    domData.isChangeFlag = !domData.isChangeFlag
                  }
                  that.loadingOption = false
                })
            }
        },
        mounted() {
            this.disposeData(this.itemData)
        },
        beforeDestroy(){
          this.$refs.cameraHotRef.$refs.controlCheckRef.releaseNow()
        }
    }
</script>

<style lang="scss">
    .hotcameraPop{
        .vRed{
            .elDialogMain{
                height: 0 !important;
            }
        }
        .HistoricalDocuments .titleBtn{
            margin-right: 56px;
            margin-top: -39px;
        }
        .titleSpan{
            padding-right: 100px;
        }
    }
</style>

