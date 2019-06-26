<template>
  <div class="realtime">
    <h3 class="title">{{title}}</h3>
    <el-row :gutter="20">
      <el-col :span="12" v-for="(item, index) in imgList" :key="index">
        <div class="itemImgBox"><img :src="item"></div>
      </el-col>
    </el-row>
    <div class="progress">
      <el-progress type="circle" :percentage="tepmNum" :width="100" color="#01b2fe" :format="format" />
      <p>温度℃</p>
    </div>
  </div>
</template>
<script>
export default {
  name: 'realtimeTem',
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    tepmNum: {
      type: Number,
      default: () => {
        return 0
      }
    },
    imgList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  methods: {
    format(percentage) {
      return `${percentage}`;
    }
  }
}
</script>
<style lang="scss" scoped>
.realtime {
  .title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }
  .itemImgBox {
    width: 100%;
    height: 0;
    padding-bottom: 60%;
    margin-bottom: 15px;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      position: absolute;
    }
  }
  .progress {
    width: 100%;
    text-align: center;
    margin-top: 20px;
    font-size: 18px;
  }
}
</style>
