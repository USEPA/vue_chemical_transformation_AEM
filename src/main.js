import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueCookieNext } from 'vue-cookie-next'

const app = createApp(App)

app.use(router)
app.use(VueCookieNext)
app.config.globalProperties.$apiname = 'http://v2626umcth819.rtord.epa.gov:9413/'
app.provide('apiname', 'http://v2626umcth819.rtord.epa.gov:9413/')

app.mount('#app')
