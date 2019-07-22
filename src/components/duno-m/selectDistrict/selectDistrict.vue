<template>
    <div class="selectDistrict">
        <el-dialog
                v-dialogDrag
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <span slot="title">
                <div class="title">
                    机器人ID-自定义任务配置01<i class="iconfont icon-xiugai1"></i>
                </div>
                <div class="title_o">
                    <span>框选设备</span>
                    <span><el-button class="button" type="primary">确认</el-button></span>
                </div>
            </span>
            <div class="main">
                <gis-map :zoom="13" :small="true" :controlBtn="false" ></gis-map>
            </div>

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
            dialogVisible: true
        }
    },
    props: {

    },
    watch: {

    },
    computed: {

    },
    methods:{

    },
    created(){
    },
    updated: function () {
    },
    beforeDestroy(){
        document.querySelector('#map').setAttribute('style','height:calc( 100vh - 166px) !important')
    },
    mounted() {
        this.$nextTick(()=>{
            document.querySelector('#map').setAttribute('style','height:100% !important')
            this.move(true)
        })
     /*   for (let i = 0; i < this.lists.length; i++) {
            this.text += ' ' + this.lists[i]
        }*/
    }
}
</script>

<style lang="scss">
    .selectDistrict{
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

