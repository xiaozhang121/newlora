<template>
    <div class="cameraPower" >
        <historical-documents :showHeader="true" :tabPaneData="[]"  :title="title"  width="444px" @close="onClose" :dialogTableVisible="visible" class="historical">
            <div class="monitor">
                <key-monitor streamAddr="45456465"></key-monitor>
            </div>
            <div class="from">
                来源：
                <el-dropdown  trigger="click">
                  <span class="el-dropdown-link">
                    <span class="click_title">4号主变摄像头12号</span><i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>demo</el-dropdown-item>
                        <el-dropdown-item>demo</el-dropdown-item>
                        <el-dropdown-item>demo</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
            <div class="moreInfo">更多记录信息>></div>
            <div class="camera">
                <camera-d></camera-d>
            </div>
            <div class="camera">
                <camera-d></camera-d>
            </div>
        </historical-documents>
    </div>
</template>

<script>
    import KeyMonitor from "_c/duno-c/KeyMonitor";
    import cameraD from './components/cameraD'
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    export default {
        name: 'cameraPower',
        components: {
            HistoricalDocuments,
            KeyMonitor,
            cameraD
        },
        data() {
            return {

            }
        },
        props: {
            title: {
                type: String,
                default: () => {
                    return ''
                }
            },
            visible: {
                type: Boolean,
                default: () => {
                    return false
                }
            }
        },
        watch: {

        },
        methods:{
            onClose(){
            }
        },
        mounted() {
        }
    }
</script>
<style lang="scss">
    .cameraPower{
        .el-icon-arrow-down{
            color: white;
        }
        .camera{
            margin-bottom: 10px;
            &:first-child{
                margin-top: 10px;
            }
        }
        .monitor{
            .keyMonitor{
                width: 100% !important;
            }
        }
        .from{
            margin: 10px 0;
        }
        .el-loading-text{
            color: #969696   !important;
        }
        .click_title{
            color: #4bbdc1;
        }
        .moreInfo{
            color: #4bbdc1 !important;
            text-align: right;
            text-decoration: underline;
        }
        .HistoricalDocuments{
            .titleBtn{
                margin-right: 48px;
                margin-top: -40px;
            }
        }
        .historyfile{
            padding-bottom: 15px;
        }
    }
</style>

