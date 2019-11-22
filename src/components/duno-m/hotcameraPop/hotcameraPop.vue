<template>
    <div class="hotcameraPop" >
        <historical-documents :itemId="itemData['monitorDeviceId']" :tabPaneData="tabPaneData" :showHeader="true"  :title="title"  width="770px" @on-show="changeCameraShow" @close="onClose" :dialogTableVisible="visible" class="historical vRed">
            <hot-camera :deviceId="itemData['monitorDeviceId']" :itemData="itemData" :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></hot-camera>
            <polygonal-backup :itemData="itemData" :yName="yName"  @onChange="onChange" :isChange="isChange" :seriesData="seriesData" :xAxisData="xAxisData" :legendData="legendData" v-else-if="cameraFlag == 'fifth'"></polygonal-backup>
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
    import hotCamera from '_c/duno-m/hotCamera'
    import moment from 'moment'
    import cameraPanel from '_c/duno-m/cameraPanel'
    export default {
        name: 'cameraPop',
        components: {
            HistoricalDocuments,
            Polygonal,
            cameraPanel,
            hotCamera,
            historyfile,
            historyfourth,
            historyfourthBackup,
            PolygonalBackup,
            cameraPanelBackUP
        },
        data() {
            return {
                yName: '',
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
        computed: {

        },
        watch: {
            itemData: {
                handler(now) {
                    this.title = now.deviceMessage.name
                    if(now['realMonitorDeviceType']==3 || now['realMonitorDeviceType']==7){
                        this.tabPaneData.splice(this.tabPaneData.length-1,1)
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
                if(now == 'fifth'){
                    this.$emit('chang-Point', 1)
                }else{
                    this.$emit('chang-Point', -1)
                }
            },
            onClose(data){
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
                this.isGetData = true
            },
            getHistoryData () {
                this.isGetData = false
                const that = this
                const url = '/lenovo-plan/api/plan/history'
                const query = {
                    monitorDeviceId: that.itemId,
                    monitorDeviceType: that.monitorDeviceType,
                    startTime: `${this.startTime} 00:00:00`,
                    endTime: `${this.endTime} 23:59:59`,
                }
                getAxiosData(url, query).then( res => {
                    const dataList = res.data.dataList
                    that.yName = res.data.unit
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
    }
</style>

