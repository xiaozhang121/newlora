<template>
    <div class="circleMain">
        <div class="circleCTX">
            <div  class="circleProgress">
            </div>
            <div class="font">{{ num }}</div>
        </div>
        <div class="explain">
            {{ explain }}
        </div>
    </div>
</template>

<script>
    export default {
        name: 'circlePic',
        data() {
            return {

            }
        },
        props: {
            num: {
                type: String,
                default: '0'
            },
            explain: {
                type: String,
                default: '暂无数据'
            },
        },
    }
</script>

<style lang="scss">
    .circleMain{
        position: relative;
        width: 80px;
        display: inline-block;
        .circleCTX{
            display: inline-block;
            transform: scale(0.8);
            .circleProgress{
                width: 80px;
                height: 80px;
                background: linear-gradient(#00b5ff, #00fcfe);
                border-radius: 50%;
                -webkit-mask: radial-gradient(transparent 59%, #000 35px);
            }
            .font{
                font-weight: bold;
                color: white;
                position: absolute;
                top: 29px;
                text-align: center;
                width: 80px;
            }
        }
        .explain{
            color: white;
            font-size: 16px;
            text-align: center;
            margin-top: -8px;
        }
    }
</style>
