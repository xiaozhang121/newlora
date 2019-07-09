<template>
    <div class="pushMov" >
        <el-dialog
                v-dialogDrag
                title="提示"
                :visible.sync="dialogVisible"
                :width="widthSet"
                :modal="false"
                :before-close="handleClose"
                >
            <span slot="title"></span>
            <div class="cameraPos">
                <div v-if="this.$store.state.app.format == 1" class="first">
                    <div class="left_main">
                        <div class="cameraItem">
                            <span class="explain Max">
                                选择推送至此区域
                            </span>
                        </div>
                    </div>
                    <div class="right_main">
                        <div class="cameraItem">
                             <span class="explain">
                                选择推送至此区域
                            </span>
                        </div>
                        <div class="cameraItem">
                             <span class="explain">
                                选择推送至此区域
                            </span>
                        </div>
                        <div class="cameraItem">
                             <span class="explain">
                                选择推送至此区域
                            </span>
                        </div>
                    </div>
                </div>
                <div v-else="this.$store.state.app.format == 2" class="second">
                    <div class="left_main">
                        <div class="cameraItem">
                            <span class="explain Max">
                                选择推送至此区域
                            </span>
                        </div>
                    </div>
                    <div class="bottomMain">
                        <div class="right_main">
                            <div class="cameraItem">
                             <span class="explain">
                                选择推送至此区域
                            </span>
                            </div>
                        </div>
                        <div class="right_main">
                            <div class="cameraItem">
                             <span class="explain">
                                选择推送至此区域
                            </span>
                            </div>
                        </div>
                        <div class="right_main">
                            <div class="cameraItem">
                             <span class="explain">
                                选择推送至此区域
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    import Polygonal from '_c/duno-c/Polygonal'
    import hotCamera from '_c/duno-m/hotCamera'
    import cameraPanel from '_c/duno-m/cameraPanel'
    import { mapState } from 'vuex'
    export default {
        name: 'pushMov',
        components: {
            HistoricalDocuments,
            Polygonal,
            cameraPanel,
            hotCamera
        },
        data() {
            return {
                dialogVisible: false
            }
        },
        props: {
         visible:{
            type: Boolean,
            default: false
         }
        },
        watch: {
            visible(now){
                this.dialogVisible = now
                this.$nextTick(()=>{
                    this.initHover()
                })
            }
        },
        computed: {
            ...mapState([
                'app'
            ]),
            widthSet(){
                 if(this.$store.state.app.format == 1){
                     return '600px'
                 }else if(this.$store.state.app.format == 2){
                     return '500px'
                 }
            }
        },
        methods:{
            handleClose(){
                this.$emit('on-close')
            },
            initHover(){
                let list = document.querySelectorAll('.cameraItem')
                for(let i=0; i<list.length; i++){
                    list[i].addEventListener('mouseenter', function (event) {
                        $(this).find('span').css({'color': '#1bf2f4'})
                    })
                    list[i].addEventListener('mouseout', function (event) {
                        $(this).find('span').css({'color': 'white'})
                    })
                }
            }
        },
        mounted() {
            this.$nextTick(()=>{
                this.initHover()
            })
        }
    }
</script>

<style lang="scss" scoped>
    .pushMov{
        position: absolute;
        top: 0;
        z-index: 2;
        overflow: hidden;
        .cameraItem{
            border: 1.5px dashed #a4adaf;
            width: 100%;
            height: 0;
            padding-bottom: 56%;
            position: relative;
            .explain{
                pointer-events: none;
                color: white;
                font-size: 13px;
                width: 52px;
                height: 39px;
                position: absolute;
                left: 0;
                bottom: 0;
                top: 0;
                right: 0;
                margin: auto;
                &.Max{
                    font-size: 17px;
                    width: 136px;
                }
            }
        }
        .cameraPos{
            overflow: hidden;
            .first{
                display: flex;
                width: 108%;
                .left_main{
                    width: 70%;
                }
                .right_main{
                    width: 21%;
                    .cameraItem{
                        margin-left: 9px;
                        margin-bottom: 9px;
                    }
                }
                .cameraItem:hover{
                    border: 1.5px solid #4ca7ac;
                }
            }
            .second{
                display: flex;
                width: 100%;
                flex-direction: column;
                .left_main{
                    width: 100%;
                }
                .bottomMain{
                    .right_main{
                        width: calc(100% / 3 - 6px);
                        display: inline-block;
                        margin-top: 9px;
                        margin-right: 9px;
                        &:last-child{
                            margin-right: 0;
                        }
                        .cameraItem{
                        }
                    }
                }
                .cameraItem:hover{
                    border: 1.5px solid #4ca7ac;
                    color: #4ca7ac;
                }
            }
        }
    }
</style>
<style lang="scss">
    .pushMov{
        .el-dialog{
            border: 1px solid #688c9e;
            background: rgba(17,32,39,0.9);
        }
    }
</style>

