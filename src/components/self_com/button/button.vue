<template>
    <div class="buttonMain">

    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        }
    }
</script>

<style lang="scss">
.buttonMain{
    width: 150px;
    height: 66px;
    background:
            linear-gradient(-13deg,transparent 0px,#58a 0) bottom right,
            linear-gradient(45deg,transparent 9px,#58a 0) bottom left,
            linear-gradient(129deg,transparent -4px,#58a 0) top left,
            linear-gradient(-135deg,transparent 9px,#58a 0) top right;
    background-size: 50% 51%;
    background-repeat: no-repeat;
    box-shadow: 0 0 15px  #fff inset;
}
</style>
