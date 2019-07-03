<template>
  <div class="image">
    <!-- <div><img :src="login" alt=""></div> -->
  </div>
</template>
<script>
export default {
  name: 'inspection',
  data () {
    return {
      login: require('@/assets/images/login-bg.png'),
    }
  },
  mounted () {
    const that = this
  }
}
</script>
<style lang="scss" scoped>
.image {
  width: 80%;
   border: 1px solid #008290;
}
</style>
