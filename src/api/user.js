import axios from '@/libs/api.request'

export const login = (data) => {
  return axios.request({
    url: 'auth/login',
    data,
    method: 'post'
  })
}

export const getUserInfo = (token) => {
  return axios.request({
    url: '/auth/userinfo',
    params: { token },
    method: 'get'
  })
}

export const logout = (token) => {
  return axios.request({
    url: 'logout',
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
