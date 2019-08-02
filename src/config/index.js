/* 是否开始mock */
const isMock = false
/* dev开发地址 */
// let baseUrl = 'http://52.82.107.5:8080'
// let baseUrl = 'http://192.168.1.150:8096'
// let baseUrl = 'http://10.0.6.223:8096'
// let baseUrl = 'http://10.0.10.35:8080'              // 锴锴
let baseUrl = 'http://52.82.107.5:8080'              // 锴锴
// let baseUrl = 'http://192.168.9.112:8088'                  // 刘飞
// let baseUrl = 'http://10.0.6.233:8088'                  // 刘飞
// let baseUrl = 'http://192.168.9.113:8091'
/* 如果开始mock数据模式dev启动自动切换至mock
/* mock地址 */
// let mockUrl = 'http://10.0.6.233:8088'                  // 刘飞
let mockUrl = 'http://192.168.9.112:8088'                  // 刘飞
// let mockUrl = 'http://192.168.9.113:8096'
// const mockUrl = 'http://192.168.1.150:8096'
// const mockUrl = 'http://192.168.9.113:8091'
// const mockUrl = 'http://192.168.9.113:8091'
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
        pro: 'http://10.0.0.164:8088'
    }
}