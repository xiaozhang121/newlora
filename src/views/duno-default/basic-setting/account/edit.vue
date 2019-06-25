<template>
  <el-card>
    <form-tep ref="formData" :model="formData" label-width="110px" @onSubmit="onFormSubmit">
      <input-tep
        v-if="!disabled"
        label="账号"
        prop="account"
        :initialValue="formData.account"
        placeholder="请输入"
        :rules="accountValidate"
        @onChange="onChange"
      />

      <duno-details-tep
        v-if="disabled"
        label="账号"
        :initialValue="formData.account"
      />

      <input-tep
        label="昵称"
        prop="username"
        :initialValue="formData.username"
        placeholder="请输入"
        :rules="{ required: true, message: '请输入昵称', trigger: 'blur' }"
        @onChange="onChange"
      />

      <input-tep
        label="账号拼音"
        prop="namePinyin"
        :initialValue="formData.namePinyin"
        placeholder="请输入"
        :rules="{ required: true, message: '请输入账号拼音', trigger: 'blur' }"
        @onChange="onChange"
      />

      <select-tep
        label="角色"
        placeholder="请选择"
        prop="role"
        :multiple="true"
        :clearable="false"
        :filterable="false"
        :initialValue="formData.role"
        entityName="SysRole"
        :isDictionaries="false"
        :rules="{ required: true, message: '请选择角色', trigger: 'change' }"
        @onChange="onChange"
      />

      <input-tep
        label="手机号"
        prop="phone"
        :initialValue="formData.phone"
        placeholder="请输入"
        :rules="phoneValidate"
        @onChange="onChange"
      />

      <input-tep
        label="邮箱"
        prop="email"
        :initialValue="formData.email"
        placeholder="请输入"
        :rules="[{ required: true, message: '邮箱不能为空', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }]"
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
import { FormTep, InputTep, SelectTep, DunoDetailsTep } from '_c/Form'
import mixinViewModule from '@/mixins/view-module'
import { isPhone, isAccount } from '@/libs/formVerify'
export default {
  mixins: [mixinViewModule],
  name: 'editRole',
  components: { FormTep, InputTep, SelectTep, DunoDetailsTep },
  data () {
    return {
      mixinViewModuleOptions: {
        addURL: '/venus/crud/SysUser/add', //  新增接口
        toEditURL: '/venus/crud/SysUser/toEdit', //  编辑回显接口
        editURL: '/venus/crud/SysUser/edit' //  编辑接口
      },
      formData: {
        account: '',
        username: '',
        namePinyin: '',
        role: '',
        phone: '',
        email: ''
      },
      query: {},
      disabled: false
    }
  },
  computed: {
    accountValidate () {
      return [{ required: true, message: '账号不能为空', trigger: 'blur' }, { validator: isAccount, trigger: 'blur' }]
    },
    phoneValidate () {
      return  [{ required: true, message: '手机号不能为空', trigger: 'blur' }, { validator: isPhone, trigger: 'blur' }]
    }
  },
  methods: {
    init () {
      this.query = { ...this.$route.query }
      if (this.query.id) {
        this.toEdit()
        this.disabled = true
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