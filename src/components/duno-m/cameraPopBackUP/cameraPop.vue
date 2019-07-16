<template>
    <div class="cameraPop" >
        <historical-documents :showHeader="true"  :title="title" :itemId="itemId" width="744px" @on-show="changeCameraShow" @close="onClose" :dialogTableVisible="visible" class="historical">
            <camera-panel-back-u-p  :itemData="itemData" :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></camera-panel-back-u-p>
            <polygonal-backup  @onChange="onChange" :isChange="isChange" :seriesData="seriesData" :xAxisData="xAxisData" :legendData="legendData" v-else-if="cameraFlag == 'fifth'"></polygonal-backup>
            <historyfile  :itemId="itemId" v-else-if="cameraFlag == 'sixth'"/>
            <historyfourth-backup  :itemId="itemId" :itemData="itemData" v-else-if="cameraFlag == 'fourth'"></historyfourth-backup>
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
                    this.disposeData(now)
                },
                deep: true
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
                    if (data.monitorDeviceType == '1' || data.monitorDeviceType == '99') {
                        this.title = data.deviceMessage.name || data.deviceMessage.cameraName
                    } else if (data.monitorDeviceType == '2') {
                        this.title = data.deviceMessage.cameraName
                    } else {
                        this.title = ''
                    }
                    this.monitorDeviceType = data.monitorDeviceType
                    this.itemId = data.areaId
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

