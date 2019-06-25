<template>
  <el-card class="inquire">
    <form-tep
      :label-width="labelWidth"
      :label-position="labelPosition"
      ref="formValidate"
      :model="formValidate"
    >
      <el-row :gutter="10">
        <el-col :xs="23" :sm="12" :md="8" :lg="6" class="inquire-item"  v-for="(item, index) in newData" :key="index">
          <!--输入框-->
          <input-tep
            :label-width="labelWidth"
            v-if="item.type === 'input'"
            :label="item.title"
            :prop="item.name"
            :initialValue="formValidate[item.name]"
            :placeholder="item.title"
            @onChange="onChange"
          />
          <!--下拉框-->
          <select-tep
            :label-width="labelWidth"
            v-if="item.type == 'select'"
            :label="item.title"
            :prop="item.name"
            :placeholder="item.title"
            :multiple="item.multiple ? true : false"
            :clearable="item.clearable ? true : false"
            :filterable="item.filterable ? true : false"
            :initialValue="formValidate[item.name]"
            :entityName="item.entityName"
            :isDictionaries="item.isDictionaries"
            :ganged="item.ganged ? formValidate[item.ganged] : null"
            @onChange="onChange"
          />
          <!--联动下拉框-->
          <long-select-tep
            :label-width="labelWidth"
            v-if="item.type == 'longSelect'"
            :label="item.title"
            :prop="item.name"
            :placeholder="item.title"
            :multiple="item.multiple ? true : false"
            :clearable="item.clearable ? true : false"
            :filterable="item.filterable ? true : false"
            :remote="false"
            :initialValue="formValidate[item.name]"
            :entityName="item.entityName"
            :isDictionaries="item.isDictionaries"
            :ganged="item.ganged ? formValidate[item.ganged] : null"
            @onChange="onChange"
          />
          <!--日期选择-->
          <date-picker-tep
            :label-width="labelWidth"
            v-if="item.type == 'date' || item.type == 'datetime' || item.type == 'datetimerange' || item.type == 'daterange' || item.type == 'month' || item.type == 'year'"
            :label="item.title"
            :prop="item.name"
            :initialValue="formValidate[item.name]"
            :type="item.type"
            :placeholder="item.title"
            :editable="false"
            @onChange="onChange"
          />
          <!--两个数字范围-->
          <el-form-item :label="item.title + '：'" v-if="item.type == 'numArr'" :label-width="labelWidth">
            <el-row>
              <el-col :span="10">
                <el-input-number :min="min" v-model="formValidate[item.name[0]]" placeholder="最小值" style="width: 100%"></el-input-number>
              </el-col>
              <el-col :span="4">
                <div style="width: 100%;text-align: center">至</div>
              </el-col>
              <el-col :span="10">
                <el-input-number :min="min" v-model="formValidate[item.name[1]]" placeholder="最大值" style="width: 100%"></el-input-number>
              </el-col>
            </el-row>
          </el-form-item>

          <!-- 时分秒查询范围 -->
          <el-form-item :label="item.title + '：'" v-if="item.type == 'timeArr'" :label-width="labelWidth">
            <el-row>
              <el-col :span="10">
                <el-time-select placeholder="起始时间" v-model="formValidate[item.name[0]]"
                  :picker-options="{ start: item.start ? item.start : '00:00', step:  item.step ? item.step : '00:15', end:  item.end ? item.end : '24:00', maxTime: formValidate[item.name[1]] }" style="width: 100%">
                </el-time-select>
              </el-col>
              <el-col :span="4">
                <div style="width: 100%;text-align: center">至</div>
              </el-col>
              <el-col :span="10">
                <el-time-select placeholder="结束时间" v-model="formValidate[item.name[1]]"
                  :picker-options="{ start: item.start ? item.start : '00:00', step:  item.step ? item.step : '00:15', end:  item.end ? item.end : '24:00', minTime: formValidate[item.name[0]]}" style="width: 100%">
                </el-time-select>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>

        <el-col :xs="23" :sm="12" :md="8" :lg="6" class="inquire-btn">
          <el-form-item label-width="0">
            <el-button type="primary" class="synchronization" :disabled="isLoad" @click="handleSubmit">搜索</el-button>
            <el-button class="emptyBtn" @click="empty">清空</el-button>
            <el-button type="text" v-if="fromData.length > 3 && user.isSimple" class="Grade" @click="clickGrade(false)">更多搜索<i class="el-icon-arrow-down"></i></el-button>
            <el-button type="text" v-if="fromData.length > 3 && !user.isSimple" class="Grade" @click="clickGrade(true)">简易搜索<i class="el-icon-arrow-up"></i></el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </form-tep>
  </el-card>
