<template>
    <div class="rouTineInspection" >
        <div class="rouTineInspection_left">
            <div class="nr">
                <div class="main">
                    <gis-map v-if="mapShow" :rebot="true" :deviceList="deviceList" :zoom="16"  ref="gisMapObj" fillColor="#0f1c22" :small="true"  :controlBtn="false" :isDiagram="2"  ></gis-map>
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
                    <div class="info">{{  workTime  }}</div>
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
                mapShow: false,
                isFirst: true,
                workTime: '',
                state: 1,
                stateF: 1,
                timer: null,
                deviceList: [],
                robot: require('@/assets/buttonPng/robot.png'),
                taskName: '开始任务',
                cameraFlag: 'first',
            }
        },
        props: {
            isChange:{},
            robotId: {},
            substationId: {},
            robotStatus: {},
            taskStatus: {},
            index:{},
            visible:{
                type: Boolean,
                default: false
            }
        },
        watch:{
            taskName(now){
                if(now.indexOf('开始任务')>-1){

                }
            },
            isChange(now){
               setTimeout(()=>{
                   try{
                       this.$refs.gisMapObj.rmCover(this.$refs.gisMapObj.pointListObj[0]['anchor'])
                   }catch (e) {}
                   try{
                       this.$refs.gisMapObj.removeLineList(this.$refs.gisMapObj.coverList)
                   }catch (e) {}
               },700)
            },
            taskStatus:{
                handler(now){
                    if(now){
                        this.initData()
                        if(now['startInspectionTime'] == 0){
                            this.workTime = "0:00:00"
                        }else{
                        let times = new Date().getTime() - now['startInspectionTime']
                        this.workTime = this.formatDuring(times)
                        }
                        this.stateF = now['taskState']
                        if(now['taskState'] == 2){
                          this.taskName = '暂停任务'
                        }else{
                          this.taskName = '开始任务'
                        }
                        this.$nextTick(()=>{
                            clearInterval(this.timer)
                            this.timer = null
                            this.initData()
                            this.timer = setInterval(()=>{
                                this.initData()
                            },3000)
                            this.$emit('on-fresh')
                        })
                    }
                },
                deep: true,
                immediate: true
            }
        },
        computed: {

        },
        methods:{
            formatDuring(mss) {
                let days = parseInt(mss / (1000 * 60 * 60 * 24));
                let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                minutes = minutes<10?'0'+minutes:minutes
                let seconds = parseInt((mss % (1000 * 60)) / 1000);
                return hours + ":" + minutes + ":" + (Number(seconds)<10?'0'+seconds:seconds);
            },
            arrHandle(data){
                let arr = []
                for(let i=0; i<data.length; i++){
                    if(data[i] && 'cadX' in data[i])
                        arr.push([data[i]['cadX'],data[i]['cadY']])
                }
                return arr
            },
            initData(){
                const that = this
                postAxiosData('/lenovo-robot/rest/taskMap',{taskId:this.taskStatus['taskId'],taskRunHisId: that.taskStatus['taskRunHisId']}).then(res=>{
                    let data = res.data.details
                    let arr = that.arrHandle(data)
                    let arrT = []
                    try{
                       arrT = that.arrHandle(that.robotStatus['hisLocation'])
                    }catch (e) {}
                    that.$nextTick(()=>{
                        try{
                        that.clearLine()
                        that.$refs.gisMapObj.setDrawLine(arr, 0, [10, 10])
                        if(arr.length && !that.robotStatus['curLocation'] && that.isFirst){
                            that.isFirst = false
                            that.$refs.gisMapObj.setCenter({cadX:arr[0][0], cadY: arr[0][1], flag: true})
                        }
                        that.$refs.gisMapObj.setDrawLine(arrT, 1, [0, 0])
                        that.robotStatus['curLocation']['src'] = that.robot
                        that.robotStatus['curLocation']['show'] = true
                        if(that.$refs.gisMapObj.pointListObj.length) {
                            that.$refs.gisMapObj.setOverlayPos(that.robotStatus['curLocation'])
                        }else{
                            that.deviceList.push(that.robotStatus['curLocation'])
                            that.$refs.gisMapObj.setCenter(that.robotStatus['curLocation'])
                        }
                        }catch (e) {}
                    })
                })
            },
            clearLine(){
                try{
                const that = this
                let arr = that.$refs.gisMapObj.coverList
                that.$refs.gisMapObj.removeLineList(arr)
                }catch (e) {
                    
                }
            },
            changeTaskStatus(){
                if(this.stateF == 1){
                    this.stateF = 2
                    this.state = '2'
                }else if(this.stateF == 2){
                    this.stateF = 1
                    this.state = '1'
                }
                if(this.taskName.indexOf('开始')>-1){
                    this.taskName = '暂停任务'
                }else{
                    this.taskName = '开始任务'
                }
                postAxiosData('/lenovo-robot/rest/taskControl', {substationID: this.substationId, robotID: this.robotId, state: this.state, taskID: this.taskStatus['taskId']}).then(res=>{
                    this.$message.success('操作成功')
                })
            },
            changeCameraShow(now){
                this.cameraFlag = now
            },
            onClose(data){
                this.$emit('onClose',data, this.index)
            }
        },
        mounted() {
            setTimeout(()=>{
                this.mapShow = true
                this.$nextTick(()=>{
                    document.querySelector('#map').setAttribute('style','height:100% !important')
                })
            },3000)
            try{

            }catch (e) {
                
            }
        },
        beforeDestroy(){
            try {
                document.querySelector('#map').setAttribute('style', 'height:calc( 100vh - 166px) !important')
            }catch (e) {
                
            }
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

