export { default as DunoDialogTep } from './dialog.vue'

/* 
使用方法
  import { DunoDialogTep } from '_c/duno-dialog'
  
  <duno-dialog-tep
      v-if="showDialog"
      title="手动抓取"
      :loading="dataListLoading"
      :showDialog="showDialog"
      @onConfirm=""                   // 点击确定调用的方法
      @onCancel="showDialog = false"  // 点击取消
    >
      <div>弹框内容</div>
    </duno-dialog-tep>

*/