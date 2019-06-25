export { default as DunoProgressTep } from './progress.vue'

/* 
  使用方法
  import { DunoProgressTep } from '_c/duno-progress'

  <duno-progress-tep
    axiosUrl="/venus/crud/SpiderTask/view" // 获取进度的请求地址
    :query="progressQuery"                 // 请求携带的参数
    loadingText="数据抓取中..."             // 加载中的文字
    @on-hide="showProgress = false"        // 点击终止的方法
  />
*/