</template>

<script>
import { mapState } from 'vuex'
import { FormTep, InputTep, SelectTep, longSelectTep, DatePickerTep } from '_c/Form'
import { isArray } from '@/libs/util'
export default {
  name: 'HeadSearch',
  components: { FormTep, InputTep, SelectTep, longSelectTep, DatePickerTep },
  data () {
    return {
      formValidate: {},
      newData: [],
      timer: false
    }
  },
  props: {
    fromData: Array,
    min: Number,
    isLoad: Boolean,
    labelPosition: {
      type: String,
      default: 'right'
    },
    labelWidth: {
      type: String,
      default: '120px'
    }
  },
  created () { // vue生命周期--创建完毕状态
    this.pushData(this.user.isSimple)
    const newData = this.fromData
    let newObj = {}
    for (let i in newData) {
      if (newData[i].type == 'numArr' || newData[i].type == 'timeArr') {
        newObj[newData[i].name[0]] = null
        newObj[newData[i].name[1]] = null
      } else {
        newObj[newData[i].name] = newData[i].initial ? newData[i].initial : ''
      }
    }
    this.formValidate = newObj
  },
  watch: {},
  computed: {
    ...mapState([
      'user'
    ])
  },
  methods: {
    pushData (flag) {
      if (flag) {
        let index = this.fromData.length
        let fromData = []
        index = index > 3 ? 3 : index
        for (let i = 0; i < index; i++) {
          fromData.push(this.fromData[i])
        }
        this.newData = fromData
      } else {
        this.newData = this.fromData
      }
    },
    handleSubmit () {
      const that = this
      let newObj = {}
      for (let i in that.newData) {
        if (that.newData[i].type == 'numArr' || that.newData[i].type == 'timeArr') {
          let data = that.formValidate[that.newData[i].name[0]]
          let data1 = that.formValidate[that.newData[i].name[1]]
          newObj[that.newData[i].name[0]] =  !data && data != 0 ? '' : data
          newObj[that.newData[i].name[1]] =  !data1 && data1 != 0 ? '' : data1
        } else if (that.newData[i].type == 'daterange' || that.newData[i].type == 'datetimerange') {
          let data = that.formValidate[that.newData[i].name]
          newObj[that.newData[i].name + 'StartDate'] = data[0] || ''
          newObj[that.newData[i].name + 'EndDate'] = data[1] || ''
        } else if (isArray(that.formValidate[that.newData[i].name])) {
          newObj[that.newData[i].name] = that.formValidate[that.newData[i].name].join(',')
        } else {
          let data = that.formValidate[that.newData[i].name]
          newObj[that.newData[i].name] = !data ? '' : data
        }
      }
      this.$emit('clcikSearch', newObj)// 点击查询事件触发后，自动触发receptionData事件，并且带参数data
    },
    empty () { // 清空
      for (let key in this.formValidate) {
        if (isArray(this.formValidate[key])) {
          this.formValidate[key] = []
        } else {
          this.formValidate[key] = null
        }
      }
      this.$emit('clcikSearch', this.formValidate)
    },
    clickGrade (flag) {
      this.user.isSimple = flag
      this.pushData(flag)
    },
    onChange (obj) {
      this.formValidate[obj.name] = obj.value
    }
  },
  mounted () {}
}
</script>

<style lang="scss">
  .inquire{
    margin-bottom: 15px;
    min-width: 165px;
    .inquire-btn{
      float: right;
      text-align: right;
      .emptyBtn{
        margin-left: 5px;
        margin-right: 5px;
      }
      .Grade{
        font-size: 15px;
        padding: 5px;
      }
      .Grade:focus{
        box-shadow: none;
      }
    }

    .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
      margin: 5px 0;
    }
  }
</style>