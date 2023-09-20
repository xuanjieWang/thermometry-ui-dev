import request from '@/utils/request'

// 查询测温数据列表
export function listData(query) {
  return request({
    url: '/temp/data/list',
    method: 'get',
    params: query
  })
}

// 查询测温数据详细
export function getData(id) {
  return request({
    url: '/temp/data/' + id,
    method: 'get'
  })
}

// 新增测温数据
export function addData(data) {
  return request({
    url: '/temp/data',
    method: 'post',
    data: data
  })
}

// 修改测温数据
export function updateData(data) {
  return request({
    url: '/temp/data',
    method: 'put',
    data: data
  })
}

//搜索测温数据
export function tempData(data) {
  return request({
    url: '/alarm/data/listByCondition',
    method: 'post',
    data: data,
    params: data
  })
}

// 删除测温数据
export function delData(id) {
  return request({
    url: '/temp/data/' + id,
    method: 'delete'
  })


}
