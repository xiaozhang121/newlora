<template>
  <div style="height: 100%">
    <el-container v-if="!isBigScreen" style="height: 100%" class="main">
      <el-header
              v-if="isShowHeader && !isHidden"
              class="main-header not-print"
              style="height: 80px;"
      >
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <alarm-tip />
          <!-- 告警消息 -->
          <user />
          <!-- 用户基础操作 -->
        </header-bar>
      </el-header>
      <el-container class="mainAside">
        <el-menu class="el-menu-vertical-demo not-print" :collapse="isCollapse">
          <el-aside
                  v-show="!isCollapse"
                  v-if="$store.state.app.topNav != 3 && $store.state.app.topNav != 1 && !isHidden"
                  hide-trigger
                  collapsible
                  :width="collapsed ? '64px' : '200px'"
                  class="left-sider"
                  :style="{overflow: 'hidden'}"
          >
            <side-menu
                    :unique-opened="true"
                    ref="sideMenu"
                    textColor="#fff"
                    activeTextColor="#00fefe"
                    :default-active="defaultActive"
                    :collapsed="collapsed"
                    @select="turnToPage"
                    :menu-list="menuList"
            ></side-menu>
          </el-aside>
          <i
                  v-show="!isCollapse"
                  @click="isShowSide"
                  class="sideShow sideShrink el-icon-d-arrow-left not-print"
          >收起</i>
          <i
                  v-show="isCollapse"
                  @click="isShowSide"
                  class="sideShow sideOpen el-icon-d-arrow-right not-print"
          ></i>
        </el-menu>
        <el-main class="main-content-con">
          <el-container class="main-layout-con">
            <el-main class="content-wrapper">
              <!--<custom-bread-crumb show-icon :list="breadCrumbList"></custom-bread-crumb>-->
              <keep-alive :include="cacheList">
                <router-view class="duno-cons" />
              </keep-alive>
              <!--<duno-footer />-->
            </el-main>
          </el-container>
        </el-main>
      </el-container>
    </el-container>
    <el-container v-if="isBigScreen" style="height: 100%;width: 100%" class="main">
      <el-collapse-transition class="not-print">
        <el-row v-show="showheader">
          <el-col :span="24">
            <headerBig />
          </el-col>
        </el-row>
      </el-collapse-transition>
      <el-container :style="{height: '100%',width:'100%',padding:'0 20px'}">
        <el-row style="height:100%; width: 100%" :gutter="20">
          <el-col style="height:100%" :span="8">
            <div class="lineTitle">功能卡片</div>
            <!-- <parentAlarm /> -->
            <iframe :src="alarmSrc" frameborder="0" class="iframe" ref="iframe"></iframe>
          </el-col>
          <el-col style="height:100%" :span="8">
            <div class="lineTitle">操作中台</div>
            <el-container class="mainAside">
              <el-aside
                      v-if="$store.state.app.topNav != 3 && $store.state.app.topNav != 1 && !isHidde"
                      hide-trigger
                      collapsible
                      :width="collapsed ? '64px' : '200px'"
                      class="left-sider"
                      :style="{overflow: 'hidden'}"
              >
                <side-menu
                        :unique-opened="true"
                        ref="sideMenu"
                        textColor="#fff"
                        activeTextColor="#00fefe"
                        :default-active="defaultActive"
                        :collapsed="collapsed"
                        @select="turnToPage"
                        :menu-list="menuList"
                ></side-menu>
              </el-aside>
              <el-main class="main-content-con">
                <el-container class="main-layout-con">
                  <el-main class="content-wrapper">
                    <keep-alive :include="cacheList">
                      <router-view class="duno-cons" />
                    </keep-alive>
                  </el-main>
                </el-container>
              </el-main>
            </el-container>
          </el-col>
          <el-col style="height:100%" :span="8">
            <div class="lineTitle">视频监控</div>
            <!-- <parentVideo /> -->
            <iframe :src="videoSrc" frameborder="0" class="iframe" ref="iframe"></iframe>
          </el-col>
        </el-row>
      </el-container>
    </el-container>
    <popup-one-info
            :itemDataOption="$store.state.user.alarmInfo"
            v-if="visible && frameLength()"
            @onClose="alarmClose"
            :visible="visible"
    ></popup-one-info>
    <el-dialog
            :close-on-click-modal="false"
            v-if="visibleCamera"
            class="dialogMain"
            :visible.sync="visibleCamera"
            :show-close="false"
            :before-close="beforeClose"
    >
      <KeyMonitor
              :isPic="$store.state.app.isPic"
              :monitorInfo="$store.state.app.monitorInfo"
              v-if="visibleCamera"
              :onlyCanel="true"
              :autoplay="true"
              :streamAddr="monitorData.src"
              @on-close="onClose"
      />
    </el-dialog>
  </div>
