<template>
  <div>
    <securityNum :navBar='navBar'  :securityRecord='securityRecord' :title='title' />
  </div>
</template>
<script>
import securityNum from "../components/securityNum.vue";
export default {
  name: "monitor35",
  components: {
    securityNum
  },
  data(){
      return{
          title:"35千伏安防警告",
          securityRecord:"35千伏安防记录",
          navBar:["操作中台", "安防监测", "35千伏"]
      }
  }
};
</script>

