<template>
  <div class="timeDiv">
    <el-form class="timeTemplate" label-width="75">
      <el-form-item>
        <template slot="label"><label class="LableDiv"><span>年份</span>：</label></template>
        <div>
          <el-row>
            <el-col :span="4">
              <el-form-item label-width="0">
                <input type="hidden" v-model="yearNum">
                <el-date-picker type="year" @change="creationDateFn" v-model="yearNum" :editable="false" placeholder="年"
                  :clearable="false" style="width: 100%;"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label-width="0" style="text-align: right">
                <el-button style="width: 19%" class="months" :type="isYear ? 'primary' : 'default'"
                  :disabled="isYears.isGreater" @click="weksFn(null, null, yearNum)">
                  <span :class="['Month', 'MonthS0']">全年</span>
                </el-button>
                <el-button style="width: 19%" v-for="i in 4" :key="i" class="months"
                  :type="isQuarter == i ? 'primary' : 'default'" @click="weksFn(null, null, null, i)"
                  :disabled="isClickQuarter(i)">
                  <span :class="['Month', 'MonthS'+ i]">第{{weksArr[(i - 1)]}}季度</span>
                </el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
    </el-form>

    <el-form class="timeTemplate" label-width="75">
      <el-form-item>
        <template slot="label"><label class="LableDiv"><span>月份</span>：</label></template>
        <div>
          <el-dropdown size="mini" split-button
            :type="isMonthCom == i ? 'primary' : 'default'"
            v-for="i in 12" :key="i"
            @click="weksFn(i, 0, null, null, disabled(i))"
            @command="clickMonthFn"
            trigger="click"
            :class="['dropdownBtn', disabled(i) ? 'disabledBtn' : isMonthCom == i ? 'highlight' : '']">
            <label :class="['el-dropdown-link', 'Month', 'MonthS'+ i]">{{ monthArr[(i - 1)] }}</label>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :disabled="disabled(i)" :command="i + '-1'">上旬</el-dropdown-item>
              <el-dropdown-item :disabled="isDayTenFn(i, 10)" :command="i + '-2'">中旬</el-dropdown-item>
              <el-dropdown-item :disabled="isDayTenFn(i, 20)" :command="i+'-3'">下旬</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import { getQuarter, getMonthData, CompareDate } from '@/libs/util'
  import moment from 'moment'
  const newMonth = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] // 月数组
  const newwWeks = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'] // 月数组
  const newwWekss = ['上', '中', '下'] // 月数组
  export default {
    name: 'timeTemplate',
    components: {},
    data() {
      return {
        year: null,
        is_go: true,
        is_zgo: false,
        isYear: false, // 是否选中全年
        nowYear: null, // 现在年份
        nowMonth: null, // 现在月份
        yearNum: null, // 选中的年份
        isQuarter: null, // 选中的季度
        weksNum: null, // 选中的第几周
        isMonth: null, // 选中的月份
        starDate: null, // 开始日期
        theOffset: null, // 偏移量
        isMonthArr: false, // 是否选中全月
        monthArr: [], // 月数组
        weksArr: [], // 月数组
        weksArrs: [], // 月数组
        trigger: 0
      }
    },
    props: {
      postReportData: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    computed: {
      isYears () {
        let that = this
        let year = that.nowYear
        let month = Number(that.nowMonth)
        let isTrue = new Date(that.yearNum).getFullYear() == year ? true : false // 判断是否等于当前年份
        let isGreater = new Date(that.yearNum).getFullYear() > year ? true : false // 判断是否大于当前年份
        let isMonth = 0
        if (month >= 4 && month < 7) {
          isMonth = 1
        } else if (month >= 7 && month < 10) {
          isMonth = 2
        } else if (month >= 10) {
          isMonth = 3
        } else {
          isMonth = 0
        }
        let obj = {
          'isTrue': isTrue,
          'isGreater': isGreater,
          'isMonth': isMonth
        }
        return obj
      },
      isMonthCom () {
        let that = this
        let num = 0
        if (that.starDate && !that.isQuarter && !that.isYear) {
          num = Number(that.starDate.slice(4, 6))
        }
        return num
      }
    },
    methods: {
      isClickQuarter (num) {
        const that = this
        if (!that.isYears.isGreater && !that.isYears.isTrue || (num - 1) == that.isYears.isMonth && !that.isYears.isGreater) {
          return false
        }
        return true
      },
      isDayTen (day) { // 判断是否大于当月10号
        if (!day) return false
        let that = this
        const yearNum = that.yearNum.getFullYear() // 选中的年份
        let falg
        if (that.nowYear) {
          let m = that.nowMonth > 9 ? that.nowMonth.toString() : '0' + that.nowMonth
          day = Number(day) > 9 ? day.toString() : '0' + day
          let newDate = moment().format('YYYY-MM-DD') // 当前时间
          let newDate1 = that.nowYear + '-' + m + '-' + day // 当月10号
          if (that.nowYear == yearNum) {
            falg = CompareDate(newDate, newDate1)
          } else {
            falg = false
          }
        } else {
          falg = false
        }
        return falg
      }, // 判断是否大于当月某一天
      isDayTenFn (index, day) { // 判断中下旬是否可以点击
        let that = this
        if(!that.isMonth){
          that.isMonth = new Date().getMonth()+1
        }
        let nowMonth = new Date().getMonth()+1
        if (!that.isYears.isGreater && !that.isYears.isTrue) {
          return false
        } else if (that.isYears.isGreater) {
          return true
        } else if (that.isYears.isTrue) {
          const newDay = that.year.getDate()
          if (index > nowMonth) {
            return true
          } else {
            if (newDay > day || index < nowMonth) {
              return false
            }
          }
        }
        return true
      }, // 判断下旬是否可以点击
      disabled (index) { // 判断按钮是否可点击
        const yearNum = this.yearNum.getFullYear() // 当前的年份
        let falg = (
          this.isYears.isTrue && index > this.nowMonth ||
          ( index == this.nowMonth && this.nowYear < yearNum)
        ) ||
        this.isYears.isGreater ?
          true : false

        return falg
      },// 判断按钮是否可点击
      creationDateFn(date) { // 选择年份
        let that = this
        that.is_zgo = true
        that.yearNum = new Date(date + '-01-01')
        that.weksFn(null, null)
      },  // 选择年份
      weksFn(month, weksNum, year, quarter,isClick) {  // 点击选择日期（月、周、年、季度）              weksFn(月、周、年、季度)
        let that = this
        if (isClick === true) return
        const yearNum = that.yearNum.getFullYear() // 选中的年份
        that.isMonth = month; // 选中月份
        that.weksNum = weksNum; // 选中的当月第几旬
        that.monthArr = JSON.parse(JSON.stringify(newMonth))// 初始化选中月份
        if (year) {  // 是否选择全年
        // let demo =moment().startOf('year').format('YYYYMMDD')
          that.isYear = true;
          that.isQuarter = null;
          let num = getQuarter(year);
          that.starDate = moment(year).startOf('year').format('YYYYMMDD');
          if(moment(year).isLeapYear()){
            that.theOffset = 366;
          }else{
            that.theOffset = 365;
          }
        // console.log(year+'年有'+num.day+'天，从'+ num.startTime + '开始')
        } else if (quarter) { // 选中季度
          that.isYear = false;
          that.isQuarter = quarter;
          let num = getQuarter(yearNum, quarter);
          that.starDate = num.startTime;
          that.theOffset = num.day;
        // console.log(quarter+'季度有'+num.day+'天，从'+ num.startTime + '开始')
        } else { // 选中月
          that.isYear = false;
          that.isQuarter = null;
          if (weksNum == 0) {  //选择月
            let numObj = getMonthData(yearNum, month)  // 获取当月有多少天，从那天开始
            let starDate = numObj.startTime
            let theOffset
            const newDay = that.year.getDate()
            if (that.isYears.isTrue && that.nowMonth === month && newDay <= 20) {
              theOffset = 10;
              that.monthArr[(month - 1)] = '上旬'
            } else {
              theOffset = numObj.day
            }
            that.starDate = starDate;
            that.theOffset = theOffset;
          // console.log(month+'月一共有'+numObj.day +'天,从'+ numObj.startTime + '开始')
          } else {
            that.starDate = null
            that.theOffset = null
          }
        }
        that.isMonthArr = true
        const newObj = {
          'starDate': that.starDate,
          'theOffset': that.theOffset,
        }
        this.$emit('on-change', newObj)
      },  // 选年、月、季度
      clickMonthFn(weksNum) {  // 点击下拉框
        let arr = weksNum.split('-')
        weksNum = Number(arr[1])
        let that = this
        let month = Number(arr[0]);
        that.isQuarter = null;
        that.isYear = false
        const yearNum = that.yearNum.getFullYear() // 选中的年份
        if (weksNum > 0 && weksNum < 4) {
          let num = getMonthData(yearNum, month);
          let startTime = weksNum == 1 ? num.startTime.substring(0, 6) + '01' : weksNum == 2 ? num.startTime.substring(0, 6) + '11' : num.startTime.substring(0, 6) + '21'
          let newDay = weksNum == 3 ? Number(num.day) - 20 : 10;
          that.starDate = startTime;
          that.theOffset = newDay;
          let period = weksNum == 1 ? '上' : weksNum == 2 ? '中' : '下'
          // console.log( month+'月'+ period +'旬，有'+ that.theOffset +'天,从'+ that.starDate + '开始' )
        } else {
          let num = getMonthData(yearNum, month);
          that.starDate = num.startTime;
          that.theOffset = num.day;
        }
        that.monthArr = JSON.parse(JSON.stringify(newMonth))// 初始化选中月份
        that.monthArr[(month - 1)] = weksNum == 1 ? '上旬' : weksNum == 2 ? '中旬' : '下旬'
        // console.log( month+'月，有'+ that.theOffset +'天,从'+ that.starDate + '开始' )
        const newObj = {
          'starDate': that.starDate,
          'theOffset': that.theOffset,
        }
        this.$emit('on-change', newObj)
      },
      pushData () {
        const that = this
        let date = new Date()
        that.year = new Date()
        that.nowYear = new Date().getFullYear() // 当前的年份
        that.nowMonth = new Date().getMonth() + 1 // 当前的月份
        if (that.postReportData.startTime) {
          let time = that.postReportData.startTime
          time = time.substring(0,8)
          time = moment(time).format('YYYY-MM-DD')
          date = new Date(time)
        }
        that.yearNum = date  // 选中的年份
        that.isMonth = date.getMonth() + 1 // 默认选中月份
      }
    },
    created () {
      let that = this
      that.monthArr = JSON.parse(JSON.stringify(newMonth))
      that.weksArr = JSON.parse(JSON.stringify(newwWeks))
      that.weksArrs = JSON.parse(JSON.stringify(newwWekss))
      that.pushData()
    },
    mounted() {
      let that = this
      that.weksFn(that.isMonth, 0)  // 月 周   首次加载赋值选择日期和偏移量
      // console.log('当前的月份为：' + that.nowMonth)
      // console.log('当前的年份为：' + that.nowYear)
      // console.log('选中的年份为：' + that.yearNum)
      // console.log('选中月份为：' + that.isMonth)
    }
  }
</script>

<style lang='scss'>
  @import './style/index.scss';
</style>