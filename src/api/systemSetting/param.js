import request from '@/utils/request'

// 查询系统参数列表
export function listParam(query) {
  return request({
    url: '/systemSetting/param/list',
    method: 'get',
    params: query
  })
}

// 查询系统参数详细
export function getParam(id) {
  return request({
    url: '/systemSetting/param/' + id,
    method: 'get'
  })
}

// 新增系统参数
export function addParam(data) {
  return request({
    url: '/systemSetting/param',
    method: 'post',
    data: data
  })
}

// 修改系统参数
export function updateParam(data) {
  return request({
    url: '/systemSetting/param',
    method: 'put',
    data: data
  })
}

// 删除系统参数
export function delParam(id) {
  return request({
    url: '/systemSetting/param/' + id,
    method: 'delete'
  })
}
