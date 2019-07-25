<template>
    <div class="selectDistrict">
        <el-dialog
                v-dialogDrag
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <span slot="title">
                <div class="title">
                    <input :readonly="!readOnly" :class="{'noBorder': !readOnly}" v-model="taskName" type="text" class="taskName"/>
                    <i @click="toEdit" class="iconfont icon-xiugai1"></i>
                </div>
                <div class="title_o">
                    <span>框选设备</span>
                    <span><el-button class="button" type="primary">确认</el-button></span>
                </div>
            </span>
            <div class="main">
                <gis-map ref="gisMapRef" @on-draw="onDraw" :zoom="13" :boxSelect="true" :small="true" :controlBtn="false"></gis-map>
            </div>
            <ul class="drawList">
                <li class="drawItem" v-for="(item, index) in drawList" :key="index">
                    <div>选区{{ item['number'] }}设备</div>
                    <div class="select">
                        <el-select multiple  v-model="value" placeholder="请选择">
                            <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="del" @click="delDraw(item['number'])">
                        <i class="iconfont icon-shanchu1"></i>
                    </div>
                </li>
            </ul>
        </el-dialog>
    </div>
</template>

<script>
import gisMap from '_c/duno-m/gisMap'
export default {
    name: 'selectDistrict',
    components: {
        gisMap
    },
    data() {
        return {
            options:[

            ],
            drawList: [],
            taskName: '机器人ID-自定义任务配置01',
            readOnly: false,
            dialogVisible: false
        }
    },
    props: {
        visible: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        visible(now){
            this.dialogVisible = now
            if(now){
                this.$nextTick(()=>{
                    document.querySelector('#map').setAttribute('style','height:100% !important')
                })
            }else{
                document.querySelector('#map').setAttribute('style','height:calc( 100vh - 166px) !important')
            }
        }
    },
    computed: {
    },
    methods:{
        delDraw(target){
            this.$refs.gisMapRef.removeItem(target)
        },
        onDraw(now){
            this.drawList = now
            console.log(now)
        },
        toEdit(){
            this.readOnly = !this.readOnly
        },
        handleClose(){
            this.$emit('on-close')
        }
    },
    created(){
    },
    updated: function () {
    },
    beforeDestroy(){
    },
    mounted() {
        this.$nextTick(()=>{
            this.move(true)
        })
     /*   for (let i = 0; i < this.lists.length; i++) {
            this.text += ' ' + this.lists[i]
        }*/
    }
}
</script>

<style lang="scss">
    .el-select-dropdown {
        background: linear-gradient(
                        210deg,
                        rgba(48, 107, 135, 0.9),
                        rgba(28, 50, 64, 0.7) 60%
        ) !important;
        border: none !important;
    }
    .el-select-dropdown__item,
    .el-select-dropdown__empty,
    .el-select-dropdown__item.selected {
        color: white;
    }
    .el-select-dropdown__list {
        position: relative;
        top: -5px;
    }
    .selectDistrict{
        .drawList{
            margin-top: 25px;
            .drawItem{
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                .select{
                    margin-left: 20px;
                    flex-grow: 1;
                    .el-select{
                        width: 100%;
                    }
                    .el-input__inner{
                        border-radius: 0;
                    }
                }
                .del{
                    cursor: pointer;
                    i{
                        font-size: 20px;
                        color: #e62700;
                        margin-left: 20px;
                    }
                }
            }
            .drawItem:last-child{
                margin-bottom: 0;
            }
        }
        .noBorder{
            cursor: pointer;
            border: 1px solid transparent !important;
        }
        .taskName{
            border: 1px solid #c7c7c7;
        }
        .el-dialog{
            width: 47% !important;
        }
        .el-dialog__body{
            padding-top: 3px;
        }
        .title{
            font-weight: bold;
            font-size: 17px;
        }
        .title_o{
            font-size: 13px;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            .button{
                background-color: #3a77ff;
                border-radius: 16px;
                border: none;
            }
            &:last-child{

            }
        }
        .main{
            background: #0e191d;
            height: 350px;
            overflow: hidden;
        }
        .icon-xiugai1{
            margin-left: 8px;
            color: #666666;
            cursor: pointer;
        }
    }
</style>

