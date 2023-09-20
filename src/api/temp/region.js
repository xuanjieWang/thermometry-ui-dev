import request from '@/utils/request'

// 查询测温区域列表
export function listRegion(query) {
  return request({
    url: '/temp/region/list',
    method: 'get',
    params: query
  })
}

// 查询测温区域详细
export function getRegion(id) {
  return request({
    url: '/temp/region/' + id,
    method: 'get'
  })
}

// 新增测温区域
export function addRegion(data) {
  return request({
    url: '/temp/region',
    method: 'post',
    data: data
  })
}

// 修改测温区域
export function updateRegion(data) {
  return request({
    url: '/temp/region',
    method: 'put',
    data: data
  })
}

// 删除测温区域
export function delRegion(id) {
  return request({
    url: '/temp/region/' + id,
    method: 'delete'
  })
}
