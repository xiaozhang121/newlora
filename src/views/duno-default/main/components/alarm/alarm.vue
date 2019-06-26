<template>
  <el-popover
    popper-class="promptBox"
    placement="bottom"
    width="440"
    v-model="visible"
    trigger="manual">
    <div @click="visible = !visible" slot="reference" class="header-icon">
      <el-badge :max="99" :value="value" :hidden="!isDot">
        <i class="iconfont icon-gaojingxinxi"></i>
      </el-badge>
    </div>
    <div class="promptContent">
      <h3>当前告警信息<span class="DotNum" v-if="isDot">{{value}}</span> <i  @click="visible = !visible" class="iconfont icon-guanbi"/></h3>
      <div class="promptItemBox">
        <div class="itemData" v-for="(item, index) in itemData" :key="index">
          <el-row>
            <el-col :span="15"><h5 class="title">{{item.title}}</h5></el-col>
            <el-col :span="9"><div class="buttonAll"><el-button type="info" round @click="restoration(item)">复位</el-button><el-button type="success" round @click="retain(item)">保存</el-button></div></el-col>
          </el-row>
          <p class="itemTitle">当前温度：<span>{{item.tepm}}</span></p>
          <p class="itemTitle">超出阈值：<span>{{item.threshold}}</span></p>
          <!-- 接数据时要对此处的状态做处理，下方class类名已经写好 -->
          <p class="itemTitle">缺陷评估：<span class="alarm">{{item.defect}}</span></p>
          <p class="itemTitle itemBottomTitle ">{{item.time}}<span class="location">位置：{{item.location}}</span></p>
        </div>
      </div>
    </div>
  </el-popover>
</template>

<script>
import { getAxiosData } from '@/api/axiosType.js'
import { mapState } from 'vuex'
export default {
  name: 'alarmTip',
  data () {
    return {
      value: 0,
      visible: false,
      itemData: []
    }
  },
  computed: {
    ...mapState([
      'user'
    ]),
    isDot () {
      return this.value > 0
    }
  },
  watch: {
    itemData: {
      handler(now) {
        if (now && now.length) {
          this.value = now.length
        } else {
          this.value = 0
        }
      },
      deep: true
    }
  },
  methods: {
    restoration (item) {
      console.log('复位', item)
    },
    retain (item) {
      console.log('保存', item)
    },
    getData () {
      const that = this
      const url = '/venus/user/massage/num'
      const query = { 'account': that.user.account }
      getAxiosData(url, query).then(res => {
        if (res.code !== 200) {
          that.value = 0
          return false
        }
        that.value = res.data
      })
    }
  },
  mounted () {
    // this.getData()
    this.itemData = [
        {
          title: '4号主变01#枪机',
          tepm: '98℃',
          threshold: '61%',
          defect: '危急缺陷',
          time: '05-21 13:33:23',
          location: '此处显示设备具体方位'
        },
        {
          title: '4号主变01#枪机',
          tepm: '98℃',
          threshold: '61%',
          defect: '危急缺陷',
          time: '05-21 13:33:23',
          location: '此处显示设备具体方位'
        },
        {
          title: '4号主变01#枪机',
          tepm: '98℃',
          threshold: '61%',
          defect: '危急缺陷',
          time: '05-21 13:33:23',
          location: '此处显示设备具体方位'
        }
      ]
  }
}
</script>
<style lang="scss">
  .header-icon{
    color: white;
    position: relative;
    overflow: inherit;
    
    .el-badge__content {
      border: none;
      background-color:#ce021d;
    }
  }
  body .prompt {
    &Box {
      box-sizing: border-box;
      background: rgba(47, 51, 63, 0.7);
      padding: 10px;
      border: none;
      color: #fff;
      .popper__arrow {
        border-bottom-color:rgba(47, 51, 63, 0.7) !important;
      }
    }
    &Content {
      > h3 {
        height: 55px;
        line-height: 55px;
        font-size: 16px;
        > i {
          float: right;
          margin-right: 10px;
        }
      }
      .DotNum {
        display: inline-block;
        font-size: 12px;
        vertical-align: text-bottom;
        padding: 3px 5px;
        border-radius: 30px;
        margin-left: 1em;
        width: auto;
        height: auto;
        line-height: initial;
        background: #ce021d;
        color: #fff;
      }
    }
    &ItemBox {
      max-height: 588px;
      overflow-x: hidden;
      overflow-y: auto;
      .itemData {
        box-sizing: border-box;
        padding: 20px 20px 10px;
        background: rgba(35, 38, 47, 0.7);
        margin-bottom: 10px;
      }
      .itemData:last-of-type{
        margin-bottom: 0;
      }
      .title {
        font-size: 22px;
        font-weight: bold;
        color: #05E0E1;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
      }
      .buttonAll {
        text-align: right;
      }
      .itemTitle {
        color: #fff;
        font-size: 18px;
        padding: 5px 0;
        .alarm {
          color: #d7203f;
          font-size: 22px;
        }
        .warning {
          color: #ff8300;
          font-size: 22px;
        }
        .general {
          color: #ffe828;
          font-size: 22px;
        }
      }
      .itemBottomTitle {
        color: #999;
        font-size: 16px;
      }
      .location {
        margin-left: 1em;
      }
    }
    
  }
</style>