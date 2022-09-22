import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VueCookieNext } from 'vue-cookie-next'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'
import BootstrapVue3 from 'bootstrap-vue-3'

const app = createApp(App)

app.use(router)
app.use(VueCookieNext)
app.use(BootstrapVue3)
app.config.globalProperties.$apiname = 'http://127.0.0.1:5000/'
app.provide('apiname', 'http://127.0.0.1:5000/')

app.mount('#app')
