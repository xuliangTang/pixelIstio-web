import request from '@/utils/request'

export function getVsList(ns) {
  return request({
    url: '/virtualServices?ns=' + ns,
    method: 'get',
  })
}

export function createVS(data) {
  return request({
    url: '/virtualService',
    data,
    method: 'post',
  })
}

export function loadVs(ns,name) {
  return request({
    url: '/virtualService/' + ns+'/'+name,
    method: 'get',
  })
}

export function updateVS(data) {
  return request({
    url: '/virtualService',
    data,
    method: 'put',
  })
}
export function deleteVS(ns,name) {
  return request({
    url: '/virtualService/' + ns+'/'+name,
    method: 'delete',
  })
}