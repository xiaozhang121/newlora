<template>
  <el-dialog
    custom-class='myDia'
    title='告警提示设置'
    :visible="visible"
    center
    width='400px'
    @close='handleClose'>
    <el-form 
      ref='form' 
      :model="form" 
      label-width="120px" 
      :label-position='"left"'
      :hide-required-asterisk='true'
      >
      <el-form-item 
        :rules='rules' 
        prop='danger' 
        label="缺陷告警">
        <el-select
          v-model="form.danger"
          placeholder="危急：请选择"
          >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :rules='rules' prop='serious'>
        <el-select
          v-model="form.serious" 
          placeholder="严重：请选择"
          >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :rules='rules' prop='primary'>
        <el-select
          v-model="form.primary"
          placeholder="一般：请选择"
          >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item :rules='rules' prop='people'  label="人员警告">
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
      </el-form-item>
      <el-form-item :rules='rules' prop='environment'  label="环境异常">
        <el-select
          v-model="form.environment" 
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
    </el-form>
    <div slot='footer'>
      <el-button 
        @click='handleClose' 
        size='medium' 
        class='warningBtn'
        >取消</el-button>
      <el-button 
        @click='submitForm("form")' 
        size='medium' 
        class='warningBtn'>确定</el-button>
    </div>,
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean
    }
  },
  data () {
    return {
      options: [{
        value: '弹窗',
        label: '弹窗'
      },{
        value: '闪烁',
        label: '闪烁'
      },{
        value: '不提示仅记录',
        label: '不提示仅记录'
      }],
      form: {
        danger: '',
        serious: '',
        primary: '',
        people: '',
        environment: ''
      },
      rules: {
        required: true,
        message: '请选择',
        trigger: 'blur'
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('handleClose')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid, obj) => {
        if (valid) {
          this.$emit('submitSetting', this.form)
        } else {
          return false;
        }
      });
    },
  }
}
</script>
<style lang='scss'>
.myDia {
  background-color: #eee;
  .warningBtn {
    background-color: #00688B;
    color: #fff;
  }
}
</style>

