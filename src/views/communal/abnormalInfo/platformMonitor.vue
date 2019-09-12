<template>
    <div class="platformMonitor">
        <platform-line></platform-line>
    </div>
</template>

<script>
    import platformLine from "_c/duno-m/platformLine"
    import moment from "moment";
    export default {
        name: "platformMonitor",
        components: {
            platformLine
        },
        data() {
            const that = this;
            return {

            };
        },
        methods: {

        },
        mounted() {

        }
    };
</script>

<style lang="scss">
    @import "@/style/tableStyle.scss";
    .platformMonitor{

    }
</style>
