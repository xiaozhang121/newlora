<template>
    <div class="diffPanel">
        <el-dialog :close-on-click-modal="false" :model="true"  class="elDialogClass" :visible="visibleOption" width="450px" center @close="handleClose">
            <div slot="title">
                差值修订
            </div>
            <div class="main">
                <p>
                   当前差值&nbsp;&nbsp;≥&nbsp;&nbsp;10℃
                </p>
                <p>
                    修改差值
                    <el-input
                        class="itemInput"
                        v-model="diffValue"
                        placeholder="差值"
                ></el-input>
                </p>
            </div>
            <span slot="footer" class="dialog-footer">
                <button-custom class="button" @click.native="handleClose" title="取消" />
                <button-custom class="button" @click.native="handleSubmit" title="确定" />
            </span>
        </el-dialog>
    </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
    name: 'diffPanel',
    components: {
        buttonCustom
    },
    data() {
    return {
        visibleOption: false,
        diffValue: '',
        sliderValueold: 1,
        disabled: false,
        sliderValue: 1,
        xjBtn: require('@/assets/camera/xjBtn.png'),
        xjBtnClick: require('@/assets/camera/xjBtnClick.png'),
        squera: require('@/assets/camera/squera.png'),
        squeraClick: require('@/assets/camera/squeraClick.png'),
        activeNum: '',
        operateUrl: {
            play: '/lenovo-visible/api/visible-equipment/stable/play/{deviceId}',// 视频播放
            pause: '/lenovo-visible/api/visible-equipment/stable/pause/{deviceId}',// 暂停
            ptzSet: '/lenovo-visible/api/visible-equipment/ptz/direction-adjust/{id}/{cmd}/{step}/{flag}',//
            stop: '/lenovo-visible/api/visible-equipment/stable/stop/{deviceId}'// 停止播放
        }
    }
    },
    watch:{
        diffData(now){
            this.diffValue = now
        },
        visible(now){
            this.visibleOption = now
        },
        disabledOption:{
            handler(now){
                this.disabled = now
            },
            immediate: true
        }
    },
    props: {
        diffData:{
            type: [String, Number],
            default: ''
        },
        visible:{
            type: Boolean,
            default: () => {
                return false
            }
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
        handleSubmit(){
            this.$message.info('修改成功')
            this.handleClose()
        },
        handleClose(){
            this.$emit('on-close')
        },
        viewCamera(command, flag){
            if(!flag){
              this.activeNum = command
            }
            // else{
            //   command=0
            // }
            let url = this.operateUrl.ptzSet.replace("{cmd}", command).replace("{id}", this.deviceId)
                .replace("{step}", 8).replace("{flag}", Number(flag));
            return new Promise((resolve, reject)=>{
                putAxiosData(url).then(res => {
                    resolve(res)
                },error=>{
                    reject(res)
                    this.$message.error(error.message);
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
                this.viewCamera(5, false).then(res=>{
                    setTimeout(()=>{
                        this.viewCamera(5, true).then(res=>{
                            that.disabled = false
                        })
                    },Math.abs(now-old)*timeSeed)
                })
            }else{
                this.viewCamera(4, false).then(res=>{
                    setTimeout(()=>{
                        this.viewCamera(4, true).then(res=>{
                            that.disabled = false
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
    .diffPanel{
        .el-input--small .el-input__inner{
            text-align: center;
        }
        .dialog-footer {
            display: flex;
            justify-content: center;
            color: #ffffff;
            .button {
                height: 37px;
                line-height: 31px;
                font-size: 14px;
                &:first-child {
                    margin-right: 30px;
                }
            }
        }
        .el-dialog__header{
            font-size: 22px;
            color: #333333;
        }
        .el-dialog__headerbtn{
            right: 14px !important;
            top: 6px !important;
        }
        .el-dialog__body{
            margin-top: -15px;
        }
        .main{
            padding: 0 47px;
            line-height: 44px;
            p{
                font-size: 16px;
                color: #707070;
                &:last-child{
                    display: flex;
                    align-items: center;
                }
                .el-input--small{
                    width: 71%;
                    margin-left: 20px;
                }
            }
        }
    }
</style>

