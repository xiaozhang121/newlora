<template>
  <historical-documents width="500px" :tabPaneData="tabPaneData" @on-show="onShow" :dialogTableVisible="visible" @close="onClose">
    <div>
      <realtime v-if="activeName == 'first'" />
      <historicalwarning v-if="activeName == 'second'" />
    </div>
  </historical-documents>
</template>
<script>
import HistoricalDocuments from '_c/duno-c/HistoricalDocuments'
import realtime from './components/realtime'
import historicalwarning from './components/historicalwarning'
export default {
  name:'popupinfo',
  components: {HistoricalDocuments, realtime, historicalwarning},
  data() {
    return {
      activeName: 'first',
      tabPaneData: [
        {
          label: "实时信息",
          name: "first"
        },
        {
          label: "历史告警",
          name: "second"
        },
        {
          label: "历史数据",
          name: "third"
        },
      ]
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  methods: {
    onShow (data) {
      this.activeName = data
    },
    onClose (data) {
      this.$emit('onClose', data)
    }
  }
}
</script>
