export { default as popupinfo } from './popupinfo.vue' // 实时信息、历史告警、历史数据
export { default as popupinfod } from './popupinfod.vue' // 实时信息、历史告警、历史数据
export { default as popupOneInfo } from './popuponeinfo.vue' // 单个告警信息，带复位、保存功能

/* 
  <!-- 一 -->
  <popupinfo :visible="visible" @onClose="visible = !visible"/>
  <!-- 二 -->
  <popupOneInfo :visible="visible" :itemId="itemId" @onClose="visible = !visible" />


  import { popupinfo, popupOneInfo } from '_c/popupinfo'
  export default {
    components: {popupinfo, popupOneInfo},
    data() {
      return {
        visible: false
      }
    },
    methods: {
      onClose (data) {
        this.visible = data
      }
    }
  }
*/