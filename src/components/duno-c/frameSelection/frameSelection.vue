<template>
  <div class="frameSelection">
    <div
      class="dialog-content"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      element-loading-text="加载中"
    >
      <canvas
        ref="myCanvas"
        width="450px"
        @mousedown="canvasDown($event)"
        @mousemove="canvasMove($event)"
        @mouseup="canvasUp($event)"
        @mouseleave="canvasUp($event)"
      ></canvas>
      <i v-if="!isVideo" class="iconfont icon-bofang"></i>
      <div v-if="isPoint&&!isDrew&&isVideo" @click="handleDraw" class="btn">手动标定</div>
      <div v-if="!isPoint&&!isDrew&&isVideo" @click="cleanRect" class="btn">清除</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "frameSelection",
  props: {
    shotData: {
      type: [Object, Array],
      default: () => {
        return {};
      }
    },
    isVideo: {
      type: Boolean,
      default: () => {
        return true;
      }
    }
  },
  data() {
    let that = this;
    return {
      loading: true,
      isPoint: true,
      isDrew: false,
      context: {},
      ctxHeight: null,
      img: new Image(),
      beginRec: {
        x0: null,
        y0: null,
        x1: null,
        y1: null
      }
    };
  },
  watch: {
    shotData(now) {
      this.loading = false;
      this.img.src = `http://10.0.10.35:8100/lenovo-storage/api/storageService/file/imgFile?bucketName=${now.cephBucket}&fileName=${now.cephFileName}`;
      this.init();
    },
    beginRec: {
      handler(now) {
        if (this.isDrew) {
          this.drawRect();
        }
      },
      deep: true
    }
  },

  methods: {
    //初始化
    init() {
      let that = this;
      let c = this.$refs.myCanvas;
      that.context = c.getContext("2d");
      // that.img.src =
      //   "https://img.iplaysoft.com/wp-content/uploads/2019/free-images/free_stock_photo.jpg";
      that.img.onload = function() {
        let w = that.img.width;
        let h = that.img.height;
        that.ctxHeight = Math.round((h * 450) / w);
        c.height = that.ctxHeight;
        that.context.drawImage(that.img, 0, 0, 450, that.ctxHeight);
      };
    },
    // 鼠标按下
    canvasDown(e) {
      if (!this.isPoint) {
        this.isDrew = true;
        this.beginRec.x0 = e.offsetX;
        this.beginRec.y0 = e.offsetY;
        this.beginRec.x1 = e.offsetX;
        this.beginRec.y1 = e.offsetY;
      }
    },
    //鼠标移动/移出canvas
    canvasMove(e) {
      if (this.isDrew) {
        this.beginRec.x1 = e.offsetX;
        this.beginRec.y1 = e.offsetY;
      }
    },
    //鼠标松开
    canvasUp(e) {
      if (this.isDrew) {
        this.isDrew = false;
        this.beginRec.x1 = e.offsetX;
        this.beginRec.y1 = e.offsetY;
        let imgFile = {
          width: this.img.width,
          height: this.img.height
        };
        this.$emit("on-send", this.beginRec, imgFile);
      }
    },
    //重新绘制canvas
    drawRect(e) {
      let that = this;
      that.context.clearRect(
        that.beginRec.x0,
        that.beginRec.y0,
        that.beginRec.x1 - that.beginRec.x0,
        that.beginRec.y1 - that.beginRec.y0
      );
      that.context.beginPath();
      that.context.strokeStyle = "red";
      that.context.lineWidth = 1;
      that.context.drawImage(that.img, 0, 0, 450, that.ctxHeight);
      that.context.strokeRect(
        that.beginRec.x0,
        that.beginRec.y0,
        that.beginRec.x1 - that.beginRec.x0,
        that.beginRec.y1 - that.beginRec.y0
      );
    },
    //清除矩形
    cleanRect() {
      let that = this;
      that.isPoint = true;
      that.context.clearRect(
        that.beginRec.x0,
        that.beginRec.y0,
        that.beginRec.x1 - that.beginRec.x0,
        that.beginRec.y1 - that.beginRec.y0
      );
      that.context.drawImage(that.img, 0, 0, 450, that.ctxHeight);
    },
    handleDraw() {
      this.isPoint = false;
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init();
    });
  }
};
</script>

<style lang="scss">
.frameSelection {
  .dialog-content {
    position: relative;
    .btn {
      position: absolute;
      right: 10px;
      bottom: 20px;
      background: rgba(255, 144, 0, 0.8);
      color: #fff;
      padding: 5px 10px;
      cursor: pointer;
    }
    .icon-bofang {
      cursor: pointer;
      color: #fff;
      font-size: 66px;
      position: absolute;
      top: 32%;
      left: 42%;
    }
  }
}
</style>
