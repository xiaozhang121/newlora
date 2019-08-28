<template>
    <div class="chosenList">
        <div class="title">
            <span>{{ title }}</span>
            <span class="last" v-if="control" @click="toHide()">收起<i class="iconfont icon-xiala" :class="{'turnA': !collapse}"></i></span>
        </div>
        <el-collapse-transition>
            <div class="contain" :class="{'overShow': dataList.length>6}" v-show="collapse">
                <div class="item" v-for="(item, index) in dataList" :key="index" :class="{'grey': (index+1)%2!=0}">
                    <el-checkbox v-model="item['isCheck']">{{ item['title'] }}</el-checkbox>
                </div>
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
                dataList:[
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    }
                ],
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
        methods: {
            toHide(){
                this.collapse = !this.collapse
            }
        }
    }
</script>
<style lang="scss">
    .chosenList{
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
        .item{
            padding: 0 10px;
            height: 43px;
        }
        .grey{
            background: #c7c7c7;
        }
    }
</style>