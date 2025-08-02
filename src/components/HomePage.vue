<template>
  <div id="homepage">
    <!-- Header Navigation -->
    <header class="header">
      <div class="nav-container">
        <div class="logo">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28Z" fill="url(#heartGradient)"/>
              <path d="M12 14C12 12.8954 12.8954 12 14 12C15.1046 12 16 12.8954 16 14V16H18C19.1046 16 20 16.8954 20 18C20 19.1046 19.1046 20 18 20H14C12.8954 20 12 19.1046 12 18V14Z" fill="white"/>
              <defs>
                <linearGradient id="heartGradient" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop stop-color="#D7263D"/>
                  <stop offset="1" stop-color="#FFB400"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">Flare</span>
        </div>
        <div class="nav-actions">
          <router-link to="/login" class="nav-login">Log In</router-link>
          <button class="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
          </button>
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
          <div class="feature-card">
            <div class="feature-icon heart-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M34.6 8.4C31.2 8.4 28.2 10.2 26.4 12.6L24 15.6L21.6 12.6C19.8 10.2 16.8 8.4 13.4 8.4C8.4 8.4 4.8 12.6 4.8 17.4C4.8 23.4 11.4 29.4 24 39.6C36.6 29.4 43.2 23.4 43.2 17.4C43.2 12.6 39.6 8.4 34.6 8.4Z" fill="#D7263D"/>
              </svg>
            </div>
            <h3>Swipe & Match</h3>
            <p>Swipe right to like, left to pass—mutual interest unlocks conversation.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon chat-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <path d="M40 8H8C5.8 8 4 9.8 4 12V28C4 30.2 5.8 32 8 32H12V40L20 32H40C42.2 32 44 30.2 44 28V12C44 9.8 42.2 8 40 8Z" fill="#FFB400"/>
              </svg>
            </div>
            <h3>Chat Instantly</h3>
            <p>Real-time, lightweight messaging once you've made a match.</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon profile-icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="16" r="8" fill="#D7263D"/>
                <path d="M24 28C16 28 8 32 8 36V40H40V36C40 32 32 28 24 28Z" fill="#D7263D"/>
              </svg>
            </div>
            <h3>Customize Profile</h3>
            <p>Add photos, preferences, and polish your presence to stand out.</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'HomePage'
}
</script>

<style scoped>
/* Global Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

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

.logo-text {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 1.75rem;
  color: #FFFFFF;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
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

.menu-toggle {
  display: none;
  flex-direction: column;
  background: none;
  border: none;
  cursor: pointer;
  gap: 4px;
}

.menu-toggle span {
  width: 24px;
  height: 3px;
  background: #E6E6F0;
  border-radius: 2px;
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

.heart-icon {
  background: rgba(215, 38, 61, 0.1);
}

.chat-icon {
  background: rgba(255, 180, 0, 0.1);
}

.profile-icon {
  background: rgba(215, 38, 61, 0.1);
}

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

/* Responsive Design */
@media (max-width: 1024px) {
  .features-grid {
    max-width: 600px;
  }
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }
  
  .nav-login {
    display: none;
  }
  
  .hero {
    padding: 3rem 1.5rem 4rem;
  }
  
  .hero-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  .btn {
    width: 100%;
    max-width: 280px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    max-width: 400px;
  }
  
  .section-title {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .hero {
    padding: 2.5rem 1rem 3rem;
  }
  
  .how-it-works {
    padding: 3rem 1rem 2rem;
  }
  
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .hero p {
    font-size: 1.1rem;
  }
}
</style>

