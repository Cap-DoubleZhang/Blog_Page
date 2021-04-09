import request from '@/utils/request'

// 获取字典列表
export function getDictionaries(query) {
    return request({
        url: 'dictionary/dictionaries',
        method: 'get',
        params: query
    })
}

// 新增/编辑字典信息
export function saveDictionary(data) {
    return request({
        url: 'dictionary/dictionary',
        method: 'post',
        data
    })
}

// 删除字典
export function deleteDictionary(data) {
    return request({
        url: 'dictionary/dictionary',
        method: 'delete',
        data
    })
}
