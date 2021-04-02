import request from '@/utils/request'

export function login(data) {
    return request({
        url: 'user/login',
        method: 'post',
        data
    })
}

export function getInfo() {
    return request({
        url: 'user/info',
        method: 'get'
    })
}

export function logout() {
    return request({
        url: 'user/logout',
        method: 'post'
    })
}

export function getUsers(query) {
    return request({
        url: 'user/users',
        method: 'get',
        params: query
    })
}

export function createUser(data) {
    return request({
        url: 'user/user',
        method: 'post',
        data
    })
}

export function deleteUser(data) {
    return request({
        url: 'user/user',
        method: 'delete',
        data
    })
}