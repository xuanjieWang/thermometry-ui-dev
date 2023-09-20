import request from '@/utils/request'

// 查询设备分组列表
export function listGroup(query) {
  return request({
    url: '/equipment/group/list',
    method: 'get',
    params: query
  })
}

// 查询设备分组详细
export function getGroup(id) {
  return request({
    url: '/equipment/group/' + id,
    method: 'get'
  })
}

// 新增设备分组
export function addGroup(data) {
  return request({
    url: '/equipment/group',
    method: 'post',
    data: data
  })
}

// 修改设备分组
export function updateGroup(data) {
  return request({
    url: '/equipment/group',
    method: 'put',
    data: data
  })
}

// 删除设备分组
export function delGroup(id) {
  return request({
    url: '/equipment/group/' + id,
    method: 'delete'
  })
}
