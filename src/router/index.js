import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },
    {
        path: '/404',
        component: () =>
            import ('@/views/error-page/404'),
        hidden: true
    },
    {
        path: '/401',
        component: () =>
            import ('@/views/error-page/401'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [{
            path: 'dashboard',
            component: () =>
                import ('@/views/dashboard/index'),
            name: 'Dashboard',
            meta: { title: 'dashboard', icon: 'dashboard', affix: true }
        }]
    },
    {
        path: '/system',
        component: Layout,
        redirect: '/system/users',
        alwaysShow: true,
        meta: {
            title: '系统管理',
            icon: 'el-icon-s-tools'
        },
        children: [{
            path: 'users',
            component: () =>
                import ('@/views/sys-user/index'),
            name: '用户管理',
            meta: { title: '用户管理', icon: 'el-icon-user-solid' }
        }, {
            path: 'roles',
            component: () =>
                import ('@/views/sys-role/index'),
            name: '角色管理',
            meta: { title: '角色管理', icon: 'el-icon-location-outline' }
        }, {
            path: 'userinfo',
            hidden: true,
            component: () =>
                import ('@/views/sys-user/userinfo'),
            name: '用户信息',
            meta: { title: '用户信息', icon: 'el-icon-location-outline' }
        }, {
            path: 'menus',
            component: () =>
                import ('@/views/sys-menu/index'),
            name: '菜单管理',
            meta: { title: '菜单管理', icon: 'el-icon-menu' }
        }]
    }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [

    // 404 page must be placed at the end !!!
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router
