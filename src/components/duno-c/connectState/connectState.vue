<template>
  <div class="connectState">
    <el-button type="primary" @click="connentSatus" round>{{title}}</el-button>
  </div>
</template>

<script>
import { getAxiosData, putAxiosData } from "@/api/axiosType";
export default {
  name: "connectState",
  props: {
    deviceId: {
      type: String,
      default: () => {
        return "";
      }
    }
  },
  data() {
    return {
      title: "连接",
      status: ""
    };
  },
  methods: {
    init() {
      let url = `/lenovo-visible/api/visible-equipment/view/${this.deviceId}`;
      getAxiosData(url).then(res => {
        this.status = res.result.status;
      });
    },
    connentSatus(){
      let url = `/lenovo-visible/api/visible-equipment/equip-connect/${this.deviceId}/0`
      putAxiosData(url).then(res=>{
        if(res.status==200){
          this.$message.success('操作成功');
        }
      })
    }
  },
  mounted(){
    this.init()
  }
};
</script>

<style lang='scss'>
.connectState {
}
</style>
