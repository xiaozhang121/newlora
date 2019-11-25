<template>
    <div class="selectChosen">
        <div class="contain">
            <div class="mainTitle">
                <div class="activeTitle" @click="showContain">
                    <span>{{ activeTitle }}</span>
                    <i class="iconfont icon-xiala" :class="{'active': isActive}"></i>
                </div>
            </div>
            <div class="mainContain" ref="mainContain" v-show="isShow">
                <div class="container">
                    <div v-for="(item, index) in selectList" :key="index">
                        <label class="contain-item" v-if="item['type']">{{ item['type'] }}</label>
                        <component :label="index" @click.native.stop="chosenItem(index)" class="contain-item" v-else :key="index" v-model="item['active']" :title="item['name']" :is="comName">{{ item['name'] }}</component>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'selectChosen',
    components: {

    },
    data() {
        return {
            isClick: false,
            dom: null,
            nowActive: [],
            isActive: false,
            isShow: false,
            comName: 'el-checkbox',
            activeTitle: '选择ROI',
            selectList: [
              { type: '预置位1' },
              { name: '4号主变1000Kv侧套管A相接线柱'},
              { name: '4号主变1000Kv侧套管AA相接线柱'},
              { name: '4号主变1000Kv侧套管AAA相接线柱'},
              { type: '预置位2' },
              { name: '4号主变1000Kv侧套管B相接线柱'},
              { name: '4号主变1000Kv侧套管BB相接线柱'},
              { name: '4号主变1000Kv侧套管BBB相接线柱'},
            ]
        }
    },
    watch:{
       dataList:{
         handler(now){
           this.selectList = now
           this.resetList()
           this.setInitActive()
         },
         deep: true
         // immediate: true
       },
       typeChosen:{
         handler(now){
           if(now){
             switch (now){
               case 'Multiple':
                 this.comName = 'el-checkbox'
                 break;
               case 'Single':
                 this.comName = 'el-radio'
                 break;
             }
           }
         },
         deep: true,
         immediate: true
       }
    },
    props: {
        maxSelect: {
          type: [String, Number],
          default: 3
        },
        activeIndex: {
          type: [String, Number, Array],
          default: '0'
        },
        dataList:{
          type: Array,
          default: ()=>{
            return []
          }
        },
        typeChosen: {
           type: String,
           default: 'Multiple'
        }
    },
    computed: {
        activeList(){
          return this.selectList.filter(item => {
            return item['active']
          })
        }
    },
    methods:{
      setInitActive(){
        let data = this.selectList
        let count = 0
        let activeIndex = 0
        for(let i=0; i<data.length; i++){
          if('type' in data[i]){
            continue
          }
          if(count == this.activeIndex){
            activeIndex = i
            break
          }
          count++
        }
        if(this.comName == 'el-checkbox'){
          data[activeIndex]['active'] = true
        }else{
          data[activeIndex]['active'] = activeIndex
        }
      },
      resetList(){
        let data = JSON.parse(JSON.stringify(this.selectList))
        for(let i=0; i<data.length; i++){
            data[i]['active'] = false
        }
        this.selectList = data
        this.$forceUpdate()
      },
      clearOverItem(){
        let removeItem = this.nowActive[0]
        this.removeItem(removeItem)
        this.$forceUpdate()
      },
      removeItem(removeItem, flag){
        let data = this.activeList
        let findIndex = -1
        for(let i=0; i<data.length; i++){
          if(JSON.stringify(data[i]) == JSON.stringify(removeItem)){
            if(!flag)
                data[i]['active'] = false
            findIndex = i
          }
        }
        !flag?this.nowActive.splice(0, 1):this.nowActive.splice(findIndex, 1)
      },
      chosenItem(index){
        if(this.isClick){
          return
        }
        if(this.typeChosen === 'Single'){
          this.resetList()
          this.selectList[index].active = true
        }else{
          if(this.selectList[index]['active']){
            this.removeItem(this.selectList[index], true)
          }else{
            if(!this.nowActive.length){
              this.nowActive = JSON.parse(JSON.stringify(this.activeList))
            }
            if(this.activeList.length >= this.maxSelect){
              this.clearOverItem()
            }
            this.nowActive.push(this.selectList[index])
          }
        }
        this.isClick = true
        setTimeout(()=>{
          this.isClick = false
        },50)
        let emitData = null
        if(this.typeChosen === 'Single'){
          emitData = [this.selectList[index]]
        }else{
          emitData = JSON.parse(JSON.stringify(this.nowActive))
        }
        this.$emit('on-active', emitData)
        console.log(emitData)
        this.$forceUpdate()
      },
      closeEvent(event){
        let path = event.path || (event.composedPath && event.composedPath());
        for(let i=0; i<path.length; i++){
          if(path[i].classList && path[i].classList.length && path[i].classList.contains('selectChosen')){
            return
          }
        }
        this.isActive = false
        this.runAnimate()
      },
      unBindEvent(){
        const that = this
        document.removeEventListener('mousedown', that.closeEvent)
        window.removeEventListener('resize', that.domResize)
        document.removeEventListener('mousemove', that.domResize)
        document.querySelector('.gisMap').removeEventListener('click', that.closeEvent)
      },
      bindEvent(){
        const that = this
        document.addEventListener('mousedown', that.closeEvent)
        document.addEventListener('mousemove', that.domResize)
        window.addEventListener('resize', that.domResize)
        document.querySelector('.gisMap').addEventListener('click', that.closeEvent)
      },
      domResize(){
        let pos = document.querySelector('.activeTitle').getBoundingClientRect()
        let width = $('.mainContain').width() - pos.width
        this.dom.style.left = pos.left - width  + 'px'
        this.dom.style.top = Number(pos.top) + 32 + 'px'
      },
      runAnimate(){
        const that = this
        $(this.$refs.mainContain).stop()
        this.isActive ? $(this.$refs.mainContain).slideDown('normal'):$(this.$refs.mainContain).slideUp('normal', function () {
          that.dom.style.top = -9999 + 'px'
          that.isShow = false
        })
      },
      showContain(event){
        this.isShow = true
        this.isActive = !this.isActive
        this.runAnimate()
        this.domResize()
      }
    },
    beforeDestroy(){
       this.unBindEvent()
    },
    mounted(){
       this.dom = this.$refs.mainContain
       this.bindEvent()
       this.resetList()
       this.setInitActive()
    }
}
</script>
<style lang="scss">
    .selectChosen{
        .el-checkbox__input.is-checked + .el-checkbox__label, .el-checkbox__label{
            color: white !important;
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
    }
</style>
<style lang="scss" scoped>
    .selectChosen{
        position: absolute;
        .contain{
            position: relative;
            .mainTitle{
                text-align: right;
                .activeTitle{
                    background: #2e3a41;
                    border-radius: 3px;
                    width: 168px;
                    line-height: 32px;
                    display: inline-block;
                    cursor: pointer;
                    span:first-child{
                        color: white;
                        font-size: 14px;
                        float: left;
                        padding-left: 38px;
                    }
                    .iconfont{
                        font-size: 12px;
                        width: 30px;
                        float: right;
                        text-align: center;
                        &.active{
                            transform: rotate(180deg);
                        }
                    }
                    &:after{
                        content: '';
                        display: block;
                        width: 0;
                        height: 0;
                        clear: both;
                        overflow: hidden;
                    }
                }
            }
            .mainContain{
                position: fixed;
                top: 32px;
                z-index: 8;
                .container{
                    display: flex;
                    flex-direction: column;
                    background: #37424a;
                    color: white;
                    padding: 16px;
                    max-width: 280px;
                    .contain-item{
                        width: 100%;
                        line-height: 30px;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        margin-right: 18px;
                    }
                }
            }
        }
    }
</style>

