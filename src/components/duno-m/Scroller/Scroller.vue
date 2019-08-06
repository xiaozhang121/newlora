<template>
  <div class="Scroller">
    <div class="wrap" v-show="wrapShow">
      <div id="box">
        <div id="marquee">
          <div
            class="marquee_item"
            v-for="(item, index) in lists"
            :key="index"
            @mouseenter="enter()"
            @mouseleave="leave()"
            @click="handleClick"
          >
            <div
              class="name"
              :class="[{'commonly':item.alarmLevel == 1},{'serious':item.alarmLevel == 2},{'danger':item.alarmLevel == 3}]"
            >{{ item['alarmLevelName'] }}</div>
            <div class="time">{{ item['alarmTime'] }}</div>
            <div class="mainDevice">{{ item['mainDevice'] }}</div>
            <div class="powerDeviceName">{{ item['powerDeviceName'] }}</div>
            <div class="nr">{{ item.alarmValue?item.alarmValue:item.alarmDetailType }}</div>
          </div>
        </div>
      </div>
      <!--<div id="node">
                <div v-for="(item, index) in lists" class="node_item" :key="index">
                    <div class="name">
                        {{ item['alarmLevelName'] }}
                    </div>
                    <div class="time">
                        {{ item['alarmTime'] }}
                    </div>
                    <div class="mainDevice">
                        {{ item['mainDevice'] }}
                    </div>
                    <div class="powerDeviceName">
                        {{ item['powerDeviceName'] }}
                    </div>
                    <div class="nr">
                        {{ item.alarmValue?item.alarmValue:item.alarmDetailType }}
                    </div>
                </div>
      </div>-->
    </div>
    <warning-setting @handleClose="onClose" :visibleOption="visibleSettingOption" />
    <wraning :popData="popData" :visible="visible" @handleClose="handleClose" />
  </div>
</template>

<script>
import warningSetting from "_c/duno-j/warningSetting";
import wraning from "_c/duno-j/warning";
export default {
  name: "Scroller",
  components: {
    warningSetting,
    wraning
  },
  data() {
    return {
      wrapShow: false,
      visibleSettingOption: false,
      visible: false,
      lists: [],
      distance: 1,
      timer: null,
      text: "" // 数组文字转化后的字符串
    };
  },
  props: {
    listOption: {
      type: Array,
      default: () => {
        return [];
      }
    }
  },
  watch: {
    listOption: {
      handler(now) {
        this.lists = now;
      },
      deep: true,
      immediate: true
    }
  },
  computed: {},
  methods: {
    enter() {
      clearInterval(this.timer);
    },
    leave() {
      this.move();
    },
    setTimer(box) {
      const that = this;
      // 设置位移
      this.timer = setInterval(function() {
        that.wrapShow = true;
        let width = document.getElementById("marquee").getBoundingClientRect()
          .width;
        that.distance = that.distance - 3;
        // 如果位移超过文字宽度，则回到起点
        console.log(-that.distance);
        console.log(width);
        if (-that.distance >= width) {
          that.distance = document.body.clientWidth;
        }
        box.style.transform = "translateX(" + that.distance + "px)";
      }, 100);
    },
    move(flag) {
      const that = this;
      let box = document.getElementById("box");
      /* let copy = document.getElementById('copy')
            copy.innerText = this.text // 文字副本填充*/
      if (flag) {
        // that.distance = document.body.clientWidth // 位移距离
        that.distance = document.body.clientWidth; // 位移距离
      }
      this.setTimer(box);
    },
    onClose() {
      this.visibleSettingOption = false;
    },
    handleClose() {
      this.popData = {};
      this.visible = false;
    },
    handleClick() {
      that.popData = that.lists;
      that.visible = true;
    }
  },
  created() {},
  updated: function() {},
  beforeDestroy() {
    clearInterval(this.timer);
  },
  mounted() {
    this.$nextTick(() => {
      this.move(true);
    });
    /*   for (let i = 0; i < this.lists.length; i++) {
            this.text += ' ' + this.lists[i]
        }*/
  }
};
</script>

<style lang="scss">
.Scroller {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  .wrap {
    overflow: hidden;
    color: #005bbe;
  }
  #box {
    /*width: 80%;*/
    height: 100%;
  }
  #box div {
    float: left;
  }
  #marquee {
    //margin: -5px 16px 0 20px;
    display: flex;
    white-space: nowrap;
  }
  .marquee_item,
  .node_item {
    cursor: pointer;
    margin-right: 15px;
    height: 54px;
    display: inline-flex;
    align-items: center;
    background-color: rgba(30, 70, 97, 0.9);
    border-radius: 30px;
    color: white;
    font-size: 16px;
    .name {
      align-items: center;
      margin-left: 30px;
      margin-right: 10px;
      width: 80px;
      height: 30px;
      display: inline-flex;
      justify-content: center;
      border-radius: 28px;
      align-items: center;
      color: #1d1f26;
      &.serious {
        background: #f4a723;
      }
      &.commonly {
        background: #5eb0fc;
      }
      &.danger {
        background: #d0011b;
      }
    }
    .time,
    .mainDevice,
    .powerDeviceName,
    .nr {
      margin-right: 20px;
    }
  }
  #node {
    position: absolute;
    z-index: -99;
    top: -99px;
    white-space: nowrap;
  }
}
</style>

