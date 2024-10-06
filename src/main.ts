import './styles/common.scss'
import 'element-plus/dist/index.css'
import './styles/element-plus-custom.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from  './router'
import store from './store'
import HighchartsVue from "highcharts-vue";
import ElementPlus from  'element-plus'
import {auth} from './resources/firebase.ts'
import { onAuthStateChanged } from 'firebase/auth'

onAuthStateChanged(auth, (user) => {
    if(user){
        router.push({name:'main-page'})
    } else {
        router.push({name:'login-page'})
    }
})

createApp(App)
    .use(HighchartsVue)
    .use(ElementPlus)
    .use(router)
    .use(store)
    .mount('#app')
