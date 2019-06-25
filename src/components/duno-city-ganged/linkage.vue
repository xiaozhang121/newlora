<template>
  <div class="linkage">
    <el-form-item :label="label" :prop="prop" :rules="{required: required, message: ' ', trigger: 'change'}" style="margin-bottom: 0;">
      <!-- 省、市、区/县 -->
      <el-row v-if="cityNum >= 3">
        <el-col :span="8">
          <el-form-item label-width="0" :prop="prop" :rules="{required: required, message: '请选择省级地区', trigger: 'change'}">
            <el-select v-model="sheng" @change="choseProvince" style="width: 99%;">
              <el-option v-for="item in province1" :key="item.id" :value="item.id" :label="item.value" placeholder="省级地区"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" :prop="prop" :rules="{required: required, message: '请选择市级地区', trigger: 'change'}">
            <el-select v-model="shi" @change="choseCity" style="width: 99%;">
              <el-option v-for="item in shi1" :key="item.id" :value="item.id" :label="item.value" placeholder="市级地区"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label-width="0" :prop="prop" :rules="{required: required, message: '请选择区级地区', trigger: 'change'}">
            <el-select v-model="qu" @change="choseBlock" style="width: 99%;">
              <el-option v-for="item in qu1" :key="item.id" :value="item.id" :label="item.value" placeholder="区级地区"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <!-- 省、市 -->
      <el-row v-if="cityNum == 2">
        <el-col :span="12">
          <el-form-item label-width="0" :prop="prop" :rules="{required: required, message: '请选择省级地区', trigger: 'change'}">
            <el-select v-model="sheng" @change="choseProvince" style="width: 99%;">
              <el-option v-for="item in province1" :key="item.id" :value="item.id" :label="item.value" placeholder="省级地区"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label-width="0" :prop="prop" :rules="{required: required, message: '请选择市级地区', trigger: 'change'}">
            <el-select v-model="shi" @change="choseCity" style="width: 99%;">
              <el-option v-for="item in shi1" :key="item.id" :value="item.id" :label="item.value" placeholder="市级地区"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form-item>
  </div>
</template>

<script>
export default {
  data () {
    return {
      mapJson: require('./map.json'),
      province1: '',
      sheng: '', // 省编码
      shi: '', // 市编码
      shi1: [],
      qu: '', // 区/县编码
      qu1: [],
      city1: '',
      block: ''
    }
  },
  props: {
    /* 否必填项 */
    required: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    /* title名称 */
    label: {
      type: String,
      default: '地区选择'
    },
    /* form表单必填项字段，同时组件返回父组件数据时的标识   必填 */
    prop: {
      type: String,
      default: ''
    },
    /* 省   必填 */
    province: {
      type: String
    },
    /* 市   必填 */
    city: {
      type: String
    },
    /* 区/县  必填 */
    county: {
      type: String
    },
    cityNum: {
      type: Number,
      default: () => {
        return 3
      }
    }
  },
  watch: {
    province (val) {
      if (val === null || val === undefined) {
        this.sheng = ''
      } else {
        this.sheng = val
        this.choseProvince(val)
      }
    },
    city (val) {
      if (val === null || val === undefined) {
        this.shi = ''
      } else {
        this.choseCity(val)
        this.shi = val
      }
    },
    county (val) {
      if (val === null || val === undefined) {
        this.qu = ''
      } else {
        this.qu = val
        this.choseBlock(val)
      }
    },
    sheng (val) {
      if (val) {
        if (this.shi1.length) {
          this.shi = this.shi1[0].id
        } else {
          this.qu1 = []
        }
      }
    },
    shi (val) {
      if (val) {
        if (this.qu1.length) {
          this.qu = this.qu1[0].id
          this.E = this.qu
        }
      }
    },
    qu (val) {
      if (this.sheng && this.shi && this.qu) {
        console.log('区')
        this.clickEmit()
      }
    }
  },
  methods: {
    // 加载china地点数据，三级
    getCityData () {
      let that = this
      let data = this.mapJson
      that.province1 = []
      that.city1 = []
      that.block = []
      // 省市区数据分类
      for (let item in data) {
        if (item.match(/0000$/)) { // 省
          that.province1.push({ id: item, value: data[item], children: [] })
        } else if (item.match(/00$/)) { // 市
          that.city1.push({ id: item, value: data[item], children: [] })
        } else { // 区
          that.block.push({ id: item, value: data[item] })
        }
      }
      // 分类市级
      for (let index in that.province1) {
        for (let index1 in that.city1) {
          if (that.province1[index].id.slice(0, 2) === that.city1[index1].id.slice(0, 2)) {
            that.province1[index].children.push(that.city1[index1])
          }
        }
      }
      // 分类区级
      for (let item1 in that.city1) {
        for (let item2 in that.block) {
          if (that.block[item2].id.slice(0, 4) === that.city1[item1].id.slice(0, 4)) {
            that.city1[item1].children.push(that.block[item2])
          }
        }
      }
    },
    // 选省
    choseProvince (e) {
      for (let index2 in this.province1) {
        if (e === this.province1[index2].id) {
          const shiChildren = this.province1[index2].children
          this.shi1 = shiChildren
          this.shi = ''
          this.qu1 = shiChildren.length ? shiChildren[0].children : []
          this.qu = ''
          this.E = this.qu1.length ? this.qu1[0].id : ''
          if (!shiChildren.length) {
            this.clickEmit()
          }
          break
        }
      }
    },
    // 选市
    choseCity (e) {
      for (let index3 in this.city1) {
        if (e === this.city1[index3].id) {
          const quChildren = this.city1[index3].children
          this.qu1 = quChildren
          this.qu = ''
          this.E = this.qu1.length ? this.qu1[0].id : ''
          if (!quChildren.length) {
            this.clickEmit()
          }
          break
        }
      }
    },
    // 选区
    choseBlock (e) {
      this.E = e
    },
    clickEmit () {
      let findKey = (value, arr) => {
        const newArr = arr.filter(item => item.id === value)
        if (newArr.length) {
          return newArr[0].value
        } else {
          return ''
        }
      }
      let newObj = {
        name: this.prop,
        value: `${this.sheng ? findKey(this.sheng, this.province1) : ''}${this.shi ? ',' + findKey(this.shi, this.city1) : ''}${this.qu && this.cityNum > 2 ? ',' + findKey(this.qu, this.qu1) : ''}`,
        province: this.sheng,
        city: this.shi,
        county: this.cityNum > 2 ? this.qu : ''
      }
      this.$emit('onChange', newObj)
    }
  },
  created () {
    this.getCityData()
  }
}
</script>

<style scoped>

</style>
