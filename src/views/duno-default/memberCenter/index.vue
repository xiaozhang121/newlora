<template>
  <el-card class="memberCenter">
    <el-row>
      <form-tep
        ref="formValidate"
        label-width='100px'
        :model="formData"
         @onSubmit="onFormSubmit"
      >
        <el-col :xs="24" :md="13">
          <el-form-item label="头像：">
            <div>
              <img class="memberCenter-head" v-if="!isAvator" :src="$store.state.user.avatorImgPath">
              <img class="memberCenter-head" v-else :src="formData.avator">
              <div class="memberCenter-upDiv">
                <duno-up-load-tep
                  prop="avator"
                  accept="image/*"
                  isCompress="1"
                  upUrl="venus/oss/upload"
                  @onChange="onChange"
                />
              </div>
            </div>
          </el-form-item>
        </el-col>

        <el-col :xs="24" :md="13">
          <duno-details-tep
            label="用户名"
            :initialValue="formData.username"
          />
        </el-col>

        <el-col :xs="24" :md="13">
          <input-tep
            label="手机号"
            prop="phone"
            :initialValue="formData.phone"
            placeholder="请输入"
            :rules="verifyPhone"
            @onChange="onChange"
          />
        </el-col>

        <el-col :xs="24" :md="13">
          <input-tep
            label="邮箱"
            prop="email"
            :initialValue="formData.email"
            placeholder="请输入"
            :rules="[{ required: true, message: '邮箱不能为空', trigger: 'blur' }, { type: 'email', message: '请输入正确的邮箱', trigger: 'blur' }]"
            @onChange="onChange"
          />
        </el-col>

        <el-col :xs="24" :md="13">
          <el-form-item>
            <!-- 
              调用fromTep组件中的onSubmit函数，用来触发表单验证，验证通过以后调用formTep组件上的onSubmit参数（函数）
              注意$refs.formValidate  这里的formValidate 是本组件上的ref，否则会调用不成功
            -->
            <el-button type="primary" @click="$refs.formValidate.onSubmit()" :loading="dataListLoading">提交</el-button>
          </el-form-item>
        </el-col>
      </form-tep>
    </el-row>
  </el-card>
</template>

<script>
  import { FormTep, InputTep, DunoUpLoadTep, DunoDetailsTep } from '_c/Form'
  import { isPhone } from '@/libs/formVerify'
  import mixinViewModule from '@/mixins/view-module'
  export default {
    mixins: [mixinViewModule],
    name: 'PersonalCenter',
    components: { FormTep, InputTep, DunoUpLoadTep, DunoDetailsTep },
    data () {
      return {
        isAvator: false,
        mixinViewModuleOptions: {
          toEditURL: '/venus/crud/SysUser/toEdit', //  编辑回显接口
          editURL: '/venus/crud/SysUser/edit' //  编辑接口
        },
        query: {},
        timer: false,
        suffix: false,
        upImgData: null,
        formData: {
          avator: '',
          username: '',
          phone: '',
          email: ''
        }
      }
    },
    computed: {
      verifyPhone () {
        return [{ required: true, message: '手机号不能为空', trigger: 'blur' }, { validator: isPhone, trigger: 'blur' }]
      }
    },
    methods: {
      setAvatorUrl (now) {
        if (now) {
          this.isAvator = true
          this.$message.success('上传成功，但未保存')
        } else {
          this.isAvator = false
        }
      },
      onChange (data) {
        if (data.name === 'avator') {
          this.setAvatorUrl(data.value)
        }
        this.formData[data.name] = data.value
        /* 值发生变化调用from组件的中的单个元素验证 */
        this.$refs.formValidate.$refs.formTep.validateField(data.name)
      },
      setAvator () {
        const avator = this.formData.avator ? this.formData.avator : this.avator
        this.$store.state.user.avatorImgPath = avator
      },
      onFormSubmit () {
        const that = this
        that.postEdit(() => that.setAvator())
      }
    },
    mounted () {
      let that = this
      this.query.id = this.$store.state.user.userId
      that.toEdit()
    }
  }
</script>

<style lang="scss" scoped>
  .memberCenter{
    width: 100%;
    min-width: 225px;

    &-head{
      width: 70px;
      height: 70px;
      border-radius: 50%;
      display: inline-block;
      vertical-align: middle;
    }

    &-upDiv{
      display: inline-block;
      width: auto;
      margin-left: 20px;
      vertical-align: middle;
    }
  }
</style>
