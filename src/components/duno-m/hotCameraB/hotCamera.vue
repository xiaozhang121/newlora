<template>
    <div class="hotCameraPanel" :class="{'miniWidth': topBtnListFlag != 0}">
        <template  v-if="panelType == 'first'">
            <div>
                <div class="cameraMain">
                    <div class="camera" v-if="showCamera">
                        <div class="main">
                            <video-player  ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
                        </div>
                        <div class="explain iconList" style="margin-top: 4px">
                            <!-- <span><i class="iconfont icon-luxiang"></i>录像</span>
                            <span><i class="iconfont icon-jietu"></i>截图</span> -->
                            <span @click="fullScreen('videoPlayer')"><i class="iconfont icon-quanping"></i>全屏</span>
                        </div>
                    </div>
                    <div class="camera" v-if="showCamera" style="position: relative">
                        <div class="main">
                            <video-player  ref="videoPlayerd" class="vjs-custom-skin" :options="playerOptiond"></video-player>
                        </div>
                        <div class="explain iconList" style="bottom: 10px; position: absolute;">
                            <!-- <span><i class="iconfont icon-luxiang"></i>录像</span>
                            <span><i class="iconfont icon-jietu"></i>截图</span> -->
                            <span @click="fullScreen('videoPlayerd')"><i class="iconfont icon-quanping"></i>全屏</span>
                        </div>
                    </div>
                </div>
                <div class="cameraMain" style="position: relative; top: 16px">
                    <div class="btnList" style="padding-bottom: 0; ">
                        <div class="description">
                            调整镜头
                        </div>
                        <div class="row">
                            <div class="btn" :class="{'active':activeNum == 6}" :style="'background:url('+ xjBtn +');'" @mousedown="viewCamera(6, false)" @mouseup="viewCamera(6, true)"></div>
                            <div class="btn" :class="{'actived':activeNum == 3}" :style="'background:url('+ squera +'); transform: rotate(90deg);'" @mousedown="viewCamera(3, false)"  @mouseup="viewCamera(3, true)"></div>
                            <div class="btn"  :class="{'active':activeNum == 5}" :style="'background:url('+ xjBtn +'); transform: rotate(90deg);'" @mousedown="viewCamera(5, false)"   @mouseup="viewCamera(5, true)"></div>
                        </div>
                        <div class="row">
                            <div class="btn" :class="{'actived':activeNum == 2}" :style="'background:url('+ squera +')'"  @mousedown="viewCamera(2, false)" @mouseup="viewCamera(2, true)"></div>
                            <div class="btn" style="visibility: hidden"></div>
                            <div class="btn"  :class="{'actived':activeNum == 1}" :style="'background:url('+ squera +');transform: rotate(180deg);position: relative;'" @mousedown="viewCamera(1, false)" @mouseup="viewCamera(1, true)"></div>
                        </div>
                        <div class="row">
                            <div class="btn"  :class="{'active':activeNum == 8}" :style="'background:url('+ xjBtn +'); transform: rotate(270deg);'" @mousedown="viewCamera(8, false)" @mouseup="viewCamera(8, true)"></div>
                            <div class="btn" :class="{'actived':activeNum == 4}" :style="'background:url('+ squera +');transform: rotate(270deg);'" @mousedown="viewCamera(4, false)" @mouseup="viewCamera(4, true)"></div>
                            <div class="btn" :class="{'active':activeNum == 7}"  :style="'background:url('+ xjBtn +'); transform: rotate(180deg);'" @mousedown="viewCamera(7, false)" @mouseup="viewCamera(7, true)"></div>
                        </div>
                     <!--   <div class="control_slider" style="padding-bottom: 20px">
                            <i class="iconfont icon-suoxiao1"></i>
                            <el-slider class="elSlider" v-model="sliderValue"></el-slider>
                            <i class="iconfont icon-fangda1"></i>
                        </div>-->
                    </div>
                </div>
            </div>
        </template>
        <template  v-if="panelType == 'second'">
            <div class="cameraMain">
                <div class="camera" v-if="showCamera">
                    <div class="main">
                        <video-player  ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
                    </div>
                    <div class="explain iconList" style="margin-bottom: 10px">
                        <!-- <span><i class="iconfont icon-luxiang"></i>录像</span>
                        <span><i class="iconfont icon-jietu"></i>截图</span> -->
                        <span @click="fullScreen('videoPlayer')"><i class="iconfont icon-quanping"></i>全屏</span>
                    </div>
                </div>
                <div class="camera" v-if="showCamera" style="position: relative">
                    <div class="main">
                        <video-player  ref="videoPlayerd" class="vjs-custom-skin" :options="playerOptiond"></video-player>
                    </div>
                    <div class="explain iconList" style="bottom: 17px; position: absolute">
                        <!-- <span><i class="iconfont icon-luxiang"></i>录像</span>
                        <span><i class="iconfont icon-jietu"></i>截图</span> -->
                        <span @click="fullScreen('videoPlayerd')"><i class="iconfont icon-quanping"></i>全屏</span>
                    </div>
                </div>
            </div>
            <div class="cameraMain">
                <div class="btnList" style="flex-basis: 440px; margin-top: 15px">
                    <duno-table height="200"  v-for="(item, index) in dataList"  :key="index"  :columns="columns" :dataList="item.dataList"></duno-table>
                    <div style="width: 100%; text-align: right; padding-right: 20px; margin-top: 15px">
                        <span  style="color: white">预置位切换：<span style="color: #ffd70a">{{ secondLastShow }}s</span></span>
                    </div>
                </div>
                <div class="camera" v-if="showCamera">
                    <div class="explain" style="display: block">
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
                            <el-button @click="startBoat" style="width: 90px;" type="primary">{{ boatNow?'开始巡航':'暂停巡航' }}</el-button>
                        </div>
                    </div>
                </div>
            </div>
        </template>
        <template  v-if="panelType == 'third'">
            <div style="padding-bottom: 15px">
                <div class="cameraMain">
                    <div class="camera" v-if="showCamera">
                        <div class="main">
                            <video-player  ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
                        </div>
                        <div class="explain iconList" style="margin-bottom: 10px">
                            <!-- <span><i class="iconfont icon-luxiang"></i>录像</span>
                            <span><i class="iconfont icon-jietu"></i>截图</span> -->
                            <span @click="fullScreen('videoPlayer')"><i class="iconfont icon-quanping"></i>全屏</span>
                        </div>
                    </div>
                    <div class="camera" v-if="showCamera" style="position: relative">
                        <div class="main">
                            <video-player  ref="videoPlayerd" class="vjs-custom-skin" :options="playerOptiond"></video-player>
                        </div>
                        <div class="explain iconList" style="bottom: 17px; position: absolute">
                            <!-- <span><i class="iconfont icon-luxiang"></i>录像</span>
                            <span><i class="iconfont icon-jietu"></i>截图</span> -->
                            <span @click="fullScreen('videoPlayerd')"><i class="iconfont icon-quanping"></i>全屏</span>
                        </div>
                    </div>
                </div>
                <div class="cameraMain" style="display: flex; margin-top: 10px">
                    <div class="btnList" style="padding-bottom: 0;">
                        <div class="description">
                            调整镜头
                        </div>
                        <div class="row">
                            <div class="btn" :class="{'active':activeNum == 6}" :style="'background:url('+ xjBtn +');'" @mousedown="viewCamera(6, false)" @mouseup="viewCamera(6, true)"></div>
                            <div class="btn" :class="{'actived':activeNum == 3}" :style="'background:url('+ squera +'); transform: rotate(90deg);'" @mousedown="viewCamera(3, false)"  @mouseup="viewCamera(3, true)"></div>
                            <div class="btn"  :class="{'active':activeNum == 5}" :style="'background:url('+ xjBtn +'); transform: rotate(90deg);'" @mousedown="viewCamera(5, false)"   @mouseup="viewCamera(5, true)"></div>
                        </div>
                        <div class="row">
                            <div class="btn" :class="{'actived':activeNum == 2}" :style="'background:url('+ squera +')'"  @mousedown="viewCamera(2, false)" @mouseup="viewCamera(2, true)"></div>
                            <div class="btn" style="visibility: hidden"></div>
                            <div class="btn"  :class="{'actived':activeNum == 1}" :style="'background:url('+ squera +');transform: rotate(180deg);position: relative;'" @mousedown="viewCamera(1, false)" @mouseup="viewCamera(1, true)"></div>
                        </div>
                        <div class="row">
                            <div class="btn"  :class="{'active':activeNum == 8}" :style="'background:url('+ xjBtn +'); transform: rotate(270deg);'" @mousedown="viewCamera(8, false)" @mouseup="viewCamera(8, true)"></div>
                            <div class="btn" :class="{'actived':activeNum == 4}" :style="'background:url('+ squera +');transform: rotate(270deg);'" @mousedown="viewCamera(4, false)" @mouseup="viewCamera(4, true)"></div>
                            <div class="btn" :class="{'active':activeNum == 7}"  :style="'background:url('+ xjBtn +'); transform: rotate(180deg);'" @mousedown="viewCamera(7, false)" @mouseup="viewCamera(7, true)"></div>
                        </div>
                       <!-- <div class="control_slider" style="bottom: -12px;">
                            <i class="iconfont icon-suoxiao1"></i>
                            <el-slider class="elSlider" v-model="sliderValue"></el-slider>
                            <i class="iconfont icon-fangda1"></i>
                        </div>-->
                    </div>
                    <div class="camera" v-if="showCamera" style="height: inherit;flex: 1; padding-left: 30px; padding-right: 10px">
                        <div class="addPosition" style="">
                            <div class="right">
                                <div class="left" style="width: 97%;position: relative;">
                                    <div class="title" style="font-size: 16px">请使用右上角图标调整预设位：</div>
                                    <div class="input" style="padding-top: 5px ;padding-bottom: 15px"> <el-input  style="position: relative;z-index: 9; text-align: left; width: calc( 100% - 90px )" :disabled="false" v-model="addPosInput" placeholder="输入预置位名称"></el-input><el-button style="float: right" type="primary" @click="addPosition">{{ isEdit==false?'添加':'修改' }}</el-button></div>
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
        <div v-if="topBtnListFlag == 1" class="historyAlarm" style="width: 346px">
            <div class="item">
                <div class="img">
                    <img  width="108" height="94" :src="clock"/>
                </div>
                <div class="explain">
                    <div class="title">2019-05-28 <span style="margin-left: 10px">13:22:40</span></div>
                    <div class="info">温度：60℃  超出阈值：15%</div>
                    <div class="info">安全等级：一般</div>
                </div>
            </div>
            <div class="item">
                <div class="img">
                    <img  width="108" height="94" :src="clock"/>
                </div>
                <div class="explain">
                    <div class="title">2019-05-28 <span style="margin-left: 10px">13:29:40</span></div>
                    <div class="info">温度：60℃  超出阈值：15%</div>
                    <div class="info">安全等级：一般</div>
                </div>
            </div>
        </div>
        <template v-if="topBtnListFlag == 2">
            <div style="position: relative; width: 100%; padding-bottom: 20px">
                <span style="float: right; cursor: pointer" @click="onClose"></span>
                <el-date-picker
                        style="width: 70%"
                        v-model="timeRange"
                        type="daterange"
                        range-separator="-"
                        size="mini"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
                <el-button type="text" style="position: absolute; right: 47px;color: #00b5be">搜索</el-button>
                <duno-charts
                        :isItemEchart="true"
                        width="360px"
                        :isChange="isChange"
                        height="210px"
                        :gridOption="{
                              top:40,
                          }"
                        :xAxisOption="{
                            data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                            axisLabel: {
                                show: true,
                                textStyle: {
                                    color: '#fff'
                                }
                            }
                        }"
                        :yAxisOption=" {
                                type: 'value',
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        color: '#fff'
                                    }
                               }
                            }"
                        :seriesOption="dataCharts"
                />
            </div>
        </template>
    </div>
