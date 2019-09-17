<template>
    <div class="platformBox" >
        <historical-documents :tabPaneData="tabPaneData" :showHeader="true"  :title="title"  width="470px" @on-show="onChange" @close="onClose" :dialogTableVisible="visible" class="historical">
            <div class="mainPanel">

            </div>
        </historical-documents>
    </div>
</template>

<script>
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    export default {
        name: 'platformBox',
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
    .platformBox{
        display: flex;
        flex-direction: column;
        .pop_title{
            margin-bottom: 9px;
            & > div{
                display: flex;
                position: relative;
                left: -13px;
            }
            .line{
                margin: 0 10px;
                height: 100%;
                width: 3px;
                display: inline-block;
                .block{
                    background: #106461;
                    height: 19.3%;
                    width: 2px;
                    display: inline-block;
                    float: left;
                    margin-bottom: 2px;
                }
            }
            .nr{
                margin-top: -2px;
                color: white;
                font-size: 16px;
            }
            display: flex;
            justify-content: space-between;
            a{
                font-size: 15px;
                text-decoration: underline;
            }
        }
        .mainPanel{

        }
    }
</style>


