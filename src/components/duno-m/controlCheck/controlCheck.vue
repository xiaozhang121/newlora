<template>
    <div class="isControl">
        <span v-if="isControl">结束控制倒计时 <i>{{ minute+'m '+ second+'s'}}</i></span>
        <span v-else>云台控制中</span>
        <a @click="getPression" v-if="!isControl">获取控制权</a>
        <a @click="permissionRelease" v-else>结束控制</a>
    </div>
</template>

<script>
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
const waitTime = 60*5
export default {
    name: 'controlCheck',
    components: {
    },
    data() {
        return {
            isControl: false,
            second: '',
            minute: '',
            pressions: ''
        }
    },
    watch:{
        deviceId:{
            handler(now){
                if(now){
                    this.getpermissionCheck()
                }
            },
            immediate: true
        }
    },
    props: {
        deviceId:{
            type: [String, Number],
            default: ''
        },
        deviceType: {

        }
    },
    computed: {

    },
    methods:{
        getPression(){
            if(this.pressions){
                this.permissionUse()
            }else{
                this.permissionApply()
            }
        },
        setInterval(){
            this.setTimer()
            this.timer = setInterval(this.setTimer,1000)
        },
        setTimer(){
            if(Number(this.second) != 0){
                this.second = Number(this.second)- 1<10?'0'+ Number(this.second)- 1:Number(this.second)- 1
            }else if(this.minute != 0){
                this.minute = Number(this.minute)- 1<10?'0'+ Number(this.minute)- 1:Number(this.minute)- 1
                this.second = '59'
            }else{
                this.minute = '00'
                this.second = '00'
                clearInterval(this.timer)
                this.permissionRelease()
            }
        },
        getpermissionCheck(){
            // 检测设备占用状态
            if(this.deviceType == 2){
                getAxiosData('/lenovo-iir/device/permission/check/'+ this.deviceId).then(res=>{
                    this.isControl = new Boolean(res.data.userId)
                    if(this.isControl){
                        let date = res.data.expireTime
                        let nowDate = new Date()
                        if(nowDate.getTime() <= date){
                            let Allseconds = moment(nowDate.getTime()).diff(date, 'seconds')
                            this.minute = parseInt(Allseconds / 60)<10?'0'+parseInt(Allseconds / 60):parseInt(Allseconds / 60)
                            this.second = parseInt(Allseconds % 60)<10?'0'+parseInt(Allseconds % 60):parseInt(Allseconds % 60)
                            this.setInterval()
                        }
                    }
                })
            }else{
                getAxiosData('/lenovo-visible/api/device/permission/check/'+ this.deviceId).then(res=>{
                    this.isControl = new Boolean(res.result.data)
                    if(this.isControl){
                        let date = res.result.expireTime
                        let nowDate = new Date()
                        if(nowDate.getTime() <= date){
                            let Allseconds = moment(nowDate.getTime()).diff(date, 'seconds')
                            this.minute = parseInt(Allseconds / 60)<10?'0'+parseInt(Allseconds / 60):parseInt(Allseconds / 60)
                            this.second = parseInt(Allseconds % 60)<10?'0'+parseInt(Allseconds % 60):parseInt(Allseconds % 60)
                            this.setInterval()
                        }
                    }
                })
            }
        },
        permissionRelease(){
            //设备占用权限释放
            if(this.deviceType == 2) {
                getAxiosData(`/lenovo-iir/device/permission/release/${this.deviceId}`).then(res => {
                    if(res.data){
                        this.$message.info(res.msg)
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            }else{
                getAxiosData(`/lenovo-visible/api/device/permission/release/${this.deviceId}`).then(res => {
                    if(res.result.releaseFlag){
                        this.$message.info(res.result.msg)
                    }else{
                        this.$message.error(res.result.msg)
                    }
                })
            }
        },
        permissionApply(){
            //普通使用权限申请
            if(this.deviceType == 2) {
                getAxiosData(`/lenovo-iir/device/permission/apply/${this.deviceId}/${waitTime}`).then(res => {
                    if(!res.data){
                        this.getpermissionCheck()
                        this.$message.info(res.msg)
                    }else{
                        this.$message.error(res.msg)
                    }
                })
            }else{
                getAxiosData(`/lenovo-visible/api/device/permission/apply/${this.deviceId}/${waitTime}`).then(res => {
                    if(res.result.applyFlag){
                        this.$message.info(res.result.msg)
                        this.getpermissionCheck()
                    }else{
                        this.$message.error(res.result.msg)
                    }
                })
            }
        },
        permissionUse(){
            //设备强制申请使用
            if(this.deviceType == 2){
                getAxiosData(`/lenovo-iir/device/permission/use/${this.deviceId}/${waitTime}`).then(res=>{
                    this.$message.info(res.data.outUser)
                    this.getpermissionCheck()
                })
            }else{
                getAxiosData(`/lenovo-visible/api/device/permission/use/${this.deviceId}/${waitTime}`).then(res=>{
                    if(res.result.applyFlag){
                        this.$message.info(res.result.msg)
                        this.getpermissionCheck()
                    }else{
                        this.$message.error(res.result.msg)
                    }
                })
            }
        }
    },
    created(){
        // 超级管理员
        this.pressions = this.$store.state.user.userinfo.userType == '超级管理员'
    },
    mounted(){

    }
}
</script>

<style lang="scss">
    .isControl{
        position: absolute;
        bottom: -66px;
        width: 100%;
        text-align: center;
        span:first-child{
            margin-right: 15px;
            i{
                color: #caa42d !important;
                font-style: normal;
            }
        }
        a{
            background: #254e70;
            color: white;
            padding: 7px 10px;
            border-radius: 30px;
        }
    }
</style>

