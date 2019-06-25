const mapJson = require('_c/duno-city-ganged/map.json')
export default {
  data () {
    return {
      mixinsProvince: [],
      mixinsCity: [],
      mixinsBlock: []
    }
  },
  created () {
    this.mixinsGetCityData()
  },
  methods: {
    // 加载china地点数据，三级
    mixinsGetCityData () {
      let that = this
      that.mixinsProvince = []
      that.mixinsCity = []
      that.mixinsBlock = []
      // 省市区数据分类
      for (let item in mapJson) {
        if (item.match(/0000$/)) { // 省
          that.mixinsProvince.push({ id: item, value: mapJson[item], children: [] })
        } else if (item.match(/00$/)) { // 市
          that.mixinsCity.push({ id: item, value: mapJson[item], children: [] })
        } else { // 区
          that.mixinsBlock.push({ id: item, value: mapJson[item] })
        }
      }
      // 分类市级
      for (let index in that.mixinsProvince) {
        for (let index1 in that.mixinsCity) {
          if (that.mixinsProvince[index].id.slice(0, 2) === that.mixinsCity[index1].id.slice(0, 2)) {
            that.mixinsProvince[index].children.push(that.mixinsCity[index1])
          }
        }
      }
      // 分类区级
      for (let item1 in that.mixinsCity) {
        for (let item2 in that.mixinsBlock) {
          if (that.mixinsBlock[item2].id.slice(0, 4) === that.mixinsCity[item1].id.slice(0, 4)) {
            that.mixinsCity[item1].children.push(that.mixinsBlock[item2])
          }
        }
      }
    },
    /* 根据城市获取城市编码 */
    mixinsGetCodeNo (data) {
      if (!data) {
        return ''
      }
      const cityArr = data.split(',')
      const cityObj = {}
      if (cityArr.length >= 1) {
        const provinceData = this.mixinspushData(this.mixinsProvince, cityArr[0])
        if (provinceData.length) {
          cityObj.province = provinceData[0].id
          let city = provinceData[0].children
          if (cityArr.length >= 2) {
            const cityData = this.mixinspushData(city, cityArr[1])
            if (cityData.length) {
              cityObj.city = cityData[0].id
              let county = cityData[0].children
              if (cityArr.length >= 3) {
                const countyData = this.mixinspushData(county, cityArr[2])
                if (countyData.length) {
                  cityObj.county = countyData[0].id
                }
              }
            }
          }
        }
      }
      return cityObj
    },
    mixinspushData (arr, value) {
      return arr.filter(item => item.value === value)
    }
  }
}