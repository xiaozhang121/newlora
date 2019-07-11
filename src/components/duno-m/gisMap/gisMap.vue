<template>
    <div class="gisMap">
        <div id="map" ref="rootmap" style="height: 100%"></div>
        <div v-for="(item, index) in deviceList" :style="'transform:rotate('+ item['direct'] +'deg)'"  @click="toDeviced(item,index,null,1)" v-show="item['show']" class="anchorList" :id="'anchor'+index" ><img :src="item['src']" alt="示例锚点"/></div>
        <div v-for="(item, index) in powerPointList" @click="toDeviced(item,index,null,1)"  class="anchorList" :id="'anchord'+index" ><img style="width: 5px ;height: 5px" :src="item['src']" alt="示例锚点"/></div>
    </div>
</template>
<script>
import "ol/ol.css";
import { Map, View, Overlay, Feature } from "ol";
import {boundingExtent,getCenter} from 'ol/extent'
import  { Draw } from 'ol/interaction'
import Polygon from 'ol/geom/Polygon.js';
import Point from 'ol/geom/Point.js';
import { XYZ, TileImage } from "ol/source"
import { transform, getTransform } from "ol/proj"
import { defaults  as defaultControls } from "ol/control"
import { createRegularPolygon, createBox } from 'ol/interaction/Draw.js'
import { Vector as VectorLayer, Tile as TileLayer } from "ol/layer"
import TileLayerd from "ol/layer/Tile";
import {Circle as CircleStyle, Fill, Stroke, Style, Icon, Text, RegularShape} from 'ol/style';
import { OSM, Vector as VectorSource } from "ol/source";
export default {
    name: 'gisMap',
    components: {  },
    data() {
        const that = this
        return {
            timer: null,
            robot: require('@/assets/buttonPng/robot.png'),
            anchor: require('@/assets/anchor.png'),
            mapTarget: null,
            pointListObj: [],
            vector: null,
            source: null
        }
    },
    watch: {
        powerPointList(now){
            if(now.length){
                this.$nextTick(()=>{
                    this.addPointdList(now)
                })
            }
        },
        deviceList:{
            handler(now){
                if(now.length){
                    this.$nextTick(()=>{
                        this.addPointList(now)
                    })
                }
            },
            deep: true,
            immediate: true
        },
        mapUrl(){
        }
    },
    props: {
        powerPointList:{
            type: Array,
            default: () => []
        },
        mapUrl:{
            type: String,
            default: 'http://52.82.107.5:8090'
        },
        kind:{
            type: [String, Number],
            default: ''
        },
        deviceList:{
            type: Array,
            default () {
                return []
            }
        },
        isDiagram:{
            type: Number,
            default: 1
        }
    },
    computed: {

    },
    methods:{
        toDeviced(item,index,flag){
            this.$emit('toDetail',item,index,null,1)
        },
        initFeature(){
            let polygon = null
            let polygon500Arr = [[[13232286.214123132,3776249.9050271306],[13232286.214123132,3766249.9049271308],[13215286.214023132,3766249.9049271308],[13215286.214023132,3776249.9050271306],[13232286.214123132,3776249.9050271306]],[[13222332.214123132,3775340.9051271309],[13222332.214123132,3768098.9051271309],[13225612.214123132,3768098.9051271309],[13225612.214123132,3768788.9051271309],[13224342.214123132,3768808.9051271309],[13224342.214123132,3775340.9051271309],[13222332.214123132,3775340.9051271309]]]
            let polygon110Arr = [[[13232286.214123132,3776249.9050271306],[13232286.214123132,3766249.9049271308],[13215286.214023132,3766249.9049271308],[13215286.214023132,3776249.9050271306],[13232286.214123132,3776249.9050271306]],[[13219594.214123132,3774064.9051271309],[13219574.214123132,3766954.9051271309],[13222152.214123132,3766954.9051271309],[13222172.214123132,3774044.9051271309],[13219594.214123132,3774064.9051271309]]]
            let polygon1000Arr = [[[13232286.214123132,3776249.9050271306],[13232286.214123132,3766249.9049271308],[13215286.214023132,3766249.9049271308],[13215286.214023132,3776249.9050271306],[13232286.214123132,3776249.9050271306]],[[13216809.214123132,3775470.9051271309],[13216789.214123132,3767214.9051271309],[13219494.214123132,3767234.9051271309],[13219514.214123132,3775490.9051271309],[13216809.214123132,3775470.9051271309]]]
            let polygon220Arr = [[[13232286.214123132,3776249.9050271306],[13232286.214123132,3766249.9049271308],[13215286.214023132,3766249.9049271308],[13215286.214023132,3776249.9050271306],[13232286.214123132,3776249.9050271306]],[[13226522.214123132,3773627.9051271309],[13226522.214123132,3769797.9051271309],[13228012.214123132,3769797.9051271309],[13228012.214123132,3770537.9051271309],[13231342.214123132,3770537.9051271309],[13231342.214123132,3772957.9051271309],[13228012.214123132,3772957.9051271309],[13228012.214123132,3773627.9051271309],[13226522.214123132,3773627.9051271309]]]
            let polygon35Arr =[[[13232286.214123132,3776249.9050271306],[13232286.214123132,3766249.9049271308],[13215286.214023132,3766249.9049271308],[13215286.214023132,3776249.9050271306],[13232286.214123132,3776249.9050271306]],[[13224342.214123132,3775480.9051271309],[13224342.214123132,3768808.9051271309],[13226442.214123132,3768808.9051271309],[13226442.214123132,3775480.9051271309],[13224342.214123132,3775480.9051271309]]]
            if(this.kind == 500){
                polygon = new Polygon(polygon500Arr)
                this.mapTarget.getView().setCenter([118.788106,32.062603])
            }else if(this.kind == 110){
                polygon = new Polygon(polygon110Arr)
                this.mapTarget.getView().setCenter([118.765119,32.054787])
            }else if(this.kind == 1000){
                polygon = new Polygon(polygon1000Arr)
                this.mapTarget.getView().setCenter([118.740677,32.061241])
            }else if(this.kind == 220){
                polygon = new Polygon(polygon220Arr)
                this.mapTarget.getView().setCenter([118.835237,32.064143])
            }else if(this.kind == 35){
                polygon = new Polygon(polygon35Arr)
                this.mapTarget.getView().setCenter([118.805720,32.067273])
            }
            polygon.applyTransform(getTransform('EPSG:3857', 'EPSG:4326'))
            let feature = new Feature(polygon)
            this.vector.getSource().addFeature(feature)
        },
        addPointdList(arr){
            const that = this
            let style = new Style({
                image: new CircleStyle({
                    radius: 2,
                    fill: new Fill({
                        color: '#ff9000'
                    })
                })
            })
            arr.forEach((item,index)=>{
                let anchor = new Feature({
                    geometry: new Point(transform([item['xReal'],item['yReal']], 'EPSG:3857' ,'EPSG:4326'))
                })
                anchor.setStyle( style )
                anchor.setId(index)
                anchor.set('dataInfo', JSON.stringify(item))
                anchor.set('dataId', index)
                this.vector.getSource().addFeature(anchor)
                anchor.on('mousein',function (event) {
                if(that.mapTarget.getView().getZoom()>15) {
                    let item = JSON.parse(event.target.values_.dataInfo)
                    debugger
                    let anchor = new Feature({
                        geometry: new Point(transform([item['xReal'], item['yReal']], 'EPSG:3857', 'EPSG:4326'))
                    })
                    let text = new Text({
                        text: item['mainDevice'],
                        fill: new Fill({
                            color: 'red'
                        }),
                    })
                    text.setOffsetY(-6)
                    anchor.setStyle(new Style({
                        text: text
                    }));
                    anchor.setId('pointName')
                    that.vector.getSource().addFeature(anchor)
                    /*   let feature = that.vector.getSource().getFeatureById(event.target.values_.dataId)
                that.vector.getSource().removeFeature(feature)*/
                }
                })
            })
         /*   debugger
            arr.forEach((item, index)=>{
                let anchor = new Overlay({
                    element: document.getElementById('anchord'+index)
                });
                anchor.setPosition(transform([item['xReal'],item['yReal']], 'EPSG:3857' ,'EPSG:4326'));
                this.setZoom(anchor)
                that.pointListObj.push({anchor: anchor})
                that.mapTarget.addOverlay(anchor);
            })*/

        },
        isAlarm(){
            debugger
            if(!this.timer){
                this.mapTarget.getView().setCenter(transform([13218514.714, 3768404.705], 'EPSG:3857', 'EPSG:4326'))
                this.mapTarget.getView().setZoom(20)
            }
            this.addCircle(13218514.714, 3768404.705)
            if(!this.timer){
                this.timer = setInterval(()=>{
                    this.clearCircle()
                    setTimeout(()=>{
                        this.addCircle(13218514.714, 3768404.705)
                    },1000)
                },1500)
            }
        },
        clearAlarm(){
            clearInterval(this.timer)
            this.timer = null
            this.clearCircle()
        },
        clearCircle(){
            let feature = this.vector.getSource().getFeatureById('alarmBorder')
            this.vector.getSource().removeFeature(feature)
        },
        addCircle(xReal, yReal){
            const that = this
            let anchor = new Feature({
                geometry: new Point(transform([xReal, yReal], 'EPSG:3857', 'EPSG:4326'))
            })
            let sharp = new RegularShape({
                rotation: 40,
                points: 4,    // 顶点数
                radius: 40,    // 图形大小，单位为像素
                stroke: new Stroke({ // 设置边的样式
                    color: 'red',
                    size: 2
                })
            })
            anchor.setStyle(new Style({
                image: sharp
            }));
            anchor.setId('alarmBorder')
            that.vector.getSource().addFeature(anchor)
        },
        addPointList(arr){
            const that = this
            arr.forEach((item, index)=>{
                if(index == 14){
                    debugger
                }
                let anchor = new Overlay({
                    element: document.getElementById('anchor'+index)
                });
                if(that.isDiagram == 1){

                }else if(that.isDiagram == 3){
                    debugger
                    anchor.setPosition(transform([item['realX'],item['realY']], 'EPSG:3857' ,'EPSG:4326'));
                }else{
                    anchor.setPosition(transform([item['cadX'],item['cadY']], 'EPSG:3857' ,'EPSG:4326'));
                }
                this.setZoom(anchor)
                that.pointListObj.push({anchor: anchor})
                that.mapTarget.addOverlay(anchor);
            })
        },
        setPoint(){
            let anchor = new Overlay({
                element: document.getElementById('anchor')
            });
            anchor.setPosition([118.79129270,32.06046262]);
            this.setZoom(anchor)
            this.map.addOverlay(anchor)
        },
        setZoom(anchor){
            // 监听地图层级变化
            this.mapTarget.getView().on('change:resolution', function(){
                let element = anchor.element;
                // 重新设置图标的缩放率，基于层级10来做缩放
                console.log(Math.abs((this.getZoom() / 10))-0.5)
                element.style.transform = `scale(${Math.abs((this.getZoom() / 10))-0.5})`
            })
        },
        zeroPad(num,len,radix){
            let str = num.toString(radix || 10);
            while(str.length < len){
                str = "0"+ str;
            }
            return str;
        },
        initMap(){
            const that = this
            let mapcontainer = this.$refs.rootmap;
            this.source = new VectorSource();
            this.vector = new VectorLayer({
                source: this.source,
                style: new Style({
                   fill: new Fill({
                     color: '#142838'
                   }),
                }),
                renderBuffer: 8000
            });
            this.mapTarget = new Map({
                controls: defaultControls({

                }),
                target: "map",
                layers: [
                    new TileLayerd({
                        source: new XYZ({
                            wrapX: false,
                            tileUrlFunction: function(tileCoord) {
                                console.log(tileCoord + "---X=" + tileCoord[1] + "---Y=" + (-tileCoord[2]-1));
                                let x = 'C'+that.zeroPad(tileCoord[1],8,16);
                                let y = 'R'+that.zeroPad(-tileCoord[2]-1,8,16);
                                let z = 'L'+that.zeroPad(tileCoord[0],2,10);
                                return that.mapUrl+'/'+z+'/'+y+'/'+x+'.png';
                            },
                            projection: 'EPSG:3857'
                        }),
                    }),
                    that.vector
                ],
                view: new View({
                    center: [118.79129270,32.06046262],
                    projection: 'EPSG:4326',
                    zoom: 14,
                    minZoom: 13,
                    maxZoom: 19
                })
            });
            this.mapTarget.on('pointermove', function (event) {
                if(that.mapTarget.hasFeatureAtPixel(event.pixel)){
                    that.mapTarget.forEachFeatureAtPixel(event.pixel, function(feature){
                        // 为移动到的feature发送自定义的mousemove消息
                        feature.dispatchEvent({type: 'mousein'});
                    });
                }else{
                    let feature = that.vector.getSource().getFeatureById('pointName')
                    that.vector.getSource().removeFeature(feature)
                }
            })
        }
    },
    mounted(){
        this.initMap()
        this.initFeature()

    }
}
</script>

<style lang="scss">
 .gisMap{
    width: 100%;
    height: 100%;
 }
.anchorList{
    img{
        transform-origin:center;
        cursor: pointer;
        width: 30px;
        height: 30px;
    }
}
</style>
