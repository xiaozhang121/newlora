/* 是否开始mock */
const isMock = true

/* dev开发地址 */
let baseUrl = 'http://dunoinfo.synology.me:8052'
/* mock地址 */
const mockUrl = 'http://dunoinfo.synology.me:8052'
/* 如果开始mock数据模式dev启动自动切换至mock地址 */
if (isMock) {
  baseUrl = mockUrl
}

export default {
  /**
   * @description token的名称，默认token天
   */
  tokenName: 'token',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用mock数据
   */
  isMock: isMock,
  
  useI18n: false,
  /**
   * @description api请求基础路径
   */
  baseUrl: {
    dev: baseUrl,
    pro: 'http://192.168.0.241:8052'
  }
}
