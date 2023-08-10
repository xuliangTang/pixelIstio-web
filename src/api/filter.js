import request from '@/utils/request'
export function rmFilter(ns,name) {
  return request({
    url: '/filters/'+ns+"/"+name,
    method: 'delete',
  })
}
export function getFilterList(ns) {
  return request({
    url: '/filters?ns=' + ns,
    method: 'get',
  })
}
