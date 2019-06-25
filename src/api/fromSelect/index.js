import axios from '@/libs/api.request'

export const getSelectList = (data) => {
  return axios.request({
    url: '/venus/select/dictionary',
    data,
    method: 'post'
  })
}
export const getSelectCustomList = (data) => {
  return axios.request({
    url: '/venus/select/custom',
    data,
    method: 'post'
  })
}
export const formUpData = (url, data) => {
  return axios.request({
    url: url,
    data: data,
    method: 'post'
  })
}
