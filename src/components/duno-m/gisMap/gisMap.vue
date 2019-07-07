<template>
    <div class="gisMap">
        <div id="map" ref="rootmap" style="height: 100%"></div>
        <div v-for="(item, index) in deviceList" class="anchorList" :id="'anchor'+index" ><img :src="item['src']" alt="示例锚点"/></div>
    </div>
</template>
<script>
import "ol/ol.css";
import { Map, View, Overlay, Feature } from "ol";
import  { Draw } from 'ol/interaction'
import Polygon from 'ol/geom/Polygon.js';
import { XYZ, TileImage } from "ol/source"
import { transform } from "ol/proj"
import { defaults  as defaultControls } from "ol/control"
import { createRegularPolygon, createBox } from 'ol/interaction/Draw.js'
import { Vector as VectorLayer, Tile as TileLayer } from "ol/layer"
import TileLayerd from "ol/layer/Tile";
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import { OSM, Vector as VectorSource } from "ol/source";
export default {
    name: 'gisMap',
    components: {  },
    data() {
        const that = this
        return {
            anchor: require('@/assets/anchor.png'),
            mapTarget: null,
            pointListObj: []
        }
    },
    watch: {
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
        }
    },
    props: {
        deviceList:{
            type: Array,
            default () {
                return []
            }
        },
        isDiagram:{
            type: Boolean,
            default: false
        }
    },
    computed: {

    },
    methods:{
        addPointList(arr){
            const that = this
            arr.forEach((item, index)=>{
                let anchor = new Overlay({
                    element: document.getElementById('anchor'+index)
                });
                debugger
                if(that.isDiagram){

                }else{
                    anchor.setPosition(transform([item['xAxis'],item['yAxis']], 'EPSG:3857' ,'EPSG:4326'));
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
            this.mapTarget = new Map({
                controls: defaultControls({
                    attribution: false,
                    rotate: false,
                    zoom: false
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
                                return 'http://52.82.107.5:8090/state_grid_map/'+z+'/'+y+'/'+x+'.png';
                            },
                            projection: 'EPSG:3857'
                        })
                    })
                ],
                view: new View({
                    center: [118.79129270,32.06046262],
                    projection: 'EPSG:4326',
                    zoom: 15,
                    minZoom: 13,
                    maxZoom: 19
                })
            });
        }
    },
    mounted(){
        this.initMap()
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
        width: 30px;
        height: 30px;
    }
}
</style>
