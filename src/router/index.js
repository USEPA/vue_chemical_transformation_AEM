import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import chemid from '../views/chemid.vue'
import reactid from '../views/reactionid.vue'
import chemdatabase from '../views/chemdatabase.vue'
import reactiondatabase from '../views/reactiondatabase.vue'
import newchemical from '../views/newchemical.vue'
import newreaction from '../views/newreaction.vue'
import newlibrary from '../views/newlibrary.vue'
import newdetail from '../views/newdetail.vue'
import errorlist from '../views/errorlist.vue'
import ErrorReport from '../views/errorreport.vue'
import newUser from '../views/newuser.vue'
import login from '../views/login.vue'
import SearchResults from '../views/searchresults.vue'
import contactpage from '../views/contactpage.vue'
import about from '../views/about.vue'
import reactmap from '../views/reactmap.vue'
import batchsearch from '../views/batchsearch.vue'

import testpage from '../views/testpage.vue'


const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/register',
      component: newUser
    },
    {
      path: '/login',
      component: login
    },
    {
      path: '/testpage',
      component: testpage
    },
    {
      path: '/contactpage',
      component: contactpage
    },
    {
      path: '/about',
      component: about
    },
    {
      path: '/errorlist',
      component: errorlist
    },
    {
      path: '/errorreport',
      component: ErrorReport
    },
    {
      path: '/chemical/:chemid',
      component: chemid
    },
    {
      path: '/reaction/:reactid',
      component: reactid
    },
    {
      path: '/chemical/database',
      component: chemdatabase
    },
    {
      path: '/reaction/database',
      component: reactiondatabase
    },
    {
      path: '/chemical/newchemical',
      component: newchemical
    },
    {
      path: '/reaction/newreaction',
      component: newreaction
    },
    {
      path: '/reaction/newlibrary',
      component: newlibrary
    },
    {
      path: '/reaction/newdetail/:reactid',
      component: newdetail
    },
    {
      path: '/reaction/batchsearch',
      component: batchsearch
    },
    {
      path: '/reaction/searchresults/:searchinput/:searchtype',
      component: SearchResults
    },
    {
      path: '/reaction/reactionmap/:searchinput/:searchtype',
      component: reactmap
    },
  ]
})

export default router
