import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import SvgIcon from "vue3-icon";


// const app = createApp(App).use(createPinia()).component("svg-icon", SvgIcon).use(router).mount('#app')
const app = createApp(App)
app.config.globalProperties.$REST_ENDPOINT = 'https://panel.qinaya.co/api/'

app.use(createPinia())
app.component("svg-icon", SvgIcon)
app.use(router)
app.mount('#app')


// .component("svg-icon", SvgIcon).use(router).mount('#app')

