<template>
    <div class="cameraPop" >
        <historical-documents  width="770px" @on-show="changeCameraShow" @close="onClose" :dialogTableVisible="visible" class="historical">
            <camera-panel :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></camera-panel>
            <polygonal v-else-if="cameraFlag == 'fifth'"></polygonal>
        </historical-documents>
    </div>
</template>

<script>
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    import Polygonal from '_c/duno-c/Polygonal'
    import cameraPanel from '_c/duno-m/cameraPanel'
    export default {
        name: 'cameraPop',
        components: {
            HistoricalDocuments,
            Polygonal,
            cameraPanel
        },
        data() {
            return {
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
    .cameraPop{

    }
</style>

