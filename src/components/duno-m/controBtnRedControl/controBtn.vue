<template>
    <div class="controBtn" >
        <div class="btnList" style="padding-bottom: 0; ">
            <div class="description">
                调整镜头
            </div>
            <div class="row">
                <div class="btn" :class="{'active':activeNum == 6  && activeStyle}" :style="'background:url('+ xjBtn +');'" @mousedown="viewCamera(6, false)" @mouseup="viewCamera(6, true)"></div>
                <div class="btn" :class="{'actived':activeNum == 3  && activeStyle}" :style="'background:url('+ squera +'); transform: rotate(90deg);'" @mousedown="viewCamera(3, false)"  @mouseup="viewCamera(3, true)"></div>
                <div class="btn"  :class="{'active':activeNum == 5  && activeStyle}" :style="'background:url('+ xjBtn +'); transform: rotate(90deg);'" @mousedown="viewCamera(5, false)"   @mouseup="viewCamera(5, true)"></div>
            </div>
            <div class="row">
                <div class="btn" :class="{'actived':activeNum == 2  && activeStyle}" :style="'background:url('+ squera +')'"  @mousedown="viewCamera(2, false)" @mouseup="viewCamera(2, true)"></div>
                <div class="btn" style="visibility: hidden"></div>
                <div class="btn"  :class="{'actived':activeNum == 1  && activeStyle}" :style="'background:url('+ squera +');transform: rotate(180deg);position: relative;'" @mousedown="viewCamera(1, false)" @mouseup="viewCamera(1, true)"></div>
            </div>
            <div class="row">
                <div class="btn"  :class="{'active':activeNum == 8  && activeStyle}" :style="'background:url('+ xjBtn +'); transform: rotate(270deg);'" @mousedown="viewCamera(8, false)" @mouseup="viewCamera(8, true)"></div>
                <div class="btn" :class="{'actived':activeNum == 4  && activeStyle}" :style="'background:url('+ squera +');transform: rotate(270deg);'" @mousedown="viewCamera(4, false)" @mouseup="viewCamera(4, true)"></div>
                <div class="btn" :class="{'active':activeNum == 7  && activeStyle}"  :style="'background:url('+ xjBtn +'); transform: rotate(180deg);'" @mousedown="viewCamera(7, false)" @mouseup="viewCamera(7, true)"></div>
            </div>
            <div class="control_slider" style="visibility: hidden">
                <i class="iconfont icon-suoxiao1"></i>
                <el-slider class="elSlider" :disabled="disabled" @change="cameraSF" v-model="sliderValue" :min="1" :max="20"></el-slider>
                <i class="iconfont icon-fangda1"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
    name: 'controBtn',
    components: {

    },
    data() {
    return {
        activeStyle: false,
        sliderValueold: 1,
        disabled: false,
        sliderValue: 1,
        xjBtn: require('@/assets/camera/xjBtn.png'),
        xjBtnClick: require('@/assets/camera/xjBtnClick.png'),
        squera: require('@/assets/camera/squera.png'),
        squeraClick: require('@/assets/camera/squeraClick.png'),
        activeNum: '-1',
        operateUrl: {
            play: '/lenovo-visible/api/visible-equipment/stable/play/{deviceId}',// 视频播放
            pause: '/lenovo-visible/api/visible-equipment/stable/pause/{deviceId}',// 暂停
            ptzSet: '/lenovo-visible/api/visible-equipment/ptz/direction-adjust/{id}/{cmd}/{step}',//
            stop: '/lenovo-visible/api/visible-equipment/stable/stop/{deviceId}'// 停止播放
        }
    }
    },
    watch:{
        activeStyle(now){
          if(now){
            this.xjBtn = require('@/assets/camera/xjBtnClick.png')
            this.squera = require('@/assets/camera/squeraClick.png')
            this.xjBtnClick = require('@/assets/camera/xjBtnClick.png')
            this.squeraClick = require('@/assets/camera/squeraClick.png')
          }else{
            this.xjBtn = require('@/assets/camera/xjBtn.png')
            this.squera = require('@/assets/camera/squera.png')
            this.xjBtnClick = require('@/assets/camera/xjBtn.png')
            this.squeraClick = require('@/assets/camera/squera.png')
          }
        },
        controlAble:{
            handler(now){
              this.activeNum = -1
              this.activeStyle = now
              this.disabled = !now
            },
            immediate: true
        },
        disabledOption:{
            handler(now){
              this.activeNum = -1
              this.activeStyle = !now
              this.disabled = now
            },
            immediate: true
        },
        url:{
            handler(now){
                if(now){
                    this.operateUrl.ptzSet = now
                }
            },
            immediate: true
        }
    },
    props: {
        controlAble: {
            type: Boolean,
            default: () => {
                return true
            }
        },
        url:{
            type: String,
            default: ''
        },
        deviceId:{
            type: [String, Number],
            default: ''
        },
        disabledOption: {
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    computed: {

    },
    methods:{
        viewCamera(command, flag){
            const that = this
            let cmd = Number(command)
            let value = 50
            if(!this.controlAble){
                this.activeNum = '-1'
                return
            }
            if(!flag)
                this.activeNum = command
            if(flag) {
                cmd = 0
                value = 0
            }
            let url = '/lenovo-iir/device/operate/set/ptz/'+this.deviceId+'?cmd='+cmd+'&value='+value+'&page=摄像头详情页'
            return new Promise((resolve, reject)=>{
                putAxiosData(url).then(res => {
                    try{
                    this.$message.info(res.msg)
                    }catch (e) {
                        
                    }
                    if(!res.data.flag){
                     /*   putAxiosData(`/lenovo-visible/api/visible-equipment/equip-connect/${that.deviceId}/0`).then(res=>{
                            putAxiosData(`/lenovo-visible/api/visible-equipment/equip-connect/${that.deviceId}/1`).then(res=>{})
                        })*/
                    }
                    resolve(res)
                },error=>{
                  this.$message.error(error.response.data.message)
                })
            })
        },
        cameraSF(now) {
            const that = this
            if(now == this.sliderValueold){
                return
            }
            let old = this.sliderValueold
            let timeSeed = 190
            if(now == 1 || now == 20){
                timeSeed = 300
            }
            this.disabled = true
            if(now < old) {
                this.viewCamera(15, false).then(res=>{
                    setTimeout(()=>{
                        this.viewCamera(15, true).then(res=>{
                            if(this.controlAble)
                                that.disabled = false
                            else
                                that.disabled = true
                        })
                    },Math.abs(now-old)*timeSeed)
                })
            }else{
                this.viewCamera(4, false).then(res=>{
                    setTimeout(()=>{
                        this.viewCamera(4, true).then(res=>{
                            if(this.controlAble)
                                that.disabled = false
                            else
                                that.disabled = true
                        })
                    },Math.abs(now-old)*timeSeed)
                })
            }
            this.sliderValueold = now
        }
    },
    mounted(){

    }
}
</script>

<style lang="scss">
    .controBtn{
        width: 100%;
        .control_slider{
            display: flex;
            position: absolute;
            bottom: -40px;
            width: 100%;
            justify-content: center;
            align-items: center;
            .elSlider{
                padding: 0 10px;
                padding-left: 15px;
                flex: 1;
            }
        }
        .btnList{
            padding-bottom: 50px;
            display: flex;
            flex-direction: column;
            /*width: 256px;*/
            width: 100%;
            height: 100%;
            /*margin-left: 26px;*/
            position: relative;
            .description{
                position: absolute;
                color: #a2a2a5;
                width: 34px;
                height: 51px;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                margin: auto;
            }
            .row{
                display: flex;
                /*height: 83px;*/
                .btn{
                    flex: 1;
                    cursor: pointer;
                    /*margin: 9px;*/
                    padding-bottom: 30%;
                    background-size: contain !important;
                    background-repeat: no-repeat !important;
                    margin: 4px;
                }
                .btn.active{
                    background: url("../../../../src/assets/camera/xjBtnActive.png") !important;
                    background-size: contain !important;
                    background-repeat: no-repeat !important;
                    position: relative;
                }

                .btn.actived{
                    background: url("../../../../src/assets/camera/squeraActive.png")  !important;
                    background-size: contain !important;
                    background-repeat: no-repeat !important;
                }
            }
        }
    }
</style>

