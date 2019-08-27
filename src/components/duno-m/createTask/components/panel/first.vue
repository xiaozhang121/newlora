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
            <chosen-list />
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
                form: {
                  taskName: '',
                  taskKind: '',
                },
                taskKindList:[
                    {
                        value: '巡检类型',
                        label: '巡检类型'
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