<template>
    <div class="hotcameraPop" >
        <historical-documents :showHeader="true"  :title="title"  width="770px" @on-show="changeCameraShow" @close="onClose" :dialogTableVisible="visible" class="historical">
            <hot-camera :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></hot-camera>
        </historical-documents>
    </div>
</template>

<script>
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    import Polygonal from '_c/duno-c/Polygonal'
    import hotCamera from '_c/duno-m/hotCamera'
    import cameraPanel from '_c/duno-m/cameraPanel'
    export default {
        name: 'cameraPop',
        components: {
            HistoricalDocuments,
            Polygonal,
            cameraPanel,
            hotCamera
        },
        data() {
            return {
                title: '测试头部',
                cameraFlag: 'first'
            }
        },
        props: {
            index:{},
            visible:{
                type: Boolean,
                default: false
            }
        },
        computed: {

        },
        methods:{
            changeCameraShow(now){
                this.cameraFlag = now
            },
            onClose(data){
                this.$emit('onClose',data, this.index)
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    .hotcameraPop{

    }
</style>

