<template>
    <div class="cameraD" >
        <div class="img">
            <img :src="dataInfo['pic']">
        </div>
        <div class="contain">
            <p>{{ dataInfo['executeTime'] }}</p>
            <p>{{ dataInfo['part'] }}</p>
            <p>{{ dataInfo['alarmValue'] }}</p>
        </div>
        <div class="btn">
            <a @click.stop="toDetail()">详情</a>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'cameraD',
        components: {

        },
        data() {
            return {

            }
        },
        props: {
            dataInfo:{}
        },
        watch: {

        },
        methods:{
            toDetail(){
                this.$emit('on-detail', this.dataInfo)
            },
            onClose(){
            }
        },
        mounted() {
        }
    }
</script>
<style lang="scss">
    .cameraD{
        display: flex;
        align-items: center;
        .img{
            position: relative;
            width: 140px;
            height: 89px;
            img{
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                height: 100%;
            }
            margin-right: 15px;
        }
        .contain{
            & > p{
            font-size: 14px !important;
            }
        }
        .btn{
            flex-grow: 1;
            text-align: right;
            & > a{
                color: white;
                border: 1px solid white;
                border-radius: 3px;
                padding: 4px 11px;
            }
        }
    }
</style>

