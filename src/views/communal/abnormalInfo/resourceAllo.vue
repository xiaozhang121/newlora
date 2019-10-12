<template>
    <div class="resourceAllo">
        <div class="aaaaaaaaa" style="height: 3px; width: 100%; position: fixed"></div>
        <div class="breadcrumb">
            <Breadcrumb :dataList="dataBread" />
        </div>
        <div class="title">
            资源布置图
        </div>
        <duno-main>
            <div class="contain">
                <div class="opera">
                    <div class="picMain">
                        <div class="pic_contain"></div>
                    </div>
                    <div class="panel">
                    </div>
                    <div class="line">

                    </div>
                </div>
            </div>
        </duno-main>
    </div>
</template>

<script>
    import dunoMain from "_c/duno-m/duno-main";
    import Breadcrumb from "_c/duno-c/Breadcrumb";
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    export default {
        name: "resourceAllo",
        components: {
            Breadcrumb,
            dunoMain
        },
        computed: {

        },
        watch: {

        },
        data() {
            const that = this;
            return {
                xValue: '',
                yValue: '',
                dataBread:[
                    { path: "/abnormalInfoPath/home", name: "功能卡片" },
                    { path: "", name: "平台监控" },
                    { path: "", name: "无线AP" }
                ]
            };
        },
        created() {

        },
        methods: {
            toDemo(event){
                this.xValue = event.pageX
                this.yValue = event.pageY
                console.log(event.pageX)
                console.log(event.pageY)
            }
        },
        mounted(){
            const that = this
            document.addEventListener('click',function () {
                this.xValue = event.pageX
                this.yValue = event.pageY
                console.log(this.xValue)
                console.log(this.yValue)
                document.querySelector('.aaaaaaaaa').style.left=this.xValue+'px'
                document.querySelector('.aaaaaaaaa').style.top=this.yValue+'px'
                document.querySelector('.aaaaaaaaa').style.width = document.querySelector('.line').getBoundingClientRect().left-this.xValue+'px'
            })
        }
    };
</script>

<style lang="scss">
    @import "@/style/tableStyle.scss";
    .aaaaaaaaa{
        height: 3px;
        width: 100%;
        position: fixed;
        z-index: 99999999999999;
        top: 0;
        left: 0;
        background: red;
    }
    .resourceAllo{
        .title{
            color: white;
            margin: 15px 0;
        }
        .dunoMain{
            height: calc(100% - 113px);
            .dunoMain_nr{
                border: 1.5px solid #5a5d5f;
            }
            .contain{
                padding: 0 120px;
                width: 100%;
                height: 100%;
                .opera{
                    width: 100%;
                    height: 100%;
                    position: relative;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    .picMain{
                        width: 63%;
                        height: 91%;
                        background: grey;
                        padding-right: 5%;
                        .pic_contain{
                            width: 100%;
                            height: 100%;
                            background: #2b3138;
                        }
                    }
                    .panel{
                        flex-grow: 1;
                        height: 91%;
                        background: pink;
                    }
                    .line{
                        width: 9%;
                        height: 3px;
                        position: absolute;
                        background: #1e6abc;
                        top: 18%;
                        left: 60%;
                    }
                }
            }
        }
    }
</style>
