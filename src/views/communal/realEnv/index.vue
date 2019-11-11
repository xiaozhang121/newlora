<template>
  <div class="realEnv">
    <duno-btn-top :isCheck="true" :zIndex="100" ref="btnTopRef" @on-controlBall="showControlBall" @on-active="deviceShowHandle" @on-diagram="changDiagram" @change-screen="changeFullScreen($refs.firstElE)" />
   <!-- <el-date-picker
            v-model="value2"
            align="right"
            type="date"
            placeholder="选择日期"
            :picker-options="pickerOptions1">
    </el-date-picker>-->
    <div class="mainList" v-if="mainlistShow">
      <duno-main   v-if="kilovoltKind == 'all'" :class="{'dunoMainContain': isDiagram==1}">
        <div class="main_ctx" ref="firstElE">
          <div :class="['toward']">
            <img style="position: relative; left: 40px" @click="alarmSet" :src="towardAround" v-if="isDiagram == 2 || isDiagram == 3"/>
            <img style="position: relative; left: 40px" @click="alarmSet" :src="towardAround" v-else-if="isDiagram == 1"/>
          </div>
          <img v-if="showWeather" id="weatherCheck" class="weatherCheck" draggable="true" @dragstart="drag($event, {'src':weatherCheck,'name':'weatherCheck'})"  :src="weatherCheck" style="width: 40px; height: 40px;zIndex:9999!important"/>
          <!--<div style="width: 1900px; height: 675px; background: pink; position: fixed"></div>-->
          <!-- <div v-for="(item, index) in deviceList" class="anchorPoint" :id="'anchor'+index" :key="index" >
               <img draggable="true" @dragstart="drag($event, item)" @click="toDevice(item,index)" v-if="item['show']" :src="item['src']"/>
           </div>-->
          <!--<gis-map :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>-->
          <div v-if="isDiagram == 2">
            <gis-map @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="powerPointListB" @toDetail="toDevice"  :isDiagram="isDiagram" :deviceList="deviceList"  ></gis-map>
          </div>
          <div :class="['allShowPic']" v-else-if="isDiagram == 1">
            <!--<drappable class="drappable_assembly" width="1900px" height="675px" >
                <div class="realView">
                  <img :src="kilovoltAllAround" />
                </div>
            </drappable>-->
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8203" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <gis-map @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="powerPointListB" @toDetail="toDevice" mapUrl="http://10.0.10.45:8202" :isDiagram="isDiagram" :deviceList="deviceList"  v-if="isDiagram == 3"></gis-map>
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
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204" :kind="1000" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <!--   <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
             <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->
        </div>
        <div :class="['item_ctx']"  ref="firstElE" v-else-if="isDiagram == 2">
          <div class="toward" style="left: 60px">
            <img :src="towardAround"/>
          </div>
          <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointListB" @toDetail="toDevice" :kind="1000" :isDiagram="isDiagram" :deviceList="kilovolt1000Pic"  v-if="isDiagram == 2"></gis-map>
          <!-- <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
           <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
        <div :class="['item_ctx']"  ref="firstElE" v-else-if="isDiagram == 3">
          <div>
            <div>
              <div class="toward" style="left: 60px">
                <img :src="towardAround"/>
              </div>
              <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointListB" mapUrl="http://10.0.10.45:8202"  @toDetail="toDevice" :kind="1000" :isDiagram="isDiagram" :deviceList="kilovolt1000Pic"></gis-map>
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
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204" :kind="500" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <!--  <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
            <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-else-if="isDiagram == 2">
          <div class="toward"  style="left: 60px">
            <img :src="towardAround"/>
          </div>
          <gis-map ref="gisMapObj" @on-drag="drag" @toDetail="toDevice" :kind="500" :powerPointList="powerPointListB" :isDiagram="isDiagram" :deviceList="kilovolt500Pic"  v-if="isDiagram == 2"></gis-map>
          <!--    <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
              <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-if="isDiagram == 3">
          <div>
            <div>
              <div class="toward"  style="left: 60px">
                <img :src="towardAround"/>
              </div>
              <gis-map ref="gisMapObj" @on-drag="drag"  :powerPointList="powerPointListB" mapUrl="http://10.0.10.45:8202" @toDetail="toDevice" :kind="500" :isDiagram="isDiagram" :deviceList="kilovolt500Pic"></gis-map>
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
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204" :kind="220" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <!--   <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
             <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE"   v-else-if="isDiagram == 2">
          <div class="toward"  style="left: 60px">
            <img :src="towardAround"/>
          </div>
          <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointListB" @toDetail="toDevice" :kind="220" :isDiagram="isDiagram" :deviceList="kilovolt220Pic"  v-if="isDiagram == 2"></gis-map>
          <!-- <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
           <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE"   v-else-if="isDiagram == 3">
          <div>
            <div>
              <div class="toward"  style="left: 60px">
                <img :src="towardAround"/>
              </div>
              <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointListB" mapUrl="http://10.0.10.45:8202" @toDetail="toDevice" :kind="220" :isDiagram="isDiagram" :deviceList="kilovolt220Pic"  v-if="isDiagram == 3"></gis-map>
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
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204" :kind="110" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
          </div>
          <!--      <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.firstElE)"></i>
                <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.firstElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-else-if="isDiagram == 2">
          <div class="toward"  style="left: 60px">
            <img :src="towardAround"/>
          </div>
          <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointListB" @toDetail="toDevice" :kind="110" :isDiagram="isDiagram" :deviceList="kilovolt110Pic"  v-if="isDiagram == 2"></gis-map>
          <!--   <i class="fullScreen iconfont icon-quanping" v-if="!isFullscreen" @click="changeFullScreen($refs.secondElE)"></i>
             <i class="fullScreen iconfont icon-suoxiao" v-else @click="changeFullScreen($refs.secondElE)"></i>-->
        </div>
        <div :class="['item_ctx']" ref="firstElE" v-else-if="isDiagram == 3">
          <div>
            <div>
              <div class="toward"  style="left: 60px">
                <img :src="towardAround"/>
              </div>
              <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointListB" mapUrl="http://10.0.10.45:8202" @toDetail="toDevice" :kind="110" :isDiagram="isDiagram" :deviceList="kilovolt110Pic"  v-if="isDiagram == 3"></gis-map>
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
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204" :kind="35" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
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
              <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointListB" @toDetail="toDevice" :kind="35" :isDiagram="isDiagram" :deviceList="kilovolt35Pic"  v-if="isDiagram == 2"></gis-map>
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
                <gis-map ref="gisMapObj" @on-drag="drag" :powerPointList="powerPointListB" mapUrl="http://10.0.10.45:8202" @toDetail="toDevice" :kind="35" :isDiagram="isDiagram" :deviceList="kilovolt35Pic"  v-if="isDiagram == 3"></gis-map>
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
            <gis-map fillColor="#1d2026" mapUrl="http://10.0.10.45:8204" :kind="10" @on-alarm="onAlarmC" @on-drag="drag" ref="gisMapObj" :powerPointList="disgramList" @toDetail="toDevice" v-if="isDiagram == 1"  :isDiagram="isDiagram" :deviceList="deviceList"></gis-map>
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
     <!-- <div style="position: relative; width: 30%; height: 800px; background: white">
        <area-setting />
      </div>-->
      <!--<create-task :visible="true"></create-task>-->
      <div v-for="(item,index) of modeList" style="position: absolute; top: 0" :key="index" class="model" :id="item['id']" ref="modelRef">
        <popup-one-info  :itemDataOption="$store.state.user.alarmInfo" v-if="index==modeList.length-1 && visible" @onClose="alarmClose" :visible="visible"></popup-one-info>
        <!--弹窗必须传index  -->
        <!--<camera-pop-back-u-p   @on-alarm="onAlarm" @chang-Point="changPoint" @onClose="onClose" :index="index" v-if="item['cameraFlagVisibled']" :itemData="item['itemData']" :visible="item['cameraFlagVisibled']"></camera-pop-back-u-p>-->
        <popupinfo :isDiagram="isDiagram" :itemData="item['itemData']"  @onClose="onClose" :index="index" :monitorDeviceType="item['monitorDeviceType']" :deviceId="item['deviceId']" v-if="item['popupinfoVisable']" :visible="item['popupinfoVisable']"></popupinfo>
        <!--<popupinfod   :showClassify="true"  :isDiagram="isDiagram" :itemData="item['itemData']"  @onClose="onClose"  :index="index" :monitorDeviceType="item['isShowClassifyVisble']"  v-if="item['isShowClassifyVisble']" :visible="item['isShowClassifyVisble']"></popupinfod>-->
        <hotcamera-pop @onClose="onClose" :itemData="item['itemData']" :index="index" v-if="item['hotcameraFlagVisible']" :visible="item['hotcameraFlagVisible']"/>
        <camera-pop-back-u-p @on-alarm="onAlarm" @chang-Point="changPoint" @onClose="onClose" :index="index" v-if="item['cameraFlagVisible']" :itemData="item['itemData']" :visible="item['cameraFlagVisible']"/>
        <camera-power :itemData="item['itemData']" :visible="item['isShowPowerVisible']" :mapType='isDiagram'  v-if="item['isShowPowerVisible'] && index==modeList.length-1" />
        <ball-control-d @on-reset="resetM" ref="ballControl" @on-draw="onDrawPoint"  @on-close="hideControlBall"  v-if="index==modeList.length-1 && controlBallVisible" :visible="controlBallVisible"></ball-control-d>
      </div>
    </div>
    <!--<i class="iconfont icon-bukongqiu" @click="handeControl"></i>-->
    <div class="clickMark" v-show="markVisible">点击标记</div>
  </div>
