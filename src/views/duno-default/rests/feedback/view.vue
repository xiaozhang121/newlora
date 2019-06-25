<template>
  <el-card>
    <el-row :gutter="10" class="viewRow">
      <form-tep ref="formData" :model="formData" label-width="120px">
        <el-col :xs="23" :sm="23" :md="13">
          <duno-details-tep
            label="称呼"
            :initialValue="formData.nickname"
          />
        </el-col>
        <el-col :xs="23" :sm="23" :md="13">
          <duno-details-tep
            label="联系方式"
            :initialValue="formData.phone"
          />
        </el-col>
        <el-col :xs="23" :sm="23" :md="13">
          <duno-details-tep
            label="反馈内容"
            :isHtml="true"
            :initialValue="formData.content"
          />
        </el-col>
        <el-col :xs="23" :sm="23" :md="13">
          <duno-details-tep
            label="提交时间"
            :initialValue="formData.submitTime"
          />
        </el-col>
        <el-col :xs="23" :sm="23" :md="13">
          <duno-details-tep
            label="提交用户"
            :initialValue="formData.sysUserId"
          />
        </el-col>
        <el-col :span="24">
          <el-form-item class="modalBtn">
            <el-button @click="$router.go(-1)">返回</el-button>
          </el-form-item>
        </el-col>
      </form-tep>
    </el-row>
  </el-card>
</template>
<script>
import mixinViewModule from '@/mixins/view-module'
import{ FormTep, DunoDetailsTep } from '_c/Form'
export default {
  mixins: [mixinViewModule],
  name: 'feedbackView',
  components: { FormTep, DunoDetailsTep },
  data () {
    return {
      mixinViewModuleOptions: {
        toEditURL: '/venus/crud/SysAdviceFeedback/view', //  详情接口
      },
      formData: { 
          nickname: null,
          phone: null,
          content: null,
          submitTime: null,
          sysUserId: null
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
  },
  mounted () {
    const that = this
    that.$nextTick(() => {
      that.init()
    })
  }
}
</script>