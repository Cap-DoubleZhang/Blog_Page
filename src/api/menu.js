import request from '@/utils/request'

// 获取菜单列表
export function getMenus(query) {
    return request({
        url: 'menu/menus',
        method: 'get',
        params: query
    })
}

// 获取所有的菜单列表
export function getAllMenus(query) {
    return request({
        url: 'menu/allMenus',
        method: 'get',
        params: query
    })
}

// 新增/编辑菜单信息
export function saveMenu(data) {
    return request({
        url: 'menu/menu',
        method: 'post',
        data
    })
}

// 删除菜单
export function deleteMenu(data) {
    return request({
        url: 'menu/menu',
        method: 'delete',
        data
    })
}

// 更改菜单禁用状态
export function updateMenuIsUse(data) {
    return request({
        url: 'menu/menuIsUse',
        method: 'put',
        data
    })
}