</template>
<script>
    import KeyMonitor from "_c/duno-c/KeyMonitor";
    import { mapMutations, mapState } from "vuex";
    import { getNewTagList } from "@/libs/util";
    import SideMenu from "./components/side-menu"; // 侧导航栏
    import HeaderBar from "./components/header-bar"; // header
    import customBreadCrumb from "_c/custom-bread-crumb"; // 面包屑导航
    import User from "./components/user"; // 用户基础操作
    import alarmTip from "./components/alarm/alarm.vue"; // 告警消息
    import DunoFooter from "_c/duno-footer";
    import parentAlarm from "_c/duno-c/parent-alarm";
    import parentVideo from "_c/duno-c/parent-video";
    import { popupOneInfo } from "_c/popupinfo";
    import headerBig from "_c/duno-c/header-big";
    import "./main.scss";
    export default {
        name: "Main",
        components: {
            KeyMonitor,
            SideMenu,
            popupOneInfo,
            HeaderBar,
            customBreadCrumb,
            User,
            alarmTip,
            DunoFooter,
            parentAlarm,
            parentVideo,
            headerBig
        },
        data() {
            return {
                monitorData: {
                    src: ""
                    // src: "rtmp://202.69.69.180:443/webcast/bshdlive-pc"
                },
                visibleCamera: false,
                isHidden: false,
                visible: false,
                collapsed: false,
                isFullscreen: false,
                bodyWidth: null,
                screenWidth: null,
                isBigScreen: false,
                isShowHeader: true,
                showheader: true,
                isCollapse: false,
                isnum: 1,
                alarmSrc: "../abnormalInfoPath/home",
                videoSrc: "../surveillancePath/list"
            };
        },
        computed: {
            alarmInfo(){
                return this.$store.state.user.alarmInfo
            },
            addrFlag() {
                return this.$store.state.app.webFullVisable;
            },
            addrData() {
                return this.$store.state.app.webFull;
            },
            kilovoltKind() {
                return this.$store.state.app.kilovolt;
            },
            isAlarm() {
                return this.$store.state.user.isAlarm;
            },
            defaultActive() {
                const that = this;
                const active =
                    that.$route.meta && that.$route.meta.active
                        ? that.$route.meta.active
                        : that.$route.name;
                return active;
            },
            ...mapState(["user"]),
            tagNavList() {
                return this.$store.state.app.tagNavList;
            },
            tagRouter() {
                return this.$store.state.app.tagRouter;
            },
            cacheList() {
                return this.tagNavList.length
                    ? this.tagNavList
                        .filter(item => !(item.meta && item.meta.notCache))
                        .map(item => item.name)
                    : [];
            },
            menuList() {
                return this.$store.getters.menuList;
            },
            local() {
                return this.$store.state.app.local;
            },
            breadCrumbList() {
                return this.$store.state.app.breadCrumbList;
            }
        },
        methods: {
            ...mapMutations(["setBreadCrumb", "setTagNavList"]),
            webFullScreen(streamAddr, flag) {
                this.$store.state.app.isPic = flag
                this.$store.state.app.webFullVisable = !this.$store.state.app
                    .webFullVisable;
                this.$store.state.app.webFull = streamAddr;
                document.onkeydown=function(event){
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    if (e && e.keyCode==27) {
                        parent.beforeClose()
                    }
                }
            },
            frameLength() {
                if (!("kind" in this.$route.meta)) return !(self != top);
                else return false;
            },
            onClose(){
                this.visibleCamera = false
                this.beforeClose()
            },
            beforeClose() {
                this.$store.state.app.webFullVisable = false;
            },
            alarmClose() {
                this.visible = false;
                this.$store.state.user.isAlarm = false;
            },
            turnToPage(route) {
                let { name, params, query } = {};
                if (typeof route === "string") name = route;
                else {
                    name = route.name;
                    params = route.params;
                    query = route.query;
                }
                if (name.indexOf("isTurnByHref_") > -1) {
                    window.open(name.split("_")[1]);
                    return;
                }
                this.$router.push({
                    name,
                    params,
                    query
                });
            },
            handleCollapsedChange(state) {
                this.user.isCollapsed = state;
                this.collapsed = state;
            },
            sidebarHide(num) {
                if (num && num < 500) {
                    this.user.isCollapsed = true;
                    this.collapsed = true;
                } else {
                    this.user.isCollapsed = false;
                    this.collapsed = false;
                }
            },
            getWidth() {
                let that = this;
                try {
                    let ivuLayoutWidth = document.getElementsByClassName("el-aside")[0]
                        .clientWidth;
                    window.screenWidth = document.body.clientWidth;
                    that.screenWidth = window.screenWidth - ivuLayoutWidth;
                    that.bodyWidth = window.screenWidth;
                } catch (e) {}
                try {
                    if (window.screen.availWidth > 3000 && parent.frames.length == 0) {
                        that.isBigScreen = true;
                        this.user.isHeader = 2;
                    } else if (
                        window.screen.availWidth > 3000 &&
                        parent.frames.length > 0
                    ) {
                        that.isHidden = true;
                    }
                } catch (e) {}
            },
            handleHidden(e) {
                if (e.clientY == 20 && this.showheader == false) {
                    this.showheader = true;
                } else if (e.clientY > 80 && this.showheader == true) {
                    this.showheader = false;
                }
            },
            isShowSide() {
                this.isCollapse = !this.isCollapse;
            }
        },
        watch: {
            addrFlag: {
                handler(now) {
                    this.visibleCamera = now;
                },
                deep: true
            },
            addrData: {
                handler(now) {
                    if (now) {
                        this.monitorData["src"] = now;
                    }
                },
                deep: true,
                immediate: true
            },
            kilovoltKind: {
                handler(now) {},
                deep: true,
                immediate: true
            },
            alarmInfo: {
                handler(now) {
                    this.visible = false
                    if (this.frameLength() && now['alarmConfig'] == 1) {
                        this.visible = true;
                    }
                },
                deep: true
            },
            $route(newRoute) {
                this.$store.state.user.alarmInfo = {}
                this.setBreadCrumb(newRoute.matched);
                this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
            },
            bodyWidth(now) {
                this.sidebarHide(now);
            },
            screenWidth(val) {
                let that = this;
                if (!that.timer) {
                    that.screenWidth = val;
                    if (val < 620) {
                        that.user.isFormWidthTop = true;
                    } else {
                        that.user.isFormWidthTop = false;
                    }
                    that.timer = true;
                    setTimeout(function() {
                        that.timer = false;
                    }, 400);
                }
            }
        },
        mounted() {
            /**
             * @description 初始化设置面包屑导航和标签导航
             */
            window.webFullScreen = this.webFullScreen;
            window.beforeClose = this.beforeClose;
            document.onkeydown=function(event){
                var e = event || window.event || arguments.callee.caller.arguments[0];
                if (e && e.keyCode==27) {
                    parent.beforeClose()
                }
            }
            let that = this;
            that.setTagNavList();
            that.getWidth();
            that.setBreadCrumb(this.$route.matched);
            window.addEventListener("resize", function() {
                that.getWidth();
            });
            window.addEventListener("mousemove", this.handleHidden);
            if (this.user.isHeader == 1) {
                that.isShowHeader = true;
            } else if (this.user.isHeader == 2) {
                that.isShowHeader = false;
            }
        }
    };
