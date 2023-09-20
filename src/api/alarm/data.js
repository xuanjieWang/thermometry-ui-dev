import request from '@/utils/request'

// 查询报警中心列表
export function listData(query) {
  return request({
    url: '/alarm/data/list',
    method: 'get',
    params: query
  })
}

// 查询报警中心详细
export function getData(id) {
  return request({
    url: '/alarm/data/' + id,
    method: 'get'
  })
}

// 新增报警中心
export function addData(data) {
  return request({
    url: '/alarm/data',
    method: 'post',
    data: data
  })
}

// 修改报警中心
export function updateData(data) {
  return request({
    url: '/alarm/data',
    method: 'put',
    data: data
  })
}

//获取设备报警配置详细信息
export function configData(equipmentId) {
  return request({
    url: '/tempAlarmSetting/config/tempConfig/' + equipmentId,
    method: 'get',
  })
}

//修改设备报警配置信息并开启报警
export function editConfig(data) {
  return request({
    url: '/alarm/data/startAlarmTempMonitor',
    method: 'post',
    data: data
  })
}


// 关闭websocket报警数据
export function offData(equipmentId) {
  return request({
    url: '/alarm/data/stopAlarmTempMonitor/' + equipmentId,
    method: 'post',
  })
}


// 删除报警中心
export function delData(id) {
  return request({
    url: '/alarm/data/' + id,
    method: 'delete'
  })
}

//查询当天报警的温度信息
export function listAlarmToday(data) {
  return request({
    url: '/alarm/data/listByTodayAlarm',
    method: 'post',
    data: data,
  })
}
