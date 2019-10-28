<template>
  <div class="imgLinePanel">
    <canvas id="canvas" width="600" height="400" :style="'transform:scale('+ zoomRate.x +','+ zoomRate.y +')'"></canvas>
  </div>
</template>

<script>
import {
  getAxiosData,
  putAxiosData,
  postAxiosData,
  deleteDataId
} from "@/api/axiosType";
const POINTCOLOR = 'red'
const MAXNODE =  4
export default {
  name: "inspection",
  components: {  },
  data() {
    return {
        zoomRate: {x: 1, y: 1},
        drawingSurfacsImageData: [],
        drawPoint: [],
        imgOriginWidth: 1920,
        imgOriginHeight: 1080
    }
  },
  computed: {

  },
  watch: {
      imgsrc(now){
          this.initDom()
      },
      picData:{
        handler(now){

        },
        deep: true,
        immediate: true
      }
  },
  props: {
      isLock: {},
      picData: {
          type: String,
          default: ''
      },
      imgsrc: {},
      drawPress: {
          type: Boolean,
          default: ()=>{
              return false
          }
      },
      transparent: {
          type: Boolean,
          default: ()=>{
              return false
          }
      },
      zIndex: {},
      pId:{
          type: String,
          default: ''
      }
  },
  methods: {
    ajaxToDraw(now){
        let arr = this.handleAjaxData(now)
        this.pointList = []
        for(let i=0; i<arr.length; i+=2){
            this.dataToPic([{x: arr[i].x, y: arr[i].y},{x: arr[i+1].x, y:arr[i+1].y}])
        }
        this.$emit('on-finish', this.pointList)
    },
    getCoordinate(type, w0, w1, h0, h1, x0, y0) {
        let obj = { x: 0, y: 0 };
        // 原始-->页面
        if (type) {
            obj["x"] = (w0 / w1) * x0;
            obj["y"] = (h0 / h1) * y0;
        } else {
            // 页面-->原始
            obj["x"] = (w1 / w0) * x0;
            obj["y"] = (h1 / h0) * y0;
        }
        return obj;
    },
    handleData(type = 0 ,x, y){
        const that = this
        let w1 = this.imgOriginWidth;
        let h1 = this.imgOriginHeight;
        let w0 = this.canvas.width;
        let h0 = this.canvas.height;
        return that.getCoordinate(type, w0, w1, h0, h1, x, y)
    },
    handleAjaxData(data){
        let bD = []
        let arr = data.split('|')
        for(let i=0; i<arr.length; i++){
            let dataJ = arr[i].split(':')
            for(let j=0; j<dataJ.length; j+=2){
              bD.push({x: dataJ[j], y: dataJ[j+1]})
            }
        }
        return bD
    },
    dataToPic(data){
        const that = this
        // let data = [
        //     {
        //         x: 885.6589440071937,
        //         y: 566.6876015914114
        //     },
        //     {
        //         x: 495.80745885867884,
        //         y: 769.306022644043
        //     },
        //     {
        //         x: 755.7084489576887,
        //         y: 776.1744436966745
        //     },
        //     {
        //         x: 1023.0351816309559,
        //         y: 676.5823384335166
        //     }
        // ]
        data.map((item)=>{
            let d = that.handleData(1, item['x'], item['y'])
            item['x'] = d.x
            item['y'] = d.y
        })
        for(let i=0; i<data.length; i+=2){
          this.mousedown.x = data[i]['x']
          this.mousedown.y = data[i]['y']
          let item = {x: data[i+1].x, y: data[i+1].y}
          this.drawRubberbandShape(item, true)
        }
    },
    initImg(width, height){
        const that = this
        that.img = new Image();
        // that.img.crossOrigin = "Anonymous"
        // that.img.setAttribute('crossOrigin', 'anonymous')
        that.img.onload = function(){
            that.imgOriginWidth = this.width
            that.imgOriginHeight = this.height
            that.context.drawImage(that.img,0,0, that.width, that.height);
            that.initWinResize()
            if(that.picData && that.isLock)
              that.ajaxToDraw(that.picData)
            // that.img.src = this.canvas.toDataURL('image/png')
        }
        that.img.src = this.imgsrc;
    },
    clearCanvas(){
        const that = this
        that.context.clearRect(0, 0, that.canvas.width, that.canvas.height);
        if(this.transparent){
            that.context.fillStyle="transparent"
        }
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        if(!this.transparent)
          that.context.drawImage(that.img,0,0, this.width, this.height);
        that.saveDrawingSurface();
    },
    canvasBindEvent(){
      const that = this
      this.canvas.onmousedown = function (e) {
          if(!that.drawPress){
              return
          }
          that.pointStart = {}
          let loc = that.windowToCanvas(e.clientX, e.clientY);
          e.preventDefault();
          that.saveDrawingSurface();
          that.mousedown.x = loc.x;
          that.mousedown.y = loc.y;
          that.dragging = true;
          let saveData = {x: that.mousedown.x, y: that.mousedown.y}
          let point =  that.handleData(0, saveData.x, saveData.y)
          that.pointStart = point
      }
      this.canvas.onmousemove = function (e) {
          if(!that.drawPress){
              return
          }
          if(that.dragging) {
              e.preventDefault();
              that.loc = that.windowToCanvas(e.clientX, e.clientY);
              that.restoreDrawingSurface();
              that.updateRubberband(that.loc);
          }
      }
      this.canvas.onmouseup = function (e) {
          if(!that.drawPress){
            return
          }
          that.loc = that.windowToCanvas(e.clientX, e.clientY);
          let saveData = {x: that.loc.x, y: that.loc.y}
          let point =  that.handleData(0, saveData.x, saveData.y)
        /*  that.removeDoubleLast(that.drawingSurfacsImageData)
          that.removeDoubleLast(that.pointList)*/
          if(JSON.stringify(that.pointStart) != JSON.stringify(point))
            that.drawPoint = that.drawPoint.concat({x: that.pointStart.x, y: that.pointStart.y}, {x: point.x, y: point.y})
          console.log(that.drawPoint)
          that.dragging = false;
      }
      this.canvas.ondblclick = function (e) {
      /*    if(!that.drawPress){
              return
          }
          that.loc = that.windowToCanvas(e.clientX, e.clientY);
          that.removeDoubleLast(that.drawingSurfacsImageData)
          that.removeDoubleLast(that.pointList)

          that.drawPoint = that.drawPoint.concat(that.pointList)
          console.log(that.drawPoint)

          that.restoreDrawingSurface()
          //鼠标抬起，拖动标记设为否
          that.dragging = false;
          that.pointList = []
          that.drawingSurfacsImageData = [];*/
      }
      that.context.strokeStyle = POINTCOLOR;
      that.context.lineWidth = 3;
    },
    initWinResize(){
        let bbox = this.canvas.getBoundingClientRect();
        this.pageX = bbox.left
        this.pageY = bbox.top
        let width = document.querySelector(`#${this.pId}`).offsetWidth
        let height = document.querySelector(`#${this.pId}`).offsetHeight
        let xRate = width /this.width
        let yRate = height /this.height
        this.zoomRate.x = xRate
        this.zoomRate.y = yRate
    },
    windowToCanvas(x, y) {
        const that = this
        let bbox = that.canvas.getBoundingClientRect();
        let xx =  x - bbox.left * (that.canvas.width / bbox.width)
        let yy = y - bbox.top * (that.canvas.height / bbox.height)
        if(this.zoomRate.x != 1){
           xx =  (x - bbox.left)/this.zoomRate.x
          yy = (y - bbox.top)/this.zoomRate.y
        }
        console.log(x - bbox.left, y - bbox.top)
        return {
            x: xx.toFixed(3),
            y: yy.toFixed(3)
        };
    },
    drawRubberbandShape(loc, flag) {
        const that = this
        this.context.beginPath();
        this.context.moveTo(this.mousedown.x, this.mousedown.y);
        this.context.lineTo(loc.x, loc.y);
        this.context.stroke();
        if(flag){
            that.pointList.push({x: this.mousedown.x, y:this.mousedown.y},{x: loc.x, y: loc.y})
        }
    },
    removeDoubleLast(arr){
        arr.splice(arr.length-2, 2)
    },
    updateRubberband(loc) {
        this.drawRubberbandShape(loc);
    },
    restoreDrawingSurface() {
        const that = this
        this.drawingSurfacsImageData.forEach(item=>{
            that.context.putImageData(item,
                0, 0, 0, 0, that.canvas.width, that.canvas.height
            );
        })
        console.log(this.drawingSurfacsImageData)
    },
    saveDrawingSurface() {
        let data = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.drawingSurfacsImageData.push(data)
    },
    initDom(){
        this.canvas = document.querySelectorAll('#canvas')[this.zIndex];
        this.width = document.querySelector(`#${this.pId}`).offsetWidth
        this.height = document.querySelector(`#${this.pId}`).offsetHeight
        this.canvas.setAttribute('width', this.width)
        this.canvas.setAttribute('height', this.height)
        this.context = this.canvas.getContext("2d");
        if(this.transparent){
            this.context.fillStyle="transparent"
        }
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.pointList = []
        this.drawingSurfacsImageData = [];
        this.mousedown = {};
        this.dragging = false;
        this.loc = null;
        this.canvasBindEvent()
        this.initImg(this.width, this.height)
        if(this.transparent)
            this.ajaxToDraw(this.picData)
    }
  },
  created() {

  },
  mounted() {
    const that = this
    this.initDom()
     window.addEventListener('mouseover', function (event) {
         that.first = event.pageX
         that.second = event.pageY
     })
    window.addEventListener('resize', this.initWinResize)
    setTimeout(()=>{
        // this.dataToPic()
    },6000)
  }
};
</script>

<style lang="scss">
  .imgLinePanel{
    #canvas {
      transform-origin: left top;
      background: #ffffff;
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 0;
    }
  }
</style>
