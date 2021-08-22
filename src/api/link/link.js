import request from '@/utils/request'

// 获取友链列表
export function getLinks(query) {
    return request({
        url: 'link/links',
        method: 'get',
        params: query
    })
}

// 新增/编辑友链信息
export function saveLink(data) {
    return request({
        url: 'link/link',
        method: 'post',
        data
    })
}

// 删除友链
export function deleteLink(data) {
    return request({
        url: 'link/link',
        method: 'delete',
        data
    })
}
