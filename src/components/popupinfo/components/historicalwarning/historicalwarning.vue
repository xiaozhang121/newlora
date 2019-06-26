<template>
  <div class="historicalwarning">
    <h3 class="title">{{title}}</h3>
    <div class="historicalwarningBox">
      <div class="historicalwarningItem" v-for="(item, index) in dataList" :key="index">
        <div>{{item.time}}</div>
        <div><span>温度：{{item.tepm}}</span><span class="threshold">超出阈值：{{item.threshold}}</span></div>
        <div>缺陷评估：<span class="alarm">{{item.defect}}</span></div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'historicalwarning',
  props: {
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    dataList: {
      type: Array,
      default: () => {
        return [
          // {
          //   title: '4号主变01#枪机',
          //   tepm: '98℃',
          //   threshold: '61%',
          //   defect: '危机缺陷',
          //   time: '05-21 13:33:23',
          //   location: '此处显示设备具体方位'
          // }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.historicalwarning {
  .title {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: bold;
  }
  &Box {
    width: 100%;
    max-height: 400px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &Item {
    color: #fff;
    font-size: 18px;
    padding: 10px;
    background: #343746;
    margin-bottom: 10px;
    border-radius: 4px;

    .threshold {
      margin-left: 1.5em;
    }
    .alarm {
      color: #d7203f;
    }
    .warning {
      color: #ff8300;
    }
    .general {
      color: #ffe828;
    }
  }
}
</style>
