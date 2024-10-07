import { onAuthStateChanged } from "firebase/auth";
import {auth} from '../resources/firebase.ts'
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

router.beforeEach((to, _from, next) => {
    onAuthStateChanged(auth, (user) => {
        if(user) {
            if(to.name === 'login-page') {
                next({name:'main-page'})
            } else {
                next()
            }
        } else {
            if(to.name !== 'login-page'){
                next({name:'login-page'})
            } else {
                next()
            }
        }
    })
})

export default router