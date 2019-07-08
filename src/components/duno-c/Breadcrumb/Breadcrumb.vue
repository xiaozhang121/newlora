<template>
  <div class="duno-breadcrumb">
    <el-breadcrumb :separator="separator">
      <el-breadcrumb-item v-for="(value,name,index) in dataList" :key="index" :to="{ path:'{{ name }}'}"> {{ value }}</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
    name: "Breadcrumb",
    props:{
        dataList:{ //面包屑
            type:Object,
            default:()=>{
                return {
                    '/':'设备中台',
                    '/environmental':'安防监测',
                    '/environmental/list':'安防总览'
                }
            }
        },
        separator:{
            type:String,
            default:()=>{
                return '-'
            }
        }
    },
    mounted(){
        console.log()
    }
};
</script>

<style lang="scss">
    .duno-breadcrumb{
        .el-breadcrumb{
            .el-breadcrumb__item{
                .el-breadcrumb__inner{
                    color: #fff;
                }
            }
            .el-breadcrumb__item:last-child{
                .el-breadcrumb__inner{
                    color: #4289ab;
                }
            }
        }
    }
</style>

