<template>
  <div class="login-container">
    <header class="header">
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <img src="@/assets/logo.png" alt="Flare Logo" width="32" height="32" />
        </div>
        <span class="logo-text">Flare</span>
      </router-link>
    </header>
    <section class="login-main">
      <h1>Welcome Back</h1>
      <p class="subtitle">Log in to continue making connections.</p>
      
      <!-- Error message display -->
      <div v-if="errorMessage" class="error-message" :class="{ 'banned-message': isBanned }">
        {{ errorMessage }}
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <label>Email</label>
        <input type="email" v-model="email" required placeholder="Enter your email" />
        <label>Password</label>
        <input type="password" v-model="password" required placeholder="Enter your password" />
        <button type="submit" class="login-btn" :disabled="isLoading">
          {{ isLoading ? 'Logging in...' : 'Log In' }}
        </button>
      </form>
      <p class="signup-link">
        Don't have an account?
        <router-link to="/register">Sign Up</router-link>
      </p>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
      errorMessage: '',
      isBanned: false
    };
  },
  mounted() {
    // Redirect if already logged in
    if (this.isLoggedIn()) {
      const user = this.getCurrentUser();
      if (user.role === 'admin') {
        this.$router.push({ name: 'admin' });
      } else {
        this.$router.push({ name: 'swipe' });
      }
    }
  },
  methods: {
    async handleLogin() {
      this.isLoading = true;
      this.errorMessage = '';
      this.isBanned = false;
      
      try {
        const response = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          // Check if it's a banned user
          if (response.status === 403 && data.banned) {
            this.isBanned = true;
            this.errorMessage = data.error;
          } else {
            this.errorMessage = data.error || 'Login failed';
          }
          return;
        }

        // Store user data in localStorage for persistent login
        this.login(data.user);
        
        // Redirect based on role
        if (data.user.role === 'user') {
          this.$router.push({ name: 'swipe' });
        } else if (data.user.role === 'admin') {
          this.$router.push({ name: 'admin' });
        } else {
          this.$router.push({ name: 'home' }); // fallback
        }
        
      } catch (error) {
        console.error(error);
        this.errorMessage = 'An error occurred during login. Please try again.';
      } finally {
        this.isLoading = false;
      }
    },

    // Authentication helper methods
    login(userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('isLoggedIn', 'true');
    },

    isLoggedIn() {
      return localStorage.getItem('isLoggedIn') === 'true';
    },

    getCurrentUser() {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
  }
};
</script>

<style scoped>
.login-container {
  font-family: 'Arial', sans-serif;
  color: #2d2d2d;
  background-color: #fef4e9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #542254;
  padding: 1rem 2rem;
  position: relative;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 10rem;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

.logo-icon img {
  display: block;
  border-radius: 4px;
}

.logo-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.75rem;
  color: #FFFFFF;
}

.login-main {
  margin-top: 4rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.login-main h1 {
  font-size: 2.5rem;
  color: #dd1b45;
  margin-bottom: 0.5rem;
}

.subtitle {
  margin-bottom: 2rem;
  color: #542254;
  text-align: center;
}

.error-message {
  background-color: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid #fcc;
  margin-bottom: 1rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
}

.banned-message {
  background-color: #ffe6e6;
  color: #d32f2f;
  border-color: #ffcdd2;
  font-weight: 600;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
}

.login-form label {
  margin-top: 1rem;
  margin-bottom: 0.25rem;
  font-weight: bold;
  color: #542254;
}

.login-form input {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

.login-btn {
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: linear-gradient(to right, #dd1b45, #fe741c);
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.signup-link {
  margin-top: 1rem;
  font-size: 0.9rem;
}

.signup-link a {
  color: #f54438;
  text-decoration: none;
  font-weight: bold;
}
</style>