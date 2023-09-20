import request from '@/utils/request'

// 查询测温报警配置列表
export function listConfig(query) {
  return request({
    url: '/tempAlarmSetting/config/list',
    method: 'get',
    params: query
  })
}

// 查询测温报警配置详细
export function getConfig(id) {
  return request({
    url: '/tempAlarmSetting/config/' + id,
    method: 'get'
  })
}

// 新增测温报警配置
export function addConfig(data) {
  return request({
    url: '/tempAlarmSetting/config',
    method: 'post',
    data: data
  })
}

// 修改测温报警配置
export function updateConfig(data) {
  return request({
    url: '/tempAlarmSetting/config',
    method: 'put',
    data: data
  })
}

// 删除测温报警配置
export function delConfig(id) {
  return request({
    url: '/tempAlarmSetting/config/' + id,
    method: 'delete'
  })
}
