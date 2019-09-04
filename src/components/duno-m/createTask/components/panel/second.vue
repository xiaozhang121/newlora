<template>
    <div class="taskPanel">
        <el-form  :model="form" label-width="80px">
            <div>确认执行巡检的设备</div>
            <chosen-list v-for="(item, index) in dataList" :key="index" :titleOption="item['powerDeviceName']" :controlOption="true" :dataListOption="item['monitorDevices']" />
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
                    let data = now.dataList.map(item=>{
                        if(item['isCheck']){
                            return item['deviceId']
                        }
                    })
                    let query = []
                    data.forEach(item=>{
                        if(item){
                            query.push(item)
                        }
                    })
                    getAxiosData('/lenovo-plan/api/devicemonitor/select-list',{deviceIds: query.join(',')}).then(res=>{
                        for(let i=0; i<res.data.length; i++){
                            res.data[i]['monitorDevices'].map(item=>{
                                item['isCheck'] = false
                                item['title'] = item['monitorDeviceName']
                                if(item['monitorDeviceType'] == 1){
                                    item['analyseType'] = '1'
                                }
                            })
                        }
                        let data = res.data
                        if(this.rowDataLength && !this.rowData['isChange']){
                            let arr = this.rowData['devicemonitors']
                            for(let i=0; i<arr.length; i++){
                                for(let j=0; j<data.length; j++){
                                    if(arr[i]['powerDeviceId'] == data[j]['powerDeviceId']){
                                        for(let z=0; z<data[j]['monitorDevices'].length; z++){
                                            let indexx = arr[i]['monitorDeviceId'].indexOf(data[j]['monitorDevices'][z]['monitorDeviceId'])
                                            if(indexx > -1){
                                                data[j]['monitorDevices'][z]['isCheck'] = true
                                                if(data[j]['monitorDevices'][z]['monitorDeviceType'] == 1){
                                                    if(arr[i]['analyseTypes'][indexx] == '')
                                                        data[j]['monitorDevices'][z]['analyseType'] = 1
                                                    else
                                                        data[j]['monitorDevices'][z]['analyseType'] = arr[i]['analyseTypes'][indexx]
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            this.rowData['isChange'] = true
                        }
                        this.dataList = data
                    })
                },
                deep: true
            }
        },
        data() {
            return {
                dataList: [],
                lightList:[],
                redList: []
            }
        },
        methods: {

        },
        mounted(){
            const that = this
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