</template>

<script>
    import  { controlCamera } from '@/api/camera'
    import dunoTable from '_c/duno-m/table/Table'
    import { getImage, stopImage, getPointData } from '@/api/user'
    import clock from '@/assets/camera/clock.png'
    import { mapState } from 'vuex'
    import videojs from 'video.js'
    import { DunoCharts } from '_c/duno-charts'
    import { videoPlayer } from 'vue-video-player'
    import { getAxiosData, putAxiosData } from '@/api/axiosType'
    import 'videojs-flash'
    import SWF_URL from 'videojs-swf/dist/video-js.swf'
    videojs.options.flash.swf = SWF_URL
    export default {
        name: 'cameraPanel',
        components: { dunoTable, DunoCharts, videoPlayer },
        data() {
            return {
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
                secondLastShow: 10,
                timer: null,
                showTimer: null,
                lightTimer: null,
                movTimer: null,
                boatNow: true,
                radioValue: '1',
                selectValue: '30000',
                dataCharts: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line'
                }],
                timeOptions:[
                    { value:'3000', label: '3秒/控制位' },
                    { value:'6000', label: '6秒/控制位' },
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
                            let newArr =  [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ temp +')',backgroundSize:'contain'} }) ]
                            return h('div', newArr)
                        }
                    },
                ],
                dataList: [
                    {
                        dataList: [
                            {
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
                            }
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
                            newArr.push(h('Tooltip', {
                                props: { content: '查看' }
                            }, [
                                h('el-button', {
                                    class:'tableBtnName', style: {backgroundImage:'url('+ this.play +')'},
                                    on: { click: () => {  } }
                                })
                            ]))
                            newArr.push(h('Tooltip', {
                                props: { content: '编辑' }
                            }, [
                                h('el-button', {
                                    class:'tableBtnName', style: {backgroundImage:'url('+ this.edit +')'},
                                    on: { click: () => { this.editTableData(params) } }
                                })
                            ]))
                            newArr.push(h('Tooltip', {
                                props: {content: '删除'}
                            }, [
                                h('el-poptip', {
                                    props: { confirm: true, placement: 'top-end', title: '您确定删除数据吗?', transfer: true },
                                    on: { 'on-ok': () => { this.delTableData(params) } }
                                }, [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ this.del +')'} }) ])
                            ]))
                            return h('div', newArr)
                        }
                    },
                ],
                dataListd: [
                    {
                        dataList: [
                            {
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
                            }
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
                    {name: '实时信息', active: true},
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
                activeNum: -1,
                offsetX: '',
                offsetY: '',
                xxxx: '',
                timerObj: null
            }
        },
        watch: {
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
                        let video = document.getElementById("videoMain");
                        video.onmousemove = this.mouseMove
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
                alert(now)
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
                that.isEdit = true
            },
            delTableData(params){
                this.dataListd[0]['dataList'].splice(params.index, 1)
            },
            addPosition(){
                const that = this
                if(!that.isEdit){
                    // 增加
                    if(that.addPosInput.trim() == ""){
                        that.$message.info('请输入新增预置位名称')
                        return
                    }
                    this.dataListd[0]['dataList'].push({
                        flag: 'play',
                        ago: false,
                        name: that.addPosInput,
                        deal: '删除'
                    })
                    that.addPosInput = ''
                }else{
                    // 修改
                    this.dataListd[0]['dataList'][this.editIndex].name = that.addPosInput
                    this.$forceUpdate()
                    that.addPosInput = ''
                    that.isEdit = !that.isEdit
                }
            },
            startBoat(){
                const that = this
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
                let value = 20
                if(flag) {
                    cmd = 0
                    value = 0
                }

                let url = "lenovo-iir/device/operate/set/ptz/"+this.deviceId
                putAxiosData(url,{cmd: cmd, value: value}).then(res=>{

                })
              /*  controlCamera({command: command, flag:flag}).then(res=>{
                })*/
            },
            initCamera() {
                return new Promise((resolve, reject) => {
                    if (Wfs.isSupported()) {
                        let video1 = document.getElementById("video1"),
                            wfs = new Wfs();
                        wfs.attachMedia(video1, 'ch1');
                        resolve(200)
                    }
                })
            },
            getCameraFuild(){
                getAxiosData('/lenovo-iir/device/video/url/rtmp/'+this.deviceId).then(res=>{
                    this.playerOptiond.sources[0].src = res.data.data;
                })
                getAxiosData('/lenovo-iir/device/visible/url/rtmp/'+this.deviceId).then(res=>{
                    this.playerOptions.sources[0].src = res.data.data;
                })
            }
        },
        created(){
            const that = this

            this.$nextTick(()=>{
                getImage()
                that.initCamera().then(res=>{

                })
                let video = document.getElementById("videoMain");
                video.onmousemove = this.mouseMove
            })
        }
    }
