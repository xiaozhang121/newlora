<template>
  <div>
    <securityNum :navBar='navBar' :title='title' />
  </div>
</template>
<script>
import securityNum from "../components/securityNum.vue";
export default {
  name: "monitor500",
  components: {
    securityNum
  },
  data(){
      return{
          title:"500千伏安防警告",
          navBar:["操作中台", "安防监测", "500千伏"]

      }
  }
};
</script>

