<template>
    <div class="customBox" :style="'width: '+ width">
        <div class="top not-print">
            <div class="title">{{ title }}</div>
            <div class="handle" v-if="!noHandle"><span v-if="isClose" @click="changeClose"><i class="el-icon-caret-bottom"></i>打开</span><span  @click="changeClose" v-else><i class="el-icon-caret-top"></i>收起</span></div>
            <div class="img">
                <img :src="movModel"/>
            </div>
            <div class="oblong"></div>
        </div>
        <div class="main" :class="{'noHeight':isClose}">
            <div class="slot" v-if="!isClose">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
    import movModel from '@/assets/images/movModel.png'
    export default {
        name: 'customBox',
        data() {
            return {
                movModel,
                isClose: true
            }
        },
        props: {
            noHandle:{
                type: Boolean,
                default:()=>{
                    return false
                }
            },
            title: {

            },
            width: {},
            initClose:{
                type: Boolean,
                default:()=>{
                    return true
                }
            }
        },
        methods:{
            changeClose(){
                this.isClose = !this.isClose
            }
        },
        created(){
            if(!this.initClose){
                this.isClose = false
            }
        }
    }
</script>

<style lang="scss">
    .customBox{
        width: 308px;
        position: absolute;
        left: 300px;
        .noHeight{
            height: 0 !important;
        }
        .top{
            height: 64px;
            position: relative;
            width: 100%;
            .img{
                position: absolute;
                overflow: hidden;
                height: 64px;
                width: 154px;
                img{
                    position: absolute;
                }
            }
            .oblong{
                height: 59px;
                width: calc( 100% - 154px);
                float: right;
                border: 1px solid #00fefe;
                margin-top: 5px;
                border-left: none;
                border-bottom: 0;
                background: #012131;
            }
            .title{
                color: white;
                font-size: 20px;
                position: absolute;
                z-index: 2;
                top: 23px;
                left: 27px;
            }
            .handle{
                color: white;
                font-size: 14px;
                position: absolute;
                right: 10px;
                cursor: pointer;
                top: 27px;
                z-index: 2;
            }
        }
        .main{
            width: 100%;
            height: 100%;
            border: 1px solid #00fefe;
            border-top: none;
            background: #012131;
            .slot{
                width: 100%;
            }
        }
    }
</style>
