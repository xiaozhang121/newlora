<template>
  <div class="dunoBtnTop not-print" :style="'z-index:' + zIndex">
    <div class="placeHolder" v-if="showBtnList">
    </div>
    <div class="btnList dropSelf" v-if="showBtnList?true:isSingleDrop" :style="'position: absolute; z-index:' + zIndex">
      <div class="title dropSelf" v-if="isCheck" @click.stop="toShow()">
        <!-- 全部固定监控设备 -->
        <i class="iconfont icon-zuoyoubuju" v-if="displayType=='1'"></i>
        <i class="iconfont icon-shangxiabuju" v-if="displayType=='2'"></i>
        <i class="iconfont icon-buju" v-if="displayType=='3'"></i>
        <div :class="{'output': output}">
          <input class="selfInput" ref="selfInput" :class="{iconLayout:isLayout}" @keyup="onKeyup($event)"    @focus="onFocusd()"  @blur="hiddenDrapdown" :readonly="true" :placeholder="title" v-model="titleMain" />
          <div class="iconfont icon-xiala dropSelf" :class="{'active':showListFlag}" @click="showListFlag = !showListFlag"></div>
        </div>
      </div>
      <div class="title dropSelf" v-else @click="showListFlag = !showListFlag">
        <!-- 全部固定监控设备 -->
        <i class="iconfont icon-zuoyoubuju" v-if="displayType=='1'"></i>
        <i class="iconfont icon-shangxiabuju" v-if="displayType=='2'"></i>
        <i class="iconfont icon-buju" v-if="displayType=='3'"></i>
        <div :class="{'output': output}">
          <input class="selfInput" ref="selfInput" :class="{iconLayout:isLayout}" @keyup="onKeyup($event)"     @blur="hiddenDrapdown" :readonly="!isCheck" :placeholder="title" v-model="titleMain" />
          <div class="iconfont icon-xiala dropSelf" :class="{'active':showListFlag}"></div>
        </div>
      </div>
      <div v-if="isCheck" class="btn_main dropSelf isCheck checkbox" ref="showListRef" style="display: none">
        <div v-if="showAll" class="checkbox">
          <el-checkbox :indeterminate="isIndeterminate"  v-model="checkAll" @change="handleCheckAllChange" @click.native="changeCheckBox">{{ allLabelName }}</el-checkbox>
        </div>
        <el-checkbox-group  v-model="checkedCities"  @change="handleCheckedCitiesChange">
          <!-- <duno-btn-top-item v-for="(item, index) in dataList" :key="index" @click.native="handleActive(index)" class="btnItem" :isActive="item['isActive']"  :circleColor="item['circleColor']"  :describeName="item['describeName']"/> -->
          <div class="btnItem checkbox" v-for="(item,index) in dataList" :key="index">
            <el-tooltip class="item" effect="dark" :content="item['describeName']" placement="top">
              <el-checkbox v-if="keyChange"  :disabled="(disabled && !item['isActive'])"  :label="item['monitorDeviceId']" :key="item['monitorDeviceId']" @click.native="handleActive(index,(disabled && !item['isActive']))">
                <!-- <i class="item.icon"></i> -->
                <img class="checkbox"  :src="item.img">
                {{item['describeName']}}</el-checkbox>
            </el-tooltip>
            <el-tooltip  class="item" effect="dark" :content="item['describeName']" placement="top">
              <el-checkbox v-if="!keyChange"  :disabled="(disabled && !item['isActive'])"  :label="item['describeName']" :key="item['describeName']" @click.native="handleActive(index,(disabled && !item['isActive']))">
                <!-- <i class="item.icon"></i> -->
                {{item['describeName']}}
                <span class="checkbox" v-if="Array.isArray(item.img)">
                  <img v-for="(pic, indexd) in item['img']" :key="indexd" class="icon_img checkbox" :src="pic">
                </span>
                <span class="checkbox" v-else>
                  <img v-if="item.img" class="icon_img checkbox" :src="item.img">
                </span>
              </el-checkbox>
            </el-tooltip>
          </div>
        </el-checkbox-group>
      </div>
      <div v-else class="btn_main dropSelf" ref="showListRef" style="display: none; margin-top: 0; padding: 5px 0">
        <div class="btnItem checkbox" v-for="(item,index) in dataList" :key="index" style="margin:inherit">
          <div class="btnNr" @click="singleSelect(item, index)">{{item['describeName']}}</div>
        </div>
      </div>
    </div>
    <div class="middleBtn" :class="{'bigLeft': $store.state.user.isHeader == 2}"  v-if="showBtnList">
      <div v-for="(item, index) in topBtnList" :key="index" class="btn" @click="topBtnHandle(index, item)" :class="{'active': item['active']}">
        <i v-if="!item['active']" class="iconfont icon-biyan"></i>
        <i v-else class="iconfont icon-zhengyan"></i>
        {{ item['name'] }}
      </div>
    </div>
    <div class="rightBtnHandle" v-if="showBtnList">
      <div class="zoomMain" style="display: none">
        <span class="zoom">
          <i class="iconfont icon-jianshao"></i>
        </span>
        <span class="nr">缩放图片</span>
        <span class="zoom">
          <i class="iconfont icon-zengjia"></i>
        </span>
      </div>
      <div class="controlBall" @click="handleControlBall">
          <img :src="ball"/>
          <span>布控球</span>
      </div>
      <span v-if="!isFullscreen"><i class="fullScreenTop iconfont icon-quanping"  @click="changeFullScreen()"></i></span>
      <span v-else><i class="fullScreenTop iconfont icon-suoxiao"  @click="changeFullScreen()"></i></span>
    </div>
    <!--<div class="switch" >
      <span class="title">一次接线图</span>
      <el-switch
              v-model="isDiagram"
              active-color="#26FFB1"
              inactive-color="#ff4949">
      </el-switch>
    </div>-->
  </div>
