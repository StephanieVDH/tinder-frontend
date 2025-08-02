<template>
  <div class="login-container">
    <header class="login-header">
      <div class="logo">🔥 Flare</div>
    </header>

    <section class="login-main">
      <h1>Welcome Back</h1>
      <p class="subtitle">Log in to continue making connections.</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <label>Email</label>
        <input type="email" v-model="email" required placeholder="Enter your email" />

        <label>Password</label>
        <input type="password" v-model="password" required placeholder="Enter your password" />

        <button type="submit" class="login-btn">Log In</button>
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
      password: ''
    };
  },
  methods: {
    handleLogin() {
      // Simple login stub — replace with real authentication call
      alert(`Email: ${this.email}\nPassword: ${this.password}`);
      // POST to backend login endpoint, e.g., fetch('/api/login', { method: 'POST', body: JSON.stringify(...) })
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

.login-header {
  background-color: #542254;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo {
  display: inline-block;
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

.login-btn:hover {
  opacity: 0.9;
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