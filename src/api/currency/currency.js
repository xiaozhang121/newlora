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


export const getPlanHistoryN = (query) => {
  return axios.request({
    url: '/lenovo-plan/api/plan/history/new',
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

// 设备信息-全部电力设备的信息
export const deviceList = () => {
    return axios.request({
        url: '/lenovo-device/api/device/list',
        method: 'get',
    })
}

//动态环境监测-动态环境总览-重点监测区域摄像下拉列表
export const getMonitorSelect = (query) => {
    return axios.request({
        params: { ...query },
        url: '/lenovo-device/api/security/monitor-select',
        method: 'get',
    })
}

//动态环境监测-动态环境总览-重点监测区域摄像信息
export const securityMonitor = (query) => {
    return axios.request({
        url: '/lenovo-device/api/security/monitor',
        method: 'get',
        params: { ...query }
    })
}

// 配置信息-修改(推送)
export const editConfig = (query) => {
    return axios.request({
        url: '/lenovo-device/api/config/edit',
        method: 'put',
        params: query
    })
}

// 设备信息-全部电力设备的信息
export const lastDeviceList = (query) => {
    return axios.request({
        url: '/lenovo-device/api/device/list',
        method: 'get',
        params: { ...query }
    })
}

//监控设备-根据监控id获得监控摄像头信息
export const getMonitorView = (query) => {
    return axios.request({
        url: '/lenovo-device/api/device/monitor/view',
        method: 'get',
        params: { ...query }
    })
}

//告警信息-告警提示设置下拉框
export const getAlarmAction = (data) => {
    return axios.request({
        url: '/lenovo-alarm/api/alarm/action',
        method: 'post'
    })
}