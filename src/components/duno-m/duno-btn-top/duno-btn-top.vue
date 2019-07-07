<template>
  <div class="dunoBtnTop">
    <div class="placeHolder" v-if="showBtnList">
    </div>
    <div class="btnList" v-if="showBtnList">
      <div class="title" @click="showListFlag = !showListFlag">
          全部固定监控设备
          <div class="iconfont icon-xiala" :class="{'active':showListFlag}"></div>
      </div>
        <div class="btn_main" ref="showListRef" style="display: none">
          <div>
            <el-checkbox :indeterminate="isIndeterminate"  v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          </div>
          <el-checkbox-group v-model="checkedCities"  @change="handleCheckedCitiesChange">
            <!--<duno-btn-top-item v-for="(item, index) in dataList" :key="index" @click.native="handleActive(index)" class="btnItem" :isActive="item['isActive']" :circleColor="item['circleColor']"  :describeName="item['describeName']"/>-->
            <div class="btnItem" v-for="(item,index) in dataList" >
              <el-checkbox :label="item['describeName']" :key="item['describeName']" @click.native="handleActive(index)">{{item['describeName']}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
    </div>
    <div class="middleBtn"  v-if="showBtnList">
      <div v-for="(item, index) in topBtnList" :key="index" class="btn" @click="topBtnHandle(index, item)" :class="{'active': item['active']}">
        <i v-if="!item['active']" class="iconfont icon-yincangmima"></i>
        <i v-else class="iconfont icon-xianshi"></i>
        {{ item['name'] }}
      </div>
    </div>
    <div class="rightBtnHandle" v-if="showBtnList">
      <div class="zoomMain">
        <span class="zoom">
          <i class="iconfont icon-jianhao"></i>
        </span>
        <span class="nr">缩放图片</span>
        <span class="zoom">
          <i class="iconfont icon-jiahao"></i>
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
import dunoBtnTopItem  from '../duno-btn-topItem'
export default {
  name: 'dunoBtnTop',
  data (){
    return {
        isFullscreen: false,
        showListFlag: false,
        checkAll: false,
        checkedCities: [],
        isIndeterminate: false,
        topBtnList:[
            {active: false, name:'实景航拍图'},
            {active: false, name:'设备布置图'},
            {active: false, name:'一次接线图'}
        ],
        dataList:[
          {
            circleColor:'#00B4FF',
            describeName: '可见光',
            monitorDeviceType: 1,
            isActive: true
          },
          {
            circleColor:'#FF5EB9',
            describeName: '可见光（云台）',
            monitorDeviceType: 3,
            isActive: true
          },
          {
            circleColor:'#4FF2B7',
            describeName: '红外测光',
            monitorDeviceType: 2,
            isActive: true
          },
          {
            circleColor:'#FF9000',
            describeName: '红外测光（云台）',
            monitorDeviceType: 4,
            isActive: true
          },
          {
            circleColor:'#597AFF',
            describeName: '智能锁具',
            monitorDeviceType: 5,
            isActive: true
          },
          {
            circleColor:'#C06EFF',
            describeName: '微型气象站',
            monitorDeviceType: 6,
            isActive: true
          }
        ],
        isDiagram: false,
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
  components: {
    Icons,
    dunoBtnTopItem
  },
  props: {
    showBtnList: {
        type: Boolean,
        default: true
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
      changeFullScreen(){
          this.$emit('change-screen')
      },
      topBtnHandle(index ,item){
        if(item['name'].indexOf('一次接线图')>-1){
            this.isDiagram = !this.isDiagram
        }
        let data = JSON.parse(JSON.stringify(this.topBtnList))
        if(!this.topBtnList[index]['active']){
          data.map(item=>{
              item['active'] = false
          })
        }
        this.topBtnList = data
        this.topBtnList[index]['active'] = !this.topBtnList[index]['active']
        this.$forceUpdate()
      },
      handleCheckedCitiesChange(value) {
          let checkedCount = value.length;
          this.checkAll = checkedCount === this.dataListName.length;
          this.isIndeterminate = checkedCount > 0 && checkedCount < this.dataListName.length;
      },
      handleCheckAllChange(val) {
          if(!val){
              this.resetActive()
          }else{
              this.chosenActive()
          }
          this.checkedCities = val ? this.dataListName : [];
          this.isIndeterminate = false;
          this.$emit('on-active',this.dataList)
      },
      handleActive(index,event){
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
  display: flex;
  justify-content: space-between;
  padding-bottom: 13px;
  .fullScreenTop{
    color: white;
    font-size: 24px;
    cursor: pointer;
  }
  .icon-xiala{
    font-size: 9px;
    position: absolute;
    width: 10px;
    height: 12px;
    right: 23px;
    top: 11px;
    &.active{
      transform: rotate(180deg);
    }
  }
  // border-bottom: 1px solid #2E3136;
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
    background: linear-gradient(top right  ,rgba(48,107,135,0.9), rgba(28,50,64,0.7) 60%);
    .title{
      cursor: pointer;
      padding: 5px 20px;
      color: white;
      font-size: 17px;
      background: #1a2f42;
    }
    .btn_main{
      margin-top: 7px;
      padding: 5px 20px;
      display: flex;
      flex-direction: column;
      .btnItem{
        margin: 12px 0;
      }
    }
  }
  .middleBtn{
    position: relative;
    left: -55px;
    width: 486px;
    justify-content: space-between;
    display: flex;
    color: #949594;
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
