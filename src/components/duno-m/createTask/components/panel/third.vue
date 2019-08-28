<template>
    <div class="taskPanelT">
        <el-form  :model="form" label-width="80px" style="padding: 0 33px;">
            <!--<div class="radioItem">
                <el-radio v-model="radio" label="1">立即执行</el-radio>
            </div>
            <div  class="radioItem">
                <el-radio v-model="radio" label="2">预约任务</el-radio>
            </div>-->
            <div>
                开始时间
                <el-date-picker
                        class="mainItem"
                        v-model="value3"
                        type="datetime"
                        placeholder="选择日期时间"
                       >
                </el-date-picker>
            </div>
            <div class="tip">结束时间以各监测设备需要为准</div>
            <div>
                重复
                <el-select    class="mainItem last" v-model="value" placeholder="请选择">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </el-form>
    </div>
</template>
<script>
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    import chosenList from "_c/duno-m/chosenList";
    export default {
        name: 'taskPanel',
        components: {
            chosenList
        },
        props:{
            list:{}
        },
        watch:{
            radio(now){
                if(now == 1){
                    this.value3 = ''
                    this.value = ''
                }
            },
            list:{
                handler(now){
                    debugger
                },
                deep: true
            }
        },
        data() {
            return {
                radio: '1',
                value3: '',
                options: [{
                    value: '每两周',
                    label: '每两周'
                }, {
                    value: '每一周',
                    label: '每一周'
                }],
                value: ''
            }
        },
        methods: {
            initData(){
                postAxiosData('/lenovo-plan/api/list/plan-cycle').then(res=>{
                    this.options = res.data
                })
            }
        },
        mounted(){
            this.initData()
            this.value3 =  new Date()
        }
    }
</script>
<style lang="scss">
    .taskPanelT{
        .tip{
            color: #999999;
            font-size: 13px;
        }
        .el-select{
            width: 220px;
        }
        .mainItem{
            margin-left: 10px;
            &.last{
                margin-left: 36px;
            }
        }
        .radioItem{
            margin-bottom: 15px;
        }
    }
</style>