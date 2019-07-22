import axios from '@/libs/api.request'

//动态环境监测-动态环境总览-安防警告记录-复归/备注
export const dealRemarks = (query) => {
    return axios.request({
        url: '/lenovo-alarm/api/alarm/deal',
        method: 'post',
        params: {
            ...query
        }
    })
}

//动态环境监测-动态环境总览-安防警告记录-选择所有区域
export const getRegionData = (data) => {
    return axios.request({
        url: '/lenovo-device/api/area/select-list',
        method: 'post',
    })
}

//动态环境监测-动态环境总览-安防警告记录-选择告警类型
export const getTypeData = (query) => {
    return axios.request({
        url: '/lenovo-alarm/api/alarm-type/list',
        method: 'get',
        params: {
            ...query
        }
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
    return axios.request({
        url: "/lenovo-plan/api/task/iir-result/list",
        method: 'get'
    })
}

//配置管理-任务配置-列表
export const infrInformation = (data) => {
    return axios.request({
        url: "/lenovo-plan/api/plan/all-list",
        method: 'get'
    })
}

//配置管理-设备监测管理-列表
export const getDevice = (data) => {
    return axios.request({
        url: "/lenovo-device/api/area/select-list",
        method: 'post'
    })
}

//配置管理-设备监测管理-状态
export const getStatus = (data) => {
    return axios.request({
        url: "/lenovo-device/api/monitor/status",
        method: 'post'
    })
}

//所有报表-巡视任务报表-所有巡检报表
export const getPlayType = (data) => {
    return axios.request({
        url: "/lenovo-plan/api/list/plan-type",
        method: 'post'
    })
}

//所有报表-表计分析-echarts
export const getEchartsData = (data) => {
    return axios.request({
        url: "/lenovo-plan/api/statistics/meter-data/chart",
        method: 'get'
    })
}

//所有报表-表计分析-泄露电路表
export const getAmmeter = (data) => {
    return axios.request({
        url: "/lenovo-device/api/device/meter-type/select",
        method: 'get'
    })
}

//所有报表-表计分析-主设备名
export const getMainEqui = (query) => {
    return axios.request({
        url: "/lenovo-device/api/device/part/select",
        method: 'get',
        params: {
            ...query
        }
    })
}

//所有报表-表计分析-相位
export const getDifference = (query) => {
    return axios.request({
        url: "/lenovo-device/api/device/phase/select",
        method: 'get',
        params: {
            ...query
        }
    })
}

//视频监控-可见光-摄像头详情-历史信息记录
export const getVLIght = (query) => {
    return axios.request({
        url: "/lenovo-alarm/api/alarm/level-edit",
        method: 'put',
        params: {
            ...query
        }
    })
}

//视频监控-可见光-摄像头详情-历史信息记录-全部数据类型
export const getVType = (data) => {
    return axios.request({
        url: "/lenovo-device/api/device/data/type",
        method: 'post',
    })
}

//视频监控-可见光-摄像头详情-历史信息记录-全部异常等级
export const getVGrade = (data) => {
    return axios.request({
        url: "/lenovo-alarm/api/alarm/level",
        method: 'post',
    })
}

//视频监控-可见光-摄像头详情-历史数据-预置位
export const getVPreset = (data) => {
    return axios.request({
        url: "",
        method: 'get',
    })
}

//视频监控-可见光-摄像头详情-历史数据echarts
export const getVEcharts = (query) => {
    return axios.request({
        url: "/lenovo-plan/api/plan/history/preset",
        method: 'post',
        params: {
            ...query
        }
    })
}

//视频监控-红外检测-摄像头详情-历史信息记录
export const getRedLIght = (query) => {
    return axios.request({
        url: "/lenovo-alarm/api/alarm/level-edit",
        method: 'put',
        params: {
            ...query
        }
    })
}

//视频监控-红外检测-摄像头详情-历史信息记录-全部数据类型
export const getRedType = (data) => {
    // debugger
    return axios.request({
        url: "/lenovo-device/api/device/data/type",
        method: 'post',
    })
}

//视频监控-红外检测-摄像头详情-历史信息记录-全部异常等级
export const getRedGrade = (data) => {
    return axios.request({
        url: "/lenovo-alarm/api/alarm/level",
        method: 'post',
    })
}

//视频监控-红外检测-摄像头详情-历史数据-预置位
export const getRedPreset = (data) => {
    return axios.request({
        url: "",
        method: 'get',
    })
}

//视频监控-红外检测-摄像头详情-历史数据echarts
export const getRedEcharts = (query) => {
    // debugger
    return axios.request({
        url: "/lenovo-plan/api/plan/history/preset",
        method: 'post',
        params: {
            ...query
        }
    })
}