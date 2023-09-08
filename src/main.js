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

//sets up a global variable for the rest of the app to use so that the location of the backend only needs to be specified once
//change the apiname variable to the location of the server for the backend for any new deployed location
app.config.globalProperties.$apiname = 'https://ccte-cced-api-chet.epa.gov/'
app.provide('apiname', 'hhttps://ccte-cced-api-chet.epa.gov/')

app.mount('#app')
