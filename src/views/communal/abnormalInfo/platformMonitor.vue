<template>
    <div class="platformMonitor">
        <div class="breadcrumb">
            <Breadcrumb :dataList="dataBread" />
        </div>
        <div class="title">
            <span>平台监控</span>
        </div>
        <duno-main class="mainContain">
            <div class="main" :class="{'isHide': isHide}">
                <gis-map kind="self" @toDetail="toDevice"  ref="gisMapObj" :deviceList="deviceList" fillColor="rgba(14,27,38, 0.75)" :polygonData="[[[13215283.811880944,3776271.1453833655],[13232286.273360128,3776249.821483701],[13232286.273360128,3766246.2152650086],[13215280.527477384,3766246.919600075],[13215283.811880944,3776271.1453833655]]]" isDiagram="3" mapUrl="http://10.0.10.45:8202" />
                <div class="explainM"  :class="{'hide': isHide}">
                    <map-explain />
                </div>
                <div class="popContain" :class="{'hide': isHide}">
                    <power-pop @on-visible="onVisible"/>
                </div>
            </div>
        </duno-main>
        <platform-line :showList="false" :visible="visible" @on-close="onClose()" :dataInfo="dataInfo"></platform-line>
        <!--<platform-box></platform-box>-->
    </div>
</template>

<script>
    import { deviceLocation, deviceList, lastDeviceList } from '@/api/currency/currency.js'
    import platformLine from "_c/duno-m/platformLine"
    import platformBox from "_c/duno-m/platformBox"
    import mapExplain from "_c/duno-m/mapExplain"
    import Breadcrumb from "_c/duno-c/Breadcrumb";
    import moment from "moment";
    import gisMap from '_c/duno-m/gisMap'
    import powerPop from '_c/duno-m/powerPop'
    import dunoMain  from '_c/duno-m/duno-main'
    import mixinViewModule from "@/mixins/view-module";
    export default {
        name: "platformMonitor",
        mixins: [mixinViewModule],
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
                dataInfo: null,
                visible: false,
                deviceList: [],
                tempDeviceList: [],
                caisson: require('@/apiData/caisson'),
                reticle: require('@/apiData/reticle'),
                fiber: require('@/apiData/fiber'),
                fBox: require('@/apiData/fBox'),
                wirelessAP: require('@/apiData/wirelessAP'),
                isHide: false,
                dataBread: [
                    { path: "/abnormalInfoPath/home", name: "功能卡片" },
                    { path: "", name: "平台监控" },
                ]
            };
        },
        watch: {
            isHide(now){
                this.$nextTick(()=>{
                    this.$refs.gisMapObj.mapTarget.updateSize()
                })
            }
        },
        methods: {
            onClose(){
                this.visible = false
            },
            toDevice(item, index, targetd, modelIndex = 0, flag){
                let type = item['monitorDeviceType']
                this.dataInfo = item
                if(type == 1 || type == 2)
                    this.visible = true
            },
            setAP(){
              const that = this
              let data = that.wirelessAP.default
              let arr = []
              data.forEach((item, index)=>{
                  arr.push({
                      cadX: item['location'][0],
                      cadY: item['location'][1],
                      realX:item['location'][0],
                      realY:item['location'][1],
                      xCad:item['location'][0],
                      yCad:item['location'][1],
                      show: true,
                      isShow: true,
                      monitorDeviceName: item['name'].trim(),
                      src: that.AP
                  })
              })
                return arr
            },
            setCaisson(){
                const that = this
                let data = that.caisson.default
                let arr = []
                data.forEach((item, index)=>{
                    arr.push({
                        cadX: item['location'][0],
                        cadY: item['location'][1],
                        realX:item['location'][0],
                        realY:item['location'][1],
                        xCad:item['location'][0],
                        yCad:item['location'][1],
                        show: true,
                        isShow: true,
                        monitorDeviceName: item['name'].trim(),
                        src: that.waterBox
                    })
                })
                return arr
            },
            getDeviceList(){
                const that = this
                deviceLocation().then(res=>{
                    let data = res.data
                    data.map((item, index)=>{
                        if(item['monitorDeviceType'] == 1 || item['monitorDeviceType'] == 99 || item['monitorDeviceType'] == 5){
                            if (item.deviceMessage.supportPreset) {
                                item['src'] = that.light
                            }else{
                                item['src'] = that.lightNoCamera
                            }
                            if(item['monitorDeviceType'] == 5){
                                item['src'] = that.lightD
                            }
                        }else if(item['monitorDeviceType'] == 2){
                            if(item.deviceMessage.supportPreset){
                                item['src'] = that.redLightCamera
                            }else{
                                item['src'] = that.redLight
                            }
                        }
                        item['show'] = true
                        item['isShow'] = true
                    })
                    let ap = that.setAP()
                    let waterBox = that.setCaisson()
                    // debugger
                    data = data.concat(ap)
                    data = data.concat(waterBox)
                    that.deviceList = data
                    that.tempDeviceList = data
                })
            },
            arrHandle(data){
                let arr = []
                for(let i=0; i<data.length; i++){
                    if(data[i].location.length){
                        arr.push(data[i].location)
                    }
                }
                return arr
            },
            handleFiber(){
                const that = this
                let data = that.fiber.default
                data.forEach((item, index) => {
                        let arr = that.arrHandle(item)
                        that.$refs.gisMapObj.setDrawLine(arr, 1, [0, 0], '#c7b299', 3, item)
                })
            },
            handlefBox(){
                const that = this
                let data = that.fBox.default
                data.forEach((item, index) => {
                    let arr = that.arrHandle(item)
                    that.$refs.gisMapObj.setDrawLine(arr, 1, [0, 0], '#ee183b', 3, item)
                })
            },
            handleReticle(){
                const that = this
                let data = that.reticle.default
                data.forEach((item, index) => {
                    let arr = that.arrHandle(item)
                    that.$refs.gisMapObj.setDrawLine(arr, 1, [0, 0], '#0071bc', 3, item)
                })
            },
            onVisible(){
                this.isHide = !this.isHide
            }
        },
        created(){
        },
        beforeDestroy(){

        },
        mounted() {
            this.handleReticle()
            this.handleFiber()
            this.handlefBox()
            this.getDeviceList()
        }
    };
</script>

<style lang="scss">
    @import "@/style/tableStyle.scss";
    .platformMonitor{
        position: absolute;
        top: -6px;
        width: calc(100% - 44px);
        .el-dialog{
            transform: translateX(83%) translateY(18%);
        }
        .el-dialog__headerbtn .el-dialog__close{
            /*display: none;*/
            position: relative;
            top: 9px;
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
            .dunoMain_nr{
                .main{
                    width: calc(100% - 628px);
                    height: 100%;
                    &.isHide{
                        width: 100%;
                    }
                }
            }
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
                right: 645px;
                top: 0;
                transition: right .5s;
                &.hide{
                    right: 40px;
                }
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
