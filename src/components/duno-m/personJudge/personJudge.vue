<template>
    <div class="personJudge" >
        <el-dialog
                v-dialogDrag
                title="人工判断"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose">
            <el-input class="itemInput" v-model="formData.input" placeholder="请输入内容"></el-input>
            <el-input class="itemInput" v-model="formData.inputT" placeholder="请输入内容"></el-input>
            <el-select class="itemInput" v-model="formData.select" placeholder="请选择">
                <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                </el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <button-custom class="button" @click.native="dialogVisible = false"  title="取消" />
                <button-custom class="button"  title="确定" />
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import buttonCustom from '_c/duno-m/buttonCustom'
    export default {
        name: 'personJudge',
        components: {
            buttonCustom
        },
        data() {
            return {
                value: '',
                formData:{
                    input: '',
                    inputT: '',
                    select: ''
                },
                options: [
                    {
                        value: '选项1',
                        label: '黄金糕'
                    }, {
                        value: '选项2',
                        label: '双皮奶'
                    }, {
                        value: '选项3',
                        label: '蚵仔煎'
                    }, {
                        value: '选项4',
                        label: '龙须面'
                    }, {
                        value: '选项5',
                        label: '北京烤鸭'
                    }
                ],
                dialogVisible: false
            }
        },
        props: {
            visible:{
                type: Boolean,
                default: false
            }
        },
        watch:{
            visible:{
                handler(now){
                    this.dialogVisible = now
                },
                immediate: true
            }
        },
        computed: {

        },
        methods:{

        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    .personJudge{
        .itemInput{
            margin-bottom: 20px;
            width: 100%;
            &:last-child{
                margin-bottom: 0;
            }
        }
        .dialog-footer{
            display: flex;
            justify-content: center;
            .button{
                height: 37px;
                line-height: 31px;
                font-size: 14px;
                &:first-child{
                    margin-right: 30px;
                }
            }
        }
    }
</style>

