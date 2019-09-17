<template>
    <div class="platformLine" >
        <historical-documents :tabPaneData="tabPaneData" :showHeader="true"  :title="title"  width="470px" @on-show="onChange" @close="onClose" :dialogTableVisible="visible" class="historical">
            <div class="mainPanel">
                <div class="explain">
                    <div class="p_title">型号：</div>
                    <div class="nr">LS-6520-51QF-E1</div>
                </div>
                <div class="explain">
                    <div class="p_title">IP：</div>
                    <div class="nr">171.12.12.165</div>
                </div>
                <div class="status">
                    <div class="circle"></div>
                    <div class="nr">
                        正常
                    </div>
                    <div class="link">
                        104m/s
                    </div>
                </div>
                <div class="connectDevice">
                    <div class="titleD">
                        <span>连接的监测设备 (10/12)</span>
                        <a href="javascript:void(0)">详情>></a>
                    </div>
                    <div class="mainD">
                        <ul :class="{'overflow': deviceLength}">
                            <li v-for="(item, index) in deviceList" :key="index" :class="{'colorLine': (index+1)%2!=0}">
                                <div class="nowS" :class="[{'green': item['status'] == 'green'}, {'red': item['status']  == 'red'}]"></div>
                                <div class="nrS">{{ item['cameraName'] }}</div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </historical-documents>
    </div>
</template>

<script>
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    export default {
        name: 'platformLine',
        components: {
            HistoricalDocuments
        },
        data() {
            return {
                tabPaneData: [],
                title: '24口万兆交换机',
                visible: true,
                deviceList: [
                    {status: 'green', cameraName: '4号主变红外11号摄像头'},
                    {status: 'green', cameraName: '4号主变红外11号摄像头'},
                    {status: 'red', cameraName: '4号主变红外11号摄像头'},
                    {status: 'green', cameraName: '4号主变红外11号摄像头'},
                    {status: 'green', cameraName: '4号主变红外11号摄像头'},
                    {status: 'green', cameraName: '4号主变红外11号摄像头'}
                ]
            }
        },
        props: {

        },
        watch: {

        },
        computed: {
            deviceLength(){
                if(this.deviceList.length > 6){
                    return true
                }else{
                    return false
                }
            }
        },
        methods:{
            onChange(){

            },
            onClose(){

            }
        },
        created(){
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    .mainPanel{
        display: flex;
        flex-direction: column;
        .overflow{
            overflow-y: auto;
        }
        .explain{
            display: flex;
            font-size: 18px;
            color: #cccccc;
            margin-top: 10px;
            .p_title{
            }
            .nr{
                display: flex;
                align-items: center;
            }
        }
        .status{
            display: flex;
            align-items: center;
            margin-top: 10px;
            .circle{
                background: #1fc17f;
                border-radius: 100%;
                width: 15px;
                height: 15px;
                margin-right: 12px;
            }
            .nr{
                color: white;
                font-size: 16px;
            }
            .link{
                margin-left: 20px;
                font-size: 16px;
                color: #138150;
            }
        }
        .connectDevice{
            margin-top: 12px;
            .titleD{
                display: flex;
                justify-content: space-between;
                font-size: 16px;
                a{
                    text-decoration: underline;
                }
            }
            .mainD{
                ul{
                    margin-top: 10px;
                    max-height: 240px;
                    li{
                        display: flex;
                        align-items: center;
                        line-height: 40px;
                        padding: 0 14px;
                        &.colorLine{
                            background-color: #2a526c;
                        }
                        .nowS{
                            width: 15px;
                            height: 15px;
                            margin-right: 10px;
                            &.green{
                                background-color: #15af4f;
                            }
                            &.red{
                                background-color: #f0183a;
                            }
                        }
                        .nrS{

                        }
                    }
                }
            }
        }
    }
</style>


