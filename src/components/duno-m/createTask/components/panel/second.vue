<template>
    <div class="taskPanel">
        <el-form  :model="form" label-width="80px">
            <div>确认执行巡检的设备</div>
            <chosen-list titleOption="可见光" :controlOption="true" :dataListOption="lightList" />
            <chosen-list titleOption="红外测温" :controlOption="true" :dataListOption="redList" />
        </el-form>
    </div>
</template>
<script>
    import chosenList from "_c/duno-m/chosenList";
    export default {
        name: 'taskPanel',
        components: {
            chosenList
        },
        data() {
            return {
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