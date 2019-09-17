<template>
    <div class="mapExplain">
        <div class="infoD">
            <div class="item">
                <div class="titleE">
                    光纤
                </div>
                <div class="showE">
                    <div class="line"></div>
                </div>
            </div>
            <div class="item">
                <div class="titleE">
                    网页
                </div>
                <div class="showE">
                    <div class="line"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    export default {
        name: 'mapExplain',
        components: {

        },
        data() {
            return {
            }
        },
        props: {

        },
        computed: {

        },
        methods:{

        },
        mounted() {

        }
    }
</script>

<style lang="scss">
    .mapExplain{
        width: 150px;
        height: 100px;
        background: #223333;
        .infoD{
            display: flex;
            .item{
                flex-grow: 1;
                flex-basis: 0;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                .titleE{

                }
                .showE{
                   flex: 1;
                    .line{
                        background: white;
                        height: 1px;
                        width: 100%;
                    }
                }
            }
        }
    }
</style>

