import axios from '@/libs/api.request'

//设备信息-设备类型
export const getDeviceType = (data) => {
    return axios.request({
        url: '/lenovo-device/api/device/type',
        method: 'post'
    })
}

//5.1.1告警服务-获得告警历史信息
export const getAlarmHistory = (query) => {
    return axios.request({
        url: '/lenovo-alarm/api/alarm/history',
        method: 'get',
        params: { ...query }
    })
}

//1.1.0设备信息-获取区域列表
export const getAreaList = (query) => {
    return axios.request({
        url: '/lenovo-device/api/area/list',
        method: 'get',
        params: { ...query }
    })
}