<template>
  <div>
    <securityNum :navBar='navBar' :title='title' />
  </div>
</template>
<script>
import securityNum from "../components/securityNum.vue";
export default {
  name: "monitor110",
  components: {
    securityNum
  },
  data(){
      return{
          title:"110千伏安防警告",
          navBar:["操作中台", "安防监测", "110千伏"]
      }
  }
};
</script>

