<template>
    <div class="echartMap">
        <div ref="dom" class="charts"></div>
    </div>
</template>

<script>
    import echarts from 'echarts'
    import { DunoChartPieLoop } from "_c/duno-charts/index";
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    import { getRecode } from "@/api/configuration/configuration.js";
    export default {
        name: "echartMap",
        components: {

        },
        computed: {

        },
        watch: {

        },
        data() {
            const that = this;
            return {
                dom: null,
                geoCoordMap: require('@/views/communal/abnormalInfo/components/geoCoordMap.json'),
                BJData: [
                    [{name:'北京'}, {name:'上海公司', info:'dsfsdfsdf',value:95}],
                ],
                SHData:[
                    [{name:'上海'},{name:'包头',value:95}],
                    [{name:'上海'},{name:'昆明',value:90}],
                    [{name:'上海'},{name:'广州',value:80}],
                    [{name:'上海'},{name:'郑州',value:70}],
                    [{name:'上海'},{name:'长春',value:60}],
                    [{name:'上海'},{name:'重庆',value:50}],
                    [{name:'上海'},{name:'长沙',value:40}],
                    [{name:'上海'},{name:'北京',value:30}],
                    [{name:'上海'},{name:'丹东',value:20}],
                    [{name:'上海'},{name:'大连',value:10}]
                ],
                color: ['#a6c84c', '#ffa022', '#46bee9'],
                series: [],
                option: {}
            };
        },
        created() {

        },
        methods: {
            convertData(data){
                let res = [];
                for (let i = 0; i < data.length; i++) {
                    let dataItem = data[i];
                    let fromCoord = geoCoordMap[dataItem[0].name];
                    let toCoord = geoCoordMap[dataItem[1].name];
                    if (fromCoord && toCoord) {
                        res.push({
                            fromName: dataItem[0].name,
                            toName: dataItem[1].name,
                            coords: [fromCoord, toCoord]
                        });
                    }
                }
                return res;
            },
            initData(){
                const that = this
                [['28456465', that.BJData, '213123']].forEach(function (item, i) {
                    that.series.push({
                            name: item[0],
                            type: 'lines',
                            zlevel: 1,
                            effect: {
                                show: true,
                                period: 6,
                                trailLength: 0.7,
                                color: '#fff',
                                symbolSize: 3
                            },
                            lineStyle: {
                                normal: {
                                    color: color[i],
                                    width: 0,
                                    curveness: 0
                                }
                            },
                            data: that.convertData(item[1])
                        },
                        {
                            name: item[0],
                            type: 'lines',

                            lineStyle: {
                                normal: {
                                    color: color[i],
                                    width: 1,
                                    opacity: 0.6,
                                    curveness: 0
                                }
                            },
                            data: that.convertData(item[1])
                        },
                        {
                            name: item[0] + ' Top10',
                            type: 'effectScatter',
                            coordinateSystem: 'geo',
                            zlevel: 2,
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    formatter: '{b}'
                                }
                            },
                            symbolSize: function (val) {
                                return val[2] / 8;
                            },
                            itemStyle: {
                                normal: {
                                    color: color[i]
                                }
                            },
                            data: that.SHData.map(function (dataItem) {
                                return {
                                    name: dataItem[1].name,
                                    value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value])
                                };
                            })
                        },
                        {
                            name: item[0],
                            type: 'scatter',
                            symbol:'image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1566964546957&di=5c20969bfd9171fe7487f154fa36eb57&imgtype=0&src=http%3A%2F%2Fimgup04.iefans.net%2Fiefans%2F2019-02%2F11%2F11%2F15498570716693_1.jpg',
                            symbolSize:[100,50],
                            symbolOffset :[50,0],

                            coordinateSystem: 'geo',
                            zlevel: 2,
                            rippleEffect: {
                                brushType: 'stroke'
                            },
                            label: {
                                normal: {
                                    show: true,
                                    position: 'right',
                                    formatter: `{b} \n {name|{d}}\n ${item[2]}`,
                                    fontSize: 16,
                                    rich: {
                                        name: {
                                            textBorderColor: '#fff'
                                        }
                                    }
                                }
                            },

                            itemStyle: {
                                normal: {
                                    color: color[i]
                                }
                            },
                            data: item[1].map(function (dataItem) {
                                return {
                                    name: dataItem[1].name,
                                    value: geoCoordMap[dataItem[1].name].concat([dataItem[1].value]),
                                    info: dataItem[1].info
                                };
                            })
                        });
                });
            }
        },
        mounted(){
            const that = this
            that.dom = echarts.init(that.$refs.dom)
            that.initData()
            that.option = {
                backgroundColor: '#00263b',
                title : {

                    left: 'center',
                    textStyle : {
                        color: '#fff'
                    }
                },
                tooltip : {
                    trigger: 'item'
                },
                legend: {
                    show: false
                },
                geo: {
                    map: 'world',
                    center: [115.97, 29.71],
                    zoom: 3,
                    label: {
                        emphasis: {
                            show: false
                        }
                    },
                    roam: true,
                    itemStyle: {
                        normal: {
                            areaColor: '#00192e',
                            borderColor: '#404a59'
                        },
                        emphasis: {
                            areaColor: '#2a333d'
                        }
                    }
                },
                series: that.series
            }
        }
    };
</script>

<style lang="scss">
    @import "@/style/tableStyle.scss";
    .echartMap{

    }
</style>
