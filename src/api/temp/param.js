import request from '@/utils/request'

// 查询测温参数列表
export function listParam(query) {
  return request({
    url: '/temp/param/list',
    method: 'get',
    params: query
  })
}

// 查询测温参数详细
export function getParam(id) {
  return request({
    url: '/temp/param/' + id,
    method: 'get'
  })
}

// 新增测温参数
export function addParam(data) {
  return request({
    url: '/temp/param',
    method: 'post',
    data: data
  })
}

// 修改测温参数
export function updateParam(data) {
  return request({
    url: '/temp/param',
    method: 'put',
    data: data
  })
}

// 删除测温参数
export function delParam(id) {
  return request({
    url: '/temp/param/' + id,
    method: 'delete'
  })
}
