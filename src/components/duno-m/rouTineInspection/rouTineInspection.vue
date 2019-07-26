<template>
    <div class="rouTineInspection" >
        <div class="rouTineInspection_left">
            <div class="nr">
                <div class="main">
                    <gis-map :lineDash="[10,10]" ref="gisMapObj" fillColor="#0f1c22" :small="true"  :controlBtn="false" :isDiagram="2"  ></gis-map>
                </div>
            </div>
        </div>
        <div class="rouTineInspection_right">
            <div class="title">
                <div class="circle"></div>
                <div class="name">任务模式</div>
                <pattery :rate="robotStatus['battery']" class="pattery"></pattery>
            </div>
            <div class="rouTine_Main">
                <div class="explain">
                    <span class="name">{{ taskStatus['inspectionName']?taskStatus['inspectionName']:'暂无名称' }}</span>
                    <span class="taskId">任务ID：{{ taskStatus['taskId'] }}</span>
                </div>
                <div class="item">
                    <div class="name">已执行/总步骤：</div>
                    <div class="info"><span class="lastCount">{{ taskStatus['doneStepsCnt'] }}</span>/{{ taskStatus['totalStepsCnt'] }}</div>
                </div>
                <div class="item">
                    <div class="name">工作时长：</div>
                    <div class="info">{{  taskStatus['startInspectionTime']  }}</div>
                </div>
                <div v-if="taskStatus['taskType'] == '1504'">
                    <button-custom class="stopTask" @click.native="changeTaskStatus" :title="taskName" />
                </div>
            </div>
        </div>
        <div class="rouTineInspection_last">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import mixinWebSocket from '@/mixins/webSocket'
    import pattery from '_c/duno-m/pattery'
    import gisMap from '_c/duno-m/gisMap'
    import buttonCustom from '_c/duno-m/buttonCustom'
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    export default {
        mixins: [mixinWebSocket],
        name: 'rouTineInspection',
        components: {
            pattery,
            gisMap,
            buttonCustom
        },
        data() {
            return {
                taskName: '开始任务',
                cameraFlag: 'first'
            }
        },
        props: {
            robotStatus: {},
            taskStatus: {},
            index:{},
            visible:{
                type: Boolean,
                default: false
            }
        },
        watch:{
            taskStatus:{
                handler(now){
                    if(now)
                        this.initData()
                },
                deep: true,
                immediate: true
            }
        },
        computed: {

        },
        methods:{
            initData(){
                const that = this
                getAxiosData('/lenovo-robot/rest/taskMap',{taskRunHisId: that.taskStatus['taskRunHisId']}).then(res=>{
                    let arr = []
                    let data = res.data.details
                    for(let i=0; i<data.length; i++){
                        if(data[i] && 'cadX' in data[i])
                            arr.push([data[i]['cadX'],data[i]['cadY']])
                    }
                    that.$nextTick(()=>{
                        that.$refs.gisMapObj.setDrawLine(arr, 0)
                    })
                })
            },
            changeTaskStatus(){

                if(this.taskName.indexOf('开始')>-1){
                    this.taskName = '结束任务'
                }else{
                    this.taskName = '开始任务'
                }
            },
            changeCameraShow(now){
                this.cameraFlag = now
            },
            onClose(data){
                this.$emit('onClose',data, this.index)
            }
        },
        mounted() {
            document.querySelector('#map').setAttribute('style','height:100% !important')
        },
        beforeDestroy(){
            document.querySelector('#map').setAttribute('style','height:calc( 100vh - 166px) !important')
        }
    }
</script>

<style lang="scss">
    .rouTineInspection{
        display: flex;
        height: 100%;
        .rouTineInspection_left{
            width: 49.5%;
            padding-bottom: 17%;
            position: relative;
            .nr{
                width: 100%;
                height: 100%;
                position: absolute;
                padding: 2%;
                padding-right: 0;
                .main{
                    width: 100%;
                    height: 100%;
                    background: #0f1c22;
                }
            }
        }
        .rouTineInspection_right{
            flex-grow: 1;
            padding: 1%;
            padding-left: 1.5%;
            position: relative;
            .title{
                width: 100%;
                display: flex;
                flex-direction: row;
                align-items: center;
                border-bottom: 1px solid #1f455a;
                padding-bottom: 13px;
                .name{
                    font-size: 14px;
                    margin-right: 30px;
                }
                .pattery{
                    flex: 1;
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
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
                .stopTask{
                    width: 140px;
                    font-size: 14px;
                    line-height: 35px;
                    height: 40px;
                    position: absolute;
                    bottom: 19px;
                }
                .explain{
                    display: flex;
                    align-items: baseline;
                    margin-top: 13px;
                    margin-bottom: 20px;
                    .name{
                        font-size: 17px;
                        margin-right: 22px;
                    }
                    .taskId{
                        color: #cccccc;
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
                        color: #cccccc;
                        font-size: 14px;
                    }
                }
            }
        }
        .rouTineInspection_last{
            display: inline-flex;
            align-items: center;
        }
    }
</style>

