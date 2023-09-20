import request from '@/utils/request'

// 查询设备数据列表
export function listData(query) {
  return request({
    url: '/equipment/data/list',
    method: 'get',
    params: query
  })
}

// 查询设备数据详细
export function getData(id) {
  return request({
    url: '/equipment/data/' + id,
    method: 'get'
  })
}

// 新增设备数据
export function addData(data) {
  return request({
    url: '/equipment/data',
    method: 'post',
    data: data
  })
}

//搜索新设备
export function searchData() {
  return request({
    url: '/equipment/data/search',
    method: 'get',
  })
}

//新增搜索后出现的设备到显示中去
//   export function addSearEquiData(data) {
//   return request({
//     url: '/equipment/data',
//     method: 'post',
//     data: data
//   })
//   }

 // 登录新设备
export function loginEquipment(id) {
  return request({
    url: '/equipment/data/loginEquipment/' + id,
    method: 'put'
  })
}
//根据设备信息登录
export function authEquiment(data) {
  return request({
    url: '/equipment/data/loginEquipmentSelf',
    method: 'put',
    data:data,
  })
}


// 修改设备数据
export function updateData(data) {
  return request({
    url: '/equipment/data',
    method: 'put',
    data: data
  })
}

// 删除设备数据
export function delData(id) {
  return request({
    url: '/equipment/data/' + id,
    method: 'delete'
  })
}

//获取系统osd参数详细参数
export function osdParamDataByData(equipmentId) {
  return request({
    url: '/systemSetting/param/OsdConfig/' + equipmentId,
    method: 'get'
  })
}

//获取系统osd参数详细参数
export function osdParamData(equipmentId) {
  return request({
    url: '/systemSetting/param/getInfOsd/' + equipmentId,
    method: 'get'
  })
}

//获取the_temp_param信息
export function configData(equipmentId) {
  return request({
      url: '/temp/param/tempParamConfig/' + equipmentId,
      method: 'get'
  })
}

//从设备当中获取环境变量信息
export function configDataByEquip(equipmentId) {
  return request({
    url: '/temp/param/envirParam/' + equipmentId,
    method: 'get'
  })
}

//配置系统osd参数详细参数
export function osdData(data) {
  return request({
    url: '/systemSetting/param/setOsdDisplay',
    method: 'put',
    data: data
  })
}

//配置系统osd参数开关
export function osdDataSwitch(data) {
  return request({
    url: '/systemSetting/param/setInfOsd',
    method: 'put',
    data: data
  })
}

//修改the_temp_param
export function paramData(data) {
  return request({
    url: '/temp/param/setEnvirParam',
    method: 'put',
    data: data
  })
}

//获取当前在线的设备
export function EquipData() {
  return request({
    url: '/equipment/data/list/status',
    method: 'get',
  })
}

//获取当前设备温度
export function EquipTemp(data) {
  return request({
    url: '/alarm/data/getTemp',
    // headers: { 'Cache-Control': 'no-cache' },
    method: 'post',
    data: data
  })
}


//同步OSD时间
export function sysData(equipmentId) {
  return request({
    url: '/systemSetting/param/syncTime/' + equipmentId,
    method: 'put',
  })
}
