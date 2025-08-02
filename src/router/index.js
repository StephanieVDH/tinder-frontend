import Vue from 'vue';
import Router from 'vue-router';

import HomePage from '@/components/HomePage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import LogIn from '@/components/LogIn.vue'; 
import AdminPage from '@/components/AdminPage.vue'; 
import SwipePage from '@/components/SwipePage.vue';

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
    {
      path: '/admin',
      name: 'admin',
      component: AdminPage,
    },
    {
      path: '/swipe',
      name: 'swipe',
      component: SwipePage,
    }

  ],
});
