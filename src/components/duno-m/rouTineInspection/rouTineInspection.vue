<template>
    <div class="rouTineInspection" >
        <div class="title">
            <div class="circle"></div>
            <div class="name">任务模式</div>
            <pattery class="pattery"></pattery>
            <div class="moreTask">更多任务></div>
        </div>
        <div class="rouTine_Main">
            <div class="explain">
                <span class="name">例行巡视</span>
                <span class="taskId">任务ID：29106666</span>
            </div>
            <div class="item">
                <div class="name">已执行/总步骤：</div>
                <div class="info"><span class="lastCount">7</span>/32</div>
            </div>
            <div class="item">
                <div class="name">工作时长：</div>
                <div class="info">02:23:21</div>
            </div>
        </div>
        <div class="cameraMain"></div>
    </div>
</template>

<script>
    import pattery from '_c/duno-m/pattery'
    export default {
        name: 'rouTineInspection',
        components: {
            pattery
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
    .rouTineInspection{
        display: flex;
        height: 100%;
        flex-direction: column;
        .title{
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: center;
            border-bottom: 1px solid #1f455a;
            padding-bottom: 6px;
            .name{
                font-size: 14px;
                margin-right: 30px;
            }
            .pattery{
                flex: 1;
                display: flex;
                flex-direction: row;
                justify-content: start;
            }
            .circle{
                border-radius: 300px;
                background: #52f9bd;
                height: 10px;
                width: 10px;
                margin-right: 7px;
            }
            .moreTask{
                border: 1px solid #1f455a;
                border-radius: 4px;
                padding: 2px 5px;
                font-size: 13px;
                cursor: pointer;
            }
        }
        .rouTine_Main{
            .explain{
                display: flex;
                align-items: baseline;
                margin-top: 13px;
                margin-bottom: 5px;
                .name{
                    font-size: 17px;
                    margin-right: 22px;
                }
                .taskId{
                    color: #858a8f;
                    font-size: 14px;
                }
            }
            .item{
                margin-bottom: 7px;
                display: flex;
                align-items: center;
                .lastCount{
                    color: #4debb4;
                    font-size: 18px;
                }
                .name,.info{
                    color: #858a8f;
                    font-size: 14px;
                }
            }
        }
        .cameraMain{
            background: grey;
            flex: 1;
        }
    }
</style>

