import request from '@/utils/request'

// 用户登录
export function login(data) {
    return request({
        url: 'user/login',
        method: 'post',
        data
    })
}

// 获取当前登录信息
export function getInfo() {
    return request({
        url: 'user/info',
        method: 'get'
    })
}

// 获取当前登录信息
export function getUserInfo() {
    return request({
        url: 'user/userinfo',
        method: 'get'
    })
}

// 退出系统
export function logout() {
    return request({
        url: 'user/logout',
        method: 'post'
    })
}

// 获取用户列表
export function getUsers(query) {
    return request({
        url: 'user/users',
        method: 'get',
        params: query
    })
}

// 新增/编辑用户信息
export function saveUser(data) {
    return request({
        url: 'user/user',
        method: 'post',
        data
    })
}

// 删除用户
export function deleteUser(data) {
    return request({
        url: 'user/user',
        method: 'delete',
        data
    })
}

// 更改用户禁用状态
export function updateUserIsUse(data) {
    return request({
        url: 'user/userIsUse',
        method: 'put',
        data
    })
}

// 重置用户密码（不需使用原密码）
export function resetUserPassword(data) {
    return request({
        url: 'user/resetpassword',
        method: 'put',
        data
    })
}

// 更改用户密码（需使用原密码）
export function updateUserPassword(data) {
    return request({
        url: 'user/updatepassword',
        method: 'put',
        data
    })
}
