<!-- src/components/HomePage.vue -->
<template>
  <div id="homepage">
    <!-- Hero Section -->
    <section class="hero">
      <h1>Love at First Swipe</h1>
      <p>Discover, match, and chat with people near you through an intuitive, swipe-based experience.</p>
      <div class="buttons">
        <router-link to="/register" class="primary">Get Started</router-link>
        <router-link to="/login">Log In</router-link>
      </div>
    </section>

    <!-- Features -->
    <section class="features">
      <div class="feature">
        <h2>Swipe &amp; Match</h2>
        <p>Swipe right to like, left to pass—match only when there’s mutual interest.</p>
      </div>
      <div class="feature">
        <h2>Chat Instantly</h2>
        <p>Easy, real-time messaging once you’ve matched with someone.</p>
      </div>
      <div class="feature">
        <h2>Customize Profile</h2>
        <p>Add photos, write a bio, and set your preferences to find your perfect match.</p>
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
/* Container */
#homepage {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 20px;
}

/* Hero */
.hero {
  text-align: center;
  margin-bottom: 40px;
}
.hero h1 {
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 10px;
}
.hero p {
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 20px;
}
.buttons {
  display: inline-flex;
  gap: 10px;
}
.buttons a {
  display: inline-block;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid #333;
  color: #333;
  transition: background-color 0.3s, color 0.3s;
}
.buttons a.primary {
  background-color: #333;
  color: #fff;
}
.buttons a:hover {
  background-color: #e0e0e0;
}
.buttons a.primary:hover {
  background-color: #555;
}

/* Feature Cards */
.features {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
}
.feature {
  background: #fff;
  padding: 20px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  width: 260px;
  text-align: center;
}
.feature h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 10px;
}
.feature p {
  font-size: 1rem;
  color: #555;
}
</style>

