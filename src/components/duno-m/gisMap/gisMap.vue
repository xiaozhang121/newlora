<template>
    <div class="gisMap">
        <div id="map" ref="rootmap" style="height: 100%"></div>
        <div v-for="(item, index) in deviceList" @dragstart="drag($event, item)" :style="'transform:rotate('+ item['direct'] +'deg)'"  @click="toDeviced(item,index,null,1)" v-show="item['show']" class="anchorList" :id="'anchor'+index" ><img :src="item['src']" alt="示例锚点"/></div>
        <div v-for="(item, index) in powerPointList"  @click="toDeviced(item,index,null,1)"  class="anchorList" :id="'anchord'+index" ><img style="width: 5px ;height: 5px" :src="item['src']" alt="示例锚点"/></div>
        <!--<el-button v-if="boxSelect" type="primary" style="position: absolute;z-index: 999; top: 0; left: 90px" @click="startDraw('Box')">四边形</el-button>-->
        <a v-if="boxSelect" class="boxSelect" @click="startDraw('Box')">框选区域</a>
        <!--<div class="toolTip"></div>-->
    </div>
</template>
<script>
    import "ol/ol.css";
    import { LineString } from "ol/geom";
    import { Map, View, Overlay, Feature } from "ol";
    import {unByKey} from 'ol/Observable'
    import {boundingExtent,getCenter} from 'ol/extent'
    import Polygon from 'ol/geom/Polygon.js';
    import  { Draw, DragPan } from 'ol/interaction'
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
                EventList: [],
                lineColor: '#78cbff',
                isIn:false,
                rebotTimer: null,
                coverList:[{vectorLayer: null},{vectorLayer: null}],                   // 机器人线路
                drawList: [],
                drawListNum: 0,
                draw: null,
                typeSelect: 'None',
                isFirst: true,
                isClick: true,
                clickTarget: null,
                timer: null,
                timerd: null,
                robot: require('@/assets/buttonPng/robot.png'),
                anchor: require('@/assets/anchor.png'),
                mapTarget: null,
                pointListObj: [],
                vector: null,
                vectord: null,
                sourced: null,
                source: null,
                mapActive: true,
                clickPos: []
            }
        },
        watch: {
            mapActive(now){
                const that = this
                try{
                    let pan = that.getPan();
                    pan.setActive(now);
                }catch (e) {

                }
            },
            kind(now){
                if(!this.isFirst){
                    let feature = this.vector.getSource().getFeatures()
                    feature.forEach(item=>{
                        if(item['id_'] == null){
                            this.vector.getSource().removeFeature(item)
                        }
                    })
                    this.initFeature()
                }
            },
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
            polygonData: {
                type: Array,
                default: () => []
            },
            noZoomLimit:{
                type: Boolean,
                default: false
            },
            rebot:{
                type: Boolean,
                default: false
            },
            lineDash: {
                type: Array,
                default: () => []
            },
            boxSelect: {
                type: Boolean,
                default: false
            },
            small: {
                type: Boolean,
                default: false
            },
            zoom: {
                type: Number,
                default: 14
            },
            minZoom: {
                type: Number,
                default: 13
            },
            maxZoom:{
                type: Number,
                default: 19
            },
            fillColor: {
                type: String,
                default: '#142838'
            },
            controlBtn:{
                type: Boolean,
                default: true
            },
            powerPointList:{
                type: Array,
                default: () => []
            },
            mapUrl:{
                type: String,
                default: 'http://10.0.10.45:8201'
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
                type: [Number, String],
                default: 1
            }
        },
        computed: {

        },
        methods:{
            getPan() {
                let pan;
                this.mapTarget.getInteractions().forEach(function(element, index, array) {
                    if(element instanceof DragPan) {
                        pan = element;
                    }
                })
                return pan;
            },
            setPosition(obj, x, y){
                let item = obj.get('pointInfo')
                let anchor = new Overlay({
                    element: document.getElementById('anchor'+ item['s_index']),
                    offset: item['s_offset']
                });
                if(x > 1000)
                    anchor.setPosition(transform([x,y], 'EPSG:3857' ,'EPSG:4326'));
                else
                    anchor.setPosition([x, y]);
                anchor.set('pointInfo',item)
                this.mapTarget.removeOverlay(obj)
                this.setZoom(anchor)
                // this.pointListObj.push({anchor: anchor})
                this.mapTarget.addOverlay(anchor);
                // obj.setPosition(transform([x, y], 'EPSG:3857', 'EPSG:4326'))
            },
            setOverlayPos({cadX, cadY}){
                this.mapTarget.getOverlays().array_[0].setPosition(transform([cadX, cadY], 'EPSG:3857', 'EPSG:4326'))
            },
            // 清除覆盖物
            rmCover(coverItem) {
                if (!this.mapTarget) {
                    return;
                }
                this.mapTarget.removeOverlay(coverItem);
            },
            // 设置线条
            setLine(arr, type, lineColor, lineWidth, info) {
                if (!arr || !arr.length) {
                    return;
                }
                let that = this;
                //线要素
                let lineFeature = new Feature(new LineString(arr));

                lineFeature.set('lineInfo', info)
                lineFeature.set('type', 'line')

                //实例化一个矢量图层Vector作为绘制层
                let source = new VectorSource({
                    features: [lineFeature]
                });
                // 用于设置线串所在的矢量图层样式的函数
                let styleFunction = function(feature) {
                    let geometry = feature.getGeometry();
                    let width  = 0
                    if(type[0] == 10){
                        width = 2
                    }else{
                        width =  4
                    }
                    if(lineColor){
                        that.lineColor = lineColor
                    }else{
                        that.lineColor = '#78cbff'
                    }

                    if(lineWidth){
                        width = lineWidth
                    }

                    let styles = [
                        new Style({
                            // 线串的样式
                            stroke: new Stroke({
                                lineDash: type,
                                color: that.lineColor,
                                width: width
                            })
                        })
                    ];
                    return styles;
                };
                let vectorLayer = new VectorLayer({
                    source: source,
                    style: styleFunction,
                    renderBuffer: 8000
                });
                return vectorLayer;
            },
            // 绘制线条
            drawLine(vectorLayer) {
                if (!vectorLayer || !this.mapTarget) {
                    return;
                }
                //将绘制层添加到地图容器中
                this.mapTarget.addLayer(vectorLayer);
            },
            // 去除指定router
            removeChosenLine(index){
                this.removeLine(this.coverList[index].vectorLayer)
            },
            // 删除线条
            removeLine(vectorLayer) {
                if (!vectorLayer || !this.mapTarget) {
                    return;
                }
                this.mapTarget.removeLayer(vectorLayer);
            },
            // 线条设置以及绘制操作
            setDrawLine(vectorLayer, index, type, lineColor, lineWidth, info) {
                vectorLayer.map((item, index)=>{
                    vectorLayer[index] = transform(item, 'EPSG:3857', 'EPSG:4326')
                })
                // 设置线条
                vectorLayer = this.setLine(vectorLayer, type, lineColor, lineWidth, info);

                // 绘制线条
                this.drawLine(vectorLayer);
                // 保存线条对象
                this.coverList[index].vectorLayer = vectorLayer;
            },
            removeLineList(arr) {
                let that = this;
                arr.forEach((item, index) => {
                    if (item.vectorLayer) that.removeLine(item.vectorLayer);
                });
            },
            addInteraction(){
                const that = this
                let value = this.typeSelect;
                let geometryFunction = null
                if (value == 'None') {
                    return;
                }else if(value == 'Square'){
                    geometryFunction = createRegularPolygon(4);
                }else if(value === 'Box'){
                    geometryFunction = createBox();
                }else if(value == 'Star'){
                    geometryFunction = function(coordinates, geometry) {
                        let center = coordinates[0];
                        let last = coordinates[1];
                        let dx = center[0] - last[0];
                        let dy = center[1] - last[1];
                        let radius = Math.sqrt(dx * dx + dy * dy);
                        let rotation = Math.atan2(dy, dx);
                        let newCoordinates = [];
                        let numPoints = 12;
                        for (let i = 0; i < numPoints; ++i) {
                            let angle = rotation + i * 2 * Math.PI / numPoints;
                            let fraction = i % 2 === 0 ? 1 : 0.5;
                            let offsetX = radius * fraction * Math.cos(angle);
                            let offsetY = radius * fraction * Math.sin(angle);
                            newCoordinates.push([center[0] + offsetX, center[1] + offsetY]);
                        }
                        newCoordinates.push(newCoordinates[0].slice());
                        if (!geometry) {
                            geometry = new Polygon([newCoordinates]);
                        } else {
                            geometry.setCoordinates([newCoordinates]);
                        }
                        return geometry;
                    };
                }
                this.draw = new Draw({
                    source: this.sourced,
                    style: new Style({
                        fill: new Fill({
                            color: 'transparent'
                        }),
                        stroke: new Stroke({
                            color: '#ff9000',
                            width: 2
                        }),
                        image:new CircleStyle({
                            radius: 5,
                            fill: new Fill({
                                color: '#ff9000'
                            })
                        })
                    }),
                    type: this.typeSelect,
                    freehand: true,
                    geometryFunction: geometryFunction
                });

                this.mapTarget.addInteraction(this.draw);
                this.draw.on('drawend', function (evt) {
                    let id = that.drawList.length
                    if(id-1 > that.drawListNum){
                        that.drawListNum = id
                    }else{
                        id = ++that.drawListNum
                    }
                    evt.feature.setId(id);
                    console.log(id)
                    that.drawList.push({number: id, value:[], options: []})
                    let polygon = evt.feature.getGeometry();
                    that.addNumber(polygon.flatCoordinates[6],polygon.flatCoordinates[7], id)
                    // alert(that.insidePolygon(polygon.getCoordinates(), [118.79129270,32.06046262]))
                    that.containPoint(polygon, that.drawList.length-1)
                    // alert(polygon.intersectsExtent([118.79129270,32.06046262]))   // 是否包含该点位
                    setTimeout(function(){              //如果不设置延迟，范围内要素选中后自动取消选中，具体原因不知道
                        that.startDraw('None')
                    },300)
                    that.$emit('on-draw', that.drawList)
                })
            },
            containPoint(polygon, index){
                let arr = []
                this.powerPointList.forEach(item=>{
                    if(polygon.intersectsExtent(transform([item['xReal'],item['yReal']], 'EPSG:3857', 'EPSG:4326'))){
                        arr.push(item)
                    }
                })
                let value = []
                arr.forEach((item)=>{
                    value.push(item['deviceIdStr'])
                })
                this.drawList[index]['value'] = value
                this.drawList[index]['options'] = arr
            },
            removeArea(id){
                const that = this
                let feature = that.vectord.getSource().getFeatureById(id)
                that.vectord.getSource().removeFeature(feature)
            },
            removeItem(id){
                this.removeArea(id)
                this.removeArea('text'+id)
                let indexd = ''
                this.drawList.forEach((item, index)=>{
                    if(item['number'] == id){
                        indexd = index
                    }
                })
                this.drawList.splice(indexd, 1)
            },
            addNumber(xReal, yReal, id){
                const that = this
                let padding = [4,7,4,7]
                if(id > 9){
                    padding = [4,4,4,4]
                }
                let sharp = new Text({
                    rotation: 0,
                    text: id+'',
                    fill: new Fill({
                        color: 'white'
                    }),
                    padding: padding,
                    backgroundFill: new Fill({
                        color: '#ff9000'
                    }),
                })
                sharp.setOffsetY(10)
                sharp.setOffsetX(-10)
                let style = new Style({
                    text: sharp,
                })
                let anchor = new Feature({
                    geometry: new Point([xReal, yReal]),
                })
                anchor.setId('text'+id)
                anchor.setStyle(style)
                this.vectord.getSource().addFeature(anchor)
            },
            startDraw(kind){
                this.mapTarget.removeInteraction(this.draw);
                this.typeSelect = kind
                this.addInteraction()
            },
            drag(event, item){
                this.$emit('on-drag',event,item)
            },
            toDeviced(item,index,flag){
                if(this.isClick){
                    if('monitorDeviceType' in item && item['monitorDeviceType'] == 4){
                        this.$router.push({
                            path:'/surveillancePath/ballControlM',
                            query:{
                                monitorDeviceId: item['monitorDeviceId']
                            }
                        })
                    }else{
                        this.$emit('toDetail',item,index,null,1)
                    }
                }
            },
            initFeature(){
                try {
                    let polygon = null
                    if(this.isDiagram != 1){
                        var polygon500Arr = [[[13232286.214123132,3776249.9050271306],[13232286.214123132,3766249.9049271308],[13215286.214023132,3766249.9049271308],[13215286.214023132,3776249.9050271306],[13232286.214123132,3776249.9050271306]],[[13222332.214123132,3775340.9051271309],[13222332.214123132,3768098.9051271309],[13225612.214123132,3768098.9051271309],[13225612.214123132,3768788.9051271309],[13224342.214123132,3768808.9051271309],[13224342.214123132,3775340.9051271309],[13222332.214123132,3775340.9051271309]]]
                        var polygon110Arr = [[[13232286.214123132,3776249.9050271306],[13232286.214123132,3766249.9049271308],[13215286.214023132,3766249.9049271308],[13215286.214023132,3776249.9050271306],[13232286.214123132,3776249.9050271306]],[[13219594.214123132,3774064.9051271309],[13219574.214123132,3766954.9051271309],[13222152.214123132,3766954.9051271309],[13222172.214123132,3774044.9051271309],[13219594.214123132,3774064.9051271309]]]
                        var polygon1000Arr = [[[13232286.214123132,3776249.9050271306],[13232286.214123132,3766249.9049271308],[13215286.214023132,3766249.9049271308],[13215286.214023132,3776249.9050271306],[13232286.214123132,3776249.9050271306]],[[13216809.214123132,3775470.9051271309],[13216789.214123132,3767214.9051271309],[13219494.214123132,3767234.9051271309],[13219514.214123132,3775490.9051271309],[13216809.214123132,3775470.9051271309]]]
                        var polygon220Arr = [[[13232286.214123132,3776249.9050271306],[13232286.214123132,3766249.9049271308],[13215286.214023132,3766249.9049271308],[13215286.214023132,3776249.9050271306],[13232286.214123132,3776249.9050271306]],[[13226522.214123132,3773627.9051271309],[13226522.214123132,3769797.9051271309],[13228012.214123132,3769797.9051271309],[13228012.214123132,3770537.9051271309],[13231342.214123132,3770537.9051271309],[13231342.214123132,3772957.9051271309],[13228012.214123132,3772957.9051271309],[13228012.214123132,3773627.9051271309],[13226522.214123132,3773627.9051271309]]]
                        var polygon35Arr =[[[13232286.214123132,3776249.9050271306],[13232286.214123132,3766249.9049271308],[13215286.214023132,3766249.9049271308],[13215286.214023132,3776249.9050271306],[13232286.214123132,3776249.9050271306]],[[13224342.214123132,3775480.9051271309],[13224342.214123132,3768808.9051271309],[13226442.214123132,3768808.9051271309],[13226442.214123132,3775480.9051271309],[13224342.214123132,3775480.9051271309]]]
                        var polygon10Arr = []
                    }else{
                        var polygon1000Arr = [
                            [
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ]
                            ],
                            [
                                [
                                    13228937.214023132,
                                    3773996.9049271308
                                ],
                                [
                                    13228937.214023132,
                                    3769154.9049271308
                                ],
                                [
                                    13228999.214023132,
                                    3769154.9049271308
                                ],
                                [
                                    13232082.214023132,
                                    3769154.9049271308
                                ],
                                [
                                    13232082.214023132,
                                    3774100.9049271308
                                ],
                                [
                                    13228937.214023132,
                                    3774100.9049271308
                                ],
                                [
                                    13228937.214023132,
                                    3773996.9049271308
                                ]
                            ]
                        ]
                        var polygon500Arr = [
                            [
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ]
                            ],
                            [
                                [
                                    13223286.214023132,
                                    3768664.9049271308
                                ],
                                [
                                    13223286.214023132,
                                    3768471.9049271308
                                ],
                                [
                                    13223528.214023132,
                                    3768471.9049271308
                                ],
                                [
                                    13226283.214023132,
                                    3768471.9049271308
                                ],
                                [
                                    13226283.214023132,
                                    3768577.9049271308
                                ],
                                [
                                    13226283.214023132,
                                    3769697.9049271308
                                ],
                                [
                                    13226283.214023132,
                                    3769871.9049271308
                                ],
                                [
                                    13226457.214023132,
                                    3769871.9049271308
                                ],
                                [
                                    13226578.214023132,
                                    3769871.9049271308
                                ],
                                [
                                    13226578.214023132,
                                    3770545.9049271308
                                ],
                                [
                                    13226457.214023132,
                                    3770545.9049271308
                                ],
                                [
                                    13226457.214023132,
                                    3773631.9049271308
                                ],
                                [
                                    13223286.214023132,
                                    3773631.9049271308
                                ],
                                [
                                    13223286.214023132,
                                    3773182.9049271308
                                ],
                                [
                                    13223286.214023132,
                                    3768664.9049271308
                                ]
                            ]
                        ]
                        var polygon220Arr = [
                            [
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ]
                            ],
                            [
                                [
                                    13218997.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13218997.214023132,
                                    3771882.9049271308
                                ],
                                [
                                    13218007.214023132,
                                    3771882.9049271308
                                ],
                                [
                                    13218007.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13217844.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13215853.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13215853.214023132,
                                    3769236.9049271308
                                ],
                                [
                                    13220572.214023132,
                                    3769236.9049271308
                                ],
                                [
                                    13220612.214023132,
                                    3769236.9049271308
                                ],
                                [
                                    13220612.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13220572.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13219799.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13218997.214023132,
                                    3772568.9049271308
                                ]
                            ]
                        ]
                        var polygon110Arr = [
                            [
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ]
                            ],
                            [
                                [
                                    13226283.214023132,
                                    3769697.9049271308
                                ],
                                [
                                    13226283.214023132,
                                    3768577.9049271308
                                ],
                                [
                                    13228999.214023132,
                                    3768577.9049271308
                                ],
                                [
                                    13228999.214023132,
                                    3769154.9049271308
                                ],
                                [
                                    13228999.214023132,
                                    3773996.9049271308
                                ],
                                [
                                    13228937.214023132,
                                    3773996.9049271308
                                ],
                                [
                                    13226457.214023132,
                                    3773996.9049271308
                                ],
                                [
                                    13226457.214023132,
                                    3773631.9049271308
                                ],
                                [
                                    13226457.214023132,
                                    3770545.9049271308
                                ],
                                [
                                    13226457.214023132,
                                    3769871.9049271308
                                ],
                                [
                                    13226457.214023132,
                                    3769697.9049271308
                                ],
                                [
                                    13226283.214023132,
                                    3769697.9049271308
                                ]
                            ]
                        ]
                        var polygon35Arr = [
                            [
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ]
                            ],
                            [
                                [
                                    13220572.214023132,
                                    3773182.9049271308
                                ],
                                [
                                    13220572.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13220612.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13220612.214023132,
                                    3769236.9049271308
                                ],
                                [
                                    13220572.214023132,
                                    3769236.9049271308
                                ],
                                [
                                    13220572.214023132,
                                    3768223.9049271308
                                ],
                                [
                                    13223528.214023132,
                                    3768223.9049271308
                                ],
                                [
                                    13223528.214023132,
                                    3768471.9049271308
                                ],
                                [
                                    13223528.214023132,
                                    3768664.9049271308
                                ],
                                [
                                    13223286.214023132,
                                    3768664.9049271308
                                ],
                                [
                                    13223286.214023132,
                                    3773182.9049271308
                                ],
                                [
                                    13220572.214023132,
                                    3773182.9049271308
                                ]
                            ]
                        ]
                        var polygon10Arr = [
                            [
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3766249.9049271308
                                ],
                                [
                                    13215286.214023132,
                                    3776249.9050271306
                                ],
                                [
                                    13232286.214123132,
                                    3776249.9050271306
                                ]
                            ],
                            [
                                [
                                    13217844.214023132,
                                    3774402.9049271308
                                ],
                                [
                                    13217844.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13218007.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13218176.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13218176.214023132,
                                    3772232.9049271308
                                ],
                                [
                                    13218595.214023132,
                                    3772232.9049271308
                                ],
                                [
                                    13218570.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13218997.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13219799.214023132,
                                    3772568.9049271308
                                ],
                                [
                                    13219799.214023132,
                                    3774402.9049271308
                                ],
                                [
                                    13217844.214023132,
                                    3774402.9049271308
                                ]
                            ]
                        ]
                    }
                    if(this.kind == 500){
                        polygon = new Polygon(polygon500Arr)
                        if(this.isDiagram != 1)
                            this.mapTarget.getView().setCenter([118.788106,32.062603])
                        else
                            this.setCenterMap(polygon500Arr)
                    }else if(this.kind == 110){
                        polygon = new Polygon(polygon110Arr)
                        if(this.isDiagram != 1)
                            this.mapTarget.getView().setCenter([118.765119,32.054787])
                        else
                            this.setCenterMap(polygon110Arr)
                    }else if(this.kind == 1000){
                        polygon = new Polygon(polygon1000Arr)
                        if(this.isDiagram != 1)
                            this.mapTarget.getView().setCenter([118.740677,32.061241])
                        else
                            this.setCenterMap(polygon1000Arr)
                    }else if(this.kind == 220){
                        polygon = new Polygon(polygon220Arr)
                        if(this.isDiagram != 1)
                            this.mapTarget.getView().setCenter([118.835237,32.064143])
                        else
                            this.setCenterMap(polygon220Arr)
                    }else if(this.kind == 35){
                        polygon = new Polygon(polygon35Arr)
                        if(this.isDiagram != 1)
                            this.mapTarget.getView().setCenter([118.805720,32.067273])
                        else
                            this.setCenterMap(polygon35Arr)
                    }else if(this.kind == 10){
                        polygon = new Polygon(polygon10Arr)
                        if(this.isDiagram != 1)
                            this.mapTarget.getView().setCenter(transform([13223786.214039,3771249.904943], 'EPSG:3857' ,'EPSG:4326'))
                        else{
                            this.setCenterMap(polygon10Arr)
                            this.mapTarget.getView().setZoom(15)
                        }
                    }
                    if(this.polygonData.length){
                        polygon = new Polygon(this.polygonData)
                    }
                    polygon.applyTransform(getTransform('EPSG:3857', 'EPSG:4326'))
                    let feature = new Feature(polygon)
                    this.vector.getSource().addFeature(feature)
                } catch (err) {}
            },
            setCenterMap(arr){
                let x = 0
                let y = 0
                let count = 0
                arr[1].forEach(item=>{
                    count++
                    x += item[0]
                    y += item[1]
                })
                x = x / count
                y = y / count
                this.mapTarget.getView().setCenter(transform([x,y], 'EPSG:3857' ,'EPSG:4326'))
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
                    let anchor = null
                    if(that.isDiagram == 1){
                        if(that.kind == ''){
                            anchor = new Feature({
                                geometry: new Point(transform([item['xLoc'],item['yLoc']], 'EPSG:3857' ,'EPSG:4326'))
                            })
                        }else{
                            anchor = new Feature({
                                geometry: new Point(transform([item['xLocReverse'],item['yLocReverse']], 'EPSG:3857' ,'EPSG:4326'))
                            })
                        }
                    }else{
                        anchor = new Feature({
                            geometry: new Point(transform([item['xReal'],item['yReal']], 'EPSG:3857' ,'EPSG:4326'))
                        })
                    }
                    anchor.setStyle( style )
                    anchor.setId(index)
                    anchor.set('dataInfo', JSON.stringify(item))
                    anchor.set('dataFlag', '1')
                    anchor.set('dataId', index)
                    this.vector.getSource().addFeature(anchor)
                    anchor.on('mousein',function (event) {
                        that.isIn = true
                        if(event.target.values_.dataFlag == 1 && (that.mapTarget.getView().getZoom()>15 || that.isDiagram == 1 || that.noZoomLimit)) {
                            let item = JSON.parse(event.target.values_.dataInfo)
                            that.clickTarget = item
                            let anchor = null
                            if(that.isDiagram == 1){
                                if(that.kind == ''){
                                    anchor = new Feature({
                                        geometry: new Point(transform([item['xLoc'],item['yLoc']], 'EPSG:3857' ,'EPSG:4326'))
                                    })
                                }else{
                                    anchor = new Feature({
                                        geometry: new Point(transform([item['xLocReverse'],item['yLocReverse']], 'EPSG:3857' ,'EPSG:4326'))
                                    })
                                }
                            }else{
                                anchor = new Feature({
                                    geometry: new Point(transform([item['xReal'], item['yReal']], 'EPSG:3857', 'EPSG:4326'))
                                })
                            }
                            let text = new Text({
                                scale: 2,
                                text: item['deviceName'],
                                fill: new Fill({
                                    color: 'red'
                                }),
                            })
                            text.setOffsetY(-10)
                            anchor.setStyle(new Style({
                                text: text,
                                zIndex: 99,
                            }));
                            anchor.setId('pointName')
                            that.vector.getSource().addFeature(anchor)
                            /*   let feature = that.vector.getSource().getFeatureById(event.target.values_.dataId)
                        that.vector.getSource().removeFeature(feature)*/
                        }else{
                            let feature = that.vector.getSource().getFeatureById('pointName')
                            that.vector.getSource().removeFeature(feature)
                            that.clickTarget = null
                        }
                    })
                })
                /* arr.forEach((item, index)=>{
                       let anchor = new Overlay({
                           element: document.getElementById('anchord'+index)
                       });
                       anchor.setPosition(transform([item['xReal'],item['yReal']], 'EPSG:3857' ,'EPSG:4326'));
                       this.setZoom(anchor)
                       that.pointListObj.push({anchor: anchor})
                       that.mapTarget.addOverlay(anchor);
                   })*/

            },
            findPoint(point){
                let deviceId =  'deviceIdStr' in  point?point['deviceIdStr']:point.powerDeviceId
                if(this.isDiagram == 1){
                    for(let i=0; i<this.powerPointList.length; i++){
                        if(this.powerPointList[i].deviceId == deviceId){
                            return this.powerPointList[i]
                        }
                        for(let j=0; j<this.powerPointList[i].childDevice.length; j++){
                            if(this.powerPointList[i].childDevice[j] == deviceId)
                                return this.powerPointList[i]
                        }
                    }
                }
                for(let i=0; i<this.powerPointList.length; i++){
                    if(this.powerPointList[i].deviceId == deviceId){
                        return this.powerPointList[i]
                    }
                }
            },
            setCenter({cadX, cadY, flag}){
                if(flag){
                    this.mapTarget.getView().setCenter([cadX, cadY])
                }else
                    this.mapTarget.getView().setCenter(transform([cadX, cadY], 'EPSG:3857', 'EPSG:4326'))
            },
            isAlarm(point){
                let data = this.findPoint(point)
                let pointX = ''
                let pointY = ''
                if(this.isDiagram == 1) {
                    if(this.kind == ''){
                        pointX = data['xLoc']
                        pointY = data['yLoc']
                    }else{
                        pointX = data['xLocReverse']
                        pointY = data['yLocReverse']
                    }
                }else{
                    pointX = data['xReal']
                    pointY = data['yReal']
                }
                if(point['alarmConfig'] != 3){
                    try{
                        this.clearAlarm()
                    }catch (e) {

                    }
                    if(!this.timer){
                        this.mapTarget.getView().setCenter(transform([pointX, pointY], 'EPSG:3857', 'EPSG:4326'))
                        this.mapTarget.getView().setZoom(20)
                    }
                    this.addCircle(pointX, pointY)
                    if(!this.timer){
                        this.timer = setInterval(()=>{
                            this.clearCircle()
                            this.timerd = setTimeout(()=>{
                                this.addCircle(pointX, pointY)
                            },500)
                        },1000)
                    }
                    this.$emit('on-alarm',data)
                }
            },
            clearAlarm(){
                clearInterval(this.timer)
                clearTimeout(this.timerd)
                this.timer = null
                this.timerd = null
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
                    rotation: 0.78,
                    points: 4,    // 顶点数
                    radius: 40,    // 图形大小，单位为像素
                    stroke: new Stroke({ // 设置边的样式
                        color: 'red',
                        width: 2
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
                    }
                    let offset = []
                    if(that.rebot){
                        offset = [-20, -20]
                    }else{
                        offset = [0, 0]
                    }
                    if(item['monitorDeviceType'] == 4)
                        offset = [-15, -15]
                    let anchor = new Overlay({
                        element: document.getElementById('anchor'+index),
                        offset: offset
                    });
                    if(that.rebot){
                        /* that.rebotTimer = setInterval(()=>{
                             if(document.getElementById('anchor'+index).style.display == 'none'){
                                 document.getElementById('anchor'+index).style.display == 'block'
                             }else{
                                 document.getElementById('anchor'+index).style.display == 'none'
                             }
                         },500)*/
                    }
                    if(that.isDiagram == 1){

                    }else if(that.isDiagram == 3){
                        if(!item['realX']){
                            item['realX'] = ''
                        }
                        if(!item['realY']){
                            item['realY'] = ''
                        }
                        anchor.setPosition(transform([item['realX'],item['realY']], 'EPSG:3857' ,'EPSG:4326'));
                    }else{
                        if(!item['cadX']){
                            item['cadX'] = ''
                        }
                        if(!item['cadY']){
                            item['cadY'] = ''
                        }
                        anchor.setPosition(transform([item['cadX'],item['cadY']], 'EPSG:3857' ,'EPSG:4326'));
                    }
                    item['s_index'] = index
                    item['s_offset'] = offset
                    anchor.set('pointInfo',item)
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
                this.EventList[5] = this.mapTarget.getView().on('change:resolution', function(){
                    /*  let element = anchor.element;
                      // 重新设置图标的缩放率，基于层级10来做缩放
                      // console.log(Math.abs((this.getZoom() / 10))-0.5)
                      element.style.transform = `scale(${Math.abs((this.getZoom() / 10))-0.5})`*/
                })
            },
            zeroPad(num,len,radix){
                let str = num.toString(radix || 10);
                while(str.length < len){
                    str = "0"+ str;
                }
                return str;
            },
            dropOverlay(){
                const that = this
                let data = that.pointListObj
                data.map(item=>{
                    item['stopEvent'] = true
                })
                that.pointListObj = data
            },
            stopEventOverlay(){
                const that = this
                let data = that.pointListObj
                data.map(item=>{
                    item['stopEvent'] = false
                })
                that.pointListObj = data
            },
            bindEvent(){
                const that = this
                this.$refs.rootmap.addEventListener('click',function () {
                    if(that.clickTarget && that.isDiagram == 1){
                        that.$emit('toDetail', that.clickTarget,1,null,1)
                        console.log(that.clickTarget)
                    }
                    if(that.clickTarget && that.isDiagram != 1){
                        that.$emit('toDetail', that.clickTarget,1,null,1)
                    }
                })
            },
            clearTextLabel(){
                const that = this
                try{
                    let feature = that.vector.getSource().getFeatureById('pointName')
                    that.vector.getSource().removeFeature(feature)
                    that.clickTarget = null
                }catch (e) {

                }
            },
            initMap(){
                const that = this
                let mapcontainer = this.$refs.rootmap;
                this.source = new VectorSource();
                this.vector = new VectorLayer({
                    source: this.source,
                    style: new Style({
                        fill: new Fill({
                            color: that.fillColor
                        }),
                    }),
                    renderBuffer: 8000
                });
                this.sourced = new VectorSource();
                this.vectord = new VectorLayer({
                    source: this.sourced,
                    style: new Style({
                        fill: new Fill({
                            color: 'transparent'
                        }),
                        stroke: new Stroke({
                            color: '#ff9000',
                            width: 2
                        }),
                        image:new CircleStyle({
                            radius: 5,
                            fill: new Fill({
                                color: '#ff9000'
                            })
                        })
                    })
                });
                this.EventList[4] = this.mapTarget = new Map({
                    controls: defaultControls({
                        attribution: that.controlBtn,
                        rotate: that.controlBtn,
                        zoom: that.controlBtn
                    }),
                    target: "map",
                    layers: [
                        new TileLayerd({
                            source: new XYZ({
                                wrapX: false,
                                tileUrlFunction: function(tileCoord) {
                                    // console.log(tileCoord + "---X=" + tileCoord[1] + "---Y=" + (-tileCoord[2]-1));
                                    let x = 'C'+that.zeroPad(tileCoord[1],8,16);
                                    let y = 'R'+that.zeroPad(-tileCoord[2]-1,8,16);
                                    let z = 'L'+that.zeroPad(tileCoord[0],2,10);
                                    return that.mapUrl+'/'+z+'/'+y+'/'+x+'.png';
                                },
                                projection: 'EPSG:3857'
                            }),
                        }),
                        that.vectord,
                        that.vector
                    ],
                    view: new View({
                        center: [118.79129270,32.06046262],
                        projection: 'EPSG:4326',
                        zoom: that.zoom,
                        minZoom: that.minZoom,
                        maxZoom: that.maxZoom
                    })
                });
                this.EventList[3] = this.mapTarget.on('pointermove', function (event) {
                    let pixel = that.mapTarget.getEventPixel(event.originalEvent)
                    let feature = that.mapTarget.forEachFeatureAtPixel(pixel, function(feature) {
                        return feature;
                    });
                    try{
                        if(feature.get('type') == 'line'){
                            $('.toolTip').css({
                                left: (pixel[0] + 15 ) + 'px',
                                top: (pixel[1] - 15 ) + 'px'
                            })
                            $('.toolTip').show()
                            feature.get('lineInfo')
                        }else{
                            $('.toolTip').hide();
                        }
                    }catch (e) {}

                    if(that.isIn){
                        that.clearTextLabel()
                    }
                    if(that.mapTarget.hasFeatureAtPixel(event.pixel)){
                        that.mapTarget.forEachFeatureAtPixel(event.pixel, function(feature){
                            // 为移动到的feature发送自定义的mousemove消息
                            feature.dispatchEvent({type: 'mousein'});
                        });
                    }else{
                        that.isIn = false
                        that.clearTextLabel()
                    }
                })
                this.EventList[2] = this.mapTarget.on('movestart', function (evt) {
                    that.isClick = false
                });
                this.EventList[1] = this.mapTarget.on('moveend', function (evt) {
                    that.isClick = true
                });
                // 禁止鼠标拖动
                let pan = that.getPan();
                //false：当前地图不可拖动。true：可拖动
                pan.setActive(that.mapActive);

                this.EventList[0] = this.mapTarget.on('click', function (evt) {
                     // alert(transform([evt.coordinate[0],evt.coordinate[1]], 'EPSG:4326' ,'EPSG:3857'))
                    that.clickPos = transform([evt.coordinate[0],evt.coordinate[1]], 'EPSG:4326' ,'EPSG:3857')
                 })
                this.addInteraction()
                setTimeout(()=>{
                    // this.dropOverlay()
                },10000)
            },
            clearAllEvent(){
                this.EventList.forEach(item=>{
                    unByKey(item)
                })
            }
        },
        mounted(){
            /* this.isFirst = false
             this.initMap()
             this.initFeature()
             this.bindEvent()*/
            if(!this.small){
                this.initMap()
            }
            this.$nextTick(()=>{
                if(this.small){
                    this.initMap()
                }
                if(this.deviceList.length)
                    this.addPointList(this.deviceList)
                this.isFirst = false
                this.initFeature()
                this.bindEvent()
            })
        },
        beforeDestroy(){
            this.mapTarget.getOverlays().clear()
            this.clearAllEvent()
        }
    }
</script>

<style lang="scss">
    .gisMap{
        width: 100%;
        height: 100%;
        position: relative;
        .toolTip{
            width: 100px;
            height: 100px;
            background: pink;
            position: absolute;
        }
        .boxSelect{
            color: #e5e5e5;
            background: rgba(255, 144, 0, 0.5);
            width: 80px;
            height: 32px;
            position: absolute;
            text-align: center;
            line-height: 31px;
            left: 18px;
            bottom: 30px;
        }
        #map{
            height: calc( 100vh - 166px ) !important;
        }
    }
    .anchorList{
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        img{
            transform-origin:center;
            cursor: pointer;
            width: 30px !important;
            height: 30px !important;
        }
    }
</style>
