<template>
  <div class="dunoBtnTop not-print" :style="'z-index:' + zIndex">
    <div class="placeHolder" v-if="showBtnList">
    </div>
    <div class="btnList dropSelf" v-if="showBtnList?true:isSingleDrop" :style="'position: absolute; z-index:' + zIndex">
      <div class="title dropSelf"  @click="showListFlag = !showListFlag">
          <!-- 全部固定监控设备 -->
          <input class="selfInput" @blur="hiddenDrapdown()" readonly :value="title" />
          <div class="iconfont icon-xiala dropSelf" :class="{'active':showListFlag}"></div>
      </div>
      <div v-if="isCheck" class="btn_main dropSelf isCheck" ref="showListRef" style="display: none">
          <div v-if="showAll">
            <el-checkbox :indeterminate="isIndeterminate"  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </div>
          <el-checkbox-group  v-model="checkedCities"  @change="handleCheckedCitiesChange">
            <!-- <duno-btn-top-item v-for="(item, index) in dataList" :key="index" @click.native="handleActive(index)" class="btnItem" :isActive="item['isActive']"  :circleColor="item['circleColor']"  :describeName="item['describeName']"/> -->
            <div class="btnItem" v-for="(item,index) in dataList" :key="index">
              <el-checkbox v-if="keyChange" :disabled="(disabled && !item['isActive'])"  :label="item['monitorDeviceId']" :key="item['monitorDeviceId']" @click.native="handleActive(index,(disabled && !item['isActive']))">
                <!-- <i class="item.icon"></i> -->
                <img  :src="item.img">
                {{item['describeName']}}</el-checkbox>
              <el-checkbox v-else :disabled="(disabled && !item['isActive'])"  :label="item['describeName']" :key="item['describeName']" @click.native="handleActive(index,(disabled && !item['isActive']))">
                <!-- <i class="item.icon"></i> -->
                <img v-if="item.img" class="icon_img" :src="item.img">
                {{item['describeName']}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
      <div v-else class="btn_main dropSelf" ref="showListRef" style="display: none; margin-top: 0; padding: 5px 0">
          <div class="btnItem" v-for="(item,index) in dataList" :key="index" style="margin:inherit">
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
      <div class="zoomMain" style="visibility: hidden">
        <span class="zoom">
          <i class="iconfont icon-jianshao"></i>
        </span>
        <span class="nr">缩放图片</span>
        <span class="zoom">
          <i class="iconfont icon-zengjia"></i>
        </span>
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
import mixinViewModule from '@/mixins/view-module'
import dunoBtnTopItem  from '../duno-btn-topItem'
export default {
  mixins: [mixinViewModule],
  name: 'dunoBtnTop',
  data (){
    return {
        disabled: false,
        isFullscreen: false,
        showListFlag: false,
        checkAll: false,
        checkedCities: [],
        isIndeterminate: false,
        topBtnList:[
            {active: false, name:'实景航拍图'},
            {active: true, name:'设备布置图'},
            {active: false, name:'一次接线图'}
        ],
        isDiagram: 2,
        isClick: false,
    }
  },
  watch: {
      isDiagram(now){
          this.$emit('on-diagram', now)
      },
      showListFlag(now){
          if(now){
              $(this.$refs.showListRef).slideDown('normal')
          }else{
              $(this.$refs.showListRef).slideUp('normal')
          }
      }
  },
  components: {
    Icons,
    dunoBtnTopItem
  },
  props: {
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
    title:{
      type:String,
      default:()=>{
        return "全部固定监控设备"
      }
    },
    isSingleDrop:{
      type:Boolean,
      default:()=>{
        return true
      }
    },
    dataList:{
      type:Array,
      default:()=>{
        return [
          {
            img:require('@/assets/buttonPng/light.svg'),
            circleColor:'#00b4ff',
            describeName: '可见光',
            monitorDeviceType: 1,
            isActive: true
          },
          {
            img:require('@/assets/buttonPng/redLight.png'),
            circleColor:'#e654a6',
            describeName: '红外测温',
            monitorDeviceType: 2,
            isActive: true
          },
          {
            img:require('@/assets/buttonPng/intelLock.png'),
            circleColor:'#ffca28',
            describeName: '智能锁具',
            monitorDeviceType: 5,
            isActive: true
          },
          {
            img:require('@/assets/SVG/weatherCheck.svg'),
            circleColor:'#C06EFF',
            describeName: '微型气象站',
            monitorDeviceType: 6,
            isActive: true
          }
        ]
    },
    isDiagram: 2,
    isClick: false
    }
  },
  watch: {
      isDiagram(now){
          this.$emit('on-diagram', now)
      },
      showListFlag(now){
          $(this.$refs.showListRef).stop()
          if(now){
              $(this.$refs.showListRef).slideDown('normal')
          }else{
              $(this.$refs.showListRef).slideUp('normal')
          }
      }
  },
  computed: {
      dataListName(){
          let data = []
          this.dataList.forEach(item=>{
              data.push(item['describeName'])
          })
          return data
      }
  },
  methods:{
      hiddenDrapdown(){
          const that = this
          if(that.isCheck){
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
          this.$emit('on-active',this.dataList)
      },
      handleActive(index,flag){
        if(flag){
            return
        }
        if(!this.isClick){
            this.dataList[index]['isActive'] = !this.dataList[index]['isActive']
            this.$forceUpdate();
            this.$emit('on-active',this.dataList)
            this.isClick = true
            setTimeout(()=>{
                this.isClick = false
            },50)
        }
      },
      chosenActive(){
          this.dataList.map((item)=>{
              item['isActive'] = true
          })
          this.$forceUpdate();
      },
      resetActive(){
        this.dataList.map((item)=>{
            item['isActive'] = false
        })
        this.$forceUpdate();
      }
  },
  created(){

  },
  mounted(){
      $(this.$refs.showListRef).hide('normal')
      this.handleCheckAllChange(true)
      this.checkAll = true
  }
}
</script>

<style lang="scss">
.dunoBtnTop{
  min-height: 38px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  padding-bottom: 13px;
  .icon_img{
    width: 20px;
    height: 20px;
  }
  .fullScreenTop{
    color: white;
    font-size: 24px;
    cursor: pointer;
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
      left: 15% !important;
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
