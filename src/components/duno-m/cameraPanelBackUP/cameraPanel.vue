<template>
    <div class="cameraPanel" :class="{'miniWidth': topBtnListFlag != 0}">
        <template  v-if="panelType == 'first'">
            <!--<div class="title">{{ cameraName }}</div>-->
            <div class="cameraMain">
                <div class="camera" v-if="showCamera">
                    <div class="main" style="width: 400px; height: 250px">
                        <video-player  ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
                        <div class="controlTip"  v-if="isCamera">
                            <div class="left">
                                录制 {{timeIncreateD}}
                            </div>
                            <div class="right">
                                <!--<i  class="iconfont icon-zanting" v-if="!isStop" @click="toStop(true)"></i> <i v-else @click="toStop(false)" class="iconfont icon-bofang"></i>--> <i @click="videotape()" class="iconfont icon-tingzhi"></i>
                            </div>
                        </div>
                        <!--<video id="video1" width="400" height="250" controls></video>-->
                    </div>
                    <div class="explain iconList">
                         <span @click="videotape()">
                                <i class="iconfont icon-luxiang" v-if="!isCamera"></i><span v-else class="redPoint"></span>录像
                        </span>
                        <span @click="isSample(1)"><i class="iconfont icon-jietu"></i>截图</span>
                        <span @click="fullScreen()"><i class="iconfont icon-quanping"></i>全屏</span>
                    </div>
                </div>
                <div class="btnList" style="padding-bottom: 0; ">
                    <div class="description">
                        调整镜头
                    </div>
                    <div class="row">
                        <div class="btn" :class="{'active':activeNum == 1 && activeStyle}" :style="'background:url('+ xjBtn +');'" @mousedown="viewCamera(1, false)" @mouseup="viewCamera(0, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 2 && activeStyle}" :style="'background:url('+ squera +'); transform: rotate(90deg);'" @mousedown="viewCamera(2, false)"  @mouseup="viewCamera(0, true)"></div>
                        <div class="btn"  :class="{'active':activeNum == 3 && activeStyle}" :style="'background:url('+ xjBtn +'); transform: rotate(90deg);'" @mousedown="viewCamera(3, false)"   @mouseup="viewCamera(0, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn" :class="{'actived':activeNum == 4 && activeStyle}" :style="'background:url('+ squera +')'"  @mousedown="viewCamera(4, false)" @mouseup="viewCamera(0, true)"></div>
                        <div class="btn" style="visibility: hidden"></div>
                        <div class="btn"  :class="{'actived':activeNum == 5 && activeStyle}" :style="'background:url('+ squera +');transform: rotate(180deg);position: relative;'" @mousedown="viewCamera(5, false)" @mouseup="viewCamera(0, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn"  :class="{'active':activeNum == 6 && activeStyle}" :style="'background:url('+ xjBtn +'); transform: rotate(270deg);'" @mousedown="viewCamera(6, false)" @mouseup="viewCamera(0, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 7 && activeStyle}" :style="'background:url('+ squera +');transform: rotate(270deg);'" @mousedown="viewCamera(7, false)" @mouseup="viewCamera(0, true)"></div>
                        <div class="btn" :class="{'active':activeNum == 8 && activeStyle}"  :style="'background:url('+ xjBtn +'); transform: rotate(180deg);'" @mousedown="viewCamera(8, false)" @mouseup="viewCamera(0, true)"></div>
                    </div>
                    <div class="control_slider">
                        <i class="iconfont icon-suoxiao1"></i>
                        <el-slider class="elSlider" :disabled="disabled"   @change="cameraSF" v-model="sliderValue"  :min="1" :max="20"></el-slider>
                        <i class="iconfont icon-fangda1"></i>
                    </div>
                    <!---->
                    <control-check @on-disable="onDisable"  ref="controlCheckRef" v-if="lockPress && deviceId"  :deviceType="1"  :deviceId="deviceId" />
                </div>
            </div>
        </template>
        <template  v-else-if="panelType == 'second'">
            <!--<div class="title">{{ cameraName }}</div>-->
            <div class="cameraMain" style="padding-bottom: 39px;">
                <div class="camera" v-if="showCamera">
                    <div class="main" style="width: 400px; height: 250px">
                        <video-player  ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
                        <div class="controlTip" style="position: absolute; bottom: 96px"  v-if="isCamera">
                            <div class="left">
                                录制 {{timeIncreateD}}
                            </div>
                            <div class="right">
                                <!--<i  class="iconfont icon-zanting" v-if="!isStop" @click="toStop(true)"></i> <i v-else @click="toStop(false)" class="iconfont icon-bofang"></i>--> <i @click="videotape()" class="iconfont icon-tingzhi"></i>
                            </div>
                        </div>
                        <!--<video id="video1" width="400" height="250" controls></video>-->
                    </div>
                    <div class="explain iconList">
                         <span @click="videotape()">
                                <i class="iconfont icon-luxiang" v-if="!isCamera"></i><span v-else class="redPoint"></span>录像
                        </span>
                        <span @click="isSample(1)"><i class="iconfont icon-jietu"></i>截图</span>
                        <span @click="fullScreen()"><i class="iconfont icon-quanping"></i>全屏</span>
                    </div>
                </div>
                <div class="btnList">
                    <div style="display: flex; margin-bottom: 39px; position: relative; top: 5px;">
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
                    <div style="display:flex;width: 100%; text-align: right; margin-top: 13px; justify-content: space-between; align-items: baseline">
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
            <!--<div class="title">{{ cameraName }}</div>-->
            <div class="cameraMain">
                <div class="camera" v-if="showCamera">
                    <div class="main" style="width: 400px; height: 250px">
                        <video-player  ref="videoPlayer" class="vjs-custom-skin" :options="playerOptions"></video-player>
                        <div class="controlTip"  style="position: absolute; bottom: 253px" v-if="isCamera">
                            <div class="left">
                                录制 {{timeIncreateD}}
                            </div>
                            <div class="right">
                                <!--<i  class="iconfont icon-zanting" v-if="!isStop" @click="toStop(true)"></i> <i v-else @click="toStop(false)" class="iconfont icon-bofang"></i>--> <i @click="videotape()" class="iconfont icon-tingzhi"></i>
                            </div>
                        </div>
                        <!--<video id="video1" width="400" height="250" controls></video>-->
                    </div>
                    <div class="explain iconList">
                          <span @click="videotape()">
                                <i class="iconfont icon-luxiang" v-if="!isCamera"></i><span v-else class="redPoint"></span>录像
                        </span>
                        <span @click="isSample(1)"><i class="iconfont icon-jietu"></i>截图</span>
                        <span @click="fullScreen()"><i class="iconfont icon-quanping"></i>全屏</span>
                    </div>
                </div>
                <div class="btnList" style="padding-bottom: 0; ">
                    <div class="description">
                        调整镜头
                    </div>
                    <div class="row">
                        <div class="btn" :class="{'active':activeNum == 1 && activeStyle}" :style="'background:url('+ xjBtn +');'" @mousedown="viewCamera(1, false)" @mouseup="viewCamera(0, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 2 && activeStyle}" :style="'background:url('+ squera +'); transform: rotate(90deg);'" @mousedown="viewCamera(2, false)"  @mouseup="viewCamera(0, true)"></div>
                        <div class="btn"  :class="{'active':activeNum == 3 && activeStyle}" :style="'background:url('+ xjBtn +'); transform: rotate(90deg);'" @mousedown="viewCamera(3, false)"   @mouseup="viewCamera(0, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn" :class="{'actived':activeNum == 4 && activeStyle}" :style="'background:url('+ squera +')'"  @mousedown="viewCamera(4, false)" @mouseup="viewCamera(0, true)"></div>
                        <div class="btn" style="visibility: hidden"></div>
                        <div class="btn"  :class="{'actived':activeNum == 5 && activeStyle}" :style="'background:url('+ squera +');transform: rotate(180deg);position: relative;'" @mousedown="viewCamera(5, false)" @mouseup="viewCamera(0, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn"  :class="{'active':activeNum == 6 && activeStyle}" :style="'background:url('+ xjBtn +'); transform: rotate(270deg);'" @mousedown="viewCamera(6, false)" @mouseup="viewCamera(0, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 7 && activeStyle}" :style="'background:url('+ squera +');transform: rotate(270deg);'" @mousedown="viewCamera(7, false)" @mouseup="viewCamera(0, true)"></div>
                        <div class="btn" :class="{'active':activeNum == 8 && activeStyle}"  :style="'background:url('+ xjBtn +'); transform: rotate(180deg);'" @mousedown="viewCamera(8, false)" @mouseup="viewCamera(0, true)"></div>
                    </div>
                    <div class="control_slider" style="bottom: -32px">
                        <i class="iconfont icon-suoxiao1"></i>
                        <el-slider class="elSlider" :disabled="disabled"   @change="cameraSF" v-model="sliderValue"  :min="1" :max="20"></el-slider>
                        <i class="iconfont icon-fangda1"></i>
                    </div>
                </div>
            </div>
            <div class="addPosition" style="">
                <div class="left" v-if="isAdd">
                    <control-check @on-disable="onDisable"  ref="controlCheckRef" v-if="lockPress && deviceId" :deviceType="1" :deviceId="deviceId" style="text-align: left; margin-bottom: 27px; margin-top: 10px; position: inherit; top: inherit"/>
                    <div class="title">新增预置位名称：</div>
                    <div class="input"> <el-input  style="position: relative;z-index: 9" :disabled="false" @input="checkSpecial" v-model="addPosInput" placeholder=""></el-input></div>
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
        <screenshot
                v-if="isShow"
                :isShow="isShow"
                :isVideo='isVideo'
                :taskId='taskId'
                :shotData="shotData"
                @closeShot="closeShot"
                :monitorInfo="monitorInfo"
                :monitorDeviceId="monitorInfo['monitorDeviceId']"
                top="5vh"
        />
    </div>
