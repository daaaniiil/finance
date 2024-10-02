import { createRouter,  createWebHistory } from  'vue-router'

const router =  createRouter({
    history: createWebHistory(),
    routes: [
        {
            name: 'main',
            path: '/',
            component: () => import('../views/MainPage.vue'),
            meta: {
                layout: 'main-layout',
                auth: true
            }
        },
        {
            name: 'auth',
            path: '/auth',
            component: () => import('../views/auth/AuthPage.vue'),
            meta: {
                layout: 'empty-layout'
            }
        },
        {
            name: 'introduction',
            path: '/introduction',
            component: () => import('../views/common/IntroductionPage.vue'),
            meta: {
                layout: 'empty-layout'
            }
        },
    ],
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
})

export default router