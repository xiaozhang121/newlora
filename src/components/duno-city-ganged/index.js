export { default as DunoCityGanged } from './linkage.vue'

/* 
  使用方法

  import { DunoCityGanged } from '_c/duno-city-ganged'

  <duno-city-ganged
    label="选择地区"               // title名称
    prop="cityAll"                // form表单必填项字段，同时组件返回父组件数据时的标识   必填
    :required="true"              // 是否必填项
    :province="formData.province" // 省   必填
    :city="formData.city"         // 市   必填
    :county="formData.county"     // 区/县  必填 cityNum为2时可不带
    :cityNum="2"                  // 城市联机数，默认为 3，  可选值是 2 / 3
    @onChange="onChange"
    />

    onChange (data) {
      this.formData[data.name] = data.value     // 城市组合
      if (data.name === 'cityAll') {
        this.formData.province = data.province  // 省
        this.formData.city = data.city          // 市
        this.formData.county = data.county      // 区/县
      }
      console.log(this.formData)
      this.$refs.formData.$refs.formTep.validateField(data.name)
    }

  注意：
  1、必须引入  import citySwitch from '_c/duno-city-ganged/citySwitch' // 编辑回显时中文转换城市编码
  2、mixins: [citySwitch], // 混入到使用组件的模板 
  3、在监听处监听值发生变化时通过中文的地名找到对应的城市编码 示例：
        cosnt val = "山西省,太原市"
        const obj = this.mixinsGetCodeNo(val) || {}
        省编码 = obj.province || ''
        市编码 = obj.city || ''
        区/县编码 = obj.county || ''
*/