</script>

<style lang="scss">
    .miniWidth{
        width: 364px !important;
    }
    .hotCameraPanel{
        position: relative;
        display: flex;
        flex-direction: column;
        width: 750px;
        .video-js .vjs-control-bar{
            display: none;
        }
        .vjs-custom-skin{
            transform: scale(1.2,1.46);
            transform-origin: left top;
        }
        .iconList{
            display: flex;
            justify-content: flex-start;
            height: 34px !important;
            span{
                display: flex;
                margin-right: 25px;
                flex: none !important;
                align-items: center;
                text-align: left !important;
            }
            i{
                font-size: 21px;
                margin-right: 7px;
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
        .historyAlarm{
            display: flex;
            flex-direction: column;
            .item{
                display: flex;
                margin-bottom: 24px;
                .img{
                    position: relative;
                    display: flex;
                    img{
                    }
                }
                .explain{
                    display: flex;
                    flex-direction: column;
                    padding-left: 15px;
                    color: white;
                    .title{
                        font-weight: bold;
                        margin-bottom: 7px;
                    }
                }
            }
            .item:last-child{
                margin-bottom: 0;
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
            .camera{
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
                width: 256px;
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
                        /*margin: 9px;*/
                        background-size: contain !important;
                        background-repeat: no-repeat !important;
                    }
                    .btn.active{
                        background: url("../../../../src/assets/camera/xjBtnClick.png") !important;
                        background-size: contain !important;
                        background-repeat: no-repeat !important;
                    }
                    .btn.actived{
                        background: url("../../../../src/assets/camera/squeraClick.png")  !important;
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
