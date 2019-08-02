<template>
  <div class="duno-breadcrumb">
    <el-breadcrumb :separator="separator">
      <el-breadcrumb-item
        :class="{'pointer': index == (dataList.length-1)}"
        v-for="(item,index) in dataList"
        :key="index"
        @click.native="toBack(index)"
      >{{ item }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  name: "Breadcrumb",
  props: {
    dataList: {
      //面包屑
      type: Array,
      default: () => {
        return ["操作中台", "动态环境监测", "动态环境总览"];
      }
    },
    separator: {
      type: String,
      default: () => {
        return "-";
      }
    }
  },
  methods:{
      toBack(index){
          if(this.dataList.length-1 == index)
          this.$router.go(-1)
      }
  },
  mounted() {
    console.log();
  }
};
</script>

<style lang="scss">
.pointer{
  .el-breadcrumb__inner{
    cursor: pointer !important;
  }
}
.duno-breadcrumb {
  padding-top: 10px;
  @media screen and (min-width: 3500px) {
    font-size: 12px;
  }
  .el-breadcrumb {
    .el-breadcrumb__item {
      .el-breadcrumb__inner {
        color: #fff;
      }
    }
    .el-breadcrumb__item:last-child {
      .el-breadcrumb__inner {
        color: #4b9bc1;
      }
    }
  }
}
</style>

