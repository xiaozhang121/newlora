<template>
  <div class="duno-breadcrumb not-print">
    <el-breadcrumb :separator="separator">
      <el-breadcrumb-item
        :class="{'pointer': index == 0}"
        v-for="(item,index) in breadData"
        :key="index"
        :to="{path:item.path}"
        @click.native="toBack(index)"
      >{{ item.name }}</el-breadcrumb-item>
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
        return [];
      }
    },
    separator: {
      type: String,
      default: () => {
        return "-";
      }
    }
  },
  data() {
    return {
      breadData: []
    };
  },
  watch: {
    dataList: {
      handler(now) {
        this.breadData = now;
        this.handleReturn();
      },
      deep: true
    }
  },
  methods: {
    toBack(index) {
      if (this.breadData.length < 3) {
        console.log(index);
        if (index == 0) this.$router.go(-1);
      }
    },
    handleReturn() {
      if (this.breadData.length < 2) {
        let obj = {
          name: "返回"
        };
        this.breadData.unshift(obj);
      }
    }
  },
  mounted() {
    this.breadData = this.dataList;
    this.handleReturn();
  }
};
</script>

<style lang="scss">
.pointer {
  .el-breadcrumb__inner {
    cursor: pointer !important;
  }
}
.duno-breadcrumb {
  padding-top: 10px;
  .el-breadcrumb {
    @media screen and (min-width: 3500px) {
      font-size: 12px;
    }
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

