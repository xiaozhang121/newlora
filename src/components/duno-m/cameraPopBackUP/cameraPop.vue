<template>
    <div class="cameraPop" >
        <historical-documents :tabPaneData="tabPaneData" :showHeader="true"  :title="title" :itemId="itemId" width="744px" @on-show="changeCameraShow" @close="onClose" :dialogTableVisible="visible" class="historical vLight">
            <camera-panel-back-u-p  :itemData="itemData" :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></camera-panel-back-u-p>
            <polygonal-backup :yName="yName" :flag='flag'  @onChange="onChange" :isChange="isChange" :seriesData="seriesData" :xAxisData="xAxisData" :legendData="legendData" v-else-if="cameraFlag == 'fifth'"></polygonal-backup>
            <historyfile  :itemId="itemId" v-else-if="cameraFlag == 'sixth'"/>
            <historyfourth-backup   v-loading="loadingOption"
                                    element-loading-background="rgba(0, 0, 0, 0.8)"
                                    element-loading-text="加载中"
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
                isGetData: false
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
                    if(now['realMonitorDeviceType']==3 || now['realMonitorDeviceType']==7){
                        this.tabPaneData.splice(this.tabPaneData.length-1,1)
                    }
                    this.disposeData(now)
                },
                deep: true,
                immediate: true
            },
            cameraFlag (now) {
                if (now == 'fifth' && this.itemData && this.isGetData) this.getHistoryData()
            },
            isGetData (now) {
                if (now)  this.getHistoryData()
            }
        },
        methods:{
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
                this.isGetData = true
            },
            getHistoryData () {
                this.loadingOption = true
                this.isGetData = false
                this.timer = setTimeout(()=>{
                    this.loadingOption = false
                },1000000000)
                const that = this
                const url = '/lenovo-plan/api/plan/history'
                const query = {
                    monitorDeviceId: that.itemId,
                    monitorDeviceType: that.monitorDeviceType,
                    startTime: `${this.startTime}`,
            endTime: `${this.endTime}`,
                }
                getAxiosData(url, query).then( res => {
                    const dataList = res.data.dataList
                    that.yName = res.data.unit
                    that.flag = res.data.flag
                    const legendData = []
                    let xAxisData = []
                    const seriesData = []
                    for (let i = 0; i < dataList.length; i++) {
                        legendData.push(dataList[i].itemName)
                        const itemDataList = dataList[i].itemDataList
                        let obj = {
                            name: dataList[i].itemName,
                            type:'line',
                            data: []
                        }
                        if(res.data.flag){
                            obj['step'] = 'start'
                        }
                        xAxisData = []
                        for (let item in itemDataList) {
                            xAxisData.push(itemDataList[item].time)
                            obj.data.push(Number(itemDataList[item].data))
                        }
                        seriesData.push(obj)
                    }
                    clearTimeout(this.timer)
                    that.loadingOption = false
                    that.legendData = legendData
                    that.xAxisData = xAxisData
                    that.seriesData = seriesData
                    that.isChange = !that.isChange
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
                margin-top: -40px;
            }
        }
        .historyfile{
            padding-bottom: 15px;
        }
    }
</style>

