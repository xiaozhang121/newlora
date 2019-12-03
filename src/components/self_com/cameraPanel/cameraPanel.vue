<template>
    <div class="cameraPaneldddd" style="width: 300px" :class="{'miniWidth': topBtnListFlag != 0}">
        <template  v-if="leftBtnListFlag == 0 && topBtnListFlag == 0">
            <div class="title">云台-TGTYS <i @click="onClose" style="color: white; float: right; cursor: pointer" class="el-icon-close"></i></div>
            <div class="cameraMain">
                <div class="camera" v-if="showCamera">
                    <div class="main">
                        <video id="video1" width="400" height="250" controls></video>
                    </div>
                    <div class="explain">
                        <!--  <span>全屏</span>
                          <span>录像</span>
                          <span>存图</span>-->
                    </div>
                </div>
                <div class="btnList" style="padding-bottom: 0; padding-left: 49px">
                    <div class="row">
                        <div class="btn" :class="{'active':activeNum == 32}" :style="'background:url('+ xjBtn +');position: relative;top: 8px;'" @mousedown="viewCamera(32, false)" @mouseup="viewCamera(32, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 0}" :style="'background:url('+ squera +'); transform: rotate(90deg);position: relative;top: 8px;'" @mousedown="viewCamera(0, false)"  @mouseup="viewCamera(0, true)"></div>
                        <div class="btn"  :class="{'active':activeNum == 33}" :style="'background:url('+ xjBtn +'); transform: rotate(90deg);position: relative;top: 8px;'" @mousedown="viewCamera(33, false)"   @mouseup="viewCamera(33, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn" :class="{'actived':activeNum == 2}" :style="'background:url('+ squera +')'"  @mousedown="viewCamera(2, false)" @mouseup="viewCamera(2, true)"></div>
                        <div class="btn" style="visibility: hidden"></div>
                        <div class="btn"  :class="{'actived':activeNum == 3}" :style="'background:url('+ squera +');transform: rotate(180deg);position: relative;left: 0px;top:-2px'" @mousedown="viewCamera(3, false)" @mouseup="viewCamera(3, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn"  :class="{'active':activeNum == 34}" :style="'background:url('+ xjBtn +'); transform: rotate(270deg);position: relative;top: -10px;left:0px'" @mousedown="viewCamera(34, false)" @mouseup="viewCamera(34, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 1}" :style="'background:url('+ squera +');transform: rotate(270deg);position: relative;left: -1px;top:-10px'" @mousedown="viewCamera(1, false)" @mouseup="viewCamera(1, true)"></div>
                        <div class="btn" :class="{'active':activeNum == 35}"  :style="'background:url('+ xjBtn +'); transform: rotate(180deg);position: relative;top: -9px;left:-1px'"@mousedown="viewCamera(35, false)" @mouseup="viewCamera(35, true)"></div>
                    </div>
                </div>
            </div>
        </template>
        <template  v-if="leftBtnListFlag == 1 && topBtnListFlag == 0">
            <div class="title">云台-TGTYS <i @click="onClose" style="color: white; float: right; cursor: pointer" class="el-icon-close"></i></div>
            <div class="cameraMain">
                <div class="camera" v-if="showCamera">
                    <div class="main">
                        <video id="video1" width="400" height="250" controls></video>
                    </div>
                    <div class="explain">
                        <span style="display: flex">
                            <div style="width: 200px">巡航间隔：</div>
                            <div style="position: relative; top: -2px">
                                 <el-select v-model="selectValue" placeholder="请选择">
                                    <el-option
                                            v-for="item in timeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </span>
                        <span>
                            <div  style="display: flex; margin-left: 17px; margin-top: 7px">
                                 <el-radio v-model="radioValue" label="1">单次</el-radio>
                                 <el-radio v-model="radioValue" label="2">循环</el-radio>
                            </div>
                        </span>
                        <span></span>
                    </div>
                </div>
                <div class="btnList">
                    <duno-table height="200"  v-for="(item, index) in dataList"  :key="index"  :columns="columns" :dataList="item.dataList"></duno-table>
                    <div style="width: 100%; text-align: right; padding-right: 20px;">
                        <span  style="color: white">预置位切换：<span style="color: #ffd70a">{{ secondLastShow }}s</span></span>
                    </div>
                    <div style="width: 100%; text-align: right; padding-right: 20px;margin-top: 8px">
                        <el-button @click="startBoat" style="width: 90px;" type="primary">{{ boatNow?'开始巡航':'暂停巡航' }}</el-button>
                    </div>
                </div>
            </div>
        </template>
        <template  v-if="leftBtnListFlag == 2 && topBtnListFlag == 0">
            <div class="title">云台-TGTYS <i @click="onClose" style="color: white; float: right; cursor: pointer" class="el-icon-close"></i></div>
            <div class="cameraMain">
                <div class="camera" v-if="showCamera" style="height: inherit;">
                    <div class="main" style="height: inherit;">
                        <video id="video1" width="400" height="250" controls></video>
                    </div>
                </div>
                <div class="btnList" style="padding-bottom: 0; padding-left: 49px">
                    <div class="row">
                        <div class="btn" :class="{'active':activeNum == 32}" :style="'background:url('+ xjBtn +');position: relative;top: 8px;'" @mousedown="viewCamera(32, false)" @mouseup="viewCamera(32, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 0}" :style="'background:url('+ squera +'); transform: rotate(90deg);position: relative;top: 8px;'" @mousedown="viewCamera(0, false)"  @mouseup="viewCamera(0, true)"></div>
                        <div class="btn"  :class="{'active':activeNum == 33}" :style="'background:url('+ xjBtn +'); transform: rotate(90deg);position: relative;top: 8px;'" @mousedown="viewCamera(33, false)"   @mouseup="viewCamera(33, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn" :class="{'actived':activeNum == 2}" :style="'background:url('+ squera +')'"  @mousedown="viewCamera(2, false)" @mouseup="viewCamera(2, true)"></div>
                        <div class="btn" style="visibility: hidden"></div>
                        <div class="btn"  :class="{'actived':activeNum == 3}" :style="'background:url('+ squera +');transform: rotate(180deg);position: relative;left: 0px;top:-2px'" @mousedown="viewCamera(3, false)" @mouseup="viewCamera(3, true)"></div>
                    </div>
                    <div class="row">
                        <div class="btn"  :class="{'active':activeNum == 34}" :style="'background:url('+ xjBtn +'); transform: rotate(270deg);position: relative;top: -10px;left:0px'" @mousedown="viewCamera(34, false)" @mouseup="viewCamera(34, true)"></div>
                        <div class="btn" :class="{'actived':activeNum == 1}" :style="'background:url('+ squera +');transform: rotate(270deg);position: relative;left: -1px;top:-10px'" @mousedown="viewCamera(1, false)" @mouseup="viewCamera(1, true)"></div>
                        <div class="btn" :class="{'active':activeNum == 35}"  :style="'background:url('+ xjBtn +'); transform: rotate(180deg);position: relative;top: -9px;left:-1px'"@mousedown="viewCamera(35, false)" @mouseup="viewCamera(35, true)"></div>
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
                    <div class="title" style="padding-left: 15px">已添加预置位：</div>
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
                <span style="float: right; cursor: pointer" @click="onClose"><i class="el-icon-close"></i></span>
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
    import  { playCamera, controlCamera, setPosition, mvPosition, editPosition, delPosition } from '@/api/camera'
    import dunoTable from '_c/self_com/table/Table'
    import clock from '@/assets/images/clock.png'
    import { DunoCharts } from '_c/duno-charts'
    export default {
        name: 'cameraPanel',
        components: { dunoTable, DunoCharts },
        data() {
            return {
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
                            let newArr = null
                            if(params.row.flag == 'play')
                                newArr =  [ h('el-button', { class:'tableBtnName', style: {backgroundImage:'url('+ temp +')',backgroundSize:'contain'}, on: { click: () => { this.checkPostion(params.row.pid) } } }) ]
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
                                    on: { click: () => { this.checkPostion(params.row.pid) } }
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
                    {name: '实时监控', active: true},
                    {name: '历史告警', active: false},
                    {name: '历史数据', active: false}
                ],
                topBtnListFlag: 0,
                Wfs: require('@/libs/wfs'),
                xjBtn: require('@/assets/xjBtn.png'),
                xjBtnClick: require('@/assets/xjBtnClick.png'),
                squera: require('@/assets/squera.png'),
                squeraClick: require('@/assets/squeraClick.png'),
                edit: require('@/assets/images/btn/edit.png'),
                del:require('@/assets/images/btn/del.png'),
                activeNum: -1
            }
        },
        watch: {
            topBtnListFlag(now){
                if(now == 0){
                    const that = this
                    this.$nextTick(()=> {
                        that.initCamera()
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
                // alert(now)
                mvPosition({pid:this.dataList[0]['dataList'][now]['pid']})
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
            checkPostion(pid){
                const that = this
                mvPosition({pid:pid}).then(res=>{

                })
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
                delPosition({pid:params.row.pid})
                this.dataListd[0]['dataList'].splice(params.index, 1)
                this.dataList[0]['dataList'].splice(params.index, 1)
                sessionStorage.setItem('dataList',JSON.stringify( that.dataList[0]['dataList']))
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
                    setPosition({'name':that.addPosInput}).then(res=>{
                        that.dataListd[0]['dataList'].push({
                            flag: 'play',
                            ago: false,
                            pid: res.data,
                            name: tempName,
                            deal: '删除'
                        })
                        that.dataList[0]['dataList'].push({
                            flag: 'play',
                            ago: false,
                            pid: res.data,
                            name: tempName,
                            deal: '删除'
                        })
                        sessionStorage.setItem('dataList',JSON.stringify( that.dataList[0]['dataList']))
                    })
                    that.addPosInput = ''
                }else{
                    // 修改
                    this.dataListd[0]['dataList'][this.editIndex].name = that.addPosInput
                    this.dataList[0]['dataList'][this.editIndex].name = that.addPosInput
                    this.$forceUpdate()
                    that.addPosInput = ''
                    that.isEdit = !that.isEdit
                    editPosition({ pid: that.temparams.row.pid, name:that.temparams.row.name })
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
                this.$emit('on-close')
            },
            viewCamera(command, flag){
                this.activeNum = command
                controlCamera({command: command, flag:flag}).then(res=>{
                })
            },
            initCamera(){
                return new Promise((resolve, reject)=>{
                    if (Wfs.isSupported()) {
                        let video1 = document.getElementById("video1"),
                            wfs = new Wfs();
                        wfs.attachMedia(video1, 'ch1');
                        resolve(200)
                    }
                })
            }
        },
        created(){
            const that = this
            if(sessionStorage.getItem('dataList')){
                that.dataListd[0]['dataList'] = JSON.parse(sessionStorage.getItem('dataList'))
                that.dataList[0]['dataList'] = JSON.parse(sessionStorage.getItem('dataList'))
            }
            this.$nextTick(()=>{
                that.initCamera().then(res=>{

                })
            })
        }
    }
</script>

<style lang="scss">
    .cameraPaneldddd{
        position: relative;
        display: flex;
        flex-direction: column;
        border: 1px solid #04e6e7;
        padding: 10px 20px;
        width: 750px;
        background: rgba(0,39,70,0.8);
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
        .el-input__inner{
            border-color: #409EFF !important;
            color: white;
        }
        .el-radio__label{
            color: white;
        }
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
            position: relative;
            left: -19px;
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
                flex: 1;
                padding-bottom: 50px;
                display: flex;
                flex-direction: column;
                .row{
                    display: flex;
                    height: 83px;
                    .btn{
                        flex: 1;
                        cursor: pointer;
                        margin: 9px;
                        background-size: contain !important;
                        background-repeat: no-repeat !important;
                    }
                    .btn.active{
                        background: url("../../../../src/assets/xjBtnClick.png") !important;
                        background-size: contain !important;
                        background-repeat: no-repeat !important;
                    }
                    .btn.actived{
                        background: url("../../../../src/assets/squeraClick.png")  !important;
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
