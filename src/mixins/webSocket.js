import qs from 'qs'
import { mapState } from 'vuex'
import config from '@/config'
import { swapArray } from '@/libs/util'
import { getAxiosData, deleteDataId, postAxiosData, putAxiosData } from '@/api/axiosType'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

export default {
    data () {
        return {
            socketUrl: '',
            Socket: null,
            isLoginPage: false
        }
    },
    computed: {

    },
    watch: {
        '$route' (to) {
            const that = this
            if (that.socketUrl) {
                if(that.Socket){
                    that.Socket.close()
                    that.Socket = null
                }
                that.initSocket()
            }
        }
    },
    methods: {
        WebSocket () {
            const that = this
            if ('WebSocket' in window && that.socketUrl && !that.Socket) {
                try {
                  /*  const index = that.baseUrl.indexOf('//')
                    let url = that.baseUrl.substring(index, that.baseUrl.length)
                    url = url.replace(':8008',':8200')*/
                    //   that.Socket = new WebSocket(`ws:${url}/lenovo-alarm/alarm/websocket`)
                    // that.Socket = new WebSocket(`ws://10.0.0.164:8081/lenovo-alarm/alarm/websocket`)
                    debugger
                    that.Socket = new WebSocket(`ws://${that.socketUrl}/lenovo-alarm/alarm/websocket`)
                    that.Socket.onmessage = function (evt) { // 接收数据 websocket
                        let receivedMsg = JSON.parse(evt.data)
                        console.log('')
                    }
                    that.Socket.onclose = function () { // 关闭 websocket
                        that.Socket = null
                    }
                    that.Socket.onerror = function () { // 错误 websocket
                        that.Socket = null
                    }
                } catch (e) {
                    that.Socket = null
                }
            }
        },
        initSocket(){
            const that = this
            if (that.$route.path !== '/login') { // 当前路径不是登录页
                that.isLoginPage = false
                that.WebSocket()
            } else {
                that.isLoginPage = true
            }
        }
    },
    mounted () {
        const that = this
        that.initSocket()
        window.onbeforeunload = function () { // 浏览器关闭
            if (that.Socket) {
                that.Socket.close()
                that.Socket = null
            }
        }
    },
    beforeDestroy() {
        const that = this
        if (that.Socket) {
            that.Socket.close()
            that.Socket = null
        }
    }
}