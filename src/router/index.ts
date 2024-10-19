import {createRouter, createWebHistory} from 'vue-router'
import {supabase} from "../resources/supabase.ts";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/auth'
        },
        {
            path: '/main',
            name: 'main-page',
            component: () => import('../views/MainView.vue'),
            meta: {
                layout: 'main-layout',
                auth: true
            }
        },
        {
            path: '/income-expenses',
            name: 'income-expenses-page',
            component: () => import('../views/common/IncomeExpensesView.vue'),
            meta: {
                layout: 'main-layout',
                auth: true
            }
        },
        {
            path: '/analytics',
            name: 'analytics-page',
            component: () => import('../views/common/AnalyticsView.vue'),
            meta: {
                layout: 'main-layout',
                auth: true
            }
        },
        {
            path: '/settings',
            name: 'settings-page',
            component: () => import('../views/common/SettingsView.vue'),
            meta: {
                layout: 'main-layout',
                auth: true
            }
        },
        {
            path: '/auth',
            name: 'login-page',
            component: () => import('../views/auth/LoginView.vue'),
            meta: {
                layout: 'empty-layout'
            }
        },
        {
            path: '/register',
            name: 'register-page',
            component: () => import('../views/auth/RegisterView.vue'),
            meta: {
                layout: 'empty-layout'
            }
        },
        {
            path: '/notfound',
            name: 'notfound-page',
            component: () => import('../views/NotFoundView.vue')
        },
    ],
    linkActiveClass: 'active',
    linkExactActiveClass: 'active'
})

router.beforeEach(async (to, _from, next) => {
    const {data: {session}} = await supabase.auth.getSession()

    if (session) {
        if (to.name === 'login-page') {
            next({name: 'main-page'})
        } else if (to.name === 'register-page') {
            next({name: 'main-page'})
        } else {
            next()
        }
    } else if (!session) {
        if (to.name === 'login-page') {
            next()
        } else if (to.name === 'register-page') {
            next()
        } else {
            next({name: 'login-page'})
        }
    }
})
export default router