</template>

<script>
    import controlCheck from '_c/duno-m/controlCheck'
    import screenshot from "_c/duno-c/screenshot";
    import moment from "moment";
    import {getAxiosData, putAxiosData, postAxiosData, deleteDataId} from '@/api/axiosType'
    import dunoTable from '_c/duno-m/table/Table'
    import videojs from 'video.js'
    import clock from '@/assets/camera/clock.png'
    import { DunoCharts } from '_c/duno-charts'
    import mixinViewModule from "@/mixins/view-module";
    import 'video.js/dist/video-js.css'
    import { videoPlayer } from 'vue-video-player'
    import 'videojs-flash'
    import SWF_URL from 'videojs-swf/dist/video-js.swf'
    videojs.options.flash.swf = SWF_URL
    export default {
        name: 'cameraPanel',
        components: { dunoTable,DunoCharts, videoPlayer, screenshot, controlCheck },
        mixins: [mixinViewModule],
        data() {
            return {
                activeStyle: false,
                lockPress: false,
                taskId: '',
                monitorInfo: {},
                isShow: false,
                isVideo:true,
                isAdd:false,
                isEdite:false,
                isViwe:false,
                isDel:false,
                shotData: [],
                passTime: 0,
                timeSeed: null,
                isStop: false,
                timerTime: null,
                timeIncreateD: '0:00:00',
                isCamera: false,
                disabled: false,
                sliderValue: 1,
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
                timerMove: null,
                timer: null,
                showTimer: null,
                lightTimer: null,
                movTimer: null,
                boatNow: true,
                radioValue: '1',
                selectValue: '3000',
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
                            if(this.isViwe){
                                newArr.push(h('Tooltip', {
                                    props: { content: '查看' }
                                }, [
                                    h('el-button', {
                                        class:'tableBtnName', style: {backgroundImage:'url('+ this.play +')'},
                                        on: { click: () => { this.checkPostion(params.row.psIndex) } }
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
                    {name: '实时信息', active: true},
                    {name: '历史告警', active: false},
                    {name: '历史数据', active: false}
                ],
                topBtnListFlag: 0,
                Wfs: require('@/libs/wfs'),
                xjBtn: require('@/assets/camera/xjBtn.png'),
                squera: require('@/assets/camera/squera.png'),
                xjBtnClick: require('@/assets/camera/xjBtnClick.png'),
                squeraClick: require('@/assets/camera/squeraClick.png'),
                edit: require('@/assets/images/btn/edit.png'),
                del:require('@/assets/images/btn/del.png'),
                operateUrl: {
                    play: '/lenovo-visible/api/visible-equipment/stable/play/{deviceId}',// 视频播放
                    pause: '/lenovo-visible/api/visible-equipment/stable/pause/{deviceId}',// 暂停
                    ptzSet: '/lenovo-visible/api/visible-equipment/ptz/direction-adjust/{cmd}/{step}/{id}',//
                    stop: '/lenovo-visible/api/visible-equipment/stable/stop/{deviceId}'// 停止播放
                },
                playerOptions:{
                  aspectRatio: "16:9",
                  fluid: true,
                  width:350,
                    sources: [{
                        type: "rtmp/flv",
                        src: 'rtmp://live.hkstv.hk.lxdns.com/live/hks2'
                    }],
                    techOrder: ['flash'],
                    autoplay: true,
                    controls: false
                },
                activeNum: -1,
                sliderValueold: 1,
                clearCameraTimer: null,
                maxSecond: 0
            }
        },
        computed:{
            deviceId(){
                if(this.itemData)
                    return this.itemData['monitorDeviceId'].toString()
                else
                    return -1
            },
            cameraName(){
                if(this.itemData)
                    return this.itemData['deviceMessage']['cameraName']
                else
                    return ''
            }
        },
        watch: {
            sliderValue(now, old){
             /*   if(this.clearCameraTimer)
                    return
                if(now < old){
                    this.viewCamera(4, true)
                    this.viewCamera(5, false)
                }else{
                    this.viewCamera(5, true)
                    this.viewCamera(4, false)
                }
                this.clearCameraTimer = setTimeout(()=>{
                    this.cameraSFClear()
                    this.clearCameraTimer = null
                },Math.abs(now - old)*500)*/
            },
            panelType(){
                const that = this
                this.$nextTick(()=> {
                    that.getListData()
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
                putAxiosData('/lenovo-visible/api/visible-equipment/ptz/preset-move'+'/20/8/'+this.dataList[0]['dataList'][now]['psIndex']+'/'+that.deviceId)
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
            onDisable(flag){
                this.activeNum = -1
                if(flag){
                  this.activeStyle = true
                  this.xjBtn = require('@/assets/camera/xjBtnClick.png')
                  this.squera = require('@/assets/camera/squeraClick.png')
                  this.xjBtnClick = require('@/assets/camera/xjBtnClick.png')
                  this.squeraClick = require('@/assets/camera/squeraClick.png')
                }else{
                  this.activeStyle = false
                  this.xjBtn = require('@/assets/camera/xjBtn.png')
                  this.squera = require('@/assets/camera/squera.png')
                  this.xjBtnClick = require('@/assets/camera/xjBtn.png')
                  this.squeraClick = require('@/assets/camera/squera.png')
                }
                this.disabled = !flag
            },
            closeShot() {
                this.isShow = false;
            },
            isSample(index) {
                const that = this
                if(index){
                  this.isVideo = true;
                }else{
                  this.isVideo = false;
                }
                this.isShow = true;
                let url = "/lenovo-device/api/stream/snapshoot";
                let query = {
                    rtmpUrl: that.playerOptions.sources[0].src
                };
                postAxiosData(url, query).then(res => {
                    this.shotData = res.data;
                });
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
                    let rest = times / 1000
                    if(rest >= this.maxSecond){
                        this.videotape()
                    }
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
                    postAxiosData('/lenovo-device/api/stream/startRecord',{'rtmpUrl': this.playerOptions["sources"][0]["src"], 'monitorDeviceId': this.deviceId, 'type': '1'}).then(res=>{
                        this.$message.info(res.msg)
                        this.taskId = res.data.taskId
                        this.maxSecond = res.data.maxRecordTime
                        this.timeIncreate()
                    })
                }else{
                    // 结束录像
                    postAxiosData('/lenovo-device/api/stream/endRecord',{'rtmpUrl': this.playerOptions["sources"][0]["src"], 'taskId':this.taskId}).then(res=>{
                        clearInterval(this.timerTime)
                        this.timeIncreateD = '0:00:00'
                        this.$message.info(res.msg)
                        this.isSample(0);
                    })
                }
            },
            cameraSF(now){
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
                    this.viewCamera(10, false).then(res=>{
                        setTimeout(()=>{
                            this.viewCamera(10, true).then(res=>{
                                that.disabled = false
                            })
                        },Math.abs(now-old)*timeSeed)
                    })
                }else{
                    this.viewCamera(9, false).then(res=>{
                        setTimeout(()=>{
                            this.viewCamera(9, true).then(res=>{
                                that.disabled = false
                            })
                        },Math.abs(now-old)*timeSeed)
                    })
                }
                this.sliderValueold = now
            },
            cameraSFClear(now){
                const that = this
                Promise.all([this.viewCamera(5, true), this.viewCamera(4, true)]).then(data=>{
                    that.disabled = false
                })
            },
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
                let ele = this.$refs.videoPlayer.$el.getElementsByClassName('vjs-fullscreen-control')[0].click();
            },
            checkPostion(pid){
                const that = this
                putAxiosData('/lenovo-visible/api/visible-equipment/ptz/preset-move'+'/20/8/'+pid+'/'+that.deviceId).then(res=>{
                    this.$message.info(res.msg)
                })
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
                    this.$message.info(res.msg)
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
                        this.$message.info(res.msg)
                    }, error => {
                      this.$message.error(error.response.data.message)
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
                        this.$message.info(res.msg)
                    }, error => {
                      this.$message.error(error.response.data.message)
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
                const that = this
                // if(flag){
                //   command = 0
                // }
                this.activeNum = command
                let url = this.operateUrl.ptzSet.replace("{cmd}", command).replace("{id}", this.deviceId)
                    .replace("{step}", 8);
                return new Promise((resolve, reject)=>{
                    putAxiosData(url).then(res => {
                       try{ 
                        this.$message.info(res.msg)
                       }catch (e) {
                           
                       }
                       if(!res.data.flag){
                          /* putAxiosData(`/lenovo-visible/api/visible-equipment/equip-connect/${that.deviceId}/0`).then(res=>{
                               putAxiosData(`/lenovo-visible/api/visible-equipment/equip-connect/${that.deviceId}/1`).then(res=>{})
                           })*/
                       }
                        resolve(res)
                    },error=>{
                        reject(res)
                        this.$message.error(error.message);
                    })
                })
            },
            initCamera(){
                const that = this
                that.disabled = false
                this.monitorInfo = {'monitorDeviceId': that.deviceId}
                const url = '/lenovo-visible/api/visible-equipment/sdk/rtmp/'+that.deviceId;
                getAxiosData(url, {}).then(res => {
                     that.playerOptions.sources[0].src = res.data;
                    /* setTimeout(()=>{
                         that.viewCamera(5, false).then(res=>{
                             setTimeout(()=>{
                                 this.viewCamera(5, true).then(res=>{
                                     that.disabled = false
                                 })
                             },5000)
                         })
                     },500)*/
                }, error => {
                  this.$message.error(error.response.data.message)
                });
            }
        },
        created(){
            const that = this
            // this.onDisable(false)
        },
        mounted(){
            const that = this
            this.lockPress = this.getAuthority("10000105")
            this.$nextTick(()=>{
                that.initCamera()   // 初始化摄像头
                that.getListData()  // 获取表格数据
            })
            this.isAdd = this.getAuthority('10000101');
            this.isViwe = this.getAuthority('10000102');
            this.isEdite = this.getAuthority('10000103');
            this.isDel = this.getAuthority('10000104');
        },
        beforeDestroy(){
          try{
            this.$refs.videoPlayer.player.dispose()
          }catch (e) {}
            if(this.$refs.controlCheckRef)
                this.$refs.controlCheckRef.releaseNow()
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
        /*padding-bottom: 30px;*/
        flex-direction: column;
        /*border: 1px solid #04e6e7;*/
        /*padding: 1px 20px;*/
        width: 710px;
        .redPoint{
            position: relative;
            background: red;
            width: 12px;
            height: 12px;
            margin-left: 0 !important;
            margin-right: 16px !important;
            border-radius: 300px;
            left: 7px;
        }
        .controlTip{
            background-color: rgba(0, 0, 0, 0.5);
            position: absolute;
            width: 447px;
            height: 30px;
            bottom: 56px;
            left: -7px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 10px;
            & div:last-child > i{
                cursor: pointer;
                &:first-child{
                  margin-right: 7px;
                }
            }
        }
        .vjs-custom-skin{
            transform: scale(1.1, 1.1);
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
                /*width: 256px;*/
                width: 249px;
                height: 256px;
                margin-left: 50px;
                position: relative;
                top: -3px;
                .description{
                    position: absolute;
                    color: #a2a2a5;
                    width: 28px;
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
                        margin: 3px;
                        background-size: contain !important;
                        background-repeat: no-repeat !important;
                        position: relative;
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
