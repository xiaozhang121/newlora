<template>
  <div class="visiblelight">
    <div class="breadcrumb">
      <!-- <Breadcrumb /> -->
    </div>
    <div class="dunoDrap">可见光</div>
    <img :src="facility" alt="">
  </div>
</template>
<script>
import Breadcrumb from "_c/duno-c/Breadcrumb";
export default {
  components: { Breadcrumb },
  name: 'visiblelightTep',
  data() {
    return {
      facility:require('@/assets/images/facility.png')
    }
  }
}
</script>
<style lang="scss" scoped>
.visiblelight {
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
