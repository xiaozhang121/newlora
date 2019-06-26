export { default as popupinfo } from './popupinfo.vue' // 实时信息、历史告警、历史数据
export { default as popupOneInfo } from './popuponeinfo.vue' // 单个告警信息，带复位、保存功能

/* 
  <!-- 一 -->
  <popupinfo :visible="visible" @onClose="visible = !visible"/>
  <!-- 二 -->
  <popupOneInfo :visible="visible" title="4号主变01#枪机" :itemData="itemData" imgSrc="http://pic44.nipic.com/20140719/2531170_081420875000_2.jpg" @onClose="visible = !visible" />


  import { popupinfo, popupOneInfo } from '_c/popupinfo'
  export default {
    components: {popupinfo, popupOneInfo},
    data() {
      return {
        visible: false,
        itemData: {
          title: '4号主变01#枪机',
          tepm: '98℃',
          threshold: '61%',
          defect: '危机缺陷',
          time: '05-21 13:33:23',
          location: '此处显示设备具体方位'
        }
      }
    },
    methods: {
      onClose (data) {
        this.visible = data
      }
    }
  }
*/