<template>
    <div class="feedBack">
        <el-dialog :model="true" :close-on-click-modal="false"  class="elDialogClass" :visible.sync="visibleOption" width="450px" center @close="handleClose">
            <div slot="title">
                问题反馈
            </div>
            <el-form ref="form" :model="form" label-width="80px">
                <div class="main">
                    <p>
                        <el-input
                                type="textarea"
                                :rows="5"
                                placeholder="请将您的问题反馈给我们,我们会尽快回复"
                                v-model="form.textInfo">
                        </el-input>
                    </p>
                    <p>
                        <el-input
                            class="itemInput"
                            v-model="form.email"
                            placeholder="输入您的邮箱地址"
                    ></el-input>
                    </p>
                </div>
            </el-form>
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
    name: 'feedBack',
    components: {
        buttonCustom
    },
    data() {
    return {
        form: {
            textInfo:'',
            email: ''
        },
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
            ptzSet: '/lenovo-visible/api/visible-equipment/ptz/direction-adjust/{id}/{cmd}/{step}',//
            stop: '/lenovo-visible/api/visible-equipment/stable/stop/{deviceId}'// 停止播放
        }
    }
    },
    watch:{
        diffData(now){
            this.diffValue = now
        },
        visible(now){
            this.form.textInfo = ''
            this.form.email = ''
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
            if(this.form.textInfo == ''){
                this.$message.error('反馈内容不能为空！')
                return;
            }
            let reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/
            if(!reg.test(this.form.email)){
                this.$message.error('邮箱格式不正确，请重新输入！')
                return;
            }
            postAxiosData('/lenovo-user/api/advice-feedback/add', {userId: this.$store.state.user.userId, content: this.form.textInfo, email: this.form.email}).then(res=>{
                if(res.code == '200'){
                    // this.$message.success(res.errorMessage)
                    this.$message({
                        message: '操作成功',
                        type: 'success'
                    })
                    this.handleClose()
                }else{
                    this.$message.error(res.errorMessage)
                }
            })
        },
        handleClose(){
            this.$emit('on-close')
        },
        viewCamera(command, flag){
            if(!flag){
              this.activeNum = command
            }else{
              command=0
            }
            let url = this.operateUrl.ptzSet.replace("{cmd}", command).replace("{id}", this.deviceId)
                .replace("{step}", 8);
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
    .feedBack{
        .el-dialog__close{
            font-size: 26px;
        }
        .el-dialog--center{
            background: #e0e0e0;
        }
        .el-input--small .el-input__inner{
            /*text-align: center;*/
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
            /*padding: 0 47px;*/
            line-height: 44px;
            & > p:first-child{
                margin-bottom: 10px;
            }
            p{
                font-size: 16px;
                color: #707070;
                &:last-child{
                    display: flex;
                    align-items: center;
                }
                .el-input--small{
                }
            }
        }
    }
</style>

