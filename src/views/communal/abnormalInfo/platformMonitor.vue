<template>
    <div class="platformMonitor">
        <div class="breadcrumb">
            <Breadcrumb :dataList="dataBread" />
        </div>
        <div class="title">
            <span>平台监控</span>
        </div>
        <duno-main class="mainContain">
            <div class="main">
                <div class="popContain">
                    <power-pop />
                </div>
            </div>
        </duno-main>
        <!--<platform-line></platform-line>-->
    </div>
</template>

<script>
    import platformLine from "_c/duno-m/platformLine"
    import Breadcrumb from "_c/duno-c/Breadcrumb";
    import moment from "moment";
    import powerPop from '_c/duno-m/powerPop'
    import dunoMain  from '_c/duno-m/duno-main'
    export default {
        name: "platformMonitor",
        components: {
            platformLine,
            Breadcrumb,
            dunoMain,
            powerPop
        },
        data() {
            const that = this;
            return {
                dataBread: [
                    { path: "/abnormalInfoPath/home", name: "功能卡片" },
                    { path: "", name: "平台监控" },
                ]
            };
        },
        methods: {

        },
        created(){

        },
        beforeDestroy(){

        },
        mounted() {

        }
    };
</script>

<style lang="scss">
    @import "@/style/tableStyle.scss";
    .platformMonitor{
        position: absolute;
        top: -6px;
        width: calc(100% - 44px);
        .breadcrumb{

        }
        .title{
            color: white;
            margin: 7px 0;
        }
        .mainContain{
            height: calc(100vh - 143px);
            width: 100%;
            position: relative;
            .main{
                background: grey;
                width: 100%;
                height: 100%;
            }
            .popContain{
                /*background: pink;*/
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
            }
        }
    }
</style>
