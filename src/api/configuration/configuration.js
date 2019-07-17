import axios from '@/libs/api.request'

//动态环境监测-安防总览-安防警告记录-复归/备注
export const dealRemarks = (data) => {
    return axios.request({
        url: '/lenovo-alarm/api/alarm/deal',
        method: 'post'
    })
}
//动态环境监测-获取区域ID
export const getAreaList = (data) => {
    return axios.request({
        url: "/lenovo-device/api/area/list",
        method: "get"
    })
}

//动态环境监测-10-1000KV-安放警告
export const circleMonth = (data) => {
    return axios.request({
        url: "/lenovo-alarm/api/security/statistics",
        method: "get"
    })
}

//动态环境监测-10-1000KV-告警类型
export const alarmType = (data) => {
    return axios.request({
        url: "/lenovo-alarm/api/alarm-type/list",
        method: "get"
    })
}

//设备监测-可见光-最新巡检报告
export const lightNewReport = (data) => {
    return axios.request({
        url: "/lenovo-plan/api/plan/visible-report/list",
        method: 'get'
    })
}

//设备监测-可见光-最新24小时记录信息
export const lightNewInformation = (data) => {
    // debugger
    return axios.request({
        url: "/lenovo-plan/api/task/visible-result/list",
        method: 'get'
    })
}

//设备监测-红外监测-最新巡检报告
export const infraNewReport = (data) => {
    return axios.request({
        url: "/lenovo-plan/api/plan/iir-report/list",
        method: 'get'
    })
}

//设备监测-红外监测-最新24小时记录信息
export const infraNewInformation = (data) => {
    // debugger
    return axios.request({
        url: "/lenovo-plan/api/task/iir-result/list",
        method: 'get'
    })
}

//所有报表-表计分析-echarts
export const getEchartsData = (data) => {
    return axios.request({
        url: "/lenovo-plan/api/statistics/meter-data/chart",
        method: 'get'
    })
}