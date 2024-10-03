import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/auth'
        },
        {
            path: '/main',
            name: 'main',
            component: () => import('../views/MainPage.vue'),
            meta: {
                layout: 'main-layout',
                auth: true
            }
        },
        {
            path: '/auth',
            name: 'auth',
            component: () => import('../views/auth/AuthPage.vue'),
            meta: {
                layout: 'empty-layout'
            }
        },
        {
            path: '/transaction',
            name: 'transaction',
            component: () => import('../views/common/TransactionPage.vue'),
            meta: {
                layout: 'main-layout',
                auth: true
            }
        },
        {
            path: '/auth',
            name: 'auth',
            component: () => import('../views/auth/AuthPage.vue'),
            meta: {
                layout: 'empty-layout'
            }
        },
        {
            path: '/notfound',
            name: 'notfound',
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