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

//2.3.1巡视计划-根据监控设备id获取历史数据
export const getPlanHistory = (query) => {
    return axios.request({
        url: '/lenovo-plan/api/plan/history',
        method: 'get',
        params: { ...query }
    })
}

export const deviceLocation = (query) => {
    return axios.request({
        url: '/lenovo-device/api/device/location',
        method: 'get',
        params: { ...query }
    })
}