import request from '@/utils/request'

// 查询设备温度列表
export function listTemp(query) {
  return request({
    url: '/equipment/temp/list',
    method: 'get',
    params: query
  })
}

// 查询设备温度详细
export function getTemp(id) {
  return request({
    url: '/equipment/temp/' + id,
    method: 'get'
  })
}

// 新增设备温度
export function addTemp(data) {
  return request({
    url: '/equipment/temp',
    method: 'post',
    data: data
  })
}

// 修改设备温度
export function updateTemp(data) {
  return request({
    url: '/equipment/temp',
    method: 'put',
    data: data
  })
}

// 删除设备温度
export function delTemp(id) {
  return request({
    url: '/equipment/temp/' + id,
    method: 'delete'
  })
}
