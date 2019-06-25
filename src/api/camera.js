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
        url: 'setPreset',
        params: { ...query },
        method: 'get'
    })
}

export const editPosition = (query) => {
    return axios.request({
        url: 'editPoint',
        params: { ...query },
        method: 'get'
    })
}

export const delPosition = (query) => {
    return axios.request({
        url: 'delPoint',
        params: { ...query },
        method: 'get'
    })
}

export const mvPosition = (query) => {
    return axios.request({
        url: 'pointMove',
        params: { ...query },
        method: 'get'
    })
}

export const controlCamera = (query) => {
    return axios.request({
        url: 'ptzCtrl',
        params: { ...query },
        method: 'get'
    })
}