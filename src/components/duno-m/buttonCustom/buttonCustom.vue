<template>
    <div class="buttonCustom">
        <span>
            {{ title }}
        </span>
    </div>
</template>

<script>
  export default {
        name: 'buttonCustom',
        data() {
            return {}
        },
        computed:{

        },
        watch: {

        },
        props: {
            title:{
                type: String,
                default: '请输入标题'
            }
        },
        methods:{

        },
        created(){
            const that = this
        },
        mounted(){

        }
    }
</script>

<style lang="scss">
  .buttonCustom{
      text-align: center;
      cursor: pointer;
      padding: 0 30px;
      background-size: cover;
      line-height: 40px;
      border: 2px solid #606465;
      background: linear-gradient(185deg, rgba(48, 107, 135, 0.6), rgba(28, 50, 64, 0.9) 42%);
  }
</style>
