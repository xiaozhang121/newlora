<template>
  <div>
    <securityNum :navBar='navBar' :title='title' />
  </div>
</template>
<script>
import securityNum from "../components/securityNum.vue";
export default {
  name: "monitor220",
  components: {
    securityNum
  },
  data(){
      return{
          title:"220千伏安防警告",
          navBar:["操作中台", "安防监测", "220千伏"]

      }
  }
};
</script>

