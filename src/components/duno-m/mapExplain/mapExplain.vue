<template>
    <div class="mapExplain" :class="{'hiddenBox': isHide}">
        <div class="triangle" @click="hideIntro()">
            <div class="triangle-topright" :class="{'blue': isHide}"></div>
            <div class="triangle-bottomleft"></div>
        </div>
        <div style="min-width: 245px; min-height: 187px">
            <div class="infoD">
                <div class="item">
                    <div class="titleE">
                        光纤
                    </div>
                    <div class="showE">
                        <div class="line"></div>
                    </div>
                </div>
                <div class="item">
                    <div class="titleE">
                        网线
                    </div>
                    <div class="showE">
                        <div class="line" style="background: #005aa0"></div>
                    </div>
                </div>
            </div>
            <div class="infoD">
                <div class="item">
                    <div class="titleE">
                        监控防水箱
                    </div>
                    <div class="showE">
                        <div class="img">
                            <img :src="waterBox" />
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="titleE">
                        可见光
                    </div>
                    <div class="showE">
                        <div class="img">
                            <img :src="lightNoCamera" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="infoD">
                <div class="item">
                    <div class="titleE">
                        无线AP
                    </div>
                    <div class="showE">
                        <div class="img">
                            <img :src="AP" />
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="titleE">
                        窄道摄像头
                    </div>
                    <div class="showE">
                        <div class="img">
                            <img :src="lightD" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="infoD">
                <div class="item">
                    <div class="titleE">
                        红外测温
                    </div>
                    <div class="showE">
                        <div class="img">
                            <img :src="redLight" />
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="titleE">
                        可见光(云台)
                    </div>
                    <div class="showE">
                        <div class="img">
                            <img :src="light" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="infoD">
                <div class="item">
                    <div class="titleE">
                        红外测温(云台)
                    </div>
                    <div class="showE">
                        <div class="img">
                            <img :src="redLightCamera" />
                        </div>
                    </div>
                </div>
                <div class="item">
                    <div class="titleE">
                        可见光(球机)
                    </div>
                    <div class="showE">
                        <div class="img">
                            <img :src="ballJ" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixinViewModule from "@/mixins/view-module";
    export default {
        name: 'mapExplain',
        mixins: [mixinViewModule],
        components: {

        },
        data() {
            return {
                waterBox: require('@/assets/runDevice/waterBox.png'),
                isHide: false
            }
        },
        props: {

        },
        computed: {

        },
        methods:{
            hideIntro(){
                this.isHide = !this.isHide
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    .mapExplain{
        width: 277px;
        height: 187px;
        background: rgba(34, 51, 51, 0.8);
        padding: 6px 14px;
        line-height: 35px;
        overflow: hidden;
        transition: all .5s;
        &.hiddenBox{
            width: 0;
            height: 0;
            background: transparent;
        }
        .triangle{
            position: absolute;
            right: 0;
            top: 0;
            cursor: pointer;
            .triangle-topright{
                position: absolute;
                width: 0;
                height: 0;
                border-top: 13px solid white;
                border-left: 13px solid transparent;
                &.blue{
                    border-top: 13px solid #007889;
                }
            }
            .triangle-bottomleft{
                width: 0;
                height: 0;
                border-bottom: 13px solid #007889;
                border-right: 13px solid transparent;
            }
        }
        .infoD{
            display: flex;
            .item{
                flex-grow: 1;
                flex-basis: 0;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 20px;
                .titleE{
                    font-size: 13px;
                }
                .showE{
                   flex: 1;
                    display: flex;
                    justify-content: flex-end;
                    .line{
                        background: white;
                        height: 1px;
                        width: 100%;
                        margin-left: 12px;
                    }
                    .img{
                        width: 20px;
                        height: 20px;
                        position: relative;
                        img{
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            left: 0;
                            top: 0;
                        }
                    }
                }
            }
            .item:nth-child(2n){
                margin-right: 0;
            }
        }
    }
</style>

