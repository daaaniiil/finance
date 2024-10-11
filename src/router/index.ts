import {createRouter, createWebHistory} from 'vue-router'
import {supabase} from "../resources/supabase.ts";

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
            path: '/analytics',
            name: 'analytics-page',
            component: () => import('../views/common/AnalyticsPage.vue'),
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

router.beforeEach( async (to, _from, next) => {
    const storedSession = sessionStorage.getItem('supabase.auth.token')
    const {data: {session}} = await supabase.auth.getSession()

    if(session || storedSession) {
        if(to.name === 'login-page'){
            next({name:'main-page'})
        } else {
            next()
        }
    } else if(!session || !storedSession) {
        if(to.name !== 'login-page'){
            next({name:'login-page'})
        } else {
            next()
        }
    }
})
export default router