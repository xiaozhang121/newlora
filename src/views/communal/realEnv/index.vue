<template>
<!--  <historical-documents  width="40%" @on-show="changeShow" @close="onClose" :dialogTableVisible="visibleCamera" class="historical">
    <camera-panel :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></camera-panel>
  </historical-documents>
  <historical-documents  width="40%" @on-show="changeShow" @close="onClose" :dialogTableVisible="visibleHotCamera" class="historical">
    <hot-camera :panelType="cameraFlag" v-if="cameraFlag == 'first' ||  cameraFlag == 'second' ||  cameraFlag == 'third'"></hot-camera>
  </historical-documents>-->
  <div class="realEnv">
    <duno-btn-top @on-diagram="changDiagram" />
    <div class="mainList" v-if="mainlistShow">
    <div v-if="false"></div>
    <duno-main class="kilovolt" v-else-if="kilovoltKind == 'all'">
      <div class="main_ctx" ref="firstElE">
        <div class="toward">
          <img :src="toward"/>
        </div>
        <drappable class="drappable_assembly" width="1900px" height="675px">
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
              <img :src="kv35" />
            </div>
          </div>
        </drappable>
        <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
        <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>
      </div>
    </duno-main>
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
import cameraPanel from '_c/duno-m/cameraPanel'
import hotCamera from '_c/duno-m/hotCamera'
import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
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
      HistoricalDocuments
  },
  computed:{
    ...mapState([
        'user'
    ]),
    kilovoltKind(){
      return this.$store.state.app.kilovolt
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
      cameraFlag: 'first'
    }
  },
  watch: {
      kilovoltKind(now){
        this.mainlistShow = false
        this.$nextTick(()=>{
            this.mainlistShow = true
        })
        console.log(now)
      }
  },
  methods: {
      changeShow(name){
       this.cameraFlag = name
      },
      onClose(now){
          this.visibleCamera = now
      },
      changeFullScreen(target){
          debugger
          screenfull.toggle(target)
      },
      changDiagram(now){
            this.isDiagram = now
      }
  },
  created(){
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
      .item_ctx{
        flex: 1;
        height: 100%;
        position: relative;
        overflow: hidden;
      }
      .item_ctx.active:first-child{
        border-right: 6px solid #18191D;
      }
      .item_ctx.active:last-child{
        border-left: 6px solid #18191D;
      }
    }
    .Once_primaryDiagram{

    }
}
</style>
