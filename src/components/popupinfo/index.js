import popupinfo from "./popupinfo.vue"
export default popupinfo

/* 
  <!-- 使用示例 -->
  <popupinfo :visible="visible" @onClose="visible = !visible"/>

  import popupinfo from '_c/popupinfo'
  export default {
    components: {popupinfo},
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