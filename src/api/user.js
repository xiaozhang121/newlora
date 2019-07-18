import axios from '@/libs/api.request'

export const initConfigure = (data) => {
    return axios.request({
        url: '/lenovo-device/api/config/view',
        params: { ...data },
        method: 'get'
    })
}

export const login = (data) => {
  return axios.request({
    url: '/lenovo-user/api/user/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/lenovo-user/api/user/user-info',
    params: { token },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: '/lenovo-user/api/user/logout',
    method: 'post'
  })
}

export const getImage = (token) => {
    return axios.request({
        url: 'pushMDT',
        method: 'get'
    })
}

export const stopImage = (token) => {
    return axios.request({
        url: 'stopPush',
        method: 'get'
    })
}

export const getPointData = (token) => {
    return axios.request({
        url: 'getTemp',
        params: { ...token },
        method: 'get'
    })
}
