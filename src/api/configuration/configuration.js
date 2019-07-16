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