</template>

<script>
    import Icons from '_c/icons'
    import dunoBtnTopItem  from '../duno-btn-topItem'
    export default {
        name: 'dunoBtnTop',
        data (){
            return {
                ball: require('@/assets/runDevice/ball.png'),
                dataInput: '',
                disabled: false,
                isFullscreen: false,
                showListFlag: false,
                checkAll: false,
                clickCheckAll: false,
                checkedCities: [],
                isIndeterminate: true,
                topBtnList:[
                    {active: false, name:'实景航拍图'},
                    {active: true, name:'设备布置图'},
                    {active: false, name:'一次接线图'}
                ],
                isDiagram: 2,
                isClick: false,
                dataBackup: [],
                titleMain: '',
                maxLength: 0,
                isNow: false,
                autoHide: true
            }
        },
        components: {
            Icons,
            dunoBtnTopItem
        },
        props: {
            ischeckAll: {
              type: Boolean,
              default: true
            },
            allLabelName: {
              type: String,
              default: '全选'
            },
            output:{
              type: Boolean,
              default: false
            },
            keyChange:{
                type: Boolean,
                default: false
            },
            showAll: {
                type: Boolean,
                default: true
            },
            zIndex: {
                type: [String, Number],
                default: '10'
            },
            isCheck:{
                type: Boolean,
                default: true
            },
            showBtnList: {
                type: Boolean,
                default: true
            },
            isLayout:{
                type:Boolean,
                default:false
            },
            title:{
                type:String,
                default:()=>{
                    return "全部固定监控设备"
                }
            },
            displayType:{
                type:[String,Number],
                default:()=>{
                    return ""
                }
            },
            isSingleDrop:{
                type:Boolean,
                default:()=>{
                    return true
                }
            },
            dataList:{
                type: Array,
                default:()=>{
                    return [
                        {
                            img:[require('@/assets/buttonPng/light.svg'),require('@/assets/buttonPng/lightCamera.png'), require('@/assets/runDevice/ballJ.png'),  require('@/assets/buttonPng/lightD.png')],
                            circleColor:'#00b4ff',
                            describeName: '可见光',
                            monitorDeviceType: [1,3,6,9],
                            isActive: true
                        },
                        {
                            img:[require('@/assets/buttonPng/redLight.png'), require('@/assets/buttonPng/redLightNCamera.png')],
                            circleColor:'#e654a6',
                            describeName: '红外测温',
                            monitorDeviceType: [2],
                            isActive: true
                        },
                        // {
                        //     img:require('@/assets/buttonPng/intelLock.png'),
                        //     circleColor:'#ffca28',
                        //     describeName: '智能锁具',
                        //     monitorDeviceType: 999,
                        //     isActive: true
                        // },
                        {
                            img:require('@/assets/SVG/weatherCheck.svg'),
                            circleColor:'#C06EFF',
                            describeName: '微型气象站',
                            monitorDeviceType: [6],
                            isActive: true
                        }
                    ]
                }
            }
        },
        watch: {
            dataList:{
                handler(now, old){
                    if(this.isCheck){
                        if(now.length && !this.dataBackup.length){
                            this.dataBackup = now
                        }
                        if(now.length == this.dataBackup.length){
                            this.onKeyup()
                        }
                    }
                },
                deep: true
            },
            title(now){
                if(this.isCheck){
                    this.titleMain = ''
                }else{
                    this.titleMain = now
                }
            },
            isDiagram(now){
                this.$emit('on-diagram', now)
            },
            showListFlag(now){
                $(this.$refs.showListRef).stop()
                if(now){
                    $(this.$refs.showListRef).slideDown('normal')
                }else{
                    if(this.isCheck){
                        $(this.$refs.showListRef).slideUp('normal')
                    }else if(!this.isCheck){
                        $(this.$refs.showListRef).slideUp('normal')
                    }
                }
            }
        },
        computed: {
            dataListName(){
                let data = []
                if(this.isCheck && this.dataBackup.length){
                    this.dataBackup.forEach(item=>{
                        data.push(item['describeName'])
                    })
                }else{
                    this.dataList.forEach(item=>{
                        data.push(item['describeName'])
                    })
                }

                return data
            }
        },
        methods:{
            changeCheckBox(){
              debugger
              // clickCheckAll
            },
            handleControlBall(){
                this.$emit('on-controlBall')
            },
            isDiff(arr1, arr2) {
                let flag = true
                if (arr1.length !== arr2.length) {
                    flag = false
                } else {
                    arr1.forEach(item => {
                        if (arr2.indexOf(item) === -1) {
                            flag = false
                        }
                    })
                }
                return flag;
            },
            toShow(){

            },
            onKeyup(event){
                if(!this.dataBackup.length){
                    this.dataBackup = this.dataList
                }
                console.log(this.titleMain)
                let value = this.titleMain
                if(event){
                    this.maxLength = 0
                }
                this.maxLength++
                if(this.maxLength < 50){
                    if(value != ''){
                        let data = this.dataBackup
                        let arr = []
                        data.forEach((item,index)=>{
                            if(item['describeName'] && item['describeName'].indexOf(value)>-1){
                                arr.push(item)
                            }
                        })
                        this.dataList = arr
                    }else{
                        this.dataList = this.dataBackup
                    }
                }
            },
            onFocusd(){
                const that = this
                this.showListFlag = true
                /* if(that.isCheck) {
                     $(that.$refs.showListRef).slideDown('normal')
                 }*/
            },
            hiddenDrapdown(e){
                const that = this
                if(that.isCheck && this.autoHide){
                    return
                }
                $(that.$refs.showListRef).slideUp('normal')
                that.showListFlag = false
            },
            singleSelect(item, index){
                this.$emit('on-select', item, index)
            },
            changeFullScreen(){
                this.$emit('change-screen')
            },
            topBtnHandle(index ,item){
                if(item['name'].indexOf('一次接线图')>-1){
                    this.isDiagram =  1
                }else if(item['name'].indexOf('设备布置图')>-1){
                    this.isDiagram =  2
                }else{
                    this.isDiagram =  3
                }
                let data = JSON.parse(JSON.stringify(this.topBtnList))
                if(!this.topBtnList[index]['active']){
                    data.map(item=>{
                        item['active'] = false
                    })
                }
                this.topBtnList = data
                this.topBtnList[index]['active'] = true
                this.$forceUpdate()
            },
            handleCheckedCitiesChange(value) {
                let checkedCount = value.length;
                this.checkAll = checkedCount === this.dataListName.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataListName.length;
                this.$emit('on-disabled', this.checkedCities)
            },
            handleCheckAllChange(val) {
                if(!val){
                    this.resetActive()
                }else{
                    this.chosenActive()
                }
                this.checkedCities = val ? this.dataListName : [];
                console.log(this.checkedCities.join(','))
                this.isIndeterminate = false;
                if(this.isCheck && this.dataBackup.length){
                    this.$emit('on-active',this.dataBackup)
                }else{
                    this.$emit('on-active',this.dataList)
                }

            },
            handleActive(index,flag){
                if(flag){
                    return
                }
                if(!this.isClick){
                    // this.dataBackup[index]['isActive'] = !this.dataBackup[index]['isActive']
                    this.$forceUpdate();
                    if(this.isCheck && this.dataBackup.length){
                      this.dataBackup[index]['isActive'] = !this.dataBackup[index]['isActive']
                      this.$emit('on-active',this.dataBackup)
                    }else{
                      this.dataList[index]['isActive'] = !this.dataList[index]['isActive']
                      this.$emit('on-active',this.dataList)
                    }
                    this.isNow = true
                    this.isClick = true
                    setTimeout(()=>{
                        this.isClick = false
                    },50)
                }
            },
            chosenActive(){
                if(this.isCheck && this.dataBackup.length){
                    this.dataBackup.map((item)=>{
                        item['isActive'] = true
                    })
                }else {
                    this.dataList.map((item)=>{
                        item['isActive'] = true
                    })
                }

                this.$forceUpdate();
            },
            resetActive(){
                if(this.isCheck  && this.dataBackup.length){
                    this.dataBackup.map((item)=>{
                        item['isActive'] = false
                    })
                }else{
                    this.dataList.map((item)=>{
                        item['isActive'] = false
                    })
                }

                this.$forceUpdate();
            },
            bindEvent(event){
                const that = this
                let path = event.path || (event.composedPath && event.composedPath());
                for(let i=0; i<path.length; i++){
                  if(path[i].classList && path[i].classList.length && path[i].classList.contains('dunoBtnTop')){
                    return
                  }
                }
                that.showListFlag = false
                that.$refs.selfInput.blur()
            }
        },
        created(){
        },
        beforeDestroy(){
            const that = this
            document.removeEventListener('click', that.bindEvent)
        },
        mounted(){
            const that = this
            $(this.$refs.showListRef).hide('normal')
            document.addEventListener('click', that.bindEvent)
            this.$nextTick(()=>{
              this.handleCheckAllChange(this.ischeckAll)
              this.checkAll = this.ischeckAll
            })
        }
    }
</script>

<style lang="scss">
  @media print {
    .not-print {
      opacity: 0;
    }
  }
  .dunoBtnTop{
    min-height: 38px;
    z-index: 10;
    display: flex;
    justify-content: space-between;
    padding-bottom: 13px;
    ::-webkit-input-placeholder { /* WebKit browsers */
      color: white;
    }

    ::-moz-placeholder { /* Mozilla Firefox 19+ */
      color: white;
    }

    :-ms-input-placeholder { /* Internet Explorer 10+ */
      color: white;
    }
    .icon_img{
      width: 20px;
      height: 20px;
      margin-right: 5px;
    }
    .fullScreenTop{
      color: white;
      font-size: 24px;
      cursor: pointer;
    }
    .icon-zuoyoubuju,
    .icon-buju,
    .icon-shangxiabuju{
      font-size: 16px;
      position: absolute;
      left: 10px;
      top: 8px;
    }
    .icon-xiala{
      font-size: 9px;
      position: absolute;
      /* width: 10px;
       height: 12px;*/
      right: 20px;
      top: 12px;
      &.active{
        transform: rotate(180deg);
        //  transform-origin:(50%,50%);
      }
    }
    .el-checkbox__label{
      color: white !important;
      margin-left: 5px;
      letter-spacing: 1px;
    }
    .el-checkbox__inner::after{
      border-color: #535353;
      border-width: 2px;
    }
    .el-checkbox__input.is-checked .el-checkbox__inner{
      background-color: white;
      border-color: white;
    }
    .placeHolder{}
    .btnList{
      display: flex;
      flex-direction: column;
      position: absolute;
      top: 17px;
      z-index: 1;
      width: 200px;
      background: linear-gradient(210deg, rgba(48,107,135,0.9), rgba(28,50,64,0.7) 60%);
      .title{
        cursor: pointer;
        padding: 0 !important;
        color: white;
        font-size: 16px;
        background: #1a2f42;
        position: relative;
        .selfInput{
          cursor: pointer;
          background: transparent;
          border: none;
          color: white;
          width: 100%;
          padding: 8px 11px;
        }
        .output{
          .selfInput{
            padding-left: 47px;
            background-image: url(../../../assets/images/btn/moreBtn.png);
            background-size: 100% 100%;
          }
          &:before{
            content: "\e666";
            display: block;
            position: absolute;
            font-size: 20px;
            z-index: 99;
            font-family: "iconfont";
            left: 20px;
            top: 5px;
          }
        }
        .iconLayout{
          padding-left: 30px;
        }
      }
      .btn_main{
        max-height: 216px;
        position: relative;
        z-index: 8;
        margin-top: 7px;
        padding: 5px 20px;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        .btnItem{
          margin: 12px 0;
          img{
            vertical-align: top
          }
          .btnNr{
            cursor: pointer;
            line-height: 37px;
            padding: 0 20px;
            font-size: 14px;
            &:hover{
              background: #1a2f42
            }
          }
        }
      }
    }
    .middleBtn{
      position: relative;
      left: -1.4%;
      width: 486px;
      justify-content: space-between;
      display: flex;
      color: #949594;
      &.bigLeft{
        left: 27% !important;
        @media screen and (min-width: 3500px) {
          left: 15% !important;
        }
      }
      .btn{
        cursor: pointer;
        display: flex;
        justify-content: baseline;
        &.active{
          color: #00f3f6;
        }
        .iconfont{
          font-size: 22px;
          position: relative;
          top: -4px;
          margin-right: 5px;
        }
      }
    }
    .rightBtnHandle{
      display: flex;
      align-items: center;
      .zoomMain{
        margin-right: 19px;
        color: white;
        align-items: center;
        justify-content: center;
        .zoom{
          cursor: pointer;
        }
        .iconfont{
          font-size: 19px;
        }
        .nr{
          margin: 0 10px;
          position: relative;
          top: -1px;
        }
      }
      .controlBall{
        width: 122px;
        margin-right: 19px;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        img{
          width: 30px;
          height: 30px;
        }
        span{
          font-size: 14px;
        }
      }
    }
    .switch{
      color: #EEEEEF;
      display: flex;
      justify-content: center;
      .title{
        margin-right: 10px;
      }
    }
  }
</style>
