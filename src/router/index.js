import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '@/components/HomePage.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'Home', component: HomePage },
  // later add: { path: '/login', name: 'Login', component: LoginPage }, etc.
]

export default new VueRouter({
  mode: 'history',
  routes
})
