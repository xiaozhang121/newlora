import axios from '@/libs/api.requestCamera'

export const playCamera = (token) => {
    return axios.request({
        url: 'socket/push/33',
        params: { token },
        method: 'get'
    })
}

export const setPosition = (query) => {
    return axios.request({
        url: '/lenovo-visible/api/visible-equipment/preset/create',
        params: { ...query },
        method: 'get'
    })
}

export const editPosition = (data) => {
    return axios.request({
        url: '/lenovo-visible/api/visible-equipment/preset/edit',
        method: 'put',
        data: data
    })
}

export const delPosition = (query) => {
    return axios.request({
        url: '/lenovo-visible/api/visible-equipment/preset/delete',
        params: { ...query },
        method: 'get'
    })
}

export const mvPosition = (query) => {
    debugger
    return axios.request({
        url: '/lenovo-visible/api/visible-equipment/ptz/preset-move',
        method: 'put',
        params: query
    })
}

export const controlCamera = (query) => {
    return axios.request({
        url: 'ptzCtrl',
        params: { ...query },
        method: 'get'
    })
}