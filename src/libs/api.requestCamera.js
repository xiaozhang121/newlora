import HttpRequest from '@/libs/axios'
import config from '@/config'
const cameraUrl = process.env.NODE_ENV === 'development' ? config.cameraUrl.dev : config.cameraUrl.pro
const axios = new HttpRequest(cameraUrl)
export default axios
