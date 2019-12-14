<template>
    <div class="chosenList">
        <div class="title">
            <span style="font-size: 16px">{{ title }} </span>
            <span class="last" v-if="control" @click="toHide()">收起<i class="iconfont icon-xiala" :class="{'turnA': !collapse}"></i></span>
        </div>
        <el-collapse-transition>
            <div class="contain" :class="{'overShow': dataLength>6}" v-show="collapse">
                <template v-for="(item, index) in dataList">
                    <div class="item" :key="index">
                        <el-checkbox v-model="item['isCheck']">{{ item['title'] }}</el-checkbox>
                    </div>
                    <template v-if="'monitorDeviceType' in item && item['monitorDeviceType'] == 1">
                        <div class="item child" v-show="item['isCheck']">
                            <el-radio v-model="item['analyseType']" label="1">外观类</el-radio>
                        </div>
                        <div class="item child" v-show="item['isCheck']">
                            <el-radio v-model="item['analyseType']" label="0">表计类/状态类</el-radio>
                        </div>
                    </template>
                </template>
            </div>
        </el-collapse-transition>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                title: '选择电力设备',
                control: false,
                dataList:[],
                collapse: true
            }
        },
        props: {
            titleOption:{
                type: String,
                default: ''
            },
            controlOption:{
                type: Boolean,
                default:()=>{
                    return false
                }
            },
            dataListOption: {
                type: Array,
                default: ()=>{
                    return []
                }
            }
        },
        watch:{
            titleOption:{
                handler(now){
                    if(now)
                        this.title = now
                },
                immediate: true
            },
            controlOption:{
                handler(now){
                    if(now)
                        this.control = now
                },
                immediate: true
            },
            dataListOption:{
                handler(now){
                    if(now.length)
                      this.dataList = now
                },
                immediate: true
            }
        },
        computed:{
            dataLength(){
                let count = 0
                this.dataList.forEach((item, index)=>{
                    if(item['monitorDeviceType'] == 1 && item['isCheck']){
                        count+=3
                    }else{
                        count++
                    }
                })
                return count
            }
        },
        methods: {
            toHide(){
                this.collapse = !this.collapse
            }
        }
    }
</script>
<style lang="scss">
    .chosenList{
        .el-radio__input.is-checked + .el-radio__label{
            color: white !important;
        }
        .el-radio__label{
            width: 100%;
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
        }
        .el-checkbox__input.is-checked + .el-checkbox__label, .el-checkbox__label{
            color: white !important;
            margin-left: 5px;
            letter-spacing: 1px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            position: relative;
            top: 5px;
        }
        .el-checkbox__label{
            color: white !important;
            margin-left: 5px;
            letter-spacing: 1px;
        }
        .el-checkbox__inner::after{
            border-color: #535353;
            border-width: 2px;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner{
            background-color: white;
            border-color: white;
        }
        .turnA{
            transform: rotate(180deg);
            position: relative;
            top: -2px;
        }
        .title{
            display: flex;
            justify-content: space-between;
            span.last{
                color: #999999;
                margin-right: 10px;
                cursor: pointer;
                i{
                    display: inline-block;
                    font-size: 13px;
                    color: #474747;
                    margin-left: 7px;
                    transition: all 0.3s;
                }
            }
        }
        .contain{
            max-height: 256px;
            &.overShow{
                overflow-y: auto;
            }
        }
        ::-webkit-scrollbar {/*滚动条整体样式*/
            display: none;
            width: 6px;     /*高宽分别对应横竖滚动条的尺寸*/
            height: 10px;
        }
        ::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
            border-radius: 10px;
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
            background: #979797 !important;
        }
        ::-webkit-scrollbar-track {/*滚动条里面轨道*/
            -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.4);
            border-radius: 10px;
            background: #e0e0e0 !important;
        }
        .contain{
            .item:nth-child(2n+1){
                background: #c7c7c7;
            }
        }
        .item{
            padding: 0 10px;
            height: 43px;
            &.child{
                padding-left: 34px;
            }
        }
        .grey{
            background: #c7c7c7;
        }
    }
</style>