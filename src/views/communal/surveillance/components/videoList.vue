<template>
    <div class="videoList" @click="onPlay" :class="{'active': isPlay}">
        <div class="pic">
            <img :src="picImg"/>
            <i class="iconfont icon-bofang"></i>
        </div>
        <div class="main">
            <div class="title">记录日期：{{ startTime }} 至 {{ endTime }}</div>
            <div v-if="isPlay" class="play blue">正在播放……</div>
            <div v-else class="play">点击播放</div>
        </div>
    </div>
</template>

<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
import KeyMonitor from "_c/duno-c/KeyMonitor";
export default {
    name: "videoList",
    components: {

    },
    computed:{
        picImg(){
            return this.dataInfo['pic']?this.dataInfo['pic']:''
        },
        startTime(){
            return this.dataInfo['startTime']?this.dataInfo['startTime']:''
        },
        endTime(){
            return this.dataInfo['endTime']?this.dataInfo['endTime']:''
        },
        isPlay(){
            return this.dataInfo['isPlay']?this.dataInfo['isPlay']:false
        }
    },
    props:{
        videoList:{},
        index:{},
        dataInfo:{
            type: Object,
            default: ()=>{
                return {}
            }
        }
    },
    data() {
        return {
            demoPic: require('@/assets/camera.png'),
            checkList: [],
        };
    },
    methods: {
        onPlay(){
            this.$emit('on-play', this.index)
            // this.$set(this.dataInfo, 'isPlay', true)
            this.$forceUpdate()
        },
        change() {}
    }
};
</script>

<style lang="scss">
    .videoList {
        cursor: pointer;
        overflow: hidden;
        position: relative;
        width: 100%;
        height: 98px;
        background: #203e52;
        display: flex;
        justify-content: center;
        align-items: center;
        border: 2px solid transparent;
        .blue{
            color: #02f0f1 !important;
        }
        &.active{
            border: 2px solid #06dbde;
        }
        .pic{
            flex-basis: 173px;
            width: 19%;
            position: relative;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 20px;
            img{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
            }
            .icon-bofang{
                position: absolute;
                z-index: 100;
                color: white;
                font-size: 32px;
            }
        }
        .main{
            line-height: 30px;
            flex-grow: 1;
            height: 100%;
            color: white;
            display: flex;
            flex-direction: column;
            justify-content: center;
            .play{
                color: #8999a4;
            }
        }
    }
</style>


