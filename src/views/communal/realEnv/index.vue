<template>
  <div class="realEnv">
    <duno-btn-top @on-active="deviceShowHandle" @on-diagram="changDiagram" />
    <div class="mainList" v-if="mainlistShow">
    <duno-main  v-if="kilovoltKind == 'all'">
      <div class="main_ctx" ref="firstElE">
        <div class="toward">
          <img :src="toward"/>
        </div>
        <drappable class="drappable_assembly" width="1900px" height="675px">
          <div class="deviceList">
            <template  v-for="(item, index) in deviceList">
              <img :key="index" @click="toDevice(item,index)" v-if="item['show']" :src="item['src']"
              :style="[
              {'left': isDiagram?item['xAxisDiagram']+'px':item['xAxis']+'px'},
              {'top': isDiagram?item['yAxisDiagram']+'px':item['yAxis']+'px'}
              ]"
              />
            </template>
          </div>
          <div class="allShowPic">
            <div class="Once_primaryDiagram" v-if="isDiagram">
              <img :src="kilovolt1000" />
              <img :src="kilovolt500" />
              <img :src="kilovolt220" />
              <img :src="kilovolt110" />
              <img :src="kilovolt35" />
            </div>
            <div class="realView" v-else>
              <img :src="kv1000" />
              <img :src="kv500" />
              <img :src="kv220" />
              <img :src="kv110" />
              <img :src="kv35" />
            </div>
          </div>
        </drappable>
        <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
        <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>
      </div>
    </duno-main>
    <duno-main class="kilovolt" v-else-if="kilovoltKind == '1000'">
      <div :class="['item_ctx', {'active': isDiagram}]"  ref="firstElE"  v-if="isDiagram">
        <div class="toward">
            <img :src="toward"/>
        </div>
        <drappable class="drappable_assembly" width="1900px" height="675px">
          <div class="allShowPic">
            <div class="Once_primaryDiagram" style="position:absolute;left: -1283px;top: 20px;transform: scale(1.3)">
              <div class="deviceList">
                <template v-for="(item,index) in kilovolt1000Pic">
                  <img :key="index" @click="toDevice(item,index,$refs.firstElE,0)" v-if="item['show']" :src="item['src']"
                     :style="[
                    {'left': item['xAxisDiagram']+'px'},
                    {'top':  item['yAxisDiagram']+'px'}
                    ]"
                  />
                </template>
                
              </div>
              <img :src="kilovolt1000" />
            </div>
          </div>
        </drappable>
        <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
        <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>
      </div>
      <div :class="['item_ctx', {'active': isDiagram}]"  ref="secondElE">
        <div class="toward">
          <img :src="toward"/>
        </div>
        <drappable idName="other"   class="drappable_assembly" width="1900px" height="675px">
          <div class="allShowPic" style="position: absolute;left: -1073px; top: -80px; transform: scale(1.3);">
            <div class="realView">
              <div class="deviceList">
                <template v-for="(item,index) in kilovolt1000Pic">
                  <img :key="index" @click="toDevice(item,index,$refs.secondElE,1)" v-if="item['show']" :src="item['src']"
                     :style="[
                    {'left': item['xAxis']+'px'},
                    {'top':  item['yAxis']+'px'}
                    ]"
                  />
                </template>
              </div>
              <img :src="kv1000" />
            </div>
          </div>
        </drappable>
        <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
        <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>
      </div>
    </duno-main>
    <duno-main class="kilovolt" v-else-if="kilovoltKind == '500'">
      <div :class="['item_ctx', {'active': isDiagram}]" ref="firstElE"  v-if="isDiagram">
        <div class="toward">
          <img :src="toward"/>
        </div>
        <drappable  class="drappable_assembly" width="1900px" height="675px">
          <div class="allShowPic">
            <div class="Once_primaryDiagram" style="position:absolute;left: -485px;top: -60px;transform: scale(1.3)">
              <div class="deviceList">
                <template v-for="(item,index) in kilovolt500Pic">
                  <img :key="index" @click="toDevice(item,index,$refs.firstElE,0)" v-if="item['show']" :src="item['src']"
                     :style="[
                    {'left': item['xAxisDiagram']+'px'},
                    {'top':  item['yAxisDiagram']+'px'}
                    ]"
                  />
                </template>
              </div>
              <img :src="kilovolt500" />
            </div>
          </div>
        </drappable>
        <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
        <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>
      </div>
      <div :class="['item_ctx', {'active': isDiagram}]" ref="secondElE">
        <div class="toward">
          <img :src="toward"/>
        </div>
        <drappable  idName="other"  class="drappable_assembly" width="1900px" height="675px">
          <div class="allShowPic" style="position: absolute;left: -300px; top: -158px;transform: scale(1.3)">
            <div class="realView">
              <div class="deviceList">
                <template v-for="(item,index) in kilovolt500Pic">
                  <img :key="index" @click="toDevice(item,index,$refs.secondElE,1)" v-if="item['show']" :src="item['src']"
                     :style="[
                    {'left': item['xAxis']+'px'},
                    {'top':  item['yAxis']+'px'}
                    ]"
                  />
                </template>
              </div>
              <img :src="kv500" />
            </div>
          </div>
        </drappable>
        <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
        <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>
      </div>
    </duno-main>
    <duno-main class="kilovolt" v-else-if="kilovoltKind == '220'">
      <div :class="['item_ctx', {'active': isDiagram}]"  ref="firstElE"  v-if="isDiagram">
        <div class="toward">
          <img :src="toward"/>
        </div>
        <drappable class="drappable_assembly" width="1900px" height="675px">
          <div class="allShowPic">
            <div class="Once_primaryDiagram" style="position:absolute;left: 400px;top: -80px;transform: scale(1.3)">
              <div class="deviceList">
                <template v-for="(item,index) in kilovolt220Pic">
                  <img :key="index" @click="toDevice(item,index,$refs.firstElE,0)" v-if="item['show']" :src="item['src']"
                     :style="[
                      {'left': item['xAxisDiagram']+'px'},
                      {'top':  item['yAxisDiagram']+'px'}
                    ]"
                  />
                </template>
              </div>
              <img :src="kilovolt220" />
            </div>
          </div>
        </drappable>
        <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
        <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>
      </div>
      <div :class="['item_ctx', {'active': isDiagram}]" ref="secondElE">
        <div class="toward">
          <img :src="toward"/>
        </div>
        <drappable  idName="other" class="drappable_assembly" width="1900px" height="675px">
          <div class="allShowPic" style="position: absolute;left: 480px; top: -180px;transform: scale(1.3)">
            <div class="realView">
              <div class="deviceList">
                <template v-for="(item,index) in kilovolt220Pic">
                  <img :key="index" @click="toDevice(item,index,$refs.secondElE,1)" v-if="item['show']" :src="item['src']"
                     :style="[
                      {'left': item['xAxis']+'px'},
                      {'top':  item['yAxis']+'px'}
                    ]"
                  />
                </template>
              </div>
              <img :src="kv220" />
            </div>
          </div>
        </drappable>
        <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
        <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>
      </div>
    </duno-main>
    <duno-main class="kilovolt" v-else-if="kilovoltKind == '110'">
      <div :class="['item_ctx', {'active': isDiagram}]" ref="firstElE"  v-if="isDiagram">
        <div class="toward">
          <img :src="toward"/>
        </div>
        <drappable class="drappable_assembly" width="1900px" height="675px">
          <div class="allShowPic">
            <div class="Once_primaryDiagram" style="position:absolute;left: -890px;top: -50px;transform: scale(1.3)">
              <div class="deviceList">
                <template v-for="(item,index) in kilovolt110Pic">
                  <img :key="index" @click="toDevice(item,index,$refs.firstElE,0)" v-if="item['show']" :src="item['src']"
                     :style="[
                      {'left': item['xAxisDiagram']+'px'},
                      {'top':  item['yAxisDiagram']+'px'}
                    ]"
                  />
                </template>
              </div>
              <img :src="kilovolt110" />
            </div>
          </div>
        </drappable>
        <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
        <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>
      </div>
      <div :class="['item_ctx', {'active': isDiagram}]" ref="secondElE">
        <div class="toward">
          <img :src="toward"/>
        </div>
        <drappable  idName="other" class="drappable_assembly" width="1900px" height="675px">
          <div class="allShowPic" style="position: absolute;left: -710px; top: -50px;transform: scale(1.3)">
            <div class="realView">
              <div class="deviceList">
                <template v-for="(item,index) in kilovolt110Pic">
                  <img :key="index" @click="toDevice(item,index,$refs.secondElE,1)" v-if="item['show']" :src="item['src']"
                     :style="[
                      {'left': item['xAxis']+'px'},
                      {'top':  item['yAxis']+'px'}
                    ]"
                  />
                </template>
              </div>
              <img :src="kv110" />
            </div>
          </div>
        </drappable>
        <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
        <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>
      </div>
    </duno-main>
    <duno-main class="kilovolt" v-else-if="kilovoltKind == '35'">
        <div :class="['item_ctx', {'active': isDiagram}]" ref="firstElE"  v-if="isDiagram">
          <div class="toward">
            <img :src="toward"/>
          </div>
          <drappable class="drappable_assembly" width="1900px" height="675px">
            <div class="allShowPic">
              <div class="Once_primaryDiagram" style="position:absolute;left: -130px;top: -85px;transform: scale(1.3)">
                <div class="deviceList">
                  <template v-for="(item,index) in kilovolt35Pic">
                    <img :key="index" @click="toDevice(item,index,$refs.firstElE,0)" v-if="item['show']" :src="item['src']"
                      :style="[
                        {'left': item['xAxisDiagram']+'px'},
                        {'top': item['yAxisDiagram']+'px'}
                      ]"
                    />
                  </template>
                </div>
                <img :src="kilovolt35" />
              </div>
            </div>
          </drappable>
          <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
          <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>
        </div>
        <div :class="['item_ctx', {'active': isDiagram}]" ref="secondElE">
          <div class="toward">
            <img :src="toward"/>
          </div>
          <drappable  idName="other" class="drappable_assembly" width="1900px" height="675px">
            <div class="allShowPic" style="position: absolute;left: -40px; top: -160px;transform: scale(1.3)">
              <div class="realView">
                <div class="deviceList">
                  <template v-for="(item,index) in kilovolt35Pic">
                    <img :key="index" @click="toDevice(item,index,$refs.secondElE,1)" v-if="item['show']" :src="item['src']"
                      :style="[
                        {'left': item['xAxis']+'px'},
                        {'top': item['yAxis']+'px'}
                      ]"
                    />
                  </template>
                </div>
                <img :src="kv35" />
              </div>
            </div>
          </drappable>
          <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
          <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>
        </div>
      </duno-main>
    <div v-for="(item,index) of modeList" :key="index" class="model" :id="item['id']" ref="modelRef">
      <!--弹窗必须传index  -->
      <popupinfo @onClose="onClose" :index="index" :monitorDeviceType="item['monitorDeviceType']" :deviceId="item['deviceId']" v-if="item['popupinfoVisable']" :visible="item['popupinfoVisable']"></popupinfo>
      <hotcamera-pop @onClose="onClose" :index="index" v-if="item['hotcameraFlagVisible']" :visible="item['hotcameraFlagVisible']"/>
      <camera-pop @onClose="onClose" :index="index" v-if="item['cameraFlagVisible']" :itemData="item['itemData']" :visible="item['cameraFlagVisible']"/>
    </div>
    </div>
  </div>
