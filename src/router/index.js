import Vue from 'vue';
import Router from 'vue-router';
import { AuthService } from '@/auth.js';

import HomePage from '@/components/HomePage.vue';
import RegisterPage from '@/components/RegisterPage.vue';
import LogIn from '@/components/LogIn.vue';
import AdminPage from '@/components/AdminPage.vue';
import SwipePage from '@/components/SwipePage.vue';
import UserProfile from '@/components/UserProfile.vue';
import Matches from '@/components/Matches.vue'; 
import Conversations from '@/components/Conversations.vue'; 
import LocationSetup from '@/components/LocationSetup.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history', // optional, for clean URLs
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
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/swipe',
      name: 'swipe',
      component: SwipePage,
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: UserProfile,
      meta: { requiresAuth: true }
    },
    {
      path: '/matches',
      name: 'matches',
      component: Matches,
      meta: { requiresAuth: true }
    },
    {
      path: '/conversations',
      name: 'conversations',
      component: Conversations,
      meta: { requiresAuth: true }
    },
    {
      path: '/location-setup',
      name: 'location-setup',
      component: LocationSetup
    }
  ],
});

// Navigation guard for authentication
router.beforeEach((to, from, next) => {
  const isLoggedIn = AuthService.isLoggedIn();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);

  if (requiresAuth && !isLoggedIn) {
    // Redirect to login if not authenticated
    next({ name: 'login' });
  } else if (requiresAdmin && !AuthService.isAdmin()) {
    // Redirect to profile if not admin
    next({ name: 'profile' });
  } else if (to.name === 'login' && isLoggedIn) {
    // Redirect logged-in users away from login page
    const user = AuthService.getCurrentUser();
    if (user && user.role === 'admin') {
      next({ name: 'admin' });
    } else {
      next({ name: 'swipe' });
    }
  } else {
    next();
  }
});

export default router;