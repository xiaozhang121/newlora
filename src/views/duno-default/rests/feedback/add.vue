<template>
  <el-card shadow>
    <form-tep ref="formData" :model="formData" label-width="120px" :rules="ruleValidate" @onSubmit="onFormSubmit" class="feedback">
      <h2>有任何问题或者建议，请告诉我们。</h2>
      <h4>您的建议将会让我们做的更好！</h4>
      <el-row class="feedback-row">
        <el-col :xs="23" :sm="12" :md="8">
          <input-tep
            label="称呼"
            prop="nickname"
            :initialValue="formData.nickname"
            placeholder="请输入"
            @onChange="onChange"
          />
        </el-col>

        <el-col :xs="23" :sm="12" :md="8">
          <input-tep
            label="联系方式"
            prop="phone"
            :initialValue="formData.phone"
            @onChange="onChange"
            placeholder="请输入"
          />
        </el-col>

        <el-col :span="24">
          <el-form-item label="详细描述：" prop="content">
            <duno-tinymce ref="editor" :value="formData.content" @on-change="handleChange"/>
          </el-form-item>
        </el-col>

        <el-col :span="24"><p class="feedback-hint">提示：可直接截图到内容中，并且描述截图内容。</p></el-col>
        <el-col :span="24">
          <el-form-item class="modalBtn">
            <!-- 
            调用fromTep组件中的onSubmit函数，用来触发表单验证，验证通过以后调用formTep组件上的onSubmit参数（函数）
            注意$refs.formData  这里的formData 是本组件上的ref，否则会调用不成功
          -->
            <el-button type="primary" @click="$refs.formData.onSubmit()" :loading="dataListLoading">确定</el-button>
            <el-button @click="$router.go(-1)" style="margin-left: 8px" :disabled="dataListLoading">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </form-tep>
  </el-card>
</template>

<script>
import { FormTep, InputTep } from '_c/Form'
import { DunoTinymce } from '_c/duno-editor'
import { postAxiosData } from '@/api/axiosType'
export default {
  components: {
    FormTep,
    InputTep,
    DunoTinymce
  },
  data () {
    return {
      formData: {
        nickname: '',
        phone: '',
        content: ''
      },
      ruleValidate: {
        content: [{ required: true, message: '请输入详情描述', trigger: 'blur' }]
      },
      dataListLoading: false
    }
  },
  methods: {
    onChange (data) {
      this.formData[data.name] = data.value
      /* 值发生变化调用from组件的中的单个元素验证 */
      this.$refs.formData.$refs.formTep.validateField(data.name)
    },
    handleChange (html) {
      this.formData.content = html
      this.$refs.formData.$refs.formTep.validateField('content')
    },
    onFormSubmit () {
      const that = this
      that.postAdd()
    },
    postAdd () {
      const that = this
      const url = '/venus/crud/SysAdviceFeedback/add'
      const query = {}
      that.dataListLoading = true
      postAxiosData(url, that.formData).then(res => {
        that.dataListLoading = false
        if (res.code !== 200) {
          return that.$message.error(res.msg)
        }
        that.$message.success(res.msg)
        that.$router.go(-1)
      }, error => {
        that.dataListLoading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './index.scss';
</style>