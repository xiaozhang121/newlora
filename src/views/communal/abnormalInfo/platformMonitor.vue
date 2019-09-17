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
                <gis-map kind="self" fillColor="rgba(14,27,38, 0.75)" :polygonData="[[[13215283.811880944,3776271.1453833655],[13232286.273360128,3776249.821483701],[13232286.273360128,3766246.2152650086],[13215280.527477384,3766246.919600075],[13215283.811880944,3776271.1453833655]]]" isDiagram="3" mapUrl="http://10.0.10.45:8202" />
                <div class="explainM">
                    <map-explain />
                </div>
                <div class="popContain" :class="{'hide': isHide}">
                    <power-pop @on-visible="onVisible"/>
                </div>
            </div>
        </duno-main>
        <!--<platform-line></platform-line>-->
        <!--<platform-box></platform-box>-->
    </div>
</template>

<script>
    import platformLine from "_c/duno-m/platformLine"
    import platformBox from "_c/duno-m/platformBox"
    import mapExplain from "_c/duno-m/mapExplain"
    import Breadcrumb from "_c/duno-c/Breadcrumb";
    import moment from "moment";
    import gisMap from '_c/duno-m/gisMap'
    import powerPop from '_c/duno-m/powerPop'
    import dunoMain  from '_c/duno-m/duno-main'
    export default {
        name: "platformMonitor",
        components: {
            platformLine,
            Breadcrumb,
            dunoMain,
            powerPop,
            gisMap,
            platformBox,
            mapExplain
        },
        data() {
            const that = this;
            return {
                isHide: false,
                dataBread: [
                    { path: "/abnormalInfoPath/home", name: "功能卡片" },
                    { path: "", name: "平台监控" },
                ]
            };
        },
        methods: {
            onVisible(){
                this.isHide = !this.isHide
            }
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
        .el-dialog__headerbtn .el-dialog__close{
            display: none;
        }
        .el-dialog__wrapper{
            width: 0;
            height: 0;
        }
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
            .ol-control button{
                color: #495f6f;
                background-color: white;
            }
            .ol-zoom{
                top: 1.5em;
                left: 1.5em;
            }
            .ol-zoom .ol-zoom-in{
                margin-bottom: 10px;
            }
            .ol-control{
                background-color: transparent;
            }
            .gisMap #map{
                height: 100% !important;
            }
            .explainM{
                position: absolute;
                right: 380px;
                top: 0;
            }
            .main{
                width: 100%;
                height: 100%;
            }
            .popContain{
                /*background: pink;*/
                height: 100%;
                position: absolute;
                right: 0;
                top: 0;
                transition: right .5s;
                &.hide{
                    right: -607px
                }
            }
        }
    }
</style>
