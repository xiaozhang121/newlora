<template>
    <div class="cameraD" >
        <div class="img">
            <img :src="data['pic']">
        </div>
        <div class="contain">
            <p>{{ data['executeTime'] }}</p>
            <p>{{ data['part'] }}</p>
            <p>{{ data['alarmValue'] }}</p>
        </div>
        <div class="btn">
            <a href="javascript:void(0)">详情</a>
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
            data:{}
        },
        watch: {

        },
        methods:{
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

