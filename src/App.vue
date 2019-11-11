<template>
  <div id="app" :class="[{'none': transperant},{'bigB': bgBack}]">
    <router-view/>
    <audio v-if="$store.state.user.isAlarm" :src="audio" loop="loop" autoplay="autoplay">
    </audio>
  </div>
</template>

<script>
import { getNewTagList, isAlarmVoice } from "@/libs/util";
import { mapState } from 'vuex'
export default {
  name: 'App',
  data () {
    const that = this
    return {
      audio: null,
      defectAlarm: require('@/audio/defectAlarm.mp3'),
      safetyAlarm: require('@/audio/safetyAlarm.mp3'),
      Socket: null,
      SocketTime: null,
      isSocketOk: true,
      isLoginPage: false,
      baseUrl: process.env.NODE_ENV === 'development' ? that.$config.baseUrl.dev : that.$config.baseUrl.pro
    }
  },
  watch: {
    '$route' (to) {
      const that = this
      try{
          for(let i=0; i<document.getElementsByClassName('addImage').length;i++){
              document.getElementsByClassName('addImage')[i].remove()
          }
          document.getElementsByClassName('addImage')[0].remove()
      }catch (e) { }
      if (to.path === '/login' || to.path === '/') {
        that.isLoginPage = true
        if (that.Socket) {
          that.Socket.close()
          that.Socket = null
        }
      } else {
        that.isLoginPage = false
        if (!that.Socket) {
          if (process.env.NODE_ENV !== 'development') {
            that.WebSocket()
          }
        }
      }
    },
     alarmInfo(now){
        if(!now){
          this.audio = null
        }
     }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    bgBack(){
        return !this.transperant && window.screen.availWidth > 3000
    },
    transperant(){
        return window.screen.availWidth > 3000 && parent.frames.length > 0
    },
    alarmInfo(){
      return this.$store.state.user.isAlarm
    }
  },
  methods: {
    linkWebSocket () {
      const that = this
    /*  if (!that.isLoginPage) {
        that.SocketTime = setInterval(function () {
          that.WebSocket()
        }, 5000)
      }*/
    },
    WebSocket () {
      const that = this
      if ('WebSocket' in window) {
        try {
          const index = that.baseUrl.indexOf('//')
          let url = that.baseUrl.substring(index, that.baseUrl.length)
          url = url.replace(':8008',':8200')
        //   that.Socket = new WebSocket(`ws:${url}/lenovo-alarm/alarm/websocket`)
          that.Socket = new WebSocket(`ws://10.0.10.35:8081/lenovo-alarm/alarm/websocket`)
          // this.Socket.onopen = function() { // 发送数据 websocket
          // // Web Socket 已连接上，使用 send() 方法发送数据
          // console.log("数据发送中...")
          // }
          that.Socket.onmessage = function (evt) { // 接收数据 websocket
            let receivedMsg = JSON.parse(evt.data)
            clearInterval(that.SocketTime)
            that.SocketTime = null
            that.isSocketOk = true
            if(receivedMsg['type'] == 'monitor'){
                that.$store.state.app.pushData = receivedMsg['data']
                that.$store.state.app.isPush = true
            }else{
                // 三项外alarm   phase
                that.$store.state.user.alarmInfo = receivedMsg
                that.$store.state.user.isAlarm  = receivedMsg['soundConfig']==1?true:false
                if(that.$store.state.user.isAlarm){
                    if(isAlarmVoice(this.$store.state.user.alarmConfig, receivedMsg)){
                        that.audio = that.defectAlarm
                    }else{
                        that.audio = that.safetyAlarm
                    }
                }else{
                    that.audio = null
                }
            }
          /*  const account = that.$store.state.user.account
            let num = 0
            for (let i = 0; i < receivedMsg.length; i++) {
              if (receivedMsg[i].account === account) {
                num++
              }
            }
            that.$store.state.user.msgNum = num*/
          }
          that.Socket.onclose = function () { // 关闭 websocket
            that.Socket = null
            if (that.isSocketOk) {
              that.isSocketOk = false
              that.linkWebSocket()
            }
          }
          that.Socket.onerror = function () { // 错误 websocket
            that.Socket = null
          }
        } catch (e) {
          that.Socket = null
        }
      }
    }
  },
  mounted () {
    const that = this
    // that.audio = that.safetyAlarm
    console.log('后台访问地址：', that.baseUrl)
    if (true) {
      if (that.$route.path !== '/login') { // 当前路径不是登录页
        that.isLoginPage = false
        that.WebSocket()
      } else {
        that.isLoginPage = true
      }
    }
    window.onbeforeunload = function () { // 浏览器关闭
      if (that.Socket) {
        that.Socket.close()
        that.Socket = null
      }
    }
  }
}
</script>

<style lang="scss">
  @import "./assets/defaultIcon/duno-iconfont.css"; // 框架默认图标库
  @import "./assets/icons/iconfont.css";  // 项目引用图标库
  @import "./style/index.scss";
  /*@import "@/style/noselect.scss";*/
  .ivu-tooltip-popper{
    z-index: 9999 !important;
  }
  .el-loading-mask{
    z-index: 0 !important;
  }
  .el-popper[x-placement^="top"] .popper__arrow::after{
    /*border-top-color: #193543 !important;*/
    border-top-color: transparent !important;
  }
  .el-popper[x-placement^="top"] .popper__arrow{
    /*border-top-color: #193543 !important;*/
    border-top-color: transparent !important;
  }
  .el-popper[x-placement^="bottom"] .popper__arrow{
    /*border-bottom-color: #193543 !important;*/
    border-bottom-color: transparent !important;
  }
  .squera{
    position:absolute; border:1px solid #e48303; overflow:hidden;
  }
  .squera_p{
    position:absolute; border:1px dashed #e48303; width:0px; height:0px;left:0px; top:0px;
  }
  .circled{
    position:absolute; border:1px solid #e48303; overflow:hidden; border-radius: 50%;
  }
  .circle_p{
    position:absolute; border:1px dashed #e48303; width:0px; height:0px;left:0px; top:0px; border-radius: 50%;
  }
  .sharp{
    position:absolute;  overflow:hidden; background: url(../src/assets/images/sharpChosend.svg) no-repeat; background-size: 100% 100%;
  }
  .sharp_p {
    position: absolute;
    width: 0px;
    height: 0px;
    left: 0px;
    top: 0px;
    background: url(../src/assets/images/sharpChosend.svg) no-repeat;
    background-size: 100% 100%;
  }
  #app {
    overflow: hidden;
    background: #15222d;
    background: url('./assets/images/home-bg.png') no-repeat top left;
    background-size: 100% 100%;
    &.none{
      background: transparent !important;
    }
    &.bigB{
      background: url('./assets/images/home-B.png') no-repeat top left;
      background-size: 100% 100%;
    }
  }
</style>