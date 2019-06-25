<template>
  <div class="dunoBtnTop">
    <div class="btnList" v-if="showBtnList">
      <duno-btn-top-item v-for="(item, index) in dataList" :key="index" @click.native="handleActive(index)" class="btnItem" :isActive="item['isActive']" :circleColor="item['circleColor']"  :describeName="item['describeName']"/>
    </div>
    <div class="switch"  v-if="showBtnList">
      <span class="title">一次接线图</span>
      <el-switch
              v-model="isDiagram"
              active-color="#26FFB1"
              inactive-color="#ff4949">
      </el-switch>
    </div>
  </div>
</template>

<script>
import Icons from '_c/icons'
import dunoBtnTopItem  from '../duno-btn-topItem'
export default {
  name: 'dunoBtnTop',
  data (){
    return {
        dataList:[
          {
            circleColor:'#00B4FF',
            describeName: '可见光',
            isActive: true
          },
          {
            circleColor:'#FF5EB9',
            describeName: '红外测光',
            isActive: true
          },
          {
            circleColor:'#4FF2B7',
            describeName: 'AR眼镜',
            isActive: true
          },
          {
            circleColor:'#FF9000',
            describeName: '机器人',
            isActive: true
          },
          {
            circleColor:'#597AFF',
            describeName: '布控球',
            isActive: true
          },
          {
            circleColor:'#C06EFF',
            describeName: '手持红外',
            isActive: true
          },
          {
            circleColor:'#FFCA28',
            describeName: '智能锁具',
            isActive: true
          }
        ],
        isDiagram: false
    }
  },
  watch: {
      isDiagram(now){
          this.$emit('on-diagram', now)
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

  },
  methods:{
      handleActive(index){
        this.dataList[index]['isActive'] = !this.dataList[index]['isActive']
        this.$forceUpdate();
      },
      resetActive(){
        this.dataList.map((item)=>{
            item['isActive'] = false
        })
        this.$forceUpdate();
      }
  }
}
</script>

<style lang="scss">
.dunoBtnTop{
  min-height: 38px;
  display: flex;
  justify-content: space-between;
  padding-bottom: 13px;
  border-bottom: 1px solid #2E3136;
  .btnItem{
    margin-right: 30px;
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
