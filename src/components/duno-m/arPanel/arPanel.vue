<template>
    <div class="arPanel">
        <el-dialog :model="true" :close-on-click-modal="false"  class="elDialogClass" :visible.sync="visibleOption" width="450px" center @close="handleClose">
            <div slot="title">
                {{ title }}
            </div>
            <el-form label-position="left" :rules="rules" ref="form" :model="form" label-width="100px">
                <el-form-item label="设备组件"  prop="devCom">
                    <el-select v-model="form.devCom" placeholder="请选择">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="电压区域">
                    <el-select v-model="form.volRegion" placeholder="请选择（非必选）">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="被监测设备">
                    <el-select v-model="form.monitorEquip" placeholder="请选择（非必选）">
                        <el-option label="区域一" value="shanghai"></el-option>
                        <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                    <button-custom class="button" @click.native="handleClose" title="取消" />
                    <button-custom class="button" @click.native="handleSubmit" title="确定" />
            </span>
        </el-dialog>
    </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import arPanel from "_c/duno-m/arPanel"
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
    name: 'arPanel',
    components: {
        buttonCustom,
        arPanel
    },
    data() {
        return {
          rules: {
            devCom: [
              { required: true, message: '请选择设备组件', trigger: 'change' }
            ],
          },
          form: {
            devCom: '',
            volRegion: '',
            monitorEquip: ''
          },
          visibleOption: false
        }
    },
    watch:{
        visible(now){
            this.visibleOption = now
        },
    },
    props: {
        params: {
            type: Object,
            default: ()=>{
              return {}
            }
        },
        title: {
            type: String,
            default: '修改图片'
        },
        visible:{
            type: Boolean,
            default: () => {
                return false
            }
        }
    },
    computed: {

    },
    methods:{
      handleClose(){
        this.$emit('on-close')
      },
      handleSubmit(){
        this.$refs['form'].validate((valid) => {
          if (valid) {

          } else {
            return false;
          }
        });
      }
    },
    mounted(){

    }
}
</script>

<style lang="scss">
    .arPanel{
        .el-form-item--small.el-form-item{
            margin-bottom: 27px;
        }
        .el-select{
            width: 95%;
        }
        .el-dialog__close{
            font-size: 26px;
        }
        .el-dialog--center{
            background: #e0e0e0;
        }
        .el-input--small .el-input__inner{
            /*text-align: center;*/
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
        .el-dialog__header{
            font-size: 18px;
            color: #333333;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .el-dialog__headerbtn{
            right: 14px !important;
            top: 19px !important;
        }
        .el-dialog__body{
            margin-top: -15px;
        }
    }
</style>

