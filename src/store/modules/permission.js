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

// // 替换route对象中的component
// function replaceComponent(comp) {
//   if (comp.component && typeof (comp.component) === 'string') {
//     comp.component = componentMap[comp.component]
//   }
//   if (comp.children && comp.children.length > 0) {
//     for (let i = 0; i < comp.children.length; i++) {
//       comp.children[i] = replaceComponent(comp.children[i])
//     }
//   }
//   return comp
// }

const actions = {
  generateRoutes: async function({ commit }) {
    // return new Promise(resolve => {
    //   // const accessedRoutes
    //   // if (roles.includes('admin')) {
    //   //   accessedRoutes = asyncRoutes || []
    //   // } else {
    //   //   accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
    //   // }
    //   const accessedRoutes = [
    //     {
    //       path: '/blog',
    //       component: componentMap['layout'],
    //       redirect: 'noRedirect',
    //       alwaysShow: true,
    //       meta: {
    //           title: '博客管理',
    //           icon: 'el-icon-reading'
    //       },
    //       children: [
    //           {
    //               path: 'createBlog',
    //               component: () => import('@/views/blog/createBlog'),
    //               name: '创建',
    //               meta: { title: '博客详情', noCache: true },
    //               hidden: true
    //           },
    //           {
    //               path: 'editBlog/:id(\\d+)',
    //               component: () => import('@/views/blog/editBlog'),
    //               name: '编辑',
    //               meta: { title: '博客详情', noCache: true },
    //               hidden: true
    //           },
    //           {
    //           path: 'blog',
    //           component: () =>
    //               import ('@/views/blog/blog'),
    //           name: '博客管理',
    //           meta: { title: '博客管理', icon: 'el-icon-document' }
    //       }]
    //   },
    //   {
    //       path: '/system',
    //       component: componentMap['layout'],
    //       redirect: 'noRedirect',
    //       alwaysShow: true,
    //       meta: {
    //           title: '系统管理',
    //           icon: 'el-icon-s-tools'
    //       },
    //       children: [{
    //           path: 'users',
    //           component: () =>
    //               import ('@/views/sys/user'),
    //           name: '用户管理',
    //           meta: { title: '用户管理', icon: 'el-icon-user-solid' }
    //       }, {
    //           path: 'roles',
    //           component: () =>
    //               import ('@/views/sys/role'),
    //           name: '角色管理',
    //           meta: { title: '角色管理', icon: 'el-icon-location-outline' }
    //       }, {
    //           path: 'userinfo',
    //           hidden: true,
    //           component: () =>
    //               import ('@/views/sys/userinfo'),
    //           name: '用户信息',
    //           meta: { title: '用户信息', icon: 'el-icon-location-outline' }
    //       }, {
    //           path: 'menus',
    //           component: () =>
    //               import ('@/views/sys/menu'),
    //           name: '菜单管理',
    //           meta: { title: '菜单管理', icon: 'el-icon-menu' }
    //       }, {
    //           path: 'dictionary',
    //           component: () =>
    //               import ('@/views/sys/dictionary'),
    //           name: '字典管理',
    //           meta: { title: '字典管理' }
    //       }, {
    //           path: 'waterfallImages',
    //           component: () =>
    //               import ('@/views/sys/waterfallImages'),
    //           name: '瀑布流图片',
    //           meta: { title: '瀑布流图片' },
    //           hidden: true
    //       }, {
    //           path: 'updloadWaterfallImage',
    //           component: () =>
    //               import ('@/views/sys/uploadWaterfallImage'),
    //           name: '上传图片',
    //           meta: { title: '上传图片' }
    //       }]
    //   }]
    //   const { data } = getCurrentUserRoleMenus()
    //   console.log(data)
    //   commit('SET_ROUTES', accessedRoutes)
    //   resolve(accessedRoutes)
    // })
    // // 1、根据当前登录用户获取所拥有的所有菜单权限
    // let res = await getCurrentUserRoleMenus()
    // res = res.data
    // // 2、整理（替换组件名称，移除children为null的数据）
    // res = res.filter(curr => {
    //   if (curr.children == null || curr.children.length === 0) {
    //     delete curr.children
    //   }
    //   return replaceComponent(curr)
    // })
    const accessedRoutes = [
      {
        path: '/blog',
        component: componentMap['layout'],
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: {
            title: '博客管理',
            icon: 'el-icon-reading'
        },
        children: [
            {
                path: 'createBlog',
                component: () => import('@/views/blog/createBlog'),
                name: '创建',
                meta: { title: '博客详情', noCache: true },
                hidden: true
            },
            {
                path: 'editBlog/:id(\\d+)',
                component: () => import('@/views/blog/editBlog'),
                name: '编辑',
                meta: { title: '博客详情', noCache: true },
                hidden: true
            },
            {
            path: 'blog',
            component: () =>
                import ('@/views/blog/blog'),
            name: '博客管理',
            meta: { title: '博客管理', icon: 'el-icon-document' }
        }]
    },
    {
        path: '/system',
        component: componentMap['layout'],
        redirect: 'noRedirect',
        alwaysShow: true,
        meta: {
            title: '系统管理',
            icon: 'el-icon-s-tools'
        },
        children: [{
            path: 'users',
            component: () =>
                import ('@/views/sys/user'),
            name: '用户管理',
            meta: { title: '用户管理', icon: 'el-icon-user-solid' }
        }, {
            path: 'roles',
            component: () =>
                import ('@/views/sys/role'),
            name: '角色管理',
            meta: { title: '角色管理', icon: 'el-icon-location-outline' }
        }, {
            path: 'userinfo',
            hidden: true,
            component: () =>
                import ('@/views/sys/userinfo'),
            name: '用户信息',
            meta: { title: '用户信息', icon: 'el-icon-location-outline' }
        }, {
            path: 'menus',
            component: () =>
                import ('@/views/sys/menu'),
            name: '菜单管理',
            meta: { title: '菜单管理', icon: 'el-icon-menu' }
        }, {
            path: 'dictionary',
            component: () =>
                import ('@/views/sys/dictionary'),
            name: '字典管理',
            meta: { title: '字典管理' }
        }, {
            path: 'waterfallImages',
            component: () =>
                import ('@/views/sys/waterfallImages'),
            name: '瀑布流图片',
            meta: { title: '瀑布流图片' },
            hidden: true
        }, {
            path: 'updloadWaterfallImage',
            component: () =>
                import ('@/views/sys/uploadWaterfallImage'),
            name: '上传图片',
            meta: { title: '上传图片' }
        }]
    }]
    const { data } = await getCurrentUserRoleMenus()
    console.log(data)
    commit('SET_ROUTES', accessedRoutes)
    return accessedRoutes
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
