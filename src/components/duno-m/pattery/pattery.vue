<template>
    <div class="rouTineInspection" >
        <div class="border">
            <div class="item">
            </div>
            <div class="item">
            </div>
            <div class="item">
            </div>
            <div class="item">
            </div>
            <div class="item">
            </div>
            <div class="realProcess" :style="{width: rate+'%'}"></div>
        </div>
        <div class="last"></div>
        <div class="data">{{ rate }}%</div>
    </div>
</template>

<script>
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    import Polygonal from '_c/duno-c/Polygonal'
    import hotCamera from '_c/duno-m/hotCamera'
    import cameraPanel from '_c/duno-m/cameraPanel'
    export default {
        name: 'rouTineInspection',
        components: {
            HistoricalDocuments,
            Polygonal,
            cameraPanel,
            hotCamera
        },
        data() {
            return {
                cameraFlag: 'first'
            }
        },
        props: {
          rate: {
              type: Number,
              default: 100
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

<style lang="scss" scoped>
    .rouTineInspection{
        display: flex;
        align-items: center;
        justify-content: center;
        .border{
            position: relative;
            border: 1px solid #52f9bd;
            width: 24px;
            height: 14px;
            display: flex;
            .item{
                position: relative;
                width: 4px;
                background: transparent;
                height: 100%;
                border-right: 1.1px solid #102432;
                z-index: 3;
                &:first-child{
                    margin-left: 0px;
                }
            }
            .realProcess{
                width: 100%;
                height: 10px;
                background: #52f9bd;
                position: absolute;
                top: 1px;
            }
        }
        .last{
            width: 3px;
            background: #52f9bd;
            height: 7px;
        }
        .data{
            font-size: 11px;
            margin-left: 3px;
            position: relative;
            top: 1px;
        }
    }
</style>

