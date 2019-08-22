<template>
    <div class="hotcameraPop" >
        <historical-documents :tabPaneData="tabPaneData" :showHeader="true"  :title="title"  width="770px" @on-show="changeCameraShow" @close="onClose" :dialogTableVisible="visible" class="historical">
            <hot-camera :deviceId="itemData['monitorDeviceId']" :itemData="itemData" :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></hot-camera>
            <polygonal-backup  @onChange="onChange" :isChange="isChange" :seriesData="seriesData" :xAxisData="xAxisData" :legendData="legendData" v-else-if="cameraFlag == 'fifth'"></polygonal-backup>
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
                tabPaneData:[
                    {
                        label: "实时监控",
                        name: "first"
                    },
                    {
                        label: "历史告警",
                        name: "fourth"
                    },
                    {
                        label: "历史数据",
                        name: "fifth"
                    },
                    {
                        label: "历史文件",
                        name: "sixth"
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
                const startTime = moment().add(-6,'hour').format('YYYY-MM-DD HH:mm:ss')
                const endTime = moment().format('YYYY-MM-DD HH:mm:ss')
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
                    startTime: `${this.startTime}`,
                    endTime: `${this.endTime}`,
                }
                getAxiosData(url, query).then( res => {
                    const dataList = res.data.dataList
                    const legendData = []
                    const xAxisData = []
                    const seriesData = []
                    for (let i = 0; i < dataList.length; i++) {
                        legendData.push(dataList[i].itemName)
                        const itemDataList = dataList[i].itemDataList
                        const obj = {
                            name: dataList[i].itemName,
                            type:'line',
                            data: []
                        }
                        for (let item in itemDataList) {
                            if (i == 0) {
                                xAxisData.push(itemDataList[item].time)
                            }
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
        .HistoricalDocuments .titleBtn{
            margin-right: 56px;
            margin-top: -39px;
        }
    }
</style>

