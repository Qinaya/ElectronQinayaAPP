import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import SvgIcon from "vue3-icon";

createApp(App).use(createPinia()).component("svg-icon", SvgIcon).use(router).mount('#app')
