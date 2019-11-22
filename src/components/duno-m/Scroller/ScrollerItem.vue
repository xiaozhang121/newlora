<template>
        <div class="wrap not-print" style="width: 100%; z-index: 0" v-show="wrapShow">
            <div :id="idName" not-print>
                <div class="marqueeClass" :id="'marquee'+idName">
                   <!-- @mouseenter="enter()"
                    @mouseleave="leave()"-->
                    <div
                            @mouseenter="enterControl"
                            @mouseleave="leaveControl"
                            class="marquee_item"
                            v-for="(item, indexd) in lists"
                            :key="indexd+''+idName"
                            @click="handleClick(indexd)"
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
</template>

<script>
    import warningSetting from "_c/duno-j/warningSetting";
    import wraning from "_c/duno-j/warning";
    export default {
        name: "ScrollerItem",
        components: {
            warningSetting,
            wraning
        },
        data() {
            return {
                saveWidth: 0,
                wrapShow: false,
                visibleSettingOption: false,
                visible: false,
                lists: [],
                popData: {},
                distance: 1,
                timer: null,
                text: "" // 数组文字转化后的字符串
            };
        },
        props: {
            widthOption:{

            },
            idName:{
                type: String,
                default: 'box'
            },
            index:{},
            listOption: {
                type: Array,
                default: () => {
                    return [];
                }
            }
        },
        watch: {
            widthOption:{
                handler(now) {
                    this.saveWidth = now;
                },
                deep: true,
                immediate: true
            },
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
            enterControl(){
                this.$emit('on-enter')
            },
            leaveControl(){
                this.$emit('on-leave')
            },
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
                    let width = document.getElementById("marquee"+that.idName).getBoundingClientRect()
                        .width;
                    if(that.saveWidth) {
                        width = that.saveWidth
                    }
                    that.distance = that.distance - 1;
                    // 如果位移超过文字宽度，则回到起点
                    /*       console.log(-that.distance)
                           console.log(width)*/
                    box.style.transform = "translateX(" + that.distance + "px)";
                    if (-that.distance >= width) {
                        that.distance = document.body.clientWidth;
                        that.$emit('on-hide', that.index)
                    }
                    if (-that.distance >= width - 1000) {
                        that.$emit('on-stop', that.index)
                    }
                    that.$emit('save-width', width)
                }, 10);
            },
            move(flag) {
                const that = this;
                let box = document.getElementById(that.idName);
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
            handleClick(index) {
                this.enterControl()
                this.$emit('on-click', index)
                /*let that = this;
                that.popData = that.lists[index];
                that.visible = true;*/
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
        #marquee, .marqueeClass {
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