</script>
<style lang="scss">
  .dialogMain {
    overflow: hidden !important;
    .el-dialog {
      width: 100% !important;
      height: 100%;
      margin-top: 0 !important;
      margin: 0;
    }
    .video-js.vjs-fluid {
      height: 100vh !important;
      padding-top: 0 !important;
    }
    .el-dialog__header {
      display: none;
    }
    .camera {
      padding-bottom: 0 !important;
      height: 100vh;
      background: black;
    }
    .keyMonitor .video-player.vjs-custom-skin {
      height: 100vh;
    }
    .vjs_video_395-dimensions.vjs-fluid {
      height: 100vh;
      padding-top: 0;
    }
    .el-dialog__body {
      padding: 0;
      .keyMonitor {
        width: 100% !important;
      }
    }
  }
  .el-menu {
    border-right: none !important;
  }
  .el-menu-item,
  .el-submenu__title {
    font-size: 18px !important;
    color: #999 !important;
  }
  .el-menu.el-menu--inline,
  .el-submenu .el-menu-item,
  .side-menu-wrapper ul > li > ul .el-menu-item.is-active {
    background: transparent !important;
  }
  .side-menu-wrapper ul > li > .el-menu {
    background: -webkit-linear-gradient(#15222d, #090f14) !important;
    background: -o-linear-gradient(#15222d, #090f14) !important;
    background: -moz-linear-gradient(#15222d, #090f14) !important;
    background: linear-gradient(#15222d, #090f14) !important;
  }

  .el-submenu.is-active .el-submenu__title {
    border-left: 4px solid #00fefe;
    background: #1b3b47 !important;
    color: #fff !important;
  }
  .el-menu-item.is-active {
    border-left: 4px solid #00fefe;
    background: #1b3b47 !important;
    color: #00fefe !important;
  }
  .el-menu-item,
  .el-submenu__title,
  .el-submenu .el-menu-item {
    font-size: 16px !important;
    border-left: 4px solid transparent;
  }
  body .el-menu {
    background: #0c141b;
    background: url("../../../assets/images/mian-bg.png") no-repeat top left;
    background-size: cover;
    padding-top: 1em;
    /*overflow-y: auto;*/
  }
  .lineTitle {
    color: #3a81a1;
    font-size: 18px;
    border-bottom: 3px solid #3a81a1;
    padding-bottom: 5px;
    margin-top: 14px;
    margin-bottom: 10px;
  }
  .iframe {
    width: 100%;
    height: 100%;
  }
  .el-menu-vertical-demo {
    position: relative;
    .sideShow {
      position: absolute;

      cursor: pointer;
      z-index: 10;
    }
    .sideShrink {
      top: 10px;
      font-size: 15px;
      right: 125px;
      color: #999;
    }
    .sideOpen {
      top: 28px;
      color: #fff;
      font-size: 20px;
      right: -20px;
    }
    .sideShow:hover {
      color: rgb(0, 254, 254);
    }
  }
  .el-menu--collapse {
    width: 0 !important;
  }
</style>
