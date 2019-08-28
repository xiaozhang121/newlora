<template>
    <div class="taskPanel">
        <el-form  :model="form" label-width="80px">
            <el-form-item label="任务名称">
                <el-input v-model="form.taskName"></el-input>
            </el-form-item>
            <el-form-item label="任务类型">
                <el-select v-model="form.taskKind">
                    <el-option v-for="(item, index) in taskKindList" :key="index" :label="item['label']" :value="item['value']"></el-option>
                </el-select>
            </el-form-item>
            <chosen-list :dataListOption="dataList"/>
        </el-form>
    </div>
</template>
<script>
    import chosenList from "_c/duno-m/chosenList";
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    export default {
        name: 'taskPanel',
        components: {
            chosenList
        },
        props:{
            list:{}
        },
        watch:{
            list:{
                handler(now){
                    debugger
                },
                deep: true
            }
        },
        data() {
            return {
                form: {
                  taskName: '',
                  taskKind: '',
                },
                dataList: [],
                taskKindList:[]
            }
        },
        methods: {
            initData(){
                postAxiosData('/lenovo-plan/api/list/plan-type').then(res=>{
                    this.taskKindList = res.data
                    this.form.taskKind = res.data[0].value
                    this.$forceUpdate()
                })
                getAxiosData('/lenovo-plan/api/device/multi', {pageIndex: 1, pageRows:888888}).then(res=>{
                    let data = res.data.tableData
                    const info = data.map(item=>{
                        let obj = {
                            title: item['deviceName'],
                            deviceId: item['deviceId'],
                            deviceTypeId: item['deviceTypeId'],
                            deviceType: item['deviceType'],
                            isCheck: false
                        }
                        return obj
                    })
                    this.dataList = info
                    this.$forceUpdate()
                })
            }
        },
        mounted(){
            this.initData()
        }
    }
</script>
<style lang="scss">
    .taskPanel{
        .el-select{
            width: 100%;
        }
    }
</style>