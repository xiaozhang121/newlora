<template>
  <div>
    <securityNum :navBar='navBar' :securityRecord='securityRecord' :title='title' />
  </div>
</template>
<script>
import securityNum from "../components/securityNum.vue";
export default {
  name: "monitor10",
  components: {
    securityNum
  },
  data(){
      return{
          title:"10千伏安防警告",
          securityRecord:"10千伏安防记录",
          navBar:["操作中台", "安防监测", "10千伏"]
      }
  }
};
</script>

