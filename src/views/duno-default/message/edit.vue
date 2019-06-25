<template>
  <el-card>
    <form-tep ref="formData" :model="formData" label-width="120px" @onSubmit="onFormSubmit">
      <select-tep
        label="账号"
        placeholder="请选择"
        prop="account"
        :multiple="false"
        :clearable="false"
        :filterable="false"
        :initialValue="formData.account"
        entityName="SysUser"
        :isDictionaries="false"
        :rules="{required: true, message: '请选择账号', trigger: 'change'}"
        @onChange="onChange"
      />

      <input-tep
        label="路径"
        prop="url"
        :initialValue="formData.url"
        placeholder="请输入"
        :rules="{required: true, message: '请输入路径', trigger: 'blur'}"
        @onChange="onChange"
      />

      <input-tep
        label="内容"
        prop="content"
        type="textarea"
        :initialValue="formData.content"
        placeholder="请输入"
        :rules="{required: true, message: '请输入内容', trigger: 'blur'}"
        @onChange="onChange"
      />

      <el-form-item class="modalBtn">
        <!-- 
          调用fromTep组件中的onSubmit函数，用来触发表单验证，验证通过以后调用formTep组件上的onSubmit参数（函数）
          注意$refs.formData  这里的formData 是本组件上的ref，否则会调用不成功
        -->
        <el-button type="primary" @click="$refs.formData.onSubmit()" :loading="dataListLoading">确定</el-button>
        <el-button @click="$router.go(-1)" style="margin-left: 8px" :disabled="dataListLoading">返回</el-button>
      </el-form-item>
    </form-tep>
  </el-card>
</template>

<script>
import { FormTep, InputTep, SelectTep } from '_c/Form'
import mixinViewModule from '@/mixins/view-module'
export default {
  mixins: [mixinViewModule],
  name: 'editRole',
  components: { FormTep, InputTep, SelectTep },
  data () {
    return {
      mixinViewModuleOptions: {
        addURL: '/venus/crud/SysMessage/add', //  新增接口
        toEditURL: '/venus/crud/SysMessage/toEdit', //  编辑回显接口
        editURL: '/venus/crud/SysMessage/edit' //  编辑接口
      },
      formData: {
        account: '',
        url: '',
        content: ''
      },
      query: {}
    }
  },
  methods: {
    init () {
      this.query = { ...this.$route.query }
      if (this.query.id) {
        this.toEdit()
      }
    },
    onChange (data) {
      this.formData[data.name] = data.value
      /* 值发生变化调用from组件的中的单个元素验证 */
      this.$refs.formData.$refs.formTep.validateField(data.name)
    },
    onFormSubmit () {
      const that = this
      if (that.query.id) {
        that.postEdit()
      } else {
        that.postAdd()
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>
