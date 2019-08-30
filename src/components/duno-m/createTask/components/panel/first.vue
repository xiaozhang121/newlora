<template>
    <div class="taskPanel">
        <el-form  :model="form" label-width="80px">
            <el-form-item label="任务名称">
                <el-input v-model="form.taskName"></el-input>
            </el-form-item>
            <el-form-item label="任务类型">
                <el-select v-model="form.taskKind" @change="onChange">
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
            onChange(value){
                const that = this
                let query = {pageIndex: 1, pageRows:888888}
                query['planType'] = value
                getAxiosData('/lenovo-plan/api/device/multi', query).then(res=>{
                    let data = res.data.tableData
                    let info = data.map(item=>{
                        let obj = {
                            title: item['deviceName'],
                            deviceId: item['deviceId'],
                            deviceTypeId: item['deviceTypeId'],
                            deviceType: item['deviceType'],
                            isCheck: false
                        }
                        return obj
                    })
                    this.$forceUpdate()
                    this.rowData['isChange'] = true
                    this.dataList = info
                })
            },
            initData(){
                const that = this
                postAxiosData('/lenovo-plan/api/list/plan-type').then(res=>{
                    this.taskKindList = res.data
                    if(!this.rowDataLength)
                        that.form.taskKind = res.data[0].value
                    this.$forceUpdate()
                    let query = {pageIndex: 1, pageRows:888888}
                    query['planType'] = that.form.taskKind
                    getAxiosData('/lenovo-plan/api/device/multi', query).then(res=>{
                        let data = res.data.tableData
                        let info = data.map(item=>{
                            let obj = {
                                title: item['deviceName'],
                                deviceId: item['deviceId'],
                                deviceTypeId: item['deviceTypeId'],
                                deviceType: item['deviceType'],
                                isCheck: false
                            }
                            return obj
                        })

                        this.$forceUpdate()
                        if(that.rowDataLength){
                            that.form['taskName'] = that.rowData['planName']
                            that.form['taskKind'] = that.rowData['planType']
                            let data = that.rowData['devicemonitor']
                            for(let i=0; i<data.length; i++){
                                for(let j=0; j<info.length; j++){
                                    if(data[i]['powerDeviceId']  == info[j]['deviceId']){
                                        info['isCheck'] = true
                                        break;
                                    }
                                }
                            }
                        }
                        this.dataList = info
                    })
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