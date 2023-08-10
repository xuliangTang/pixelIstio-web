import request from '@/utils/request'
export function loadGW(ns,name) {  //加载网关详细
  return request({
    url: '/gateway/' + ns+'/'+name,
    method: 'get',
  })
}
export function rmGateWay(ns,name) {
  return request({
    url: '/gateway/'+ns+"/"+name,
    method: 'delete',
  })
}
export function updateGateWay(data) {
  return request({
    url: '/gateway',
    data,
    method: 'put',
  })
}
export function createGateWay(data) {
  return request({
    url: '/gateway',
    data,
    method: 'post',
  })
}
export function getGWList(ns) {
  return request({
    url: '/gateways?ns=' + ns,
    method: 'get',
  })
}

