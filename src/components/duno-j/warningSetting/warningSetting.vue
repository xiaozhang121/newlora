<template>
  <el-dialog
    v-dialogDrag
    custom-class='myDia'
    title='告警提示设置'
    :visible="visible"
    center
    width='400px'
    @close='handleClose'>
    <div class="elForm">
      <el-form
              ref='form'
              :model="form"
              label-width="120px"
              :label-position='"left"'
              :hide-required-asterisk='true'
      >
        <el-form-item
                :rules='rules'
                prop='dangerAction'
                label="缺陷告警">
          <div class="formItem">
            <span>危急</span>
            <el-select
                    v-model="form.dangerAction"
                    placeholder="请选择"
            >
              <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item  :rules='rules' prop='seriousAction'>
          <div class="formItem">
            <span>严重</span>
            <el-select
                    v-model="form.seriousAction"
                    placeholder="请选择"
            >
              <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item  :rules='rules' prop='normalAction'>
          <div class="formItem">
            <span>一般</span>
            <el-select
                    v-model="form.normalAction"
                    placeholder="请选择"
            >
              <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </el-form-item>
        <el-form-item :rules='rules' prop='defectStatus'>
          <el-switch
                  v-model="form.defectStatus"
                  inactive-text="声音提示"
          >
          </el-switch>
        </el-form-item>
        <!-- <el-form-item :rules='rules' prop='people'  label="">
           <el-select
             v-model="form.people"
             placeholder="请选择"
             >
             <el-option
               v-for="item in options"
               :key="item.value"
               :label="item.label"
               :value="item.value">
             </el-option>
           </el-select>
         </el-form-item>-->
        <el-form-item :rules='rules' prop='envAction'  label="动态环境异常">
          <el-select
                  v-model="form.envAction"
                  placeholder="请选择"
          >
            <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :rules='rules' prop='securityStatus'>
          <el-switch
                  v-model="form.securityStatus"
                  inactive-text="声音提示"
          >
          </el-switch>
        </el-form-item>
      </el-form>
      <div slot='footer'>
        <div class="footer">
          <el-button
                  @click='handleClose'
                  size='medium'
                  class='warningBtn'
          >取消</el-button>
          <el-button
                  @click='submitForm("form")'
                  size='medium'
                  class='warningBtn'>确定</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { getAlarmAction } from '@/api/currency/currency.js'
import { getAxiosData, postAxiosData } from "@/api/axiosType";
export default {
  props: {
    visibleOption: {
      type: Boolean
    }
  },
  watch:{
      visibleOption(now){
          this.visible = now
      }
  },
  data () {
    return {
      visible: false,
      options: [
      /*{
        value: '弹窗',
        label: '弹窗'
      },{
        value: '闪烁',
        label: '闪烁'
      },{
        value: '不提示仅记录',
        label: '不提示仅记录'
      }*/
      ],
      form: {
        dangerAction: '',
        seriousAction: '',
        normalAction: '',
        envAction: '',
        securityStatus: false,
        defectStatus: false
      },
      rules: {
        required: true,
        message: '请选择',
        trigger: 'blur'
      }
    }
  },
  methods: {
    initData(){
        const that = this
        getAlarmAction().then(res=>{
            that.options = res.data
            that.$forceUpdate()
            this.initSelect()
        })
    },
    setData(){
        let query = JSON.parse(JSON.stringify(this.form))
        query['defectStatus']?query['defectStatus'] = 1:query['defectStatus'] = 0
        query['securityStatus']?query['securityStatus'] = 1:query['securityStatus'] = 0
        query['userId'] = this.$store.state.user.userId
        postAxiosData('/lenovo-alarm/api/alarm-tip/set',query).then(res=>{
            if(res.data.isSuccess){
                this.$message.success(res.errorMessage)
            }else{
                this.$message.error(res.errorMessage)
            }
        })
    },
    initSelect(){
        const that = this
        getAxiosData('/lenovo-alarm/api/alarm-tip/info',{userId:this.$store.state.user.userId}).then(res=>{
            that.form = {
                dangerAction: res.data.dangerAction,
                envAction: res.data.envAction,
                normalAction: res.data.normalAction,
                personAction: res.data.personAction,
                securityStatus: res.data.securityStatus==1?true:false,
                defectStatus: res.data.defectStatus==1?true:false,
                seriousAction: res.data.seriousAction
            }
            that.$forceUpdate()
        })
    },
    handleClose() {
      this.visible = false
      this.$emit('handleClose')
    },
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate((valid, obj) => {
        if (valid) {
          that.setData()
          this.$emit('submitSetting', this.form)
        } else {
          return false;
        }
      });
    },
  },
  created(){
      this.initData()
  }
}
</script>
<style lang='scss'>
.myDia {
  background-color: #eee;
  .formItem{
    display: flex;
    & > span{
      width: 47px;
    }
  }
  .elForm{
    padding: 0 20px;
  }
  .footer{
    text-align: center;
  }
  .warningBtn {
    background-image: linear-gradient(0deg, #1b303a 0%, #287982 100%);
    color: #fff;
    .el-form-item__label{
      text-align: right !important;
    }
    span{
        padding-left: 10px;
        padding-right: 10px;
    }
  }
}
</style>

