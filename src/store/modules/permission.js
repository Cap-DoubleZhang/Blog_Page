// import { asyncRoutes, constantRoutes, componentMap } from '@/router'
import { constantRoutes, componentMap } from '@/router'
import { getCurrentUserRoleMenus } from '@/api/system/roleMenu'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []

  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

// 替换route对象中的component
function replaceComponent(comp) {
  if (comp.component && typeof (comp.component) === 'string') {
    comp.component = componentMap[comp.component]
  }
  if (comp.children && comp.children.length > 0) {
    for (let i = 0; i < comp.children.length; i++) {
      comp.children[i] = replaceComponent(comp.children[i])
    }
  } else {
    delete comp.children
  }
  return comp
}

const actions = {
  generateRoutes: async function({ commit }) {
    // 1、根据当前登录用户获取所拥有的所有菜单权限
    const { data } = await getCurrentUserRoleMenus()
    // 2、整理（替换组件名称，移除children为null的数据）
    const myRoutes = data.filter(curr => {
      if (curr.children == null || curr.children.length === 0) {
        delete curr.children
      }
      return replaceComponent(curr)
    })
    console.log(myRoutes)
    // accessedRoutes
    commit('SET_ROUTES', myRoutes)
    return myRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
