<template>
    <div class="cameraPanel" :class="{'miniWidth': topBtnListFlag != 0}">
        <template  v-if="panelType == 'first'">
            <div class="title">{{ cameraName }}</div>
            <div class="cameraMain">
                <div class="camera" v-if="showCamera">
                    <div class="main" style="width: 400px; height: 250px">
                        <video-player  ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
                        <!--<video id="video1" width="400" height="250" controls></video>-->
                    </div>
                    <div class="explain iconList">
                        <span @click="fullScreen()"><i class="iconfont icon-luxiang"></i>全屏</span>
                        <span><i class="iconfont icon-jietu"></i>录像</span>
                        <span><i class="iconfont icon-quanping"></i>存图</span>
                    </div>
                </div>
                <div class="btnList" style="padding-bottom: 0; ">
                    <div class="description">
                        调整镜头
                    </div>
                    <div class="row">
                        <div class="btn" :class="{'active':activeNum == 32}" :style="'background:url('+ xjBtn +');'" @mousedown="viewCamera(32, false)" @mouseup="viewCamera(32, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 0}" :style="'background:url('+ squera +'); transform: rotate(90deg);'" @mousedown="viewCamera(0, false)"  @mouseup="viewCamera(0, true)"></div>
                        <div class="btn"  :class="{'active':activeNum == 33}" :style="'background:url('+ xjBtn +'); transform: rotate(90deg);'" @mousedown="viewCamera(33, false)"   @mouseup="viewCamera(33, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn" :class="{'actived':activeNum == 2}" :style="'background:url('+ squera +')'"  @mousedown="viewCamera(2, false)" @mouseup="viewCamera(2, true)"></div>
                        <div class="btn" style="visibility: hidden"></div>
                        <div class="btn"  :class="{'actived':activeNum == 3}" :style="'background:url('+ squera +');transform: rotate(180deg);position: relative;'" @mousedown="viewCamera(3, false)" @mouseup="viewCamera(3, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn"  :class="{'active':activeNum == 34}" :style="'background:url('+ xjBtn +'); transform: rotate(270deg);'" @mousedown="viewCamera(34, false)" @mouseup="viewCamera(34, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 1}" :style="'background:url('+ squera +');transform: rotate(270deg);'" @mousedown="viewCamera(1, false)" @mouseup="viewCamera(1, true)"></div>
                        <div class="btn" :class="{'active':activeNum == 35}"  :style="'background:url('+ xjBtn +'); transform: rotate(180deg);'"@mousedown="viewCamera(35, false)" @mouseup="viewCamera(35, true)"></div>
                    </div>
                    <div class="control_slider">
                        <i class="iconfont icon-suoxiao1"></i>
                        <el-slider class="elSlider" v-model="sliderValue"  :min="1" :max="8"></el-slider>
                        <i class="iconfont icon-fangda1"></i>
                    </div>
                </div>
            </div>
        </template>
        <template  v-else-if="panelType == 'second'">
            <div class="title">{{ cameraName }}</div>
            <div class="cameraMain">
                <div class="camera" v-if="showCamera">
                    <div class="main" style="width: 400px; height: 250px">
                        <video-player  ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
                        <!--<video id="video1" width="400" height="250" controls></video>-->
                    </div>
                    <div class="explain iconList">
                        <span @click="fullScreen()"><i class="iconfont icon-luxiang"></i>全屏</span>
                        <span><i class="iconfont icon-jietu"></i>录像</span>
                        <span><i class="iconfont icon-quanping"></i>存图</span>
                    </div>
                </div>
                <div class="btnList">
                    <div style="display: flex; margin-bottom: 30px; position: relative; top: -10px;">
                        <div style="margin-top: 5px">巡航间隔：</div>
                        <div style="flex: 1">
                            <el-select v-model="selectValue" placeholder="请选择">
                                <el-option
                                        v-for="item in timeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <duno-table style="width: 104%" height="200"  v-for="(item, index) in dataList"  :key="index"  :columns="columns" :dataList="item.dataList"></duno-table>
                    <div style="width: 100%; text-align: right;  margin-top: 5px">
                        <span  style="color: white">预置位切换：<span style="color: #ffd70a">{{ secondLastShow }}s</span></span>
                    </div>
                    <div style="display:flex;width: 100%; text-align: right; margin-top: 8px; justify-content: space-between; align-items: baseline">
                        <div>
                            <div  style="display: flex;">
                                <el-radio v-model="radioValue" label="1">单次</el-radio>
                                <el-radio v-model="radioValue" label="2">循环</el-radio>
                            </div>
                        </div>
                        <el-button @click="startBoat" style="height: 30px; line-height: 10px" type="primary">{{ boatNow?'开始巡航':'暂停巡航' }}</el-button>
                    </div>
                </div>
            </div>
        </template>
        <template  v-else-if="panelType == 'third'">
            <div class="title">{{ cameraName }}</div>
            <div class="cameraMain">
                <div class="camera" v-if="showCamera">
                    <div class="main" style="width: 400px; height: 250px">
                        <video-player  ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
                        <!--<video id="video1" width="400" height="250" controls></video>-->
                    </div>
                    <div class="explain iconList">
                        <span @click="fullScreen()"><i class="iconfont icon-luxiang"></i>全屏</span>
                        <span><i class="iconfont icon-jietu"></i>录像</span>
                        <span><i class="iconfont icon-quanping"></i>存图</span>
                    </div>
                </div>
                <div class="btnList" style="padding-bottom: 0; ">
                    <div class="description">
                        调整镜头
                    </div>
                    <div class="row">
                        <div class="btn" :class="{'active':activeNum == 32}" :style="'background:url('+ xjBtn +');'" @mousedown="viewCamera(32, false)" @mouseup="viewCamera(32, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 0}" :style="'background:url('+ squera +'); transform: rotate(90deg);'" @mousedown="viewCamera(0, false)"  @mouseup="viewCamera(0, true)"></div>
                        <div class="btn"  :class="{'active':activeNum == 33}" :style="'background:url('+ xjBtn +'); transform: rotate(90deg);'" @mousedown="viewCamera(33, false)"   @mouseup="viewCamera(33, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn" :class="{'actived':activeNum == 2}" :style="'background:url('+ squera +')'"  @mousedown="viewCamera(2, false)" @mouseup="viewCamera(2, true)"></div>
                        <div class="btn" style="visibility: hidden"></div>
                        <div class="btn"  :class="{'actived':activeNum == 3}" :style="'background:url('+ squera +');transform: rotate(180deg);position: relative;'" @mousedown="viewCamera(3, false)" @mouseup="viewCamera(3, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn"  :class="{'active':activeNum == 34}" :style="'background:url('+ xjBtn +'); transform: rotate(270deg);'" @mousedown="viewCamera(34, false)" @mouseup="viewCamera(34, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 1}" :style="'background:url('+ squera +');transform: rotate(270deg);'" @mousedown="viewCamera(1, false)" @mouseup="viewCamera(1, true)"></div>
                        <div class="btn" :class="{'active':activeNum == 35}"  :style="'background:url('+ xjBtn +'); transform: rotate(180deg);'"@mousedown="viewCamera(35, false)" @mouseup="viewCamera(35, true)"></div>
                    </div>
                    <div class="control_slider" style="bottom: -32px">
                        <i class="iconfont icon-suoxiao1"></i>
                        <el-slider class="elSlider" v-model="sliderValue" :min="1" :max="8"></el-slider>
                        <i class="iconfont icon-fangda1"></i>
                    </div>
                </div>
            </div>
            <div class="addPosition" style="">
                <div class="left">
                    <div class="title">新增预置位名称：</div>
                    <div class="input"> <el-input  style="position: relative;z-index: 9" :disabled="false" v-model="addPosInput" placeholder=""></el-input></div>
                    <div class="btnEx">
                        <span class="btnEx_title">请使用右上角图标调整预设位</span>
                        <span class="btnEx_btn"><el-button type="primary" @click="addPosition">{{ isEdit==false?'添加':'修改' }}</el-button></span>
                    </div>
                </div>
                <div class="right">
                    <div class="title">已添加预置位：</div>
                    <div class="table">
                        <duno-table height="150"  v-for="(item, index) in dataListd"  :key="index"  :columns="columnsd" :dataList="item.dataList"></duno-table>
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
        <!--   <div class="leftBtn" v-if="topBtnListFlag == 0">
               <div v-for="(item,index) in leftBtnList" :key="index" @click="changeLeftActive(index)"  class="btn" :class="{'active':item['active']}">{{ item.name }}</div>
           </div>
           <div class="topBtn">
               <div v-for="(item,index) in topBtnList" :key="index" @click="changeRightActive(index)"  class="btn" :class="{'active':item['active']}">{{ item.name }}</div>
           </div>-->
    </div>
