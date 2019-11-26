<template>
  <div class="duno-breadcrumb not-print">
    <el-breadcrumb v-if="isOperation" :separator="separator" class="pointCrumb">
      <template>
        <el-breadcrumb-item v-for="(item,index) in pointData" :key="index">{{ item.name }}</el-breadcrumb-item>
        <el-breadcrumb-item
          v-if="index>1"
          v-for="(item,index) in breadData"
          :key="index"
          :to="{path:item.path}"
        >{{ item.name }}</el-breadcrumb-item>
      </template>
    </el-breadcrumb>
    <el-breadcrumb v-else :separator="separator">
      <template v-for="(item,index) in breadData">
        <el-breadcrumb-item
          v-if="item.path"
          :class="{'pointer': index == 0}"
          :key="index"
          :to="{path:item.path}"
        >{{ item.name }}</el-breadcrumb-item>
        <el-breadcrumb-item
          v-else
          :class="{'pointer': index == 0}"
          :key="index"
          @click.native="toBack(index)"
        >{{ item.name }}</el-breadcrumb-item>
      </template>
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
      breadData: [],
      pointData: [],
      isOperation: true
    };
  },
  watch: {
    dataList: {
      handler(now) {
        // this.breadData = now;
        this.handleJump(now);
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
    },
    handleJump(now) {
      this.breadData = now;
      let name = now[0].name;
      if (name == "操作中台") {
        this.isOperation = true;
        this.pointData = now.slice(0, 2);
        console.log(this.pointData);
      } else {
        this.isOperation = false;
      }
    }
  },
  mounted() {
    this.breadData = this.dataList;
    this.handleJump(this.dataList);
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
        text-decoration: underline;
      }
    }
    .el-breadcrumb__item:last-child {
      .el-breadcrumb__inner {
        color: #4b9bc1;
      }
    }
  }
  .pointCrumb {
    .el-breadcrumb__item:nth-child(-n + 2) {
      .el-breadcrumb__inner {
        color: #aaa;
        text-decoration: none;
      }
    }
  }
  .el-breadcrumb {
    .el-breadcrumb__item:last-child {
      .el-breadcrumb__inner {
        color: #4b9bc1;
        text-decoration: none;
      }
    }
  }
  .el-breadcrumb__inner.is-link {
    font-weight: normal;
    text-decoration: none;
  }
}
</style>

