<template>
    <div class="customShap">
        <custom-box
          class="border-path"
          title="框选路径"
          :noHandle="true"
          :initClose="false"
          width="250px"
        >
            <div class="borderShap">
                <div class="squera real" :class="{'active':active == 0}" @click="changeActive(0)"></div>
                <div class="circled real" :class="{'active':active == 1}" @click="changeActive(1)"></div>
                <div class="sharp real" @click="changeActive(2)" :style="'background: url('+ showSharp +') no-repeat; color:white'"></div>
                <div class="real"  :class="{'active':active == -1}" @click="changeActive(-1)" style="color: white; text-align: center; line-height: 49px">无</div>
            </div>
        </custom-box>
    </div>
</template>

<script>
    import drawImg from "@/mixins/drawImg";
    import customBox from '@/components/self_com/customBox'
    export default {
        name: 'customShap',
        components:{ customBox },
        mixins: [ drawImg ],
        data() {
            return {
                active:-1,
                showSharp: null
            }
        },
        props: {
            num: {

            }
        },
        watch:{
            tableShow(now){
                if(now){
                    this.$emit('show-table')
                }
                this.tableShow = false
            },
            active(now){
                if(now == 0){
                    this.classNameE = 'squera_p'
                    this.classNameT = 'squera'
                    this.showSharp = this.sharp
                }else if(now == 1){
                    this.classNameE = 'circle_p'
                    this.classNameT = 'circled'
                    this.showSharp = this.sharp
                }else if(now == 2){
                    this.classNameE = 'sharp_p'
                    this.classNameT = 'sharp'
                    this.showSharp = this.sharpChosen
                }else{
                    this.showSharp = this.sharp
                }
                if(now != -1){
                    for(let i=0; i<document.getElementsByClassName('addImage').length;i++){
                        document.getElementsByClassName('addImage')[i].remove()
                    }
                    document.getElementsByClassName('addImage')[0].remove()
                }
                if(now == -1){
                    document.getElementById()
                }
            }
        },
        methods:{
            changeActive(flag){
                this.active = flag
            }
        },
        created(){
            this.showSharp = this.sharp
        }
    }
</script>

<style lang="scss">
    .customShap{
        .border-path{
            margin-left: 60px;
        }
        .active{
            border:1px solid #e48303 !important;
        }
        .borderShap{
            width: 250px;
            height: 90px;
            display: flex;
            align-items: center;
            justify-content: center;
            .real{
                width: 50px;
                height: 50px;
                position: relative !important;
                margin: 0 7px;
                cursor: pointer;
                top: -5px;
            }
            .squera{
                position:absolute; border:1px solid #CCCCCC; overflow:hidden;
            }
            .squera_p{
                position:absolute; border:1px dashed #CCCCCC; width:0px; height:0px;left:0px; top:0px;
            }
            .circled{
                position:absolute; border:1px solid #CCCCCC; overflow:hidden; border-radius: 50%;
            }
            .circle_p{
                position:absolute; border:1px dashed #CCCCCC; width:0px; height:0px;left:0px; top:0px; border-radius: 50%;
            }
            .sharp{
                position:absolute;  overflow:hidden; background: url(../../../../src/assets/images/sharpChosend.svg) no-repeat; background-size: 100% 100%;
            }
            .sharp_p{
                position:absolute;  width:0px; height:0px;left:0px; top:0px;  background: url(../../../../src/assets/images/sharpChosend.svg) no-repeat; background-size: 100% 100%;
            }
        }
    }
</style>
