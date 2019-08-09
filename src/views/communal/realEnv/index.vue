<template>
  <div class="realEnv">
    <duno-btn-top :zIndex="100" ref="btnTopRef" @on-active="deviceShowHandle" @on-diagram="changDiagram" @change-screen="changeFullScreen($refs.firstElE)" />
    <div class="mainList" v-if="mainlistShow">
      <duno-main   v-if="kilovoltKind == 'all'" :class="{'dunoMainContain': isDiagram==1}">
        <div class="main_ctx" ref="firstElE">
          <div :class="['toward']">
            <img style="position: relative; left: 40px" @click="alarmSet" :src="towardAround" v-if="isDiagram == 2 || isDiagram == 3"/>
            <img style="position: relative; left: 40px" @click="alarmSet" :src="towardAround" v-else-if="isDiagram == 1"/>
          </div>
          <img id="weatherCheck" class="weatherCheck" draggable="true" @dragstart="drag($event, {'src':weatherCheck,'name':'weatherCheck'})"  :src="weatherCheck" style="width: 40px; height: 40px;"/>
          <!--<div style="width: 1900px; height: 675px; background: pink; position: fixed"></div>-->
          <!-- <div v-for="(item, index) in deviceList" class="anchorPoint" :id="'anchor'+index" :key="index" >
               <img draggable="true" @dragstart="drag($event, item)" @click="toDevice(item,index)" v-if="item['show']" :src="item['src']"/>
           </div>-->
          <!--<gis-map :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>-->
          <div v-if="isDiagram == 2">
            <gis-map @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="powerPointList" @toDetail="toDevice"  :isDiagram="isDiagram" :deviceList="deviceList"  ></gis-map>
          </div>
          <div :class="['allShowPic']" v-else-if="isDiagram == 1">
            <!--<drappable class="drappable_assembly" width="1900px" height="675px" >
                <div class="realView">
                  <img :src="kilovoltAllAround" />
                </div>
            </drappable>-->
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8203" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <gis-map @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="powerPointList" @toDetail="toDevice" mapUrl="http://10.0.10.45:8202" :isDiagram="isDiagram" :deviceList="deviceList"  v-if="isDiagram == 3"></gis-map>
        </div>
        <!--     <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
             <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->
      </duno-main>
      <duno-main class="kilovolt" :class="{dunoMainContain: isDiagram==1}" v-else-if="kilovoltKind == '1000'">
        <div :class="['item_ctx']"  ref="firstElE"  v-if="isDiagram==1">
          <div>
            <div  class="toward">
              <img :src="toward" style="position: relative; left: 40px"/>
            </div>
            <!-- <drappable class="drappable_assembly" width="1900px" height="675px">
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
             </drappable>-->
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204/" :kind="1000" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <!--   <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
             <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->
        </div>
        <div :class="['item_ctx']"  ref="firstElE" v-else-if="isDiagram == 2">
          <div class="toward" style="left: 60px">
            <img :src="towardAround"/>
          </div>
          <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointList" @toDetail="toDevice" :kind="1000" :isDiagram="isDiagram" :deviceList="kilovolt1000Pic"  v-if="isDiagram == 2"></gis-map>
          <!-- <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
           <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
        <div :class="['item_ctx']"  ref="firstElE" v-else-if="isDiagram == 3">
          <div>
            <div>
              <div class="toward" style="left: 60px">
                <img :src="towardAround"/>
              </div>
              <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointList" mapUrl="http://10.0.10.45:8202"  @toDetail="toDevice" :kind="1000" :isDiagram="isDiagram" :deviceList="kilovolt1000Pic"></gis-map>
            </div>
          </div>
          <!-- <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
          <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
      </duno-main>
      <duno-main class="kilovolt" :class="{'dunoMainContain': isDiagram==1}" v-else-if="kilovoltKind == '500'">
        <div :class="['item_ctx']" ref="firstElE"  v-if="isDiagram==1">
          <div>
            <div class="toward">
              <img :src="toward" style="position: relative; left: 40px"/>
            </div>
            <!--  <drappable  class="drappable_assembly" width="1900px" height="675px">
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
              </drappable>-->
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204/" :kind="500" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <!--  <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
            <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-else-if="isDiagram == 2">
          <div class="toward"  style="left: 60px">
            <img :src="towardAround"/>
          </div>
          <gis-map ref="gisMapObj" @on-drag="drag" @toDetail="toDevice" :kind="500" :isDiagram="isDiagram" :deviceList="kilovolt500Pic"  v-if="isDiagram == 2"></gis-map>
          <!--    <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
              <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-if="isDiagram == 3">
          <div>
            <div>
              <div class="toward"  style="left: 60px">
                <img :src="towardAround"/>
              </div>
              <gis-map ref="gisMapObj" @on-drag="drag"  :powerPointList="powerPointList" mapUrl="http://10.0.10.45:8202" @toDetail="toDevice" :kind="500" :isDiagram="isDiagram" :deviceList="kilovolt500Pic"></gis-map>
              <!--    <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
                  <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
            </div>
          </div>
        </div>
      </duno-main>
      <duno-main class="kilovolt" :class="{'dunoMainContain': isDiagram==1}" v-else-if="kilovoltKind == '220'">
        <div :class="['item_ctx']"  ref="firstElE"  v-if="isDiagram==1">
          <div>
            <div class="toward">
              <img :src="toward" style="position: relative; left: 40px"/>
            </div>
            <!--  <drappable class="drappable_assembly" width="1900px" height="675px">
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
              </drappable>-->
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204/" :kind="220" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <!--   <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
             <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE"   v-else-if="isDiagram == 2">
          <div class="toward"  style="left: 60px">
            <img :src="towardAround"/>
          </div>
          <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointList" @toDetail="toDevice" :kind="220" :isDiagram="isDiagram" :deviceList="kilovolt220Pic"  v-if="isDiagram == 2"></gis-map>
          <!-- <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
           <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE"   v-else-if="isDiagram == 3">
          <div>
            <div>
              <div class="toward"  style="left: 60px">
                <img :src="towardAround"/>
              </div>
              <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointList" mapUrl="http://10.0.10.45:8202" @toDetail="toDevice" :kind="220" :isDiagram="isDiagram" :deviceList="kilovolt220Pic"  v-if="isDiagram == 3"></gis-map>
              <!-- <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
               <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
            </div>
          </div>
        </div>
      </duno-main>
      <duno-main class="kilovolt" :class="{'dunoMainContain': isDiagram==1}" v-else-if="kilovoltKind == '110'">
        <div :class="['item_ctx']" ref="firstElE"  v-if="isDiagram==1">
          <div>
            <div class="toward">
              <img :src="toward" style="position: relative; left: 40px"/>
            </div>
            <!-- <drappable class="drappable_assembly" width="1900px" height="675px">
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
             </drappable>-->
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204/" :kind="110" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <!--      <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
                <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-else-if="isDiagram == 2">
          <div class="toward"  style="left: 60px">
            <img :src="towardAround"/>
          </div>
          <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointList" @toDetail="toDevice" :kind="110" :isDiagram="isDiagram" :deviceList="kilovolt110Pic"  v-if="isDiagram == 2"></gis-map>
          <!--   <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
             <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-else-if="isDiagram == 3">
          <div>
            <div>
              <div class="toward"  style="left: 60px">
                <img :src="towardAround"/>
              </div>
              <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointList" mapUrl="http://10.0.10.45:8202" @toDetail="toDevice" :kind="110" :isDiagram="isDiagram" :deviceList="kilovolt110Pic"  v-if="isDiagram == 3"></gis-map>
              <!--   <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
                 <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
            </div>
          </div>
        </div>
      </duno-main>
      <duno-main class="kilovolt" :class="{'dunoMainContain': isDiagram==1}" v-else-if="kilovoltKind == '35'">
        <div :class="['item_ctx']" ref="firstElE"  v-if="isDiagram==1">
          <div>
            <div class="toward">
              <img :src="toward" style="position: relative; left: 40px"/>
            </div>
            <!-- <drappable class="drappable_assembly" width="1900px" height="675px">
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
             </drappable>-->
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204/" :kind="35" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
            <!--      <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
                  <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->

          </div>
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-else-if="isDiagram == 2">
          <div>
            <div>
              <div class="toward"  style="left: 60px">
                <img :src="towardAround"/>
              </div>
              <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointList" @toDetail="toDevice" :kind="35" :isDiagram="isDiagram" :deviceList="kilovolt35Pic"  v-if="isDiagram == 2"></gis-map>
              <!--   <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
                 <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
            </div>
          </div>
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-else-if="isDiagram == 3">
          <div>
            <div>
              <div>
                <div class="toward"  style="left: 60px">
                  <img :src="towardAround"/>
                </div>
                <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointList" mapUrl="http://10.0.10.45:8202" @toDetail="toDevice" :kind="35" :isDiagram="isDiagram" :deviceList="kilovolt35Pic"  v-if="isDiagram == 3"></gis-map>
                <!--   <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
                   <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->

              </div>
            </div>
          </div>
        </div>
      </duno-main>
      <duno-main class="kilovolt" :class="{'dunoMainContain': isDiagram==1}" v-else-if="kilovoltKind == '10'">
        <div :class="['item_ctx']" ref="firstElE"  v-if="isDiagram==1">
          <div>
            <div class="toward">
              <img :src="toward" style="position: relative; left: 40px"/>
            </div>
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204/" :kind="10" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <!--  <drappable class="drappable_assembly" width="1900px" height="675px">
              <div class="allShowPic">
                <div class="Once_primaryDiagram" style="position:absolute;left: -910px;top: -320px;transform: scale(2)">
                  <div class="deviceList">
                    <template v-for="(item,index) in kilovolt10Pic">
                      <img :key="index" @click="toDevice(item,index,$refs.firstElE,0)" v-if="item['show']" :src="item['src']"
                           :style="[
                          {'left': item['xAxisDiagram']+'px'},
                          {'top': item['yAxisDiagram']+'px'}
                        ]"
                      />
                    </template>
                  </div>
                  <img :src="kilovolt10" />
                </div>
              </div>
            </drappable>-->
          <!--     <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
               <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-else-if="isDiagram == 2">
          <div class="toward"  style="left: 60px">
            <img :src="towardAround"/>
          </div>
          <drappable  idName="other" class="drappable_assembly" width="1900px" height="675px">
            <div class="allShowPic center" style="position: absolute;top:-80px;transform: scale(1.3)">
              <div class="realView">
                <div class="deviceList">
                </div>
                <div class="center">无此图片</div>
              </div>
            </div>
          </drappable>
          <!--  <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
            <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-else-if="isDiagram == 3">
          <div>
            <div>
              <div class="toward"  style="left: 60px">
                <img :src="towardAround"/>
              </div>
              <drappable  idName="other" class="drappable_assembly" width="1900px" height="675px">
                <div class="allShowPic center" style="position: absolute;top:-80px;transform: scale(1.3)">
                  <div class="realView">
                    <div class="deviceList">
                    </div>
                    <div class="center">无此图片</div>
                  </div>
                </div>
              </drappable>
            </div>
          </div>
          <!--  <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
            <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
      </duno-main>
      <div v-for="(item,index) of modeList" style="position: absolute; top: 0" :key="index" class="model" :id="item['id']" ref="modelRef">
        <popup-one-info  :itemDataOption="$store.state.user.alarmInfo" v-if="index==modeList.length-1" @onClose="alarmClose" :visible="visible"></popup-one-info>
        <!--弹窗必须传index  -->
        <!--<camera-pop-back-u-p   @on-alarm="onAlarm" @chang-Point="changPoint" @onClose="onClose" :index="index" v-if="item['cameraFlagVisibled']" :itemData="item['itemData']" :visible="item['cameraFlagVisibled']"></camera-pop-back-u-p>-->
        <popupinfo :isDiagram="isDiagram" :itemData="item['itemData']"  @onClose="onClose" :index="index" :monitorDeviceType="item['monitorDeviceType']" :deviceId="item['deviceId']" v-if="item['popupinfoVisable']" :visible="item['popupinfoVisable']"></popupinfo>
        <popupinfod   :showClassify="true"  :isDiagram="isDiagram" :itemData="item['itemData']"  @onClose="onClose"  :index="index" :monitorDeviceType="item['isShowClassifyVisble']"  v-if="item['isShowClassifyVisble']" :visible="item['isShowClassifyVisble']"></popupinfod>
        <hotcamera-pop @onClose="onClose" :itemData="item['itemData']" :index="index" v-if="item['hotcameraFlagVisible']" :visible="item['hotcameraFlagVisible']"/>
        <camera-pop-back-u-p @on-alarm="onAlarm" @chang-Point="changPoint" @onClose="onClose" :index="index" v-if="item['cameraFlagVisible']" :itemData="item['itemData']" :visible="item['cameraFlagVisible']"/>
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
    import cameraPopBackUP from '_c/duno-m/cameraPopBackUP'
    import hotcameraPop from '_c/duno-m/hotcameraPop'                 // 可见光
    import hotCamera from '_c/duno-m/hotCamera'                       // 红外
    import { popupinfo, popupOneInfo, popupinfod } from '_c/popupinfo'
    import { deviceLocation, deviceList, lastDeviceList } from '@/api/currency/currency.js'
    import { mapState } from 'vuex'
    import gisMap from '_c/duno-m/gisMap'
    import {getAxiosData} from "../../../api/axiosType";
    export default {
        mixins: [mixinViewModule],
        name: 'RoleIndex',
        components: {
            hotCamera,
            dunoBtnTop,
            dunoMain,
            drappable,
            cameraPanel,
            Polygonal,
            popupinfo,
            popupinfod,
            popupOneInfo,
            cameraPop,
            hotcameraPop,
            gisMap,
            cameraPopBackUP
        },
        computed:{
            ...mapState([
                'user'
            ]),
            alarmInfo(){
                return this.$store.state.user.alarmInfo
            },
            kilovoltKind(){
                return this.$store.state.app.kilovolt
            },
            kilovolt1000Pic(){
                if(this.deviceList)
                    return this.deviceList.filter((item)=>{
                        return item['areaId'] == '1'
                    })
                else
                    return []
            },
            kilovolt500Pic(){
                if(this.deviceList)
                    return this.deviceList.filter((item)=>{
                        return item['areaId'] == '2'
                    })
                else
                    return []
            },
            kilovolt220Pic(){
                if(this.deviceList)
                    return this.deviceList.filter((item)=>{
                        return item['areaId'] == '3'
                    })
                else
                    return []
            },
            kilovolt110Pic(){
                if(this.deviceList)
                    return this.deviceList.filter((item)=>{
                        return item['areaId'] == '4'
                    })
                else
                    return []
            },
            kilovolt35Pic(){
                if(this.deviceList)
                    return this.deviceList.filter((item)=>{
                        return item['areaId'] == '5'
                    })
                else
                    return []
            },
            kilovolt10Pic(){
                if(this.deviceList)
                    return this.deviceList.filter((item)=>{
                        return item['areaId'] == '6'
                    })
                else
                    return []
            }
        },
        data () {
            const that = this
            return {
                disgramList: [],
                alarmId: '',
                visible: false,
                powerPointList: [],
                isAlarm: false,
                timer: null,
                tempObj: {},
                isDiagram: 2,
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
                        cameraFlagVisibled: false,
                        isShowClassifyVisble: false,
                        hotcameraFlagVisible: false,
                        itemData: {}
                    },
                    {
                        id: 'modelRight',
                        monitorDeviceType: '',
                        deviceId: '',
                        popupinfoVisable: false,      ////控制显示
                        cameraFlagVisible: false,
                        cameraFlagVisibled: false,
                        isShowClassifyVisble: false,
                        hotcameraFlagVisible: false,
                        itemData: {}
                    }
                ],
                deviceId: '',
                monitorDeviceType: '',
                cameraFlag: 'first',
                domTarget: null,
                tempDeviceList: null
            }
        },
        watch: {
            alarmInfo:{
                handler(now){
                    this.visible = false
                    this.onAlarm(now)
                },
                deep: true,
                immediate: true
            },
            kilovoltKind(now){
                this.mainlistShow = false
                this.$nextTick(()=>{
                    this.mainlistShow = true
                    this.initOtherPoint()
                    this.initDisgram()
                })
                this.onClose(false ,'all')
                this.$refs.btnTopRef.handleCheckAllChange(true)
                this.$refs.btnTopRef.checkAll = true
                // this.deviceShowHandle(this.$refs.btnTopRef.dataList)
                console.log(now)
            }
        },
        methods: {
            initDisgram(){
                const that = this
                getAxiosData('/lenovo-device/api/device/diagram/list').then(res=>{
                    let data = res.data
                    // debugger
                    if(that.kilovoltKind == 10){
                        data = data.filter(item=>{
                            return item['areaId'] == '6'
                        })
                    }else if(that.kilovoltKind == 35){
                        data = data.filter(item=>{
                            return item['areaId'] == '5'
                        })
                    }else if(that.kilovoltKind == 110){
                        data = data.filter(item=>{
                            return item['areaId'] == '4'
                        })
                    }else if(that.kilovoltKind == 220){
                        data = data.filter(item=>{
                            return item['areaId'] == '3'
                        })
                    }else if(that.kilovoltKind == 500){
                        data = data.filter(item=>{
                            return item['areaId'] == '2'
                        })
                    }else if(that.kilovoltKind == 1000){
                        data = data.filter(item=>{
                            return item['areaId'] == '1'
                        })
                    }
                    that.disgramList = data
                })
            },
            onAlarmC(point){

            },
            alarmClose(){
                this.visible = false
                this.$store.state.user.isAlarm = false
                this.$refs.gisMapObj.clearAlarm()
            },
            onAlarm(now){
                this.$refs.gisMapObj.isAlarm(now)
                this.$nextTick(()=>{
                    if(now['alarmConfig'] == 1){
                        this.visible = true
                        document.querySelector('.HistoricalDocuments').style.transform="translateX(-328px)"
                    }
                })
            },
            initOtherPoint(){
                const that = this
                lastDeviceList().then(res=>{
                    let data = res.data
                    if(that.kilovoltKind == 10){
                        data = data.filter(item=>{
                            return item['areaId'] == '6'
                        })
                    }else if(that.kilovoltKind == 35){
                        data = data.filter(item=>{
                            return item['areaId'] == '5'
                        })
                    }else if(that.kilovoltKind == 110){
                        data = data.filter(item=>{
                            return item['areaId'] == '4'
                        })
                    }else if(that.kilovoltKind == 220){
                        data = data.filter(item=>{
                            return item['areaId'] == '3'
                        })
                    }else if(that.kilovoltKind == 500){
                        data = data.filter(item=>{
                            return item['areaId'] == '2'
                        })
                    }else if(that.kilovoltKind == 1000){
                        data = data.filter(item=>{
                            return item['areaId'] == '1'
                        })
                    }
                    data.map(item=>{
                        item['src'] = that.robot
                    })
                    this.powerPointList = data
                })
            },
            closeAlarm(now){
                if(!now){
                    this.isAlarmPanel = false
                    this.alarmClear()
                    this.isAlarm = false
                }
            },
            drag(event, item){
                event.dataTransfer.setData("itemData",JSON.stringify(item))
            },
            changPoint(monitorDeviceType){
                const that = this
                that.$nextTick(()=>{
                    let data = JSON.parse(JSON.stringify(that.tempDeviceList))
                    if(monitorDeviceType == -1){
                        that.deviceList = data
                    }else if(monitorDeviceType == 1 || monitorDeviceType == 99){
                        data= data.filter(item=>{
                            return item['monitorDeviceType'] == 1 || item['monitorDeviceType'] == 99
                        })
                    }
                    that.deviceList = data
                    that.$forceUpdate()
                })
            },
            mouseupWeatherCheck(){
                let flag = this.isOverlap('moveTarget', 'weatherCheck')
                if(flag){
                    alert('')
                }
            },
            // 使用接口地址：     /lenovo-device/api/device/location
            onClose(now, index = 0, target){
                // this.changPoint(-1)
                if(index == 'all'){
                    this.modeList.map(item=>{
                        item['popupinfoVisable'] = false
                        item['cameraFlagVisible'] = false
                        item['cameraFlagVisibled'] = false
                        item['isShowClassifyVisble'] = false
                        item['hotcameraFlagVisible'] = false
                    })
                    this.$forceUpdate()
                    return
                }
                this.modeList[index][target] = now
                this.$forceUpdate()
            },
            isOverlap(idOne,idTwo){
                let objOne=$("#"+idOne),
                    objTwo=$("#"+idTwo),
                    offsetOne = objOne.offset(),
                    offsetTwo = objTwo.offset(),
                    topOne=offsetOne.top,
                    topTwo=offsetTwo.top,
                    leftOne=offsetOne.left,
                    leftTwo=offsetTwo.left,
                    widthOne = objOne.width(),
                    widthTwo = objTwo.width(),
                    heightOne = objOne.height(),
                    heightTwo = objTwo.height();
                let leftTop = leftTwo > leftOne && leftTwo < leftOne+widthOne
                    && topTwo > topOne && topTwo < topOne+heightOne,
                    rightTop = leftTwo+widthTwo > leftOne && leftTwo+widthTwo < leftOne+widthOne
                        && topTwo > topOne && topTwo < topOne+heightOne,
                    leftBottom = leftTwo > leftOne && leftTwo < leftOne+widthOne
                        && topTwo+heightTwo > topOne && topTwo+heightTwo < topOne+heightOne,
                    rightBottom = leftTwo+widthTwo > leftOne && leftTwo+widthTwo < leftOne+widthOne
                        && topTwo+heightTwo > topOne && topTwo+heightTwo < topOne+heightOne;
                return leftTop || rightTop || leftBottom || rightBottom;
            },
            changeCameraShow(now){
                this.cameraFlag = now
            },
            changeFullScreen(target){
                const that = this
                let data = that.modeList
                data.map(item=>{
                    if(item['popupinfoVisable']){
                        that.toDevice(that.tempObj['item'],that.tempObj['index'],that.tempObj['target'],that.tempObj['modelIndex'])
                    }
                    if(item['cameraFlagVisible']){
                        that.toDevice(that.tempObj['item'],that.tempObj['index'],that.tempObj['target'],that.tempObj['modelIndex'])
                    }
                    if(item['cameraFlagVisibled']){
                        that.toDevice(that.tempObj['item'],that.tempObj['index'],that.tempObj['target'],that.tempObj['modelIndex'])
                    }
                    if(item['isShowClassifyVisble']){
                        that.toDevice(that.tempObj['item'],that.tempObj['index'],that.tempObj['target'],that.tempObj['modelIndex'])
                    }
                    if(item['hotcameraFlagVisible']){
                        that.toDevice(that.tempObj['item'],that.tempObj['index'],that.tempObj['target'],that.tempObj['modelIndex'])
                    }
                })
                that.modeList = data
                this.$forceUpdate()
                screenfull.toggle(target)
                this.domTarget = target
                this.appendModel(target)
            },
            appendModel(target, index=0){
                const that = this
                target.appendChild(this.$refs.modelRef[index])
            },
            changDiagram(now){
                this.isDiagram = now
                this.initOtherPoint()
                this.initDisgram()
                this.$forceUpdate()
            },
            getPower(){
                const that = this
                deviceList().then(res=>{})
            },
            getDeviceList(){
                const that = this
                deviceLocation().then(res=>{
                    let data = res.data
                    data.map((item, index)=>{
                        if(item['monitorDeviceType'] == 1 || item['monitorDeviceType'] == 99){
                            if (item.deviceMessage.supportPreset) {
                                item['src'] = that.light
                            }else{
                                item['src'] = that.lightNoCamera
                            }
                        }else if(item['monitorDeviceType'] == 2){
                            if(item.deviceMessage.supportPreset){
                                item['src'] = that.redLightCamera
                            }else{
                                item['src'] = that.redLight
                            }
                        }
                        item['show'] = true
                        item['isShow'] = true
                    })
                    that.deviceList = data
                    that.tempDeviceList = data
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
            alarmClear(){
                clearInterval(this.timer)
            },
            alarmSet(){
                this.isAlarmPanel = true
                this.timer = setInterval(()=>{
                    this.isAlarm = !this.isAlarm
                },500)
            },
            visableHandle(item, flag, modelIndex){
                if ('deviceMessage' in item && item.deviceMessage.supportPreset) {
                    if(item.monitorDeviceType == '1')       // 可见光
                        this.modeList[modelIndex].cameraFlagVisible = flag
                    else if(item.monitorDeviceType == '99'){
                        this.modeList[modelIndex].cameraFlagVisibled = flag
                    }
                    else if(item.monitorDeviceType == '2')
                        this.modeList[modelIndex].hotcameraFlagVisible = flag
                } else{
                    if(!('monitorDeviceType' in item) && this.isDiagram == 1){
                        // debugger
                        this.modeList[modelIndex].isShowClassifyVisble = flag
                    }
                    if(item.monitorDeviceType == '1'){
                        this.modeList[modelIndex].popupinfoVisable = flag
                    }else if(item.monitorDeviceType == '2'){
                        this.modeList[modelIndex].popupinfoVisable = flag
                    }
                    // this.modeList[modelIndex].popupinfoVisable = flag
                }
            },
            toDevice(item, index, targetd, modelIndex = 0, flag){
                let target = this.$refs.firstElE
                this.onClose(false ,'all')
                this.tempObj = {
                    item: item,
                    index: index,
                    target: target,
                    modelIndex: modelIndex
                }
                if(target && !flag){
                    this.appendModel(target, modelIndex)
                }
                console.log(item)
                this.visableHandle(item, false, modelIndex)
                // 赋值----
                this.modeList[modelIndex].deviceId = item['monitorDeviceId']
                this.modeList[modelIndex].monitorDeviceType = item['monitorDeviceType']
                this.modeList[modelIndex].itemData = item
                //-----
                this.$nextTick(()=> {
                    this.visableHandle(item, true, modelIndex)
                })
            }
        },
        created(){
            this.getDeviceList()
            this.$nextTick(()=>{
                this.initDisgram()
                this.initOtherPoint()
            })
            this.$store.state.app.kilovolt = this.$route.meta.kind
        },
        beforeDestroy(){
        },
        mounted () {
            const that = this
            document.addEventListener('fullscreenchange', function(event){
                if(that.$refs.btnTopRef)
                    that.$refs.btnTopRef.isFullscreen = !that.$refs.btnTopRef.isFullscreen
                that.isFullscreen = !that.isFullscreen
                let data = that.modeList
                if(that.isFullscreen){
                    document.querySelector('#map').setAttribute('style','height:100vh !important')
                    that.$refs.firstElE.style.background = 'rgba(20, 40, 56)'
                }else{
                    document.querySelector('#map').setAttribute('style','height:calc( 100vh - 166px) !important')
                    that.$refs.firstElE.style.background = 'transparent'
                }
                data.map(item=>{
                    /* if(item['popupinfoVisable']){
                         item['popupinfoVisable'] = false
                     }
                     if(item['cameraFlagVisible']){
                         item['popupinfoVisable'] = false
                     }
                     if(item['hotcameraFlagVisible']){
                         item['popupinfoVisable'] = false
                     }*/
                })
                that.modeList = data
                this.$forceUpdate()
            })
        }
    }
</script>
<style lang="scss">
  .realEnv{
    .dunoMainContain{
      .gisMap{
        background: #1d2026 !important;
      }
    }
    .icon-xiala{
     /* width: 12px;
      height: 15px;*/
    }
    .ol-zoom{
      z-index: 4;
    }
    .center{
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
      margin: auto;
      width: 66px;
      height: 20px;
    }
    .isAlarm{
      border: 3px solid red;
    }
    .weatherCheck{
      position: absolute; bottom: 19px; right: 62px;z-index: 1;
    }
    .turnHCircle{
      transform: rotate(180deg);
      transform-origin: 53% 292px;
    }
    .fullScreen{
      color: white;
      position: absolute;
      font-size: 24px;
      cursor: pointer;
      right: 25px;
      bottom: 20px;
    }
    .toward{
      z-index: 2;
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
      transform:translate(-46%,-50%);
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
        background: #142838 !important;
        position: relative;
        overflow: hidden;
      }
      .item_ctx.active:first-child{
        /*border-left: 6px solid #18191D;*/
      }
      .item_ctx.active:last-child{
        /*border-right: 6px solid #18191D;*/
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
