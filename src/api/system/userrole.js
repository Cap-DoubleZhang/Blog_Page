import request from '@/utils/request'

export function getUserRoles(data) {
    return request({
      url: `userRoles/userRoles`,
      method: 'get',
      data
    })
}

export function saveUserRoles(data) {
  return request({
    url: `userRoles/userRole`,
    method: 'post',
    data
  })
}
