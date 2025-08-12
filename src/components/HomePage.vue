<template>
  <div id="homepage">
    <!-- Header Navigation -->
    <header class="header">
      <div class="nav-container">
        <div class="logo">
          <div class="logo-icon">
            <img src="@/assets/logo.png" alt="Flare Logo" width="32" height="32" />
          </div>
          <span class="logo-text">Flare</span>
        </div>
        <div class="nav-actions">
          <router-link to="/login" class="nav-login">Log In</router-link>
        </div>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1>Love at First Swipe</h1>
        <p>Bold connections, warm conversations. Meet people who spark your curiosity and keep the vibe alive.</p>
        <div class="hero-buttons">
          <router-link to="/register" class="btn">Get Started</router-link>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title">How it works</h2>
        
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card">
            <div :class="['feature-icon', feature.iconClass]" v-html="feature.icon"></div>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data: () => ({
    features: [
      {
        title: 'Swipe & Match',
        description: 'Swipe right to like, left to pass—mutual interest unlocks conversation.',
        iconClass: 'heart-icon',
        icon: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M34.6 8.4C31.2 8.4 28.2 10.2 26.4 12.6L24 15.6L21.6 12.6C19.8 10.2 16.8 8.4 13.4 8.4C8.4 8.4 4.8 12.6 4.8 17.4C4.8 23.4 11.4 29.4 24 39.6C36.6 29.4 43.2 23.4 43.2 17.4C43.2 12.6 39.6 8.4 34.6 8.4Z" fill="#D7263D"/></svg>'
      },
      {
        title: 'Chat Instantly',
        description: 'Real-time, lightweight messaging once you\'ve made a match.',
        iconClass: 'chat-icon',
        icon: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><path d="M40 8H8C5.8 8 4 9.8 4 12V28C4 30.2 5.8 32 8 32H12V40L20 32H40C42.2 32 44 30.2 44 28V12C44 9.8 42.2 8 40 8Z" fill="#FFB400"/></svg>'
      },
      {
        title: 'Customize Profile',
        description: 'Add photos, preferences, and polish your presence to stand out.',
        iconClass: 'profile-icon',
        icon: '<svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="16" r="8" fill="#D7263D"/><path d="M24 28C16 28 8 32 8 36V40H40V36C40 32 32 28 24 28Z" fill="#D7263D"/></svg>'
      }
    ]
  })
}
</script>

<style scoped>
/* Global Styles */
* { box-sizing: border-box; margin: 0; padding: 0; }

#homepage {
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #fef4e9;
}

/* Header */
.header {
  background: #542254;
  padding: 1rem 0;
  position: relative;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
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

.nav-login {
  padding: 0.6rem 1.5rem;
  border: 2px solid #FF3D47;
  border-radius: 8px;
  color: white;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.nav-login:hover {
  background: #dd1b45;
  color: white;
}



/* Hero Section */
.hero {
  background: linear-gradient(135deg, #dd1b45 0%, #f54438 50%, #fe741c 100%);
  padding: 4rem 2rem 5rem;
  text-align: center;
  position: relative;
}

.hero-content {
  max-width: 900px;
  margin: 0 auto;
}

.hero h1 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: clamp(3rem, 6vw, 4.5rem);
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.hero p {
  font-size: 1.25rem;
  color: white;
  margin-bottom: 3rem;
  line-height: 1.5;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 400;
}

.hero-buttons {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  background: rgba(255, 255, 255, 0.25);
  color: white;
  padding: 1rem 2.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1rem;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn:hover {
  background: rgba(255, 255, 255, 0.35);
  transform: translateY(-1px);
}

/* How It Works Section */
.how-it-works {
  background: #fef4e9;
  padding: 4rem 2rem 3rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 2.25rem;
  color: #542254;
  text-align: center;
  margin-bottom: 3.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  max-width: 900px;
  margin-left: auto;
  margin-right: auto;
}

.feature-card {
  background: white;
  padding: 2rem 1.5rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.feature-icon {
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-left: auto;
  margin-right: auto;
}

.heart-icon { background: rgba(215, 38, 61, 0.1); }
.chat-icon { background: rgba(255, 180, 0, 0.1); }
.profile-icon { background: rgba(215, 38, 61, 0.1); }

.feature-card h3 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.4rem;
  color: #1F1F2E;
  margin-bottom: 1rem;
}

.feature-card p {
  color: #666;
  line-height: 1.5;
  font-size: 0.95rem;
}
</style>