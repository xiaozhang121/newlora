<template>
    <div class="platformLine" >
        <historical-documents :tabPaneData="tabPaneData" :showHeader="true"  :title="title"  width="770px" @on-show="onChange" @close="onClose" :dialogTableVisible="visible" class="historical">
        </historical-documents>
    </div>
</template>

<script>
    import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
    export default {
        name: 'platformLine',
        components: {
            HistoricalDocuments
        },
        data() {
            return {
                tabPaneData: [],
                title: '',
                visible: true
            }
        },
        props: {

        },
        watch: {

        },
        computed: {

        },
        methods:{
            onChange(){

            },
            onClose(){

            }
        },
        created(){
        },
        mounted() {

        }
    }
</script>

<style lang="scss">

</style>


