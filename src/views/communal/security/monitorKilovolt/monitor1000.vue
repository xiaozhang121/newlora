<template>
  <div>
    <securityNum :img='img' />
    <!-- <img :src="this.img" alt=""> -->
  </div>
</template>
<script>
import securityNum from "../components/securityNum.vue";
export default {
  name: "monitor1000",
  components: {
    securityNum
  },
  data(){
    return{
      img:require('@/assets/demo/1000kv.png')
      // img:'../../../../assets/demo/1000kv.png'
    }
  }
};
</script>


