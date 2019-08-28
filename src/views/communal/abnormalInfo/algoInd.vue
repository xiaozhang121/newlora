<template>
    <div class="algoInd">
        <echart-map/>
    </div>
</template>

<script>
    import echartMap from "./components/map"
    import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
    export default {
        name: "algoInd",
        components: {
            echartMap
        },
        computed: {

        },
        watch: {

        },
        data() {
            const that = this;
            return {

            };
        },
        created() {

        },
        methods: {

        }
    };
</script>

<style lang="scss">
    @import "@/style/tableStyle.scss";
    .algoInd{

    }
</style>
