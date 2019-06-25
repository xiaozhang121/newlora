<template>
  <div class="progressBar_odd">
    <label class="itemLabel"><span>时效范围</span>：</label>
    <div style="display: inline-block; width: 85%;vertical-align: top;">
      <el-slider
        v-model="range"
        :min="minNum"
        :max="maxNum"
        :step="step"
        show-stops
        @change="slideFn"
      >
      </el-slider>

      <ul class="scaleplate">
        <li v-for="(item,index) in sliderList" :key="index"><span class="scaleLi"></span><span class="numLi">{{item}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'progressBarOdd',
    components: {},
    data () {
      return {
        maxNum:0, //最大值
        minNum:0, //最小值
        step:0, //间隔
        range: [0, 0] //选中
      }
    },
    computed: {
      sliderList () {
        const that = this
        const num = that.maxNum + that.step
        const newArr = []
        for (let item = 0; item < num; item++) {
          if (item % that.step == 0) {
            newArr.push(item)
          }
        }
        return newArr
      }
    },
    props: {
      valis: { // 滑条间隔值
        type: Number,
        default: () => {
          return 0
        }
      },
      sliding: { // 滑条范围最大值
        type: Number,
        default: () => {
          return 0
        }
      }
    },
    created () {
      const that = this
      if (that.valis) {
        that.step = that.valis
      }
      if (that.sliding) {
        that.maxNum = that.sliding
        that.range = that.sliding
      }
    },
    watch: {
      valis(now, before){
        let that = this
        if (now != 0) {
          that.step = now
        }
      },
      sliding(now, before){
        let that = this
        if (now != 0) {
          that.maxNum = now
          that.range = now
        }
      }
    },
    methods: {
      slideFn(val){
        let that = this
        that.$emit('on-change', val)
      }
    },
    mounted () {}
  }
</script>

<style lang="scss" scoped>
  .progressBar_odd{
    width: 95%;
    margin: 10px auto;
  }

  .itemLabel {
    display: inline-block;
    font-size: 16px;
    color: #3e3a39;
    font-weight: bold;

    span {
      display: inline-block;
      width: 70px;
      text-align:justify;
      text-align-last:justify;
      margin-left: 5px;
    }
  }

  .scaleplate {
    width: 100%;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content:  space-between;
    align-items: flex-start;

    li{ 
      width: 2px;
      height: 12px;
      position: relative;
      .scaleLi{
        display: inline-block;
        width: 100%;
        height: 5px;
        background: #333;
        position: absolute;
        top:0;
        left: 0;
      }

      .numLi {
        position: absolute;
        display: inline-block;
        width: 50px;
        height: 20px;
        font-size: 12px;
        bottom: -30px;
        left: -35px;
        text-align: right;
        transform:rotate(-55deg)
      }
    }
  }
</style>
