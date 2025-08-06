<template>
  <div class="page-container">
    <!-- Header Navigation (matching homepage) -->
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
          <button @click="goToProfile" class="nav-btn">Profile</button>
          <button @click="logout" class="nav-btn logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <!-- Instruction Text -->
    <p class="instruction-text">Swipe to match</p>

    <!-- Swipe Card -->
    <div class="card" v-if="currentUser">
      <img :src="currentUser.picture" alt="Profile Picture" class="profile-pic" />
      <h2>{{ currentUser.name }}, {{ currentUser.age }}</h2>
      <p>{{ currentUser.bio }}</p>
    </div>

    <!-- Swipe Buttons -->
    <div class="buttons" v-if="currentUser">
      <button @click="dislike" class="dislike-btn">Dislike</button>
      <button @click="like" class="like-btn">Like</button>
    </div>

    <!-- End of Users Message -->
    <p v-else class="end-text">No more users to show.</p>
  </div>
</template>

<script>
export default {
  name: 'SwipePage',
  data() {
    return {
      users: [],
      currentIndex: 0,
      currentPictureIndex: 0
    };
  },
  computed: {
    currentUser() {
      return this.users[this.currentIndex] || null;
    },
    currentPicture() {
      if (!this.currentUser) return '';
      return this.currentUser.pictures[this.currentPictureIndex];
    }
  },
  methods: {
    async fetchUsers() {
      try {
        const userId = localStorage.getItem('userId');
        const response = await fetch(`http://localhost:3000/api/users/swipe/${userId}`);
        const data = await response.json();
        this.users = data;
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    },
    like() {
      console.log('Liked', this.currentUser);
      this.nextUser();
    },
    dislike() {
      console.log('Disliked', this.currentUser);
      this.nextUser();
    },
    nextUser() {
      this.currentIndex++;
      this.currentPictureIndex = 0;
    },
    nextPicture() {
      if (!this.currentUser) return;
      this.currentPictureIndex = (this.currentPictureIndex + 1) % this.currentUser.pictures.length;
    },
    prevPicture() {
      if (!this.currentUser) return;
      this.currentPictureIndex =
        (this.currentPictureIndex - 1 + this.currentUser.pictures.length) %
        this.currentUser.pictures.length;
    },
    logout() {
      localStorage.clear();
      this.$router.push({ name: 'Login' });
    },
    goToProfile() {
      this.$router.push({ name: 'profile' });
    }
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>
/* Global Styles */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.page-container {
  background-color: #fef4e9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header (matching homepage) */
.header {
  background: #542254;
  padding: 1rem 0;
  position: relative;
  z-index: 100;
  width: 100%;
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

.nav-btn {
  padding: 0.6rem 1.5rem;
  border: 2px solid #FF3D47;
  border-radius: 8px;
  color: white;
  background: transparent;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #dd1b45;
  color: white;
}

.logout-btn {
  background: #dd1b45;
  border-color: #dd1b45;
}

.logout-btn:hover {
  background: #c41539;
  border-color: #c41539;
}

/* Instruction Text */
.instruction-text {
  margin-top: 20px;
  font-size: 20px;
  color: #542254;
  font-weight: 500;
}

/* Swipe Card Styling */
.card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  padding: 20px;
  margin-top: 15px;
  max-width: 350px;
  width: 90%;
  text-align: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.profile-pic {
  width: 100%;
  border-radius: 16px;
  margin-bottom: 15px;
}

.card h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #1F1F2E;
  margin-bottom: 8px;
  font-size: 1.5rem;
}

.card p {
  color: #666;
  line-height: 1.5;
  font-size: 1rem;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
}

.like-btn,
.dislike-btn {
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.like-btn {
  background-color: #dd1b45;
  color: white;
}

.dislike-btn {
  background-color: #542254;
  color: white;
}

.like-btn:hover {
  background-color: #c41539;
  transform: translateY(-1px);
}

.dislike-btn:hover {
  background-color: #461d46;
  transform: translateY(-1px);
}

.end-text {
  margin-top: 40px;
  color: #542254;
  font-size: 18px;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .logo-text {
    font-size: 1.5rem;
  }
  
  .nav-actions {
    gap: 0.5rem;
  }
  
  .nav-btn {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
  
  .card {
    max-width: 320px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 0.75rem;
  }
  
  .logo-text {
    font-size: 1.25rem;
  }
  
  .nav-btn {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .instruction-text {
    font-size: 18px;
  }
  
  .card {
    max-width: 280px;
  }
}
</style>