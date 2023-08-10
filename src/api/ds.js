
import request from '@/utils/request'

export function rmDs(ns,name) {
  return request({
    url: '/destinationRule/'+ns+"/"+name,
    method: 'delete',
  })
}
export function loadDS(ns,name) {  //加载DS详细
  return request({
    url: '/destinationRule/' + ns+'/'+name,
    method: 'get',
  })
}
export function createDS(data) {
  return request({
    url: '/destinationRule',
    data,
    method: 'post',

  })
}
export function updateDS(data) {
  return request({
    url: '/destinationRule',
    data,
    method: 'put',

  })
}
export function getDsList(ns) {
  return request({
    url: '/destinationRules?ns=' + ns,
    method: 'get',

  })
}
