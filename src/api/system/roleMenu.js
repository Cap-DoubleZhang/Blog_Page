import request from '@/utils/request'

export function getRoleMenus(query) {
    return request({
      url: `rolemenus/roleMenus`,
      method: 'get',
      params: query
    })
}

export function saveRoleMenus(data) {
  return request({
    url: `rolemenus/rolemenu`,
    method: 'post',
    data
  })
}
