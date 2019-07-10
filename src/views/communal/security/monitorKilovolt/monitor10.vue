<template>
  <div>
    <securityNum :title='title' />
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
          title:"10千伏安防警告"
      }
  }
};
</script>