</template>

<script>
import DunoHeadSearch from '_c/duno-head-search'
import screenfull from 'screenfull'
import mixinViewModule from '@/mixins/view-module'
import { DunoTablesTep } from '_c/duno-tables-tep'
import { postAxiosData } from '@/api/axiosType'
import dunoBtnTop  from '_c/duno-m/duno-btn-top'
import dunoMain  from '_c/duno-m/duno-main'
import drappable  from '_c/duno-m/drappable'
import Polygonal from '_c/duno-c/Polygonal'
import cameraPanel from '_c/duno-m/cameraPanel'
import cameraPop from '_c/duno-m/cameraPop'
import hotcameraPop from '_c/duno-m/hotcameraPop'                 // 可见光
import hotCamera from '_c/duno-m/hotCamera'                       // 红外
import { popupinfo, popupOneInfo } from '_c/popupinfo'
import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
import { deviceLocation } from '@/api/currency/currency.js'
import { mapState } from 'vuex'
export default {
  mixins: [mixinViewModule],
  name: 'RoleIndex',
  components: {
      hotCamera,
      dunoBtnTop,
      dunoMain,
      drappable,
      cameraPanel,
      HistoricalDocuments,
      Polygonal,
      popupinfo,
      popupOneInfo,
      cameraPop,
      hotcameraPop
  },
  computed:{
    ...mapState([
        'user'
    ]),
    kilovoltKind(){
      return this.$store.state.app.kilovolt
    },
    kilovolt1000Pic(){
        return this.deviceList.filter((item)=>{
            return item['areaId'] == '6'
        })
    },
    kilovolt500Pic(){
        return this.deviceList.filter((item)=>{
            return item['areaId'] == '5'
        })
    },
    kilovolt220Pic(){
        return this.deviceList.filter((item)=>{
            return item['areaId'] == '4'
        })
    },
    kilovolt110Pic(){
        return this.deviceList.filter((item)=>{
            return item['areaId'] == '3'
        })
    },
    kilovolt35Pic(){
        return this.deviceList.filter((item)=>{
            return item['areaId'] == '2'
        })
    }
  },
  data () {
    const that = this
    return {
      isDiagram: false,
      mainlistShow: true,
      isFullscreen: false,
      visibleCamera: false,
      visibleHotCamera: false,
      kilovoltList: [],
      deviceList:[],
      modeList:[
        {
            id: 'modelLeft',
            monitorDeviceType: '',
            deviceId: '',
            popupinfoVisable: false,       //控制显示
            cameraFlagVisible: false,
            hotcameraFlagVisible: false,
            itemData: {}
        },
        {
            id: 'modelRight',
            monitorDeviceType: '',
            deviceId: '',
            popupinfoVisable: false,      ////控制显示
            cameraFlagVisible: false,
            hotcameraFlagVisible: false,
            itemData: {}
        }
      ],
      deviceId: '',
      monitorDeviceType: '',
      cameraFlag: 'first',
      domTarget: null
    }
  },
  watch: {
      kilovoltKind(now){
        this.mainlistShow = false
        this.$nextTick(()=>{
            this.mainlistShow = true
        })
        this.onClose(false ,'all')
        console.log(now)
      }
  },
  methods: {
    // 使用接口地址：     /lenovo-device/api/device/location
      onClose(now, index = 0){
          if(index == 'all'){
              this.modeList.map(item=>{
                  item['popupinfoVisable'] = false
              })
              this.$forceUpdate()
              return
          }
          this.modeList[index]['popupinfoVisable'] = now
          this.$forceUpdate()
      },
      changeCameraShow(now){
          this.cameraFlag = now
      },
      changeFullScreen(target){
          screenfull.toggle(target)
          this.domTarget = target
          this.appendModel(target)
      },
      appendModel(target, index=0){
          target.appendChild(this.$refs.modelRef[index])
      },
      changDiagram(now){
          this.isDiagram = now
      },
      getDeviceList(){
        const that = this
        deviceLocation().then(res=>{
            let data = res.data
            data.map(item=>{
                    if(item['monitorDeviceType'] == 1)
                        item['src'] = that.light
                    else if(item['monitorDeviceType'] == 2){
                        item['src'] = that.redLight
                    }
                    item['show'] = true
                })
            that.deviceList = data
        })
      },
      deviceShowHandle(arr){
        const that = this
        let target = arr.filter(item=>{
            return item['isActive'] == true
        })
        let data = that.deviceList
        let j = 0
        for(let i=0; i<data.length; i++){
            for(j=0; j<target.length; j++){
                if(data[i]['monitorDeviceType'] == target[j]['monitorDeviceType']){
                    data[i]['show'] = true
                    break
                }
            }
            if(j == target.length){
                data[i]['show'] = false
            }
        }
        that.deviceList = data
        that.$forceUpdate()
      },
      toDevice(item, index, target, modelIndex = 0){
        debugger
        if(target){
          this.appendModel(target, modelIndex)
        }
        console.log(item)
        if (item.deviceMessage.supportPreset) {
          this.modeList[modelIndex].cameraFlagVisible = false
        } else {
          this.modeList[modelIndex].popupinfoVisable = false
        }
        // 赋值----
        this.modeList[modelIndex].deviceId = item['monitorDeviceId']
        this.modeList[modelIndex].monitorDeviceType = item['monitorDeviceType']
        this.modeList[modelIndex].itemData = item
        //-----
        this.$nextTick(()=>{
          if (item.deviceMessage.supportPreset) {

            this.modeList[modelIndex].cameraFlagVisible = true
          } else {
            this.modeList[modelIndex].popupinfoVisable = true
          }
        })
      }
  },
  created(){
      this.getDeviceList()
      this.$store.state.app.kilovolt = this.$route.meta.kind
  },
  mounted () {
    const that = this
    document.addEventListener('fullscreenchange', function(event){
        that.isFullscreen = !that.isFullscreen
    })
  }
}
</script>
<style lang="scss">
.realEnv{
    .fullScreen{
      color: white;
      position: absolute;
      font-size: 24px;
      cursor: pointer;
      right: 25px;
      bottom: 20px;
    }
    .main_ctx{

    }
    .toward{
      position: absolute;
      left: 15px;
      top: 10px;
    }
    .deviceList{
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      img{
        cursor: pointer;
        position: absolute;
        width: 36px !important;
        height: 36px !important;
      }
    }
    .drappable_assembly{
      transform:translate(-50%,-50%);
      position: absolute;
      left:46%;
      top:53%;
      width: 1900px;
      height: 675px;
      .historical{
        position: absolute;
        top: 0;
          .el-dialog{
                position: absolute;
                top: 0;
          }
      }
        #dragAble{
          width: 1900px;
          height: 675px;
          transform: scale(0.9);
          position: relative;
        }
        img{
           width: 1900px;
           height: 675px;
           position: absolute;
        }
    }
    .kilovolt .dunoMain_nr{
      display: flex;
      flex-direction: row-reverse;
      .item_ctx{
        flex: 1;
        height: 100%;
        position: relative;
        overflow: hidden;
      }
      .item_ctx.active:first-child{
        border-left: 6px solid #18191D;
      }
      .item_ctx.active:last-child{
        border-right: 6px solid #18191D;
      }
    }
    .Once_primaryDiagram{

    }
    .model{
      width: 100%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
    }
}
</style>
