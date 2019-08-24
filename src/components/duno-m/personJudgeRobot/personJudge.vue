<template>
  <div class="personJudge">
    <el-dialog
      v-dialogDrag
      title="人工判断"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-input class="itemInput" v-model="dataTyped" placeholder="数据类型"></el-input>
      <el-input class="itemInput" v-model="analysisResultd" placeholder="分析结果"></el-input>
      <span slot="footer" class="dialog-footer">
        <button-custom class="button" @click.native="handleClose" title="取消" />
        <button-custom @click.native="submit" class="button" title="确定" />
      </span>
    </el-dialog>
  </div>
</template>

<script>
    import { postAxiosData, getAxiosData } from '@/api/axiosType'
    import buttonCustom from '_c/duno-m/buttonCustom'
    export default {
        name: 'personJudge',
        components: {
            buttonCustom
        },
        data() {
            return {
                dataTyped: '',
                analysisResultd: '',
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
            taskCurreny:{},
            dataType:{},
            analysisResult:{},
            visible:{
                type: Boolean,
                default: false
            }
        },
        watch:{
            dataType:{
                handler(now, old){
                    if(!old){
                        this.dataTyped = now
                    }
                },
                immediate: true
            },
            analysisResult:{
                handler(now, old){
                    if(!old){
                        this.analysisResultd = now
                    }
                },
                immediate: true
            },
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
            submit(){
                postAxiosData('/lenovo-robot/rest/manualJudge',{'manualRecognType':this.dataTyped, 'manualValueShow':this.analysisResultd, 'taskDeviceId':this.taskCurreny['taskDeviceId']}).then(res=>{
                    if(!res.data.resInfo)
                        this.$message.info('修改成功')
                    else
                        this.$message.info(res.data.resInfo)
                    this.dialogVisible = false
                    this.$emit('on-close')
                })
            },
            handleClose(){
                this.dialogVisible = false
                this.$emit('on-close')
            }
        },
        mounted() {

        }
    }
</script>

<style lang="scss">
.personJudge {
  .itemInput {
    margin-bottom: 20px;
    width: 100%;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: center;
    color: #ffffff;
    .button {
      height: 37px;
      line-height: 31px;
      font-size: 14px;
      &:first-child {
        margin-right: 30px;
      }
    }
  }
  .el-dialog__title {
    font-size: 22px;
    color: #333;
  }
  .el-input__inner {
    background-color: #ffffff;
    border: solid 2px #bcbcbc;
  }
  .el-input__inner::placeholder {
    color: #707070;
  }
  .el-select .el-input.is-focus .el-input__inner {
    background-color: #ffffff;
    border: solid 2px #bcbcbc;
  }
  .el-select .el-input__inner:focus {
    background-color: #ffffff;
    border: solid 2px #bcbcbc;
  }
  .el-select-dropdown {
    width: 100%;
    min-width: 100% !important;
  }
}
.warningDialog .el-dialog__header {
  text-align: center !important;
}
</style>

