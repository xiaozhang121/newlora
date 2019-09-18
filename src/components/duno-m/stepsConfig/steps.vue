<template>
    <div class="steps">
        <div class="step_item" v-for="(item,index) in stepList" :key="index">
            <div class="circle" :class="{'active': index<nowStep}"><span>{{ index+1 }}</span></div>
            <div class="name" :class="{'active': index<nowStep}">{{ item['name'] }}</div>
            <span class="line" v-if="(index+1) < stepList.length" :class="{'active': index+1<nowStep}"></span>
        </div>
    </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
export default {
    name: 'steps',
    components: {
        buttonCustom
    },
    data() {
        return {
            nowStep: 1,
            stepList:[
                {
                    name:'选择摄像头'
                },
                {
                    name:'选择预置位'
                },
              
            ]
        }
    },
    watch:{
        step(now){
            console.log(now);
            console.log('-------')
            this.nowStep = now
            if(now > 0 && this.stepList.length>0 && now > this.stepList.length){
                this.$emit('on-max')
            }
        },
        list:{
            handler(now){
                if(now.length)
                    this.stepList = now
            },
            immediate: true
        }
    },
    props: {
        step:{
            type: [String, Number],
            default: '2'
        },
        list:{
            type: Array,
            default: () => {
                return []
            }
        }
    },
    computed: {

    },
    methods:{

    },
    mounted(){
    }
}
</script>

<style lang="scss" scoped>
    .steps{
        display: flex;
        justify-content:center;
        align-items: center;
        .step_item{
            flex-grow: 1;
            display: inline-flex;
            align-items: center;
            color: #bbbbbb;
            position: relative;
            .circle{
                background: #bbbbbb;
                width: 20px;
                height: 20px;
                border-radius: 300px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                margin-right: 10px;
                & > span{
                    color: white;
                }
                &.active{
                    background: #3a77ff;
                }
            }
            .name.active{
                color: #3a77ff;
            }
            .line{
                height: 2px;
                background: #bbbbbb;
                margin-left: 5px;
                flex-grow: 1;
                margin-right: 6px;
                &.active{
                    background: #3a77ff;
                }
            }
            &:last-child{
                flex-grow: 0;
            }
        }
    }
</style>

