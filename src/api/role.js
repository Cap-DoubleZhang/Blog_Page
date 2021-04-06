import request from '@/utils/request'

export function getRoles(query) {
  return request({
    url: 'role/roles',
    method: 'get',
    params: query
  })
}

export function saveRole(data) {
  return request({
    url: 'role/role',
    method: 'post',
    data
  })
}

export function updateRoleIsUse(data) {
  return request({
    url: 'role/roleIsUse',
    method: 'put',
    data
  })
}

export function updateRoleAdminFlag(data) {
  return request({
    url: 'role/roleAdminFlag',
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: `role/role`,
    method: 'delete',
    data
  })
}
