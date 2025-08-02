import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '@/components/HomePage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import LogIn from '@/components/LogIn.vue'; 

Vue.use(Router);

export default new Router({
  mode: 'history',    // optional, for clean URLs
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
    },
    {
      path: '/login',               
      name: 'login',
      component: LogIn,
    },
  ],
});
