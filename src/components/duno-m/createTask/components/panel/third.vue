<template>
    <div class="taskPanelT">
        <el-form  label-width="80px" style="padding: 0 33px;">
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
                        :picker-options='expireTimeOption'
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
            rowData:{
                type: Object,
                default: () => {
                    return {};
                }
            },
            list:{}
        },
        computed: {
            rowDataLength(){
                return Object.keys(this.rowData).length
            }
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
                },
                deep: true
            }
        },
        data() {
            return {
                radio: '1',
                value3: '',
                options: [],
                value: '',
                expireTimeOption: {
                    disabledDate(date) {
                        return date.getTime() <= Date.now();
                    }
                }
            }
        },
        methods: {
            initData(){
                postAxiosData('/lenovo-plan/api/list/plan-cycle').then(res=>{
                    if(this.rowDataLength){
                        if(this.rowData['planCycle']){
                            this.value = this.rowData['planCycle']
                            this.rowData['planCycle'] = ''
                        }
                        if(this.rowData['date']){
                            this.value3 = new Date(`${this.rowData['date']} ${this.rowData['time']}`)
                            this.rowData['date'] = ''
                            this.rowData['time'] = ''
                        }
                    }else{
                        this.value = res.data[0].value
                    }
                    this.options = res.data
                })
            }
        },
        mounted(){
            if(!this.rowDataLength) {
                this.value3 = new Date()
            }
            this.initData()
        },
        beforeDestroy(){
            try{
            let dom = document.querySelector('.el-picker-panel')
            dom.style.background = '#ffffff'
            dom.style.border = '1px solid #E4E7ED'
            }catch (e) {
                
            }
        }
    }
</script>
<style lang="scss">
    .el-picker-panel  {
        background: #152e3a !important;
        border: none !important;
    }
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
    .el-date-table td.disabled div{
      color: 	#606266;
      background-color: rgba(27, 59, 71, 0.7);
    }
    .el-time-panel{
      border: solid 1px rgba(27, 59, 71, 0.7);
      background-color: rgba(27, 59, 71, 0.7); 
    }
    .el-time-panel__footer{
      border-top:none
    }
    .el-time-panel__btn,
    .el-time-panel__btn.confirm{
      color:#fff;
    }
</style>
