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

// 获取字典明细列表
export function getDictionariesDetail(query) {
    return request({
        url: 'dictionary/dictionariesDetail',
        method: 'get',
        params: query
    })
}

// 新增/编辑字典明细信息
export function saveDictionaryDetail(data) {
    return request({
        url: 'dictionary/dictionaryDetail',
        method: 'post',
        data
    })
}

// 删除字典明细
export function deleteDictionaryDetail(data) {
    return request({
        url: 'dictionary/dictionaryDetail',
        method: 'delete',
        data
    })
}