</template>

<script>
    import {getAxiosData, putAxiosData, postAxiosData, deleteDataId} from '@/api/axiosType'
    import  { playCamera, controlCamera, setPosition, mvPosition, editPosition, delPosition } from '@/api/camera'
    import dunoTable from '_c/duno-m/table/Table'
    import clock from '@/assets/camera/clock.png'
    import { DunoCharts } from '_c/duno-charts'
    import 'video.js/dist/video-js.css'
    import { videoPlayer } from 'vue-video-player'
    import 'videojs-flash'
    export default {
        name: 'cameraPanel',
        components: { dunoTable,DunoCharts, videoPlayer },
        data() {
            return {
                sliderValue: 0,
                clock,
                timeRange: '',
                temparams: null,
                dataCharts: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line'
                }],
                isEdit: false,
                editIndex: -1,
                addPosInput: '',
                flagNow: -1,
                secondLast: 2,
                secondLastShow: 2,
                timer: null,
                showTimer: null,
                lightTimer: null,
                movTimer: null,
                boatNow: true,
                radioValue: '1',
                selectValue: '3000',
                timeOptions:[
                    { value:'3000', label: '3秒/控制位' },
                    { value:'120000', label: '2分钟/控制位' },
                    { value:'180000', label: '3分钟/控制位' },
                    { value:'240000', label: '4分钟/控制位' },
                    { value:'300000', label: '5分钟/控制位' }
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
                        key: 'presetName',
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
                            let newArr = null
                            if(params.row.flag == 'play')
                                newArr =  [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ temp +')',backgroundSize:'contain'}, on: { click: () => { this.checkPostion(params.row.psIndex) } } }) ]
                            else
                                newArr = [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ temp +')',backgroundSize:'contain'} }) ]
                            return h('div', newArr)
                        }
                    },
                ],
                dataList: [
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
                        key: 'presetName',
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
                                    on: { click: () => { this.checkPostion(params.row.psIndex) } }
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
                operateUrl: {
                    play: '/lenovo-visible/api/visible-equipment/stable/play/{deviceId}',// 视频播放
                    pause: '/lenovo-visible/api/visible-equipment/stable/pause/{deviceId}',// 暂停
                    ptzSet: '/lenovo-visible/api/visible-equipment/ptz/direction-adjust/{id}/{cmd}/{step}/{flag}',//
                    stop: '/lenovo-visible/api/visible-equipment/stable/stop/{deviceId}'// 停止播放
                },
                playerOptions:{
                    width:720,
                    sources: [{
                        type: "rtmp/flv",
                        src: 'rtmp://live.hkstv.hk.lxdns.com/live/hks2'
                    }],
                    techOrder: ['flash'],
                    autoplay: true,
                    controls: true
                },
                activeNum: -1
            }
        },
        computed:{
            deviceId(){
                return this.itemData['monitorDeviceId'].toString()
            },
            cameraName(){
                return this.itemData['deviceMessage']['cameraName']
            }
        },
        watch: {
            panelType(){
                debugger
                const that = this
                this.$nextTick(()=> {
                    // that.initCamera()
                })
            },
            topBtnListFlag(now){
                if(now == 0){
                    const that = this
                    this.$nextTick(()=> {
                        // that.initCamera()
                    })
                }
            },
            leftBtnListFlag(now){
                const that = this
                this.$nextTick(()=> {
                    // that.initCamera()
                })
            },
            flagNow(now){
                const that = this
                // alert(now)
                putAxiosData('/lenovo-visible/api/visible-equipment/ptz/preset-move/'+that.deviceId+'/'+this.dataList[0]['dataList'][now]['psIndex'])
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
            itemData:{ },
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
        methods:{
            getListData(){
                const that = this
                let url = '/lenovo-visible/api/visible-equipment/preset/list-name'
                getAxiosData(url, {deviceId: that.deviceId}).then(res=>{
                    let data = res.data
                    data.map(item=>{
                        item['flag'] = 'play'
                    })
                    that.dataList[0]['dataList'] = data
                    that.dataListd[0]['dataList'] = data
                })
            },
            fullScreen(){
                debugger
                let ele = this.$refs.videoPlayer.$el.getElementsByClassName('vjs-fullscreen-control')[0].click();
            },
            checkPostion(pid){
                const that = this
                debugger
                putAxiosData('/lenovo-visible/api/visible-equipment/ptz/preset-move/'+that.deviceId+'/'+pid)
            },
            editTableData(params){
                const that = this
                that.editIndex = params.index
                that.addPosInput = params.row.presetName
                that.temparams = params
                that.isEdit = true
            },
            delTableData(params){
                const that = this
                deleteDataId('/lenovo-visible/api/visible-equipment/preset/delete/'+params.row.id, {id:params.row.id}).then(res=>{
                    that.getListData()
                })
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
                    postAxiosData('/lenovo-visible/api/visible-equipment/preset/create/'+ that.deviceId,{'presetName':that.addPosInput, id: that.deviceId}).then(res=>{
                        that.getListData()
                    })
                    that.addPosInput = ''
                }else{
                    // 修改
                    let temp = that.addPosInput
                    this.$forceUpdate()
                    that.addPosInput = ''
                    that.isEdit = !that.isEdit
                    putAxiosData('/lenovo-visible/api/visible-equipment/preset/edit', { deviceId: that.deviceId.toString(), id: that.temparams.row.id.toString(), presetName:temp }).then(res=>{
                        that.getListData()
                    })
                    sessionStorage.setItem('dataList',JSON.stringify( that.dataListd[0]['dataList']))
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
                this.panelType = 'none'
                this.$emit('on-close')
            },
            viewCamera(command, flag){
                this.activeNum = command
                let url = this.operateUrl.ptzSet.replace("{cmd}", command).replace("{id}", this.deviceId)
                    .replace("{step}", this.sliderValue).replace("{flag}", Number(flag));
                putAxiosData(url).then(res => {
                },error=>{
                    this.$message.error(error.message);
                })
            },
            initCamera(){
                const that = this
                const url = '/lenovo-visible/api/visible-equipment/sdk/rtmp';
                getAxiosData(url, {}).then(res => {
                     that.playerOptions.sources[0].src = res.data;
                });
            }
        },
        created(){
            const that = this
        },
        mounted(){
            const that = this
            this.$nextTick(()=>{
                that.initCamera()   // 初始化摄像头
                that.getListData()  // 获取表格数据
            })
        }
    }
</script>

<style lang="scss">
    .miniWidth{
        width: 364px !important;
    }
    .cameraPanel{
        position: relative;
        display: flex;
        padding-bottom: 30px;
        flex-direction: column;
        /*border: 1px solid #04e6e7;*/
        padding: 1px 14px;
        width: 750px;
        .vjs-custom-skin{
            transform: scale(0.6);
            transform-origin: left top;
            position: relative;
            left: -7px;
        }
        /*background: rgba(0,39,70,0.8);*/
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
        .el-input--small .el-input__inner{
            background: transparent;
            color: #cccccc;
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
        .element::-webkit-scrollbar {display:none}
        /*  .el-input__inner{
              border-color: #409EFF !important;
              color: white;
          }
          .el-radio__label{
              color: white;
          }*/
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
                padding-left: 30px;
                flex: 1;
                .table{
                    position: relative;
                    top: -16px;
                }
            }
            .title{
                margin-bottom: 20px;
                font-size: 14px;
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
                height: 300px;
                margin-right: 7px;
                .main{
                    width: 100%;
                    height: 83%;
                }
                .explain{
                    height: 20px;
                    display: flex;
                    color: white;
                    padding-top: 20px;
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
                height: 256px;
                margin-left: 26px;
                position: relative;
                .description{
                    position: absolute;
                    color: #a2a2a5;
                    width: 29px;
                    height: 48px;
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
