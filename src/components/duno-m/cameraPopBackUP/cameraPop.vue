<template>
    <div class="cameraPop" >
        <historical-documents :tabPaneData="tabPaneData" :showHeader="true"  :title="title" :itemId="itemId" width="744px" @on-show="changeCameraShow" @close="onClose" :dialogTableVisible="visible" class="historical vLight">
            <camera-panel-back-u-p  :itemData="itemData" :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></camera-panel-back-u-p>
            <polygonal-backup ref="polygonalRef" :itemData="itemData" :yName="yName" :flag='flag' @on-charts="onCharts"  @onChange="onChange" :isChange="isChange" :seriesData="seriesData" :xAxisData="xAxisData" :legendData="legendData" v-else-if="cameraFlag == 'fifth'"></polygonal-backup>
            <historyfile  :itemId="itemId" v-else-if="cameraFlag == 'sixth'"/>
            <historyfourth-backup   v-loading="loadingOption"
                                     element-loading-background="rgba(0, 0, 0, 0)"
                                    element-loading-text="请稍后，正在加载数据…"
            :itemId="itemId" :itemData="itemData" v-else-if="cameraFlag == 'fourth'"></historyfourth-backup>
        </historical-documents>
    </div>
</template>

<script>
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    import historyfile from "_c/historyfile"
    import historyfourth from "_c/historyfourth"
    import historyfourthBackup from "_c/historyfourthBackup"
    import Polygonal from '_c/duno-c/Polygonal'
    import PolygonalBackup from '_c/duno-c/PolygonalBackup'
    import cameraPanel from '_c/duno-m/cameraPanel'
    import cameraPanelBackUP from '_c/duno-m/cameraPanelBackUP'
    import moment from 'moment'
    import { getAxiosData } from '@/api/axiosType'
    export default {
        name: 'cameraPop',
        components: {
            cameraPanelBackUP,
            HistoricalDocuments,
            Polygonal,
            cameraPanel,
            historyfile,
            PolygonalBackup,
            historyfourth,
            historyfourthBackup
        },
        data() {
            return {
                typeChosen:'Single',
                presetPos: [],
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
                yName: '',
                flag:"",
                timer: null,
                loadingOption: false,
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
        watch: {
            itemData: {
                handler(now) {
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
                // if (now == 'fifth' && this.itemData && this.isGetData)
                //   this.getHistoryData()
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
              /*  if(now == 'fifth'){
                    this.$emit('chang-Point', 1)
                }else{
                    this.$emit('chang-Point', -1)
                }*/
            },
            onClose(data){
                this.$emit('onClose',data, this.index, 'cameraFlagVisible')
            },
            disposeData(data) {
                if (data && JSON.stringify(data) !== '{}') {
                    if (data.monitorDeviceType == '1' || data.monitorDeviceType == '99') {
                        this.title = data.deviceMessage.name || data.deviceMessage.cameraName
                    } else if (data.monitorDeviceType == '2') {
                        this.title = data.deviceMessage.cameraName
                    } else {
                        this.title = ''
                    }
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
                return xAxisData
            },
            getHistoryData () {
                this.isInit = true
                this.loadingOption = true
                this.isGetData = false
                this.timer = setTimeout(()=>{
                    this.loadingOption = false
                },1000000000)
                const that = this
                const url = '/lenovo-plan/api/plan/history/new'
                const query = {
                    monitorDeviceId: that.itemId,
                    monitorDeviceType: that.monitorDeviceType,
                    startTime: `${this.startTime}`,
                    endTime: `${this.endTime}`,
                    presetId: this.presetPos.join(',')
                }
                getAxiosData(url, query).then( res => {
                    const dataList = res.data.dataList
                    // let dataList = [
                    //   {
                    //     itemName: '项目名称（可见光为电网设备名称，热感为roi名称）222222222',
                    //     itemDataList: [
                    //         ['2019-01-01', '分'],
                    //         ['2019-01-02', '合'],
                    //         ['2019-01-06', '合']
                    //     ],
                    //     maxData: 100,
                    //     minData: 30,
                    //     unit: '单位',
                    //     flag: 1
                    //   },
                    //   {
                    //     itemName: '项目名称（可见光为电网设备名称，热感为roi名称）1111111111',
                    //     itemDataList: [
                    //       ['2019-01-01', 30],
                    //       ['2019-01-02', 70],
                    //       ['2019-01-06', 100]
                    //     ],
                    //     maxData: 100,
                    //     minData: 30,
                    //     unit: '单位123',
                    //     flag: 0
                    //   }
                    // ]
                    let xAxisData = that.getAxisData(dataList)
                    let domData = this.$refs.polygonalRef.$data
                    domData.chartsType = this.typeChosen
                    if(this.typeChosen == 'Single'){
                      domData.chartsList = dataList
                      this.$refs.polygonalRef.changeActive(0)
                    }else{
                      this.$refs.polygonalRef.chartsList = []
                      domData.xAxisData = xAxisData
                    }
                    clearTimeout(this.timer)
                    that.loadingOption = false
                })
            }
        },
        mounted() {
            this.disposeData(this.itemData)
        }
    }
</script>
<style lang="scss">
    .cameraPop{
        .vLight{
            .elDialogMain{
                height: 0 !important;
            }
        }
        .el-loading-text{
            color: #969696   !important;
        }
        .HistoricalDocuments{
            .titleBtn{
                margin-right: 48px;
                margin-top: -73px;
            }
            .titleSpan{
                padding-right: 80px;
                height: 86px;
            }
        }
        .historyfile{
            padding-bottom: 15px;
        }
    }
</style>

