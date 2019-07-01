<template>
    <div class="cameraPop" >
        <historical-documents  width="770px" @on-show="changeCameraShow" @close="onClose" :dialogTableVisible="visible" class="historical">
            <camera-panel  :itemData="itemData" :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></camera-panel>
            <polygonal v-else-if="cameraFlag == 'fifth'"></polygonal>
            <historyfile :title="title" :itemId="itemId" v-if="cameraFlag == 'sixth'"/>
        </historical-documents>
    </div>
</template>

<script>
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    import historyfile from "_c/historyfile"
    import Polygonal from '_c/duno-c/Polygonal'
    import cameraPanel from '_c/duno-m/cameraPanel'
    export default {
        name: 'cameraPop',
        components: {
            HistoricalDocuments,
            Polygonal,
            cameraPanel,
            historyfile
        },
        data() {
            return {
                cameraFlag: 'first',
                title: '',
                itemId: null
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
            }
        },
        methods:{
            changeCameraShow(now){
                this.cameraFlag = now
            },
            onClose(data){
                this.$emit('onClose',data, this.index, 'cameraFlagVisible')
            },
            disposeData(data) {
                if (data && JSON.stringify(data) !== '{}') {
                    console.log(data)
                    if (data.monitorDeviceType == '1') {
                        this.title = data.deviceMessage.name
                    } else if (data.monitorDeviceType == '2') {
                        this.title = data.deviceMessage.cameraName
                    } else {
                        this.title = ''
                    }
                    this.itemId = data.areaId
                } else {
                    this.title = ''
                    this.itemId = null
                }
            }
        },
        mounted() {
            this.disposeData(this.itemData)
        }
    }
</script>

<style lang="scss">
    .cameraPop{

    }
</style>

