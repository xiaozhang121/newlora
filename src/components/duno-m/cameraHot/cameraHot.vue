<template>
    <div class="cameraHot" :class="{'miniWidth': topBtnListFlag != 0}">
        <template  v-if="panelType == 'first'">
            <div>
                <div class="cameraMain">
                    <key-monitor
                          v-if="showCamera"
                          :monitorInfo="{ monitorDeviceId: deviceId }"
                          paddingBottom="56%"
                          class="monitor"
                          :autoplay="playerOptions.autoplay"
                          :streamAddr="playerOptions.sources[0].src"
                          width="100%"
                          :pushCamera="false"
                          :showBtmOption="false"
                          :Initialization="true"
                          :videoAbsolute='true'
                          :isLive='false'
                          :isNav='true'
                          :isAux='true'
                          :isRecord="false"
                        ></key-monitor>
                    <key-monitor
                          v-if="showCamera"
                          :monitorInfo="{ monitorDeviceId: deviceId }"
                          paddingBottom="56%"
                          class="monitor"
                          :autoplay="playerOptiond.autoplay"
                          :streamAddr="playerOptiond.sources[0].src"
                          width="100%"
                          :showBtmOption="false"
                          :Initialization="true"
                          :isLive='false'
                          :isNav='true'
                          :isRecord="false"
                          :isAux='true'
                        ></key-monitor>
                </div>
                <div class="cameraMain" style="position: relative; top: 16px">
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
                    </div>
                    <control-check @on-disable="onDisable" ref="controlCheckRef" v-if="deviceId && lockPress" :deviceType="2" :deviceId="deviceId" style="top: 9px; left: 85px; bottom: inherit"/>
                </div>
            </div>
        </template>
        <template  v-if="panelType == 'second'">
            <div class="cameraMain" v-if="showCamera">
            <key-monitor
                          :monitorInfo="{ monitorDeviceId: deviceId }"
                          paddingBottom="56%"
                          class="monitor"
                          :autoplay="playerOptions.autoplay"
                          :streamAddr="playerOptions.sources[0].src"
                          width="100%"
                          :pushCamera="false"
                          :showBtmOption="false"
                          :Initialization="true"
                          :videoAbsolute='true'
                          :isLive='false'
                          :isNav='true'
                          :isAux='true'
                          :isRecord="false"
                        ></key-monitor>
                    <key-monitor
                          :monitorInfo="{ monitorDeviceId: deviceId }"
                          paddingBottom="56%"
                          class="monitor"
                          :autoplay="playerOptiond.autoplay"
                          :streamAddr="playerOptiond.sources[0].src"
                          width="100%"
                          :showBtmOption="false"
                          :Initialization="true"
                          :isLive='false'
                          :isNav='true'
                          :isRecord="false"
                          :isAux='true'
                        ></key-monitor>
            </div>
            <div class="cameraMain">
                <div class="btnList" style="flex-basis: 366px; margin-top: 15px;">
                    <duno-table height="200"  v-for="(item, index) in dataList"  :key="index"  :columns="columns" :dataList="item.dataList"></duno-table>
                    <div style="width: 100%; text-align: right; padding-right: 20px; margin-top: 15px">
                        <span  style="color: white">预置位切换：<span style="color: #ffd70a">{{ secondLastShow }}s</span></span>
                    </div>
                </div>
                <div class="camera" v-if="showCamera" style="padding-left: 67px; padding-right: 5px">
                    <div class="explain" style="display: block; margin-top: 20px">
                        <div>
                            <span style="width: 200px">巡航间隔：</span>
                            <span style="position: relative; top: -2px;  display: inline-block; text-align: right;    width: calc( 100% - 80px );">
                                 <el-select v-model="selectValue" placeholder="请选择" style="width: calc( 100% )">
                                    <el-option
                                            v-for="item in timeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </span>
                        </div>
                        <div style="margin-top: 20px; margin-right: 15px">
                            <div  style="display: flex;justify-content: flex-end;">
                                <el-radio v-model="radioValue" label="1">单次</el-radio>
                                <el-radio v-model="radioValue" label="2">循环</el-radio>
                            </div>
                        </div>
                        <div style="text-align: right;margin-top: 20px;margin-right: 15px">
                            <el-button class="bootBtn" @click="startBoat" style="width: 90px;" type="primary">{{ boatNow?'开始巡航':'暂停巡航' }}</el-button>
                        </div>
                    </div>
                </div>
            </div>
            <control-check  @on-disable="onDisable" ref="controlCheckRef" v-if="deviceId && lockPress" :deviceType="2" :deviceId="deviceId" style="top: 9px; left: 85px; bottom: inherit; visibility: hidden"/>
        </template>
        <template  v-if="panelType == 'third'">
            <div style="padding-bottom: 15px">
                <div class="cameraMain" v-if="showCamera">
                <key-monitor
                          :monitorInfo="{ monitorDeviceId: deviceId }"
                          paddingBottom="56%"
                          class="monitor"
                          :autoplay="playerOptions.autoplay"
                          :streamAddr="playerOptions.sources[0].src"
                          width="100%"
                          :pushCamera="false"
                          :showBtmOption="false"
                          :Initialization="true"
                          :isLive='false'
                          :isNav='true'
                          :videoAbsolute='true'
                          :isRecord="false"
                          :isAux='true'
                        ></key-monitor>
                    <key-monitor
                          :monitorInfo="{ monitorDeviceId: deviceId }"
                          paddingBottom="56%"
                          class="monitor"
                          :autoplay="playerOptiond.autoplay"
                          :streamAddr="playerOptiond.sources[0].src"
                          width="100%"
                          :showBtmOption="false"
                          :Initialization="true"
                          :isLive='false'
                          :isNav='true'
                          :isRecord="false"
                          :isAux='true'
                        ></key-monitor>
                </div>
                <div class="cameraMain" style="display: flex; margin-top: 10px">
                    <div class="btnList" style="padding-bottom: 0;">
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
                    </div>
                    <div class="cameraA" v-if="showCamera" style="height: inherit;flex: 1; padding-left: 118px; padding-right: 14px">
                        <div class="addPosition" style="">
                            <div class="right">
                                <div class="left" style="width: 97%;position: relative;" v-if="isAdd">
                                    <div class="title"><control-check @on-disable="onDisable" ref="controlCheckRef" style="bottom: inherit;
                                    position: relative;
                                    left: 0;
                                    top: 0;
                                    text-align: left; font-size: 14px" :deviceType="2" :deviceId="deviceId" v-if="deviceId && lockPress"/></div>
                                    <div class="input" style="padding-top: 5px ;padding-bottom: 15px"> <el-input  style="position: relative;z-index: 9; text-align: left; width: calc( 100% - 90px )" :disabled="false" @input="checkSpecial" v-model="addPosInput" placeholder="输入预置位名称"></el-input><el-button class="bootBtn" style="float: right" type="primary" @click="addPosition">{{ isEdit==false?'添加':'修改' }}</el-button></div>
                                </div>
                                <div class="table" style="padding-top: 10px">
                                    <duno-table height="150"  v-for="(item, index) in dataListd"  :key="index"  :columns="columnsd" :dataList="item.dataList"></duno-table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script>
    import  { controlCamera } from '@/api/camera'
    import controlCheck from '_c/duno-m/controlCheck'
    import dunoTable from '_c/duno-m/table/Table'
    import mixinViewModule from "@/mixins/view-module";
    import KeyMonitor from "_c/duno-c/KeyMonitor";
    import { getImage, stopImage, getPointData } from '@/api/user'
    import clock from '@/assets/camera/clock.png'
    import { mapState } from 'vuex'
    import { DunoCharts } from '_c/duno-charts'
    import { getAxiosData, putAxiosData, postAxiosData, deleteDataId } from '@/api/axiosType'
    export default {
        name: 'cameraHot',
        mixins: [mixinViewModule],
        components: { KeyMonitor, dunoTable, DunoCharts,  controlCheck },
        data() {
            const that = this
            return {
                activeStyle: false,
                lockPress: false,
                temparams: null,
                passTime: 0,
                timeSeed: null,
                isStop: false,
                timerTime: null,
                timeIncreateD: '0:00:00',
                isCamera: false,
                isAdd:false,
                isEdite:false,
                isViwe:false,
                isDel:false,
                playerOptions:{
                    width:296,
                    height:170,
                    sources: [{
                        type: "rtmp/flv",
                        src: ''
                    }],
                    techOrder: ['flash'],
                    autoplay: true,
                    controls: true
                },
                playerOptiond:{
                    width:296,
                    height:170,
                    sources: [{
                        type: "rtmp/flv",
                        src: ''
                    }],
                    techOrder: ['flash'],
                    autoplay: true,
                    controls: true
                },
                clock,
                overFlag: false,
                isEdit: false,
                editIndex: -1,
                addPosInput: '',
                flagNow: -1,
                secondLast: 10,
                secondLastShow: 9,
                timer: null,
                showTimer: null,
                lightTimer: null,
                movTimer: null,
                boatNow: true,
                radioValue: '1',
                selectValue: '9000',
                dataCharts: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line'
                }],
                timeOptions:[
                    { value:'9000', label: '9秒/控制位' },
                    { value:'12000', label: '12秒/控制位' },
                    { value:'15000', label: '15秒/控制位' }
                ],
                play:require('@/assets/camera/play.png'),
                greenPoint:require('@/assets/camera/greenPoint.png'),
                greyPoint:require('@/assets/camera/greyPoint.png'),
                orangePointG:require('@/assets/camera/orangePoint.gif'),
                orangePointP:require('@/assets/camera/orangePoint.png'),
                columns: [
                    {
                        type: 'index',
                        title: '序号',
                        width: 70,
                        fixed: 'left',
                        isCheck: true,
                        align: 'center'
                    },
                    {
                        title: '预置位名称',
                        key: 'name',
                        align: 'center',
                        minWidth: 100,
                        tooltip: true
                    },
                    {
                        title: '状态',
                        key: 'deal',
                        align: 'center',
                        minWidth: 50,
                        tooltip: true,
                        render: (h, params) => {
                            let temp = ''
                            if(params.row.flag == 'play')
                                temp = this.play
                            else if(params.row.flag == 'greenPoint')
                                temp = this.greenPoint
                            else if(params.row.flag == 'greyPoint')
                                temp = this.greyPoint
                            else if(params.row.flag == 'orangePointG')
                                temp = this.orangePointG
                            else if(params.row.flag == 'orangePointP')
                                temp = this.orangePointP
                            let newArr =  [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ temp +')',backgroundSize:'contain'}, on: { click: () => { that.checkPostion(params.row) } } }) ]
                            return h('div', newArr)
                        }
                    },
                ],
                dataList: [
                    {
                        dataList: [
                            /*{
                                flag: 'play',
                                ago: false,
                                name: '预置位名称A',
                                deal: '删除'
                            },
                            {
                                flag: 'play',
                                ago: false,
                                name: '预置位名称B',
                                deal: '删除'
                            }*/
                        ]
                    }
                ],
                columnsd: [
                    {
                        type: 'index',
                        title: '预置位序号',
                        width: 100,
                        fixed: 'left',
                        isCheck: true,
                        align: 'center'
                    },
                    {
                        title: '预置位名称',
                        key: 'name',
                        align: 'center',
                        minWidth: 100,
                        tooltip: true
                    },
                    {
                        title: '操作',
                        key: 'deal',
                        align: 'center',
                        minWidth: 100,
                        tooltip: true,
                        render: (h, params) => {
                            let newArr = []
                            if(this.isViwe){
                                newArr.push(h('Tooltip', {
                                    props: { content: '查看' }
                                }, [
                                    h('el-button', {
                                        class:'tableBtnName', style: {backgroundImage:'url('+ this.play +')'},
                                        on: { click: () => {  this.checkPostion(params.row) } }
                                    })
                            ]))
                            }
                            if(this.isEdite){
                                newArr.push(h('Tooltip', {
                                    props: { content: '编辑' }
                                }, [
                                    h('el-button', {
                                        class:'tableBtnName', style: {backgroundImage:'url('+ this.edit +')'},
                                        on: { click: () => { this.editTableData(params) } }
                                    })
                                ]))
                            }
                            if(this.isDel){
                                newArr.push(h('Tooltip', {
                                    props: {content: '删除'}
                                }, [
                                    h('el-poptip', {
                                        props: { confirm: true, placement: 'top-end', title: '您确定删除数据吗?', transfer: true },
                                        on: { 'on-ok': () => { this.delTableData(params) } }
                                    }, [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ this.del +')'} }) ])
                                ]))
                            }
                            return h('div', newArr)
                        }
                    },
                ],
                dataListd: [
                    {
                        dataList: [
                            /* {
                                 flag: 'play',
                                 ago: false,
                                 name: '预置位名称A',
                                 deal: '删除'
                             },
                             {
                                 flag: 'play',
                                 ago: false,
                                 name: '预置位名称B',
                                 deal: '删除'
                             }*/
                        ]
                    }
                ],
                leftBtnList: [
                    {name: '云台', active: true},
                    {name: '巡航', active: false},
                    {name: '预置位', active: false}
                ],
                leftBtnListFlag: 0,
                topBtnList: [
                    {name: '实时监控', active: true},
                    {name: '历史告警', active: false},
                    {name: '历史数据', active: false}
                ],
                topBtnListFlag: 0,
                Wfs: require('@/libs/wfs'),
                xjBtn: require('@/assets/camera/xjBtn.png'),
                xjBtnClick: require('@/assets/camera/xjBtnClick.png'),
                squera: require('@/assets/camera/squera.png'),
                squeraClick: require('@/assets/camera/squeraClick.png'),
                edit: require('@/assets/images/btn/edit.png'),
                del:require('@/assets/images/btn/del.png'),
                activeNum: -2,
                offsetX: '',
                offsetY: '',
                xxxx: '',
                timerObj: null
            }
        },
        watch: {
            selectValue(now){
              let second = Number(now) / 1000
              this.secondLastShow = second
            },
            deviceId:{
                handler(now){
                    if(now) {
                        this.getCameraFuild()
                    }
                },
                deep: true,
                immediate: true
            },
            overFlag(now){
                if(!now){
                    clearInterval(this.timerObj)
                    this.timerObj = null
                }
            },
            weatherData(){

            },
            base64Data(){

            },
            topBtnListFlag(now){
                if(now == 0){
                    const that = this
                    this.$nextTick(()=> {
                        that.initCamera()
                        // let video = document.getElementById("videoMain");
                        // video.onmousemove = this.mouseMove
                    })
                }
            },
            leftBtnListFlag(now){
                const that = this
                this.$nextTick(()=> {
                    that.initCamera()
                })
            },
            flagNow(now){
                const that = this
                // putAxiosData('/lenovo-iir/device/operate/ptz/'+that.deviceId+'/'+this.dataList[0]['dataList'][now]['psIndex'])
                putAxiosData('/lenovo-iir/device/operate/set/ptz/'+that.deviceId+'?cmd='+10+'&value='+this.dataList[0]['dataList'][now]['number']+'&page=首页弹窗')
                this.dataList[0]['dataList'][now]['ago'] = true
                this.dataList[0]['dataList'][now]['flag'] = 'orangePointP'
                that.lightTimer = setInterval(()=>{
                    if(this.dataList[0]['dataList'][now]['flag'] != 'orangePointP')
                        this.dataList[0]['dataList'][now]['flag'] = 'orangePointP'
                    else{
                        if(this.dataList[0]['dataList'][now]['ago']){
                            this.dataList[0]['dataList'][now]['flag'] = 'greenPoint'
                        }else{
                            this.dataList[0]['dataList'][now]['flag'] = 'greyPoint'
                        }
                    }
                    that.$forceUpdate()
                },500)
            },
            panelType(){
                const that = this
                that.dataList[0]['dataList'] = []
                that.dataListd[0]['dataList'] = []
                this.$nextTick(()=> {
                    that.getListData()
                    // that.initCamera()
                })
            }
        },
        props: {
            deviceId:{},
            itemData:{},
            panelType: {
                type: String,
                default: 'first'
            },
            num: {

            },
            showCamera:{
                type: Boolean,
                default: ()=>{
                    return true
                }
            }
        },
        computed: {
            ...mapState([
                'app'
            ]),
            base64Data(){
                return this.$store.state.app.base64
            },
            weatherData(){
                return this.$store.state.app.weatherData
            },
        },
        methods:{
              onDisable(flag){
                this.activeNum = -1
                if(flag){
                  this.activeStyle = true
                  this.xjBtn = require('@/assets/camera/xjBtnClick.png')
                  this.squera = require('@/assets/camera/squeraClick.png')
                  this.xjBtnClick = require('@/assets/camera/xjBtnClick.png')
                  this.squeraClick = require('@/assets/camera/squeraClick.png')
                }else{
                  clearInterval(this.lightTimer)
                  clearInterval(this.showTimer)
                  clearInterval(this.timer)
                  clearInterval(this.timerTime)
                  this.secondLastShow = 9
                  this.activeStyle = false
                  this.boatNow = true
                  this.initGrey()
                  this.flagNow = -1;
                  this.xjBtn = require('@/assets/camera/xjBtn.png')
                  this.squera = require('@/assets/camera/squera.png')
                  this.xjBtnClick = require('@/assets/camera/xjBtn.png')
                  this.squeraClick = require('@/assets/camera/squera.png')
                }
              },
            checkSpecial(value) {
                let myreg =
                    "[`_+@~!#$^&*()=|{}':;',\\[\\].<>/?~！%#￥……&*（）|{}【】‘；：”“'。，'、？]‘'";
                for (let i = 0; i < value.length; i++) {
                  if (myreg.indexOf(value[i]) != -1) {
                    this.addPosInput = value
                      .replace(
                        /[`~!！@#$%^&*()_\-\+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*——（）\-+={}|《》？：“”【】、；‘’，。、]/g,
                        ""
                      )
                      .replace(/\s/g, "");
                    this.$message({
                      message: "不能包含特殊字符，请重新输入",
                      type: "warning"
                    });
                  }
                }
                if(value.length>20){
                  this.$message({
                      message: "字符长度超出限制",
                      type: "warning"
                    });
                    this.addPosInput=value.slice(0,20)
                }
            },
            checkPostion(data){
                let pid = data.number
                const that = this
                let url = '/lenovo-iir/device/operate/set/ptz/'+this.deviceId+'?cmd='+10+'&value='+pid+'&page=首页弹窗'
                putAxiosData(url).then(res=>{
                    this.$message.info(res.msg)
                }, error => {
                  this.$message.error(error.response.data.msg)
                })
            },
            toStop(flag){
                this.isStop = flag
                if(this.isStop){
                    // 暂停录像
                    clearInterval(this.timerTime)
                }else{
                    // 继续录像
                    this.timeIncreate(true)
                }
            },
            timeIncreate(flag){
                this.timeSeed = new Date().getTime()
                if(flag)
                    this.timeSeed -= this.passTime
                else{
                    this.passTime = 0
                }
                this.timerTime = setInterval(()=>{
                    console.log(new Date().getTime())
                    let times = new Date().getTime() - this.timeSeed
                    this.passTime += 1000
                    this.timeIncreateD = this.formatDuring(times)
                },1000)
            },
            formatDuring(mss) {
                let days = parseInt(mss / (1000 * 60 * 60 * 24));
                let hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                let minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
                minutes = minutes<10?'0'+minutes:minutes
                let seconds = parseInt((mss % (1000 * 60)) / 1000);
                return hours + ":" + minutes + ":" + (Number(seconds)<10?'0'+seconds:seconds);
            },
            videotape(){
                this.isCamera = !this.isCamera
                if(this.isCamera){
                    // 开始录像
                    this.timeIncreate()
                }else{
                    // 结束录像
                    clearInterval(this.timerTime)
                    this.timeIncreateD = '0:00:00'
                }
            },
            fullScreen(target) {
                let ele = this.$refs[target].$el
                    .getElementsByClassName("vjs-fullscreen-control")[0]
                    .click();
            },
            mouseMove(event) {
                const that = this
                let div = document.getElementById("videoMain");
                event = event || window.event;
                let offsetX = event.offsetX
                let offsetY = event.offsetY
                this.offsetX = offsetX
                this.offsetY = offsetY
                if(!that.timerObj){
                    that.timerObj = setInterval(()=>{
                        console.log('--------------->',that.offsetX, 100-that.offsetY)
                        getPointData({x:that.offsetX, y:100-that.offsetY}).then(res=>{
                            that.xxxx = res.data
                        })
                    },200)
                }
            },
            editTableData(params){
                const that = this
                that.editIndex = params.index
                that.addPosInput = params.row.name
                that.temparams = params
                that.isEdit = true
            },
            delTableData(params){
                const that = this
                deleteDataId(
                    '/lenovo-iir/manager/preset/delete/'+params.row.id+'?page=首页弹窗'
                ).then(res => {
                    that.getListData();
                    that.$message.info(res.msg)
                });
            },
            addPosition(){
                const that = this
                if(!that.isEdit){
                    // 增加
                    if(that.addPosInput.trim() == ""){
                        that.$message.info('请输入新增预置位名称')
                        return
                    }
                    let tempName = that.addPosInput
                    postAxiosData('/lenovo-iir/manager/preset/add',{'deviceId': that.deviceId, 'name':that.addPosInput, page: '首页弹窗'}).then(res=>{
                        that.getListData()
                        that.$message.info(res.msg)
                    }, error => {
                      this.$message.error(error.response.data.msg)
                    })
                    that.addPosInput = ''
                }else{
                    // 修改
                    let temp = that.addPosInput
                    this.$forceUpdate()
                    that.addPosInput = ''
                    that.isEdit = !that.isEdit
                    putAxiosData('/lenovo-iir/manager/preset/update', { deviceId: that.deviceId, id: that.temparams.row.id.toString(), name:temp, page: '首页弹窗' }).then(res=>{
                        that.getListData()
                        that.$message.info(res.msg)
                    }, error => {
                      this.$message.error(error.response.data.msg)
                    })
                    // sessionStorage.setItem('dataList',JSON.stringify( that.dataListd[0]['dataList']))
                }
            },
            getListData(){
                const that = this
                let url = '/lenovo-iir/manager/preset/list?deviceId='+ that.deviceId
                getAxiosData(url, {pageNo: 1, pageSize: 9999999}).then(res=>{
                    let data = res.data.data.records
                    data.map(item=>{
                        item['flag'] = 'play'
                    })
                    that.dataList[0]['dataList'] = data
                    that.dataListd[0]['dataList'] = data
                }, error => {
                  this.$message.error(error.response.data.msg)
                })
            },
            startBoat(){
                const that = this
                if(that.disabled || this.activeNum == -2){
                  that.$message.error('请先申请获取控制权')
                  return
                }
                this.boatNow = !this.boatNow
                if(!this.boatNow){
                    clearInterval(that.showTimer)
                    if(that.flagNow == -1){
                        that.initGrey()
                        that.flagNow = 0;
                        that.mvFunc()
                    }else{
                        if(that.dataList[0]['dataList'].length-1 == that.flagNow && that.radioValue == 1){
                            that.flagNow = -1;
                            that.initGrey()
                            that.mvFunc()
                        }
                        that.timeoutFun()
                    }
                    // 查看到期
                    that.timer = setInterval(()=>{
                        that.timeoutFun()
                    },parseInt(that.selectValue))
                }else{
                    clearInterval(that.timer)
                    clearInterval(that.lightTimer)
                    clearInterval(that.movTimer)
                    that.dataList[0]['dataList'][that.flagNow]['flag'] = 'greenPoint'
                }
            },
            timeoutFun(){
                const that = this
                if(that.flagNow+1<that.dataList[0]['dataList'].length){
                    that.flagNow++
                    if(that.flagNow-1 >=0)
                        that.dataList[0]['dataList'][that.flagNow-1]['flag'] = 'greenPoint'
                }else{
                    that.dataList[0]['dataList'][that.dataList[0]['dataList'].length-1]['flag'] = 'greenPoint'
                    if(that.radioValue == 1){
                        clearInterval(that.timer)
                        that.boatNow = true
                        return
                    }
                    that.flagNow = 0
                    that.dataList[0]['dataList'][0]['flag'] = 'greenPoint'
                }
                that.mvFunc()
                that.$forceUpdate()
            },
            mvFunc(){
                const that = this
                clearInterval(that.lightTimer)
                clearInterval(that.showTimer)
                that.secondLastShow = that.secondLast
                // 摄像头旋转期间
                that.movTimer = setTimeout(()=>{
                    clearInterval(that.lightTimer)
                    that.dataList[0]['dataList'][that.flagNow]['flag'] = 'orangePointG'
                },that.secondLast*1000)

                that.secondLastShow--
                that.showTimer = setInterval(()=>{
                    that.secondLastShow--
                    if(that.secondLastShow == 0){
                        clearInterval(that.showTimer)
                    }
                },1000)
            },
            lightFunc(){

            },
            initGrey(){
                const that = this
                that.dataList[0]['dataList'].map((item)=>{
                    item['flag'] = 'greyPoint'
                    item['ago'] = false
                })
                that.$forceUpdate()
            },
            changeRightActive(index){
                this.topBtnList.map((item)=>{
                    item['active'] = false
                })
                this.topBtnList[index]['active'] = true
                this.topBtnListFlag = index
                this.$forceUpdate()
            },
            changeLeftActive(index){
                this.leftBtnList.map((item)=>{
                    item['active'] = false
                })
                this.leftBtnList[index]['active'] = true
                this.leftBtnListFlag = index
                this.$forceUpdate()
            },
            onClose(){
                stopImage()
                this.$emit('on-close')
            },
            viewCamera(command, flag){
                this.activeNum = command
                let cmd = Number(command)
                let value = 150
                if(flag) {
                    cmd = 0
                    value = 0
                }


                let url = '/lenovo-iir/device/operate/set/ptz/'+this.deviceId+'?cmd='+cmd+'&value='+value+'&page=首页弹窗'
                console.log(typeof cmd)
                putAxiosData(url).then(res=>{
                    try{
                        this.$message.info(res.msg)
                    }catch (e) {

                    }
                }, error => {
                  this.$message.error(error.response.data.msg)
                })
                /*  controlCamera({command: command, flag:flag}).then(res=>{
                  })*/
            },
            initCamera() {
                /* return new Promise((resolve, reject) => {
                     if (Wfs.isSupported()) {
                         let video1 = document.getElementById("video1"),
                             wfs = new Wfs();
                         wfs.attachMedia(video1, 'ch1');
                         resolve(200)
                     }
                 })*/
            },
            getCameraFuild(){
                getAxiosData('/lenovo-iir/device/video/url/rtmp/'+this.deviceId).then(res=>{
                    this.playerOptiond.sources[0].src = res.data.data;
                }, error => {
                  this.$message.error(error.response.data.msg)
                })
                getAxiosData('/lenovo-iir/device/visible/url/rtmp/'+this.deviceId).then(res=>{
                    this.playerOptions.sources[0].src = res.data.data;
                }, error => {
                  this.$message.error(error.response.data.msg)
                })
            }
        },
        mounted(){
            const that = this
            this.lockPress = this.getAuthority("10000105")
            this.$nextTick(()=>{
                that.initCamera()   // 初始化摄像头
                that.getListData()  // 获取表格数据
                that.getCameraFuild()
            })
        },
        created(){
            const that = this

            this.$nextTick(()=>{
                getImage()
                // that.initCamera().then(res=>{
                //
                // })
                // let video = document.getElementById("videoMain");
                // video.onmousemove = this.mouseMove
            })
            this.isAdd = this.getAuthority('10000101');
            this.isEdite = this.getAuthority('10000102');
            this.isViwe = this.getAuthority('10000103');
            this.isDel = this.getAuthority('10000104');
        },
        beforeDestroy(){
          if(this.$refs.controlCheckRef)
            this.$refs.controlCheckRef.releaseNow()
        }
    }
</script>

<style lang="scss">
    .miniWidth{
        width: 364px !important;
    }
    .cameraHot{
        position: relative;
        display: flex;
        flex-direction: column;
        width: 100%;
        .ivu-table-cell{
            white-space: nowrap;
        }
        .bootBtn{
            background: #315f84;
            border-radius: 30px;
        }
        .el-radio__input.is-checked + .el-radio__label{
            color: white;
        }
        .el-radio__label{
            color: white;
        }
        .el-radio__input.is-checked .el-radio__inner::after{
            transform: translate(-50%, -50%) scale(1.3);
            background: #00fefe;
        }
        .el-radio__input.is-checked .el-radio__inner{
            border-color: #00fefe;
            background: transparent;
        }
        .el-radio__inner{
            background-color: transparent;
            border: 1px solid #a4a5a6;
        }
        .ivu-table-wrapper {
            tr {
                td {
                    height: 45px;
                    // @media screen and (min-width: 3500px) {
                    //   height: 50px;
                    //   font-size: 14px;
                    // }
                }
            }
            tr:nth-child(even) {
                td {
                    background: rgba(0, 0, 0, 0) !important;
                }
            }
            tr:nth-child(odd) {
                td {
                    background-color: rgba(50, 95, 125, 0.8) !important;
                }
            }
        }
        .control_slider{
            display: flex;
            position: absolute;
            bottom: -36px;
            width: 100%;
            justify-content: center;
            align-items: center;
            .elSlider{
                padding: 0 10px;
                padding-left: 15px;
                flex: 1;
            }
        }
        .el-input--small .el-input__inner{
            background: transparent;
            color: #cccccc;
        }
        /*.element::-webkit-scrollbar {display:none}*/
        .title{
            font-size: 18px;
            color: white;
            margin: 6px 0;
        }
        .addPosition{
            display: flex;
            .left{
                flex-basis: 300px;
            }
            .right{
                flex: 1;
                .table{
                    position: relative;
                    top: -16px;
                }
            }
            .title{
                font-size: 18px;
            }
            .input{
                margin: 10px 0;
            }
            .btnEx{
                margin: 15px 0;
                .btnEx_title{
                    color: white;
                }
                .btnEx_btn{
                    float: right;
                }
            }
        }
        .cameraMain{
            display: flex;
            &>div:first-child{
              margin-right: 10px;
            }
            .cameraA{
                width: 400px;
                margin-right: 7px;
                height: 284px;
                .main{
                    width: 100%;
                    height: 83%;
                }
                .explain{
                    height: 20px;
                    display: flex;
                    color: white;
                    padding-top: 30px;
                    span{
                        text-align: center;
                        flex: 1;
                        cursor: pointer;
                    }
                }
            }
            .btnList{
                padding-bottom: 50px;
                display: flex;
                flex-direction: column;
                width: 247px;
                height: 278px;
                position: relative;
                .description{
                    position: absolute;
                    color: #a2a2a5;
                    width: 29px;
                    height: 66px;
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    margin: auto;
                }
                .row{
                    display: flex;
                    height: 83px;
                    .btn{
                        flex: 1;
                        cursor: pointer;
                        margin: 3px;
                        background-size: contain !important;
                        background-repeat: no-repeat !important;
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
        .leftBtn{
            position: absolute;
            top: 0;
            left: -80px;
            width: 80px;
            .btn{
                cursor: pointer;
                border-top-left-radius: 5px;
                border-bottom-left-radius: 5px;
                text-align: center;
                margin-bottom: 5px;
                color: white;
                padding: 6px 0;
                border: 1px solid #d9dbda;
                background: rgba(63,68,74,0.3);
            }
            .btn.active{
                border: 1px solid #04e6e7;
                background: rgba(4,230,231,0.3);
            }
        }
        .topBtn{
            position: absolute;
            top: -38px;
            left: 0px;
            display: flex;
            .btn{
                cursor: pointer;
                width: 80px;
                border-top-left-radius: 5px;
                border-top-right-radius: 5px;
                text-align: center;
                margin-right: 5px;
                color: white;
                padding: 6px 0;
                border: 1px solid #d9dbda;
                background: rgba(63,68,74,0.3);
            }
            .btn.active{
                border: 1px solid #04e6e7;
                background: rgba(4,230,231,0.3);
            }
        }
    }
</style>
