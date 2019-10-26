<template>
    <div class="isControl">
        <!--{{ pressions }} -&#45;&#45; {{ isControlPress }} -&#45;&#45; {{ getPress }}-->
        <span v-if="isControlPress && showTimer">结束控制倒计时 <i>{{ minute+'m '+ second+'s'}}</i></span>
        <span v-else>
            <div v-if="isControlPress  && !getPress">云台可操控</div>
            <div v-if="isControlPress && getPress">已获取控制权</div>
            <div v-if="!isControlPress">云台控制中</div>
        </span>
        <a @click="getPression" v-if="isControlPress && !getPress">获取控制权</a>
        <a @click="permissionRelease" v-if="isControlPress && getPress">结束控制</a>
        <a v-if="!isControlPress" style="background: grey">获取控制权</a>
    </div>
</template>

<script>
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    import moment from "moment";
    const waitTime = 60 * 5
    export default {
        name: 'controlCheck',
        components: {
        },
        data() {
            return {
                showTimer: false,
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
            zIndex: {
                type: [String, Number],
                default: '0'
            },
            deviceId:{
                type: [String, Number],
                default: ''
            },
            deviceType: {

            }
        },
        computed: {
            getPress:{
                get(){
                    return this.$store.state.user.getPress[this.zIndex]
                },
                set(val){
                    this.$set(this.$store.state.user.getPress, this.zIndex, val)
                }
            },
            isControlPress(){
                if(this.pressions){
                    return this.isControl == false || (this.isControl == true && this.pressions && this.userType == 0)
                }else{
                    return this.isControl == false
                }
            },
            isShow(){
                return Number(this.minute) && Number(this.second)
            }
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
                clearInterval(this.timer)
                this.timer = null
                this.setTimer()
                this.showTimer = true
                this.timer = setInterval(this.setTimer,1000)
            },
            setTimer(){
                if(Number(this.second) != 0){
                    this.second = Number(this.second)- 1<10?'0'+ (Number(this.second)- 1):Number(this.second)- 1
                }else if(Number(this.minute) != 0){
                    this.minute = Number(this.minute)- 1<10?'0'+ (Number(this.minute)- 1):Number(this.minute)- 1
                    this.second = '59'
                }else{
                    this.minute = '00'
                    this.second = '00'
                    clearInterval(this.timer)
                    this.timer = null
                    this.permissionRelease()
                    this.isControl = false
                }
            },
            getpermissionCheck(){
                const that = this
                // 检测设备占用状态
                if(this.deviceType == 2){
                    getAxiosData('/lenovo-iir/device/permission/check/'+ this.deviceId).then(res=>{
                        let userId = res.data.userId
                        let type = Number(res.data.userType)
                        console.log(this.$store.state.user.token)
                        console.log(userId)
                        if(this.$store.state.user.token == userId){
                            return
                        }
                        this.userType = type
                        if(type != 2){
                            this.isControl = true
                        }else{
                            this.isControl = false
                            this.getPress = false
                        }
                        /*  if(this.isControl){
                              // let date = res.data.data.expireTime
                              let nowDate = new Date()
                              /!* if(nowDate.getTime() <= date){
                                   let Allseconds = moment(date).diff(nowDate.getTime(), 'seconds')
                                   this.minute = parseInt(Allseconds / 60)<10?'0'+parseInt(Allseconds / 60):parseInt(Allseconds / 60)
                                   this.second = parseInt(Allseconds % 60)<10?'0'+parseInt(Allseconds % 60):parseInt(Allseconds % 60)
                                   // this.setInterval()
                               }*!/
                          }*/
                    })
                }else{
                    getAxiosData('/lenovo-visible/api/device/permission/check/'+ this.deviceId).then(res=>{
                        let userId = res.data.userId
                        let type = Number(res.data.userType)
                        console.log(this.$store.state.user.token)
                        console.log(userId)
                        if(this.$store.state.user.token == userId){
                            return
                        }
                        this.userType = type
                        if(type != 2){
                            this.isControl = true
                        }else{
                            this.isControl = false
                            this.getPress = false
                        }
                        /* if(this.isControl){
                             let date = ''
                             try{
                                 // date = res.data.expireTime
                             }catch (e) {
                                 date = res.data.data.expireTime
                             }
                             let nowDate = new Date()
                             /!*  if(nowDate.getTime() <= date){
                                   let Allseconds = moment(date).diff(nowDate.getTime(), 'seconds')
                                   this.minute = parseInt(Allseconds / 60)<10?'0'+parseInt(Allseconds / 60):parseInt(Allseconds / 60)
                                   this.second = parseInt(Allseconds % 60)<10?'0'+parseInt(Allseconds % 60):parseInt(Allseconds % 60)
                                   // this.setInterval()
                               }*!/
                         }*/
                    })
                }
            },
            permissionRelease(){
                //设备占用权限释放
                if(this.deviceType == 2) {
                    getAxiosData(`/lenovo-iir/device/permission/release/${this.deviceId}`).then(res => {
                        if(res.data.data){
                            clearInterval(this.timer)
                            this.timer = null
                            this.getPress = false
                            this.getpermissionCheck()
                            this.$message.info(res.data.msg)
                            this.$emit('on-disable', false)
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                }else{
                    getAxiosData(`/lenovo-visible/api/device/permission/release/${this.deviceId}`).then(res => {
                        if(res.data.releaseFlag){
                            clearInterval(this.timer)
                            this.timer = null
                            this.getPress = false
                            this.getpermissionCheck()
                            this.$message.info(res.data.msg)
                            this.$emit('on-disable', false)
                        }else{
                            this.$message.error(res.data.msg)
                        }
                    })
                }
            },
            permissionApply(){
                //普通使用权限申请
                if(this.deviceType == 2) {
                    getAxiosData(`/lenovo-iir/device/permission/apply/${this.deviceId}/${waitTime}`).then(res => {
                        if(res.data.data){
                            this.getPress = true
                            // this.getpermissionCheck()
                            this.$message.info(res.data.msg)
                            this.$emit('on-disable', true)
                        }else{
                            this.$message.error(res.data.msg)
                            this.$emit('on-disable', false)
                        }
                    })
                }else{
                    getAxiosData(`/lenovo-visible/api/device/permission/apply/${this.deviceId}/${waitTime}`).then(res => {
                        if(res.data.applyFlag){
                            this.getPress = true
                            this.$message.info(res.data.msg)
                            // this.getpermissionCheck()
                            this.$emit('on-disable', true)
                        }else{
                            this.$message.error(res.data.msg)
                            this.$emit('on-disable', false)
                        }
                    })
                }
            },
            permissionUse(){
                //设备强制申请使用
                if(this.deviceType == 2){
                    getAxiosData(`/lenovo-iir/device/permission/use/${this.deviceId}/${waitTime}`).then(res=>{
                        if(res.data.msg.indexOf('success')> -1 || res.data.msg.indexOf('成功') > -1){
                            this.getPress = true
                            this.$emit('on-disable', true)
                        }else{
                            this.$emit('on-disable', false)
                        }
                        this.$message.info(res.data.msg)
                        // this.getpermissionCheck()
                    })
                }else{
                    getAxiosData(`/lenovo-visible/api/device/permission/use/${this.deviceId}/${waitTime}`).then(res=>{
                        if(res.data.applyFlag){
                            this.getPress = true
                            this.$message.info(res.data.msg)
                            // this.getpermissionCheck()
                            this.$emit('on-disable', true)
                        }else{
                            this.$message.error(res.data.msg)
                            this.$emit('on-disable', false)
                        }
                    })
                }
            },
            releaseNow(){
                this.minute = '00'
                this.second = '00'
                clearInterval(this.timer)
                this.timer = null
                if(this.getPress)
                    this.permissionRelease()
                this.getPress = false
                window.removeEventListener('beforeunload', this.beforeunload)
            },
            clearIn(){
                this.minute = '01'
                this.second = '00'
                this.setInterval()
            },
            beforeunload(e) {
                const that = this;
                console.log("保存相关操作");
                console.log("I want to cancel");
                // Cancel the event
                e.preventDefault();
                // that.saveCamera()
                // Chrome requires returnValue to be set
                e.returnValue = "hello";
                that.releaseNow()
            }
        },
        created(){
            const that = this
            this.count = 0
            // 超级管理员
            this.pressions = (this.$store.state.user.userinfo.userType == '超级管理员')
            this.initTimer = setInterval(()=>{
                that.getpermissionCheck()
                console.log(that.count)
                if(that.getPress){
                    that.count++
                    if(that.count >= 10){
                        if(!that.timer)
                            that.clearIn()
                    }
                }
            },1000)
            document.addEventListener('mousemove', function () {
                clearInterval(that.timer)
                that.showTimer = false
                that.timer = null
                that.count = 0
            })
            console.log(this.$store.state.user.userinfo.userType)
            window.addEventListener('beforeunload', this.beforeunload)
        },
        mounted(){

        },
        beforeDestroy(){
            clearInterval(this.initTimer)
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
            div{
                display: inline-block;
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

