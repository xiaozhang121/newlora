<template>
    <div class="areaSetting">
        <canvas id="can" width="800" height="800" style="position: absolute;left: 0; top: 0"></canvas>
        <canvas id="tt" width="800" height="800" style="position: absolute;left: 0; top: 0"></canvas>
    </div>
</template>

<script>
import buttonCustom from "_c/duno-m/buttonCustom";
import firstPanel from "_c/duno-m/createTask/components/panel/first.vue";
import secondPanel from "_c/duno-m/createTask/components/panel/second.vue";
import thirdPanel from "_c/duno-m/createTask/components/panel/third.vue";
import steps from '_c/duno-m/steps'
import { getAxiosData, postAxiosData, putAxiosData } from "@/api/axiosType";
export default {
    name: 'areaSetting',
    components: {
        buttonCustom,
        steps,
        firstPanel,
        secondPanel,
        thirdPanel
    },
    data() {
        return {
            drawF: true
        }
    },
    watch:{

    },
    props: {

    },
    computed: {

    },
    methods:{
        initMount(){
            let mycolor = 'red';
            //b表示画布
            let b = 1;
            //a表示橡皮
            let a = 50;
            let oC = document.getElementById("tt")
            let oGC = oC.getContext("2d")
            if(this.drawF)
                oC.onmousedown = function(e) {
                //计算鼠标在画布的距离
                let disX = e.offsetX
                let disY =e.offsetY
                //每次必须重新开始，让它们变成多个。
                oGC.beginPath();
                if(mycolor == 'white') {
                    //设置画线的宽，与颜色
                    oGC.lineWidth = a;
                    oGC.strokeStyle = mycolor;
                    //设置画的起始点
                    oGC.moveTo(disX, disY)
                } else {
                    //设置画线的宽，与颜色
                    oGC.lineWidth = b;
                    oGC.strokeStyle = mycolor;
                    //设置画的起始点
                    oGC.moveTo(disX, disY)
                    console.log(disX, disY)
                }
                document.onmousemove = function(e) {
                    let disX = e.offsetX
                    let disY =  e.offsetY
                    //移动时设置画线的结束位置。并且显示
                    oGC.lineTo(disX, disY) //鼠标点下去的位置
                    console.log(disX, disY)
                    oGC.stroke()
                }
                //鼠标离开时清空鼠标按下与移动事件，停止画
                document.onmouseup = function() {
                    oGC.lineTo(disX, disY) //鼠标点下去的位置
                    oGC.stroke()
                    document.onmousedown = null //鼠标放开的位置
                    document.onmousemove = null
                }

            }
           /* //加减粗细
            let ainp = document.getElementsByTagName('input')
            //画笔的加减
            ainp[0].onclick = function() {
                b++;
            }
            ainp[1].onclick = function() {
                if(b > 1) {
                    b--;
                }
            }
            //橡皮的加减
            ainp[7].onclick = function() {
                a += 5;
            }
            ainp[8].onclick = function() {
                if(a > 5) {
                    a -= 5;
                }
            }
            //改变颜色
            for(var i = 2; i < ainp.length - 2; i++) {
                ainp[i].onclick = function() {
                    mycolor = this.value;
                }
            }
            //rgb颜色
            ainp[9].onchange=function(){
                mycolor=this.value;
            }*/
        },
        initImg(){
            let mycanvas = document.getElementById('can')
            let ctx = mycanvas.getContext('2d')
            let img = new Image();
            img.onload = function(){
                ctx.drawImage(img,0,0);
            }
            img.src = "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1537549551&di=3f8d4d76679adcae225387f7d6b199aa&src=http://gss0.baidu.com/-4o3dSag_xI4khGko9WTAnF6hhy/lvpics/h=800/sign=b49dc48f8718367ab28972dd1e728b68/9922720e0cf3d7ca7f0736d0f31fbe096a63a9a6.jpg";
        },
        reSize(){
            let mycanvas = document.getElementById('can')
            let ctx = mycanvas.getContext('2d')
            ctx.canvas.width  = $('.areaSetting').offsetWidth;
            ctx.canvas.height = $('.areaSetting').offsetHeight;
            mycanvas = document.getElementById('tt')
            ctx = mycanvas.getContext('2d')
            ctx.canvas.width  = $('.areaSetting').offsetWidth;
            ctx.canvas.height = $('.areaSetting').offsetHeight;
        }
    },
    mounted(){
        this.initMount()
        this.initImg()
        $(window).resize(this.reSize());
    }
}
</script>

<style lang="scss">
    .areaSetting{
        position: relative;
        width: 100%;
        height: 100%;
        .areaSetting > canvas{
            position: absolute;
            left: 0;
            top: 0;
        }
    }
</style>

