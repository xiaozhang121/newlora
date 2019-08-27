<template>
    <div class="createTask">
        <el-dialog v-dialogDrag :model="true"  class="elDialogClass" :visible="visibleOption" width="700px" center @close="handleClose">
            <div slot="title">
                创建新的任务配置
            </div>
            <div class="main">
               <div class="steps">
                   <steps :step="stepValue"/>
               </div>
              <first-panel v-show="stepValue == 1" class="panel"/>
              <second-panel v-show="stepValue == 2" class="panel"/>
              <third-panel v-show="stepValue == 3" class="panel"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <button-custom v-if="stepValue == 1" class="button" @click.native="cancel" title="取消" />
                <button-custom v-else="stepValue != 1" class="button" @click.native="toPre" title="上一步" />
                <button-custom v-if="stepValue!=3" class="button" @click.native="toNext" title="下一步" />
                <button-custom v-else class="button" @click.native="toSubmit" title="确认" />
            </span>
        </el-dialog>
    </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import firstPanel from "_c/duno-m/createTask/components/panel/first.vue";
import secondPanel from "_c/duno-m/createTask/components/panel/second.vue";
import thirdPanel from "_c/duno-m/createTask/components/panel/third.vue";
import steps from '_c/duno-m/steps'
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
    name: 'createTask',
    components: {
        buttonCustom,
        steps,
        firstPanel,
        secondPanel,
        thirdPanel
    },
    data() {
        return {
            visibleOption: true,
            stepValue: 1
        }
    },
    watch:{
        visible(now){
            this.visibleOption = now
        }
    },
    props: {
        visible:{
           type: Boolean,
           default:()=>{
               return false
           }
        }
    },
    computed: {

    },
    methods:{
        toSubmit(){
            this.$message.info('提交')
        },
        toPre(){
            this.stepValue--
        },
        handleClose(){

        },
        cancel(){},
        toNext(){
            this.stepValue++
        }
    },
    mounted(){

    }
}
</script>

<style lang="scss">
    .createTask{
        .el-dialog__header{
            font-size: 17px;
            color: #333333;
            font-weight: bold;
        }
        .el-input--small .el-input__inner{
            /*text-align: center;*/
        }
        .el-dialog--center{
            background: #e0e0e0;
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
        .el-dialog__headerbtn{
            right: 14px !important;
            top: 6px !important;
        }
        .el-dialog__body{
            margin-top: -15px;
        }
        .main{
            line-height: 44px;
            .steps{
                width: 95%;
                margin: 0 auto;
            }
            .panel{
                margin-top: 20px;
            }
            p{
                font-size: 16px;
                color: #707070;
                &:last-child{
                    display: flex;
                    align-items: center;
                }
                .el-input--small{
                    width: 71%;
                    margin-left: 20px;
                }
            }
        }
    }
</style>

