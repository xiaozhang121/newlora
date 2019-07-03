<template>
    <div class="panel" v-if="show">
        <div class="title">
            <span>{{ title }}</span>
            <span style="float: right; cursor: pointer" @click="onClose"><i class="el-icon-close"></i></span>
        </div>
        <div class="img">
            <img :src="clock"/>
        </div>
        <div class="banner">
            <div class="item">
                <banner
                    :imgList="imgList"
                    @on-change="changePic"
                />
            </div>
        </div>
        <div class="circle">
          <div class="item">
              <circle-pic />
          </div>
          <div class="item">
              <circle-pic />
          </div>
          <div class="item">
              <circle-pic />
          </div>
          <div class="item">
              <circle-pic />
          </div>
        </div>
    </div>
</template>

<script>
    import banner from '_c/self_com/banner'
    import circlePic from '_c/self_com/circlePic'
    import clock from '@/assets/images/clock.png'
    export default {
        name: 'panel',
        components: {
            banner,
            circlePic
        },
        data() {
            return {
                backImg:require('@/assets/images/test/backImg.jpg'),
                imgList:[],
                show: false,
                clock
            }
        },
        watch: {
            initShow(now){
                this.show = now
            }
        },
        props: {
            initShow: {
               type: Boolean,
               default: false
            },
            title:{
                type: String,
                default: '主变压器'
            },
        },
        created(){
            this.show = this.initShow
            this.imgList = [
                {value:this.clock, active: true},
                {value:this.clock, active: false},
                {value:this.clock, active: false},
                {value:this.clock, active: false},
                {value:this.clock, active: false},
            ]
        },
        methods:{
            onClose(){
                this.show = false
                this.$emit('on-close')
            },
            changePic(item){
                this.backImg = item
            }
        }
    }
</script>

<style lang="scss">
    .panel{
      border: 1px solid #00bfc8;
      background: rgba(0,191,200,0.1);
      width: 450px;
      height: 563px;
      border-radius: 4px;
        .title{
            color: white;
            font-size: 20px;
            padding: 0 14px;
            margin: 14px 0;
        }
        .img{
            width: 100%;
            height: 300px;
            position: relative;
            text-align: center;
            padding: 0 14px;
            img{
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
                border: 1px solid #00bfc8;
            }
        }
        .banner{
            display: flex; justify-content: center;
            margin-top: 14px;
            .item{
                width: 94%;position: relative;
            }
        }
        .circle{
            margin-top: 6px;
            display: flex;
            .item{
                text-align: center;
                flex: 1;
            }
        }
    }
</style>
