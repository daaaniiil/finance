import './styles/common.scss'
import 'element-plus/dist/index.css'
import './styles/element-plus-custom.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from  './router'
import {createPinia } from 'pinia'
import HighchartsVue from "highcharts-vue";
import ElementPlus from  'element-plus'

const pinia = createPinia()

createApp(App)
    .use(HighchartsVue)
    .use(ElementPlus)
    .use(router)
    .use(pinia)
    .mount('#app')
