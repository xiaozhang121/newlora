<template>
    <div class="createTask" v-if="visibleOption">
        <el-dialog v-dialogDrag :model="true"  class="elDialogClass" :visible="visibleOption" width="700px" center @close="handleClose">
            <div slot="title">
                创建新的任务配置
            </div>
            <div class="main">
               <div class="steps">
                   <steps :step="stepValue"/>
               </div>
              <first-panel :rowData="rowData"  ref="panel[0]" v-show="stepValue == 1" class="panel"/>
              <second-panel :rowData="rowData" :list="dataObjList['0']" ref="panel[1]" v-show="stepValue == 2" class="panel"/>
              <third-panel :rowData="rowData" :list="dataObjList['1']" ref="panel[2]" v-show="stepValue == 3" class="panel"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <button-custom v-if="stepValue == 1" class="button" @click.native="cancel" title="取消" />
                <button-custom v-else="stepValue != 1" class="button" @click.native="toPre" title="上一步" />
                <button-custom v-if="stepValue!=3" class="button" @click.native="toNext" title="下一步" />
                <button-custom v-if="rowDataLength == 0 && stepValue == 3" class="button" @click.native="toSubmit" title="确认" />
                <button-custom v-if="rowDataLength != 0 && stepValue == 3" class="button" @click.native="toEdit" title="编辑" />
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
            dataObjList: {
                '0':[],
                '1':[],
                '2':[]
            },
            visibleOption: false,
            stepValue: 1
        }
    },
    watch:{
        visible(now){
            this.visibleOption = now
        },
        stepValue(now, old){
            this.dataObjList[old-1] = this.$refs[`panel[${old-1}]`].$data
            this.$forceUpdate()
        }
    },
    props: {
        rowData:{
           type: Object,
           default: () => {
               return {};
           }
        },
        visible:{
           type: Boolean,
           default:()=>{
               return false
           }
        }
    },
    computed: {
        rowDataLength(){
            return Object.keys(this.rowData).length
        }
    },
    methods:{
        toEdit(){

        },
        toSubmit(){
            let obj = {}
            let data = []
            obj['planDate'] = {
                ['planCycle']:this.$refs['panel[2]'].$data.value,
                ['value']:[{'startTime': new Date(this.$refs['panel[2]'].$data.value3).getHours()+':'+new Date(this.$refs['panel[2]'].$data.value3).getMinutes()+':'+new Date(this.$refs['panel[2]'].$data.value3).getSeconds()}]
            }
            obj['planType'] = this.$refs['panel[0]'].$data.form.taskKind
            obj['deviceJson'] = []
            data = this.$refs['panel[1]'].$data.dataList
            for(let i=0; i<data.length; i++){
                data[i]['monitorDevices'].forEach(item=>{
                    if(item['isCheck']){
                        obj['deviceJson'].push({
                            deviceType: data[i]['deviceType'],
                            deviceId: data[i]['powerDeviceId'],
                            deviceName: data[i]['powerDeviceName'],
                            monitorDeviceId: item['monitorDeviceId'],
                            monitorDeviceType: item['monitorDeviceType'],
                            roiId: item['roiId']
                        })
                    }
                })
            }
            obj['startnow'] = 2
            obj['planName'] = this.$refs['panel[0]'].$data.form.taskName
            obj['startTime'] =  new Date(this.$refs['panel[2]'].$data.value3).getFullYear()+'-'+(new Date(this.$refs['panel[2]'].$data.value3).getMonth()*1+1)+'-'+new Date(this.$refs['panel[2]'].$data.value3).getDate()
            postAxiosData('/lenovo-plan/api/plan/create', obj).then(res=>{
                if(res.data.isSuccess){
                    this.$message.success('创建成功')
                    this.$emit('on-fresh')
                    this.handleClose()
                }else{
                    this.$message.fail('创建失败')
                }
            })
        },
        toPre(){
            this.stepValue--
        },
        handleClose(){
            this.$emit('on-close')
        },
        cancel(){
            this.$emit('on-close')
        },
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