</template>

<script>
    import { getNewTagList, isAlarmVisible, isAlarmMap } from "@/libs/util";
    import cameraPower from '_c/duno-m/cameraPower'
    import areaSetting  from '_c/duno-m/areaSetting'
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
    import createTask from '_c/duno-m/createTask'
    import { popupinfo, popupOneInfo, popupinfod } from '_c/popupinfo'
    import { deviceLocation, deviceList, lastDeviceList } from '@/api/currency/currency.js'
    import { mapState } from 'vuex'
    import gisMap from '_c/duno-m/gisMap'
    import {getAxiosData} from "../../../api/axiosType";
    import ballControlD from '_c/duno-m/ballControlD'
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
            cameraPopBackUP,
            createTask,
            areaSetting,
            cameraPower,
            ballControlD
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
                drawPoint: require('@/assets/drawPointIcon.ico'),
                value2: '',
                pickerOptions1: {
                    disabledDate(time) {
                        let date = new Date(time.getFullYear()+'-'+ ((time.getMonth()*1+1)<10?'0'+(time.getMonth()*1+1):(time.getMonth()*1+1)) + '-' + (time.getDate()<10?'0'+time.getDate():time.getDate())).getTime()
                        return [new Date('2019-09-02').getTime(), new Date('2019-09-03').getTime(), new Date('2019-09-20').getTime()].indexOf(date)>-1;
                    }
                },
                showWeather: true,
                disgramList: [],
                alarmId: '',
                visible: false,
                powerPointList: [],
                powerPointListB: [],
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
                        isShowPowerVisible: false,
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
                        isShowPowerVisible: false,
                        hotcameraFlagVisible: false,
                        itemData: {}
                    }
                ],
                deviceId: '',
                monitorDeviceType: '',
                cameraFlag: 'first',
                domTarget: null,
                tempDeviceList: null,
                controlBallVisible: false,
                markVisible: false
            }
        },
        watch: {
            controlBallVisible(nowVal){
                if(!nowVal) {
                    this.resetM()
                }
            },
            alarmInfo:{
                handler(now){
                    this.visible = false
                    this.onAlarm(now)
                },
                deep: true,
                immediate: true
            },
            isDiagram(){
                this.$refs.btnTopRef.handleCheckAllChange(true)
                this.$refs.btnTopRef.checkAll = true
            },
            kilovoltKind(now){
                this.mainlistShow = false
                this.$nextTick(()=>{
                    this.mainlistShow = true
                    this.getDeviceList()
                    this.initOtherPoint()
                    this.initOthersP()
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
          resetM(){
              $('.dunoMain_nr').css({cursor: `auto`})
              $('.dunoMain_nr')[0].removeEventListener('mousemove', this.moveEvent)
              $('.dunoMain_nr')[0].removeEventListener('click', this.savePoint)
              this.markVisible = false
          },
          onDrawPoint(monitorDeviceId){
                this.controlBallDeviceId = monitorDeviceId
                try{
                    let deviceOverlayArr = this.$refs.gisMapObj.mapTarget.getOverlays().array_
                    let controlBallD = deviceOverlayArr.filter(item=>{
                        let info = item.get('pointInfo')
                        return info.monitorDeviceType == '4' && info['monitorDeviceId'] == this.controlBallDeviceId
                    })
                    this.selectBallControl = controlBallD[controlBallD.length - 1]
                    this.$store.state.user.mapX =  controlBallD[controlBallD.length - 1].getPosition()[0]
                    this.$store.state.user.mapY =  controlBallD[controlBallD.length - 1].getPosition()[1]
                    this.$refs.gisMapObj.setPosition(controlBallD[controlBallD.length - 1], '', '')
                }catch (e) {

                }
                this.showPen()
            },
          moveEvent(event){
              const that = this
              $('.clickMark')[0].style.left = event.pageX + 17 + 'px'
              $('.clickMark')[0].style.top = event.pageY - 3 + 'px'
              that.markVisible = true
          },
          hideControlBall(){
              this.controlBallVisible = false
          },
          showControlBall(){
              const that = this
              this.controlBallVisible = true
          },
          savePoint(){
              this.$refs.ballControl[0].commitDefineVisible = true
              try{
                  let deviceOverlayArr = this.$refs.gisMapObj.mapTarget.getOverlays().array_
                  let controlBallD = deviceOverlayArr.filter(item=>{
                      let info = item.get('pointInfo')
                      return info.monitorDeviceType == '4' && info['monitorDeviceId'] == this.controlBallDeviceId
                  })
                  this.selectBallControl = controlBallD[0]
                  this.$refs.gisMapObj.setPosition(controlBallD[0], this.$refs.gisMapObj.clickPos[0], this.$refs.gisMapObj.clickPos[1])
              }catch (e) {
                  
              }
              // controlBallD[0].setPosition(this.$refs.gisMapObj.clickPos)
            /*  if(controlBallD[0].get('pointInfo').realX)
                this.$refs.gisMapObj.addPointList(['realX': ])*/
          },
          showPen(){
              const that = this
              $('.dunoMain_nr').css({cursor:`url(${this.drawPoint}) -32 27,auto`})
              $('.dunoMain_nr')[0].addEventListener('click', that.savePoint)
              $('.dunoMain_nr')[0].addEventListener('mousemove', that.moveEvent)
              $('.dunoMain_nr')[0].addEventListener('mouseout', function () {
                  that.markVisible = false
              })
          },
        //   handeControl(){
        //     this.$router.push({
        //       path:'/surveillancePath/ballControl',
        //       query:{
        //         monitorDeviceId:'118'
        //       }
        //     })
        //   },
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
                if(now['powerDeviceId'] && isAlarmMap(this.$store.state.user.alarmConfig, now)){
                    this.$refs.gisMapObj.isAlarm(now)
                }
                if(isAlarmVisible(this.$store.state.user.alarmConfig, now)){
                    this.visible = true
                    this.$nextTick(()=>{
                        if(now['powerDeviceId']) {
                            document.querySelector('.HistoricalDocuments').style.transform = "translateX(-328px)"
                        }
                    })
                }
            },
            initOthersP(){
                const that = this
                getAxiosData('/lenovo-robot/rest/device/list').then(res=>{
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
                  this.powerPointListB = data
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
                    }else if(monitorDeviceType == 1 || monitorDeviceType == 99 || monitorDeviceType == 5){
                        data= data.filter(item=>{
                            return item['monitorDeviceType'] == 1 || item['monitorDeviceType'] == 99  || monitorDeviceType == 5
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
                        item['isShowPowerVisible'] = false
                        item['hotcameraFlagVisible'] = false
                    })
                    this.$forceUpdate()
                    return
                }
                this.modeList[index][target] = now
                this.$forceUpdate()
              /*  this.changPoint(-1)
                this.$refs.btnTopRef.handleCheckAllChange(true)
                this.$refs.btnTopRef.checkAll = true*/
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
                    if(item['isShowPowerVisible']){
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
                this.getDeviceList()
                this.initOtherPoint()
                this.initOthersP()
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
                        if(item['monitorDeviceType'] == 1 || item['monitorDeviceType'] == 99 || item['monitorDeviceType'] == 5){
                            if (item.deviceMessage.supportPreset) {
                                item['src'] = that.light
                                if(item.deviceMessage.cameraType == '3'){
                                    item['src'] = that.ballJ
                                }
                            }else{
                                item['src'] = that.lightNoCamera
                            }
                            if(item['monitorDeviceType'] == 5){
                                item['src'] = that.lightD
                            }
                        }else if(item['monitorDeviceType'] == 2){
                            if(item.deviceMessage.supportPreset){
                                item['src'] = that.redLightCamera
                            }else{
                                item['src'] = that.redLight
                            }
                        }else if(item['monitorDeviceType'] == 4){
                            item['src'] = that.ball
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
                this.showWeather = this.$refs.btnTopRef.dataList[3].isActive
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
                    if(item.monitorDeviceType == '1' || item.monitorDeviceType == '5')       // 可见光
                        this.modeList[modelIndex].cameraFlagVisible = flag
                    else if(item.monitorDeviceType == '99'){
                        this.modeList[modelIndex].cameraFlagVisibled = flag
                    }
                    else if(item.monitorDeviceType == '2')
                        this.modeList[modelIndex].hotcameraFlagVisible = flag
                } else{
                    if(!('monitorDeviceType' in item) && this.isDiagram == 1){
                        // debugger
                        // this.modeList[modelIndex].isShowClassifyVisble = flag
                        this.modeList[modelIndex].isShowPowerVisible = flag
                    }
                    if(!('monitorDeviceType' in item) && this.isDiagram != 1){
                        this.modeList[modelIndex].isShowPowerVisible = flag
                    }
                    if(item.monitorDeviceType == '1' || item.monitorDeviceType == '5'){
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
            this.$nextTick(()=>{
                this.getDeviceList()
                this.initDisgram()
                this.initOtherPoint()
                this.initOthersP()
            })
            this.$store.state.app.kilovolt = this.$route.meta.kind
        },
        beforeDestroy(){
            try{
              document.querySelector('.gisMap').remove()
            }catch (e) {}
        },
        mounted () {
            const that = this
            document.addEventListener('fullscreenchange', function(event){
                let temp = that.isDiagram
                if(that.$refs.btnTopRef)
                    that.$refs.btnTopRef.isFullscreen = !that.$refs.btnTopRef.isFullscreen
                that.isFullscreen = !that.isFullscreen
                let data = that.modeList
                that.$nextTick(()=>{
                    if(that.isFullscreen){
                          document.querySelector('#map').setAttribute('style','height:100vh !important')
                          that.$refs.firstElE.style.background = 'rgba(20, 40, 56)'
                    }else{
                          document.querySelector('#map').setAttribute('style','height:calc( 100vh - 166px) !important')
                          that.$refs.firstElE.style.background = 'transparent'
                    }
                    that.$refs.gisMapObj.mapTarget.updateSize()
                })
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
  .clickMark{
    position: fixed;
    left: 0;
    top: 0;
    color: #597aff;
    pointer-events: none;
    font-size: 13px;
    width: 52px;
  }
  .realEnv{
    .dunoMainContain{
      .gisMap{
        background: #1d2026 !important;
      }
    }
    .HistoricalDocuments .el-dialog{
        margin-top: 24vh !important;
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
      /*left: 50%;*/
      /*transform: translate(-50%, -50%);*/
      position: absolute;
    }
    .icon-bukongqiu{
      position:fixed;
      bottom:5%;
      right:5%;
      font-size:30px;
      color:#4b9bc1;
      cursor:pointer;
       @media screen and (min-width: 3500px) {
      right:36%;
    }
    }
  }
</style>
