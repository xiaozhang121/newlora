<template>
    <div class="drappable" >
        <div class="dragAble" :style="{width:width, height:height}" :id="idName">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'drappable',
        components: {

        },
        data() {
            return {
                oDragObj: null,
                isdrag: false,
                ie: null,
                nn6: null,
                x: null,
                nTY: null,
                nTX: null,
                y: null,
                scale: 1,
                targetx: '',
                targety: '',
                oldWidth: '',
                oldHeight:'',
                isChild: false,
                newWidth: '',
                newHeight: ''
            }
        },
        props: {
            width:{
                type: String,
            },
            height:{
                type: String,
            },
            idName:{
                type: String,
                default: 'dragAble'
            }
        },
        computed: {

        },
        methods:{
            mouseMove(event) {
                let div = document.getElementById(this.idName);
                event = event || window.event;
                //2.获取鼠标在整个页面的位置
                let pagex = event.pageX || this.scroll().left + event.clientX;
                let pagey = event.pageY || this.scroll().top + event.clientY;
                // console.log(pagex, pagey)
                //3.获取盒子在整个页面的位置
                let xx = div.offsetLeft;
                let yy = div.offsetTop;
                // console.log(xx, yy)
                //4.用鼠标的位置减去盒子的位置赋值给盒子的内容。
                this.targetx = Math.abs(pagex - xx);
                this.targety = Math.abs(pagey - yy);
                // console.log(`鼠标在盒子中的X坐标为："+${this.targetx}+"鼠标在盒子中的Y坐标为："+${this.targety}+"px`)
            },
            scroll() {
                if(window.pageYOffset != null) {  // ie9+ 高版本浏览器
                    // 因为 window.pageYOffset 默认的是  0  所以这里需要判断
                    return {
                        left: window.pageXOffset,
                        top: window.pageYOffset
                    }
                }
                else if(document.compatMode === "CSS1Compat") {    // 标准浏览器   来判断有没有声明DTD
                    return {
                        left: document.documentElement.scrollLeft,
                        top: document.documentElement.scrollTop
                    }
                }
                return {   // 未声明 DTD
                    left: document.body.scrollLeft,
                    top: document.body.scrollTop
                }
            },
            fnWheel(obj, fncc) {
                function fn(ev) {
                    let oEvent = ev || window.event;
                    let down = true;
                    if (oEvent.detail) {
                        down = oEvent.detail > 0
                    } else {
                        down = oEvent.wheelDelta < 0
                    }
                    if (fncc) {
                        fncc.call(this, down, oEvent);
                    }
                    if (oEvent.preventDefault) {
                        oEvent.preventDefault();
                    }
                    return false;
                }
                obj.onmousewheel = fn;
                if (obj.addEventListener) {
                    obj.addEventListener('DOMMouseScroll', fn, false);
                }
            },
            moveMouse(e) {
                if (this.isdrag) {
                    let posY = event.clientY - this.y
                    let posX = event.clientX - this.x
                    if(this.isChild){
                        posY = posY / this.scale
                        posX = posX / this.scale
                    }
                    this.oDragObj.style.top = (this.nn6 ? this.nTY + e.clientY - this.y : this.nTY + posY) + "px";
                    this.oDragObj.style.left = (this.nn6 ? this.nTX + e.clientX - this.x : this.nTX + posX) + "px";
                    return false;
                }
            },
            initDrag(e) {
                let oDragHandle = this.nn6 ? e.target : event.srcElement;
                if(oDragHandle.className == 'el-input__inner' || oDragHandle.className.indexOf('el-slider')>-1){
                    return;
                }
                if(oDragHandle.className == 'drappable-child'){
                    this.isChild = true
                }else{
                    this.isChild = false
                }
                let topElement = "HTML";
                while (oDragHandle.tagName != topElement && oDragHandle.className != "dragAble") {
                    oDragHandle = this.nn6 ? oDragHandle.parentNode : oDragHandle.parentElement;
                }
                if (oDragHandle.className == "dragAble") {
                    this.isdrag = true;
                    this.oDragObj = oDragHandle;
                    this.nTY = parseInt(this.oDragObj.style.top + 0);
                    this.y = this.nn6 ? e.clientY : event.clientY;
                    this.nTX = parseInt(this.oDragObj.style.left + 0);
                    this.x = this.nn6 ? e.clientX : event.clientX;
                    document.onmousemove = this.moveMouse;
                    return false;
                }
            }
        },
        mounted(){
            const that = this
            let ie = document.all;
            let nn6 = document.getElementByIdx && !document.all;
            let isdrag = false;
            let oImg = document.getElementById(that.idName);
            oImg.onmousemove = this.mouseMove
            this.fnWheel(oImg, function(down, oEvent) {
                let tempWidth = document.getElementById(that.idName).style.width.split('px')[0]
                let tempHeight = document.getElementById(that.idName).style.height.split('px')[0]
                that.oldWidth = Math.ceil(tempWidth*that.scale);
                that.oldHeight = Math.ceil(tempHeight*that.scale);
                let oldLeft = this.offsetLeft;
                let oldTop = this.offsetTop;
                let scaleX = (oEvent.clientX - oldLeft) / that.oldWidth; //比例
                let scaleY = (oEvent.clientY - oldTop) / that.oldHeight;
                this.style.transformOrigin = 'left top'
                if (down) {
                    that.scale-=0.1
                    this.style.transform = `scale(${that.scale})`
                }else{
                    that.scale+=0.1
                    this.style.transform = `scale(${that.scale})`
                }
                that.newWidth = Math.ceil(tempWidth * that.scale)
                that.newHeight = Math.ceil(tempHeight * that.scale)
                this.style.left = (oldLeft - scaleX * (that.newWidth - that.oldWidth)) + "px";
                this.style.top = (oldTop - scaleY * (that.newHeight - that.oldHeight)) + "px";
            });
            document.onmousedown = this.initDrag;
            document.onmouseup = function () {
                that.isdrag = false
            };
        }
    }
</script>

<style lang="scss">
    .drappable{
        position: relative;
        .dragAble {
            position: relative;
            cursor: move;
        }
    }
</style>

