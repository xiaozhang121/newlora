<template>
    <md-card>
        <md-card-media>
            <!-- swiper -->
            <swiper class="swiperList" :options="swiperOption">
                <swiper-slide v-for="(item, index) in imgList" :key="index">
                    <div class="slideItem" :class="{'active':item.active}" @click="changImg(item, index)"><img :src="item.value" /></div>
                </swiper-slide>
            </swiper>
           <!-- <div class="swiper-button-prev  swiper-button-white" slot="button-prev" style="left: -46px;"></div>
            <div class="swiper-button-next  swiper-button-white" slot="button-next" style="right: -46px"></div>-->
        </md-card-media>
    </md-card>
</template>

<script>
    export default {
        data() {
            return {
                swiperOption: {
                    slidesPerView: 4,
                    spaceBetween: 30,
                    slidesPerGroup: 4,
                    resistanceRatio : 0,
                    loop: false,
                    preventLinksPropagation: true,
                    loopFillGroupWithBlank: true,
                    pagination: {
                        el: '.swiper-pagination',
                        clickable: true
                    },
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev'
                    }
                }
            }
        },
        computed: {

        },
        methods: {
            changImg(item, flag){
                const that = this
                this.imgList.map((itemd, index)=>{
                    itemd.active = false
                })
                this.imgList[flag].active = true
                this.$forceUpdate()
                this.$emit('on-change', item.value)
            }
        },
        props: {
            imgList:{
                type: Array,
                default: () => {
                    return []
                }
            }
        }
    }
</script>

<style lang="scss">
.swiperList{
    .slideItem{
        background: grey;
        height: 70px;
        position: relative;
        border: 1px solid transparent;
        img{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
    }
    .slideItem.active{
        border: 1px solid #00bfc8;
    }
}
</style>
