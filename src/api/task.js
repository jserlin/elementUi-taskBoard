import request from '@/utils/request'

/**
 * 任务列表
 * @param {*} params
 */
export function getWorkItem(params) {
  return request({
    url: '/queryWorkItem',
    method: 'get',
    params
  })
}

/**
 * 任务详情
 * @param {*} params
 */
export function getWorkItemById(params) {
  return request({
    url: '/queryWorkItemById',
    method: 'get',
    params
  })
}

/**
 * 添加任务
 * @param {*} params
 */
export function addWorkItem(params) {
  return request({
    url: '/addWorkItem',
    method: 'get',
    params
  })
}

/**
 * 删除任务
 * @param {*} params
 */
export function delWorkItem(params) {
  return request({
    url: '/deleteWorkItem',
    method: 'get',
    params
  })
}

/**
 * 更新任务
 * @param {*} params
 */
export function updateWorkItem(data) {
  return request({
    url: '/updateWorkItem',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
      // 'Content-Type': 'application/x-www-form-urlencoded'
      // 'Content-Type': 'application/json'
    }
  })
}

/**
 * 保存任务
 * @param {*} params
 */
export function saveTask(data) {
  return request({
    url: '/table/list',
    method: 'post',
    data
  })
}

/**
 * 更新评论
 * @param {*} params
 */
export function updateComment(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

