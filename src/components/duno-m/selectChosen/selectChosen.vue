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
                    <div v-for="(item, index) in selectList" :key="index" class="mainCon">
                        <label class="contain-item" v-if="item['type']">{{ item['type'] }}</label>
                        <component :label="index" @click.native.stop="chosenItem(index)" class="contain-item" v-else :key="index" v-model="item['active']" :title="item['label']" :is="comName">{{ item['label'] }}</component>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getAxiosData} from "../../../api/axiosType";

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
              // { type: '预置位1' },
              // { label: '4号主变1000Kv侧套管A相接线柱'},
              // { label: '4号主变1000Kv侧套管AA相接线柱'},
              // { label: '4号主变1000Kv侧套管AAA相接线柱'},
              // { type: '预置位2' },
              // { label: '4号主变1000Kv侧套管B相接线柱'},
              // { label: '4号主变1000Kv侧套管BB相接线柱'},
              // { label: '4号主变1000Kv侧套管BBB相接线柱'},
              // { label: '4号主变1000Kv侧套管BBBB相接线柱'},
              // { label: '4号主变1000Kv侧套管BBBBB相接线柱'},
              // { label: '4号主变1000Kv侧套管BBBBBB相接线柱'},
              // { label: '4号主变1000Kv侧套管BBBBBBB相接线柱'},
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
                 this.activeTitle = '选择ROI'
                 break;
               case 'Single':
                 this.comName = 'el-radio'
                 this.activeTitle = '选择预置位'
                 break;
             }
           }
         },
         deep: true,
         immediate: true
       }
    },
    props: {
        monitorInfo: {
          type: Object,
          default: ()=>{
            return {}
          }
        },
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
        monitorDeviceId(){
          return this.monitorInfo.monitorDeviceId?this.monitorInfo.monitorDeviceId:''
        },
        activeList(){
          return this.selectList.filter(item => {
            return item['active']
          })
        }
    },
    methods:{
      initSelectList(){
        getAxiosData('/lenovo-plan/api/plan/preset/select', {'monitorDeviceId': this.monitorDeviceId}).then(res=>{
            let data = res.data
            /*let data = [
              {
                "label": "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
                "value": "2313",
                "group": null,
                "selected": "123123"
              },
              {
                "label": "测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试",
                "value": "onAF2Nrrjw",
                "group": null,
                "selected": "123123"
              },
              {
                "label": "label12",
                "value": "onAF2Nrrjw",
                "group": null,
                "selected": "123123"
              },
              {
                "label": "label22",
                "value": "onAF2Nrrjw",
                "group": null,
                "selected": "SOMVcnGcVo"
              }
            ]*/
            if(!data.length){
              this.$emit('on-active', [])
            }
            let handleData = this.handleData(data)
            this.selectList = handleData
            this.bindEvent()
            this.resetList()
            this.setInitActive()
        })
      },
      handleData(data){
        let arr = {}
        let outData = []
        let type = data[0]["group"]
        this.isSelected = []
        data.forEach(item => {
            if(!arr[item['group']]){
              arr[item['group']] = []
            }
            arr[item['group']].push(item)
        })
        for(let key in arr){
            if(type){
              outData.push({ type: key })
            }
            arr[key].forEach(item=>{
              if(item['selected'] == 1 && item['selected'] == true){
                this.isSelected.push(item)
              }
              outData.push(item)
            })
        }
        return outData
      },
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
          if(this.isSelected.length){
            this.isSelected.forEach(item=>{
              let findIndex = this.findItem(data, item)
              if(findIndex != -1){
                data[findIndex]['active'] = true
              }
            })
          }else{
            data[activeIndex]['active'] = true
          }
          this.$emit('on-active', this.findActive(data, true))
          console.log(this.findActive(data, true))
        }else{
          if(this.isSelected.length){
            let arr = this.isSelected.slice(0, 1)
            let findIndex = this.findItem(data, arr[0])
            if(findIndex != -1){
              data[findIndex]['active'] = findIndex
              this.$emit('on-active', this.findActive(data, findIndex))
              console.log(this.findActive(data, findIndex))
            }
          }else{
            data[activeIndex]['active'] = activeIndex
            this.$emit('on-active', this.findActive(data, activeIndex))
            console.log(this.findActive(data, activeIndex))
          }
        }
      },
      findActive(arr, symbol){
        let arrB = []
        arr.forEach(item=>{
          if(item['active'] == symbol){
            arrB.push(item)
          }
        })
        return arrB
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
      findItem(arr, item , fn){
        let findIndex = -1
        for(let i=0; i<arr.length; i++){
          let before = JSON.parse(JSON.stringify(arr[i]))
          let after = JSON.parse(JSON.stringify(item))
          delete before.active
          delete after.active
          if(JSON.stringify(before) == JSON.stringify(after)){
            if(fn)
                fn(i)
            findIndex = i
            break
          }
        }
        return findIndex
      },
      removeItem(removeItem, flag){
        let data = this.activeList
        let findIndex = -1
        this.findItem(data, removeItem, function (index) {
          if(!flag)
            data[index]['active'] = false
          findIndex = index
        })
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
    created(){
       this.initSelectList()
    },
    mounted(){
       this.dom = this.$refs.mainContain
    }
}
</script>
<style lang="scss">
    .selectChosen{
        .el-checkbox__input.is-checked + .el-checkbox__label, .el-checkbox__label{
            color: white !important;
            margin-left: 5px;
            letter-spacing: 1px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            top: 5px;
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
                width: 288px;
                background: rgb(55, 66, 74);
                padding: 13px 0;
                .container{
                    display: flex;
                    flex-direction: column;
                    background: #37424a;
                    color: white;
                    max-width: 280px;
                    max-height: 300px;
                    overflow-y: auto;
                    overflow-x: hidden;
                    padding: 0 16px;
                    & .mainCon{
                        position: relative;
                    }
                    &::-webkit-scrollbar {/*滚动条整体样式*/
                        width: 7px;     /*高宽分别对应横竖滚动条的尺寸*/
                        height: 1px;
                        padding-right: 20px;
                    }
                    &::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
                        border-radius: 10px;
                        -webkit-box-shadow: inset 0 0 5px #9ba1a5;
                        background: #9ba1a5;
                    }
                    &::-webkit-scrollbar-track {/*滚动条里面轨道*/
                        -webkit-box-shadow: inset 0 0 5px transparent;
                        border-radius: 10px;
                        background: transparent;
                    }
                    .contain-item{
                        width: 100%;
                        line-height: 36px;
                        margin-right: 18px;
                    }
                }
            }
        }
    }
</style>

