/*
* FormTep： form组件，参数请参考element-ui框架
* InputTep： input输入框组件，参数请参考element-ui框架
* SelectTep： select下拉框组件（不可以远程搜索），参数请参考element-ui框架
* longSelectTep： select下拉框组件（远程搜索），参数请参考element-ui框架
* RadioTep： radio单选组件，参数请参考element-ui框架
* CheckboxTep： checkbox多选组件，参数请参考element-ui框架
* DatePickerTep： datePicker日期选择组件，参数请参考element-ui框架
* InputNumberTep： inputNumber计数器组件，参数请参考element-ui框架
* UpLoadTep： upLoad上传功能组件，参数请参考element-ui框架
* DunoUpLoadTep： upDatasd自定义上传图片、文件、视频组件
* DunoDetailsTep： 详情组件，用于展示型的内容使用
* CascaderTep： Cascader 级联选择器，参数请参考element-ui框架
* */
export { default as FormTep } from './form/index.vue'
export { default as InputTep } from './input/index.vue'
export { default as SelectTep } from './select/index.vue'
export { default as longSelectTep } from './select/longSelect.vue'
export { default as RadioTep } from './Radio/index.vue'
export { default as CheckboxTep } from './Checkbox/index.vue'
export { default as DatePickerTep } from './DatePicker/index.vue'
export { default as InputNumberTep } from './InputNumber/index.vue'
export { default as UpLoadTep } from './upload/upload.vue'
export { default as DunoUpLoadTep } from './upload/duno-upload.vue'
export { default as DunoDetailsTep } from './details/index.vue'
export { default as CascaderTep } from './cascader/index.vue'


/* 
  使用方法
  import { FormTep, InputTep, SelectTep, RadioTep, CheckboxTep, InputNumberTep, DunoDetailsTep, DatePickerTep, CascaderTep } from '_c/Form'

  <form-tep ref="formData" class="formData" :model="newFormData" label-width="130px" @onSubmit="onFormSubmit">
      <select-tep
        label="通知方式"
        placeholder="请选择通知方式"
        prop="noticeType"
        :multiple="false"
        :clearable="false"
        :filterable="false"
        :initialValue="newFormData.noticeType"
        entityName="notice_type"
        :isDictionaries="true"
        :rules="{required: true, message: '请选择通知方式', trigger: 'change'}"
        @onChange="onChange"
      />

      <radio-tep
        label="通知方式"
        placeholder="请选择通知方式"
        prop="noticeType"
        :initialValue="newFormData.noticeType"
        entityName="notice_type"
        :isDictionaries="true"
        :rules="{required: true, message: '请选择通知方式', trigger: 'change'}"
        @onChange="onChange"
      />

      <checkbox-tep
        label="通知方式"
        placeholder="请选择通知方式"
        prop="noticeType"
        :initialValue="newFormData.noticeType"
        entityName="notice_type"
        :isDictionaries="true"
        :rules="{required: true, message: '请选择通知方式', trigger: 'change'}"
        @onChange="onChange"
      />

      <input-number-tep
        label="蒸发量"
        prop="evaporation"
        :initialValue="formData.evaporation"
        :rules="[{required: true, type: 'number', message: '请输入蒸发量', trigger: 'blur'}]"
        @onChange="onChange"
      />

      <up-load-tep
        label="上传"
        prop="evaporation"
        :initialValue="formData.evaporation"
        upUrl="venus/oss/upload"
        accept="image/*"
        isCompress="1"
        :rules="{required: true, message: '请选择上传文件', trigger: 'change'}"
        @onChange="onChange"
      />

      <input-tep
        label="来源名称/账号"
        prop="sourceAccount"
        :initialValue="formData.sourceAccount"
        placeholder="请输入"
        :rules="{ required: true, message: '请输入来源名称/账号', trigger: 'blur' }"
        @onChange="onChange"
      />

      <date-picker-tep
        label="开始时间"
        prop="startDate"
        :initialValue="formData.startDate"
        type="date"
        placeholder="请选择开始时间"
        :rules="[{required: true, message: '请选择开始时间', trigger: 'change'}, {validator: startDate, trigger: 'change'}]"
        @onChange="onChange"
      />

      <duno-details-tep
        label="邮箱地址"
        :initialValue="formData.mailAddr"
      />

      <cascader-tep
        label="级联选择器"
        prop="startDate"
        :optionData="optionData"
        :initialValue="formData.startDate"
        :rules="[{required: true, type: 'array', min: 1, message: '请选择级联选择器', trigger: 'change'}]"
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

*/