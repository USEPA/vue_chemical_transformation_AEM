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

//change the apiname variable to the location of the server for the backend
app.config.globalProperties.$apiname = 'http://v2626umcth819.rtord.epa.gov:9413/'
app.provide('apiname', 'http://v2626umcth819.rtord.epa.gov:9413/')

app.mount('#app')
