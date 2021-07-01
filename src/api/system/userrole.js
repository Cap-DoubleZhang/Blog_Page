import request from '@/utils/request'

export function getUserRoles(query) {
    return request({
      url: `userRoles/userRoles`,
      method: 'get',
      params: query
    })
}

export function saveUserRoles(data) {
  return request({
    url: `userRoles/userRole`,
    method: 'post',
    data
  })
}
