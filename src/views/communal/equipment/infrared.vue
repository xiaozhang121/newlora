<template>
  <div class="infrared">
    <div class="breadcrumb">
      <!-- <Breadcrumb /> -->
    </div>
    <div class="dunoDrap">红外测温</div>
    <img :src="facility" alt="">
  </div>
</template>
<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
export default {
  components: { Breadcrumb },
  name: 'infraredTep',
  data() {
    return {
      facility:require('@/assets/images/infrared.png')
    }
  }
}
</script>
<style lang="scss" scoped>
.infrared {
  width: 100%;
  .dunoDrap {
    line-height: 45px;
    font-size: 20px;
    color: #ffffff;
  }
  img {
    width: 100%;
    display: block;
  }
}
</style>
