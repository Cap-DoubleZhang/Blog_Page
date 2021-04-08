const TokenKey = 'Admin-Token'

export function getToken() {
    return localStorage.getItem(TokenKey)
}

export function setToken(token) {
    return localStorage.setItem(TokenKey, 'Bearer ' + token)
}

export function removeToken() {
    return localStorage.removeItem(TokenKey)
}
