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
            list:{}
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
                    getAxiosData('/lenovo-plan/api/devicemonitor/select-list',{deviceId: query.join(',')}).then(res=>{
                        for(let i=0; i<res.data.length; i++){
                            res.data[i]['monitorDevices'].map(item=>{
                                item['isCheck'] = false
                                item['title'] = item['monitorDeviceName']
                            })
                        }
                        this.dataList = res.data
                    })
                },
                deep: true
            }
        },
        data() {
            return {
                dataList: [],
                lightList:[
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    }
                ],
                redList: [
                    {
                        isCheck: false,
                        title: '4号主变'
                    },
                    {
                        isCheck: false,
                        title: '4号主变'
                    }
                ]
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