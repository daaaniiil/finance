import {createRouter, createWebHistory} from 'vue-router'

// сделать нормальные роуты
const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/auth'
        },
        {
            path: '/main',
            name: 'main-page',
            component: () => import('../views/MainPage.vue'),
            meta: {
                layout: 'main-layout',
                auth: true
            }
        },
        {
            path: '/auth',
            name: 'login-page',
            component: () => import('../views/auth/LoginPage.vue'),
            meta: {
                layout: 'empty-layout'
            }
        },
        {
            path: '/transaction',
            name: 'transaction-page',
            component: () => import('../views/common/TransactionPage.vue'),
            meta: {
                layout: 'main-layout',
                auth: true
            }
        },
        {
            path: '/auth',
            name: 'auth-page',
            component: () => import('../views/auth/LoginPage.vue'),
            meta: {
                layout: 'empty-layout'
            }
        },
        {
            path: '/notfound',
            name: 'notfound-page',
            component: () => import('../views/NotFoundPage.vue')
        },
    ],
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
})

// router.beforeEach(async (to, from, next) => {
//     if(!to.name) {
//         next({ name: 'notfound' })
//         return
//     }
//     next()
// })

export default router