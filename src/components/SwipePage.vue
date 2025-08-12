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
          <button @click="goToMatches" class="nav-btn">Matches ({{ matchCount }})</button>
          <button @click="logout" class="nav-btn logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <!-- Instruction Text -->
    <p class="instruction-text">Swipe to match</p>

    <!-- Match Notification -->
    <div v-if="showMatchNotification" class="match-notification">
      <div class="match-content">
        <h2>It's a Match! 🎉</h2>
        <p>You and {{ lastMatchedUser }} liked each other!</p>
        <button @click="showMatchNotification = false" class="close-match-btn">Continue Swiping</button>
      </div>
    </div>

    <!-- Swipe Card -->
    <div class="card" v-if="currentUser">
      <div class="picture-container">
        <img :src="currentPicture" alt="Profile Picture" class="profile-pic" />
        <div class="picture-dots" v-if="currentUser.pictures && currentUser.pictures.length > 1">
          <span 
            v-for="(pic, index) in currentUser.pictures" 
            :key="index"
            :class="['dot', { active: index === currentPictureIndex }]"
            @click="currentPictureIndex = index"
          ></span>
        </div>
      </div>
      <div class="user-info">
        <div class="name-age">
          <h2>{{ currentUser.name }}, {{ currentUser.age }}</h2>
          <div class="distance" v-if="currentUser.distance !== undefined">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#666">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span>{{ formatDistance(currentUser.distance) }}</span>
          </div>
        </div>
        <p class="bio">{{ currentUser.bio }}</p>
      </div>
    </div>

    <!-- Swipe Buttons -->
    <div class="buttons" v-if="currentUser">
      <button @click="dislike" class="dislike-btn" :disabled="isProcessing">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
        </svg>
        Dislike
      </button>
      <button @click="like" class="like-btn" :disabled="isProcessing">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
        </svg>
        Like
      </button>
    </div>

    <!-- Loading State -->
    <div v-else-if="isLoading" class="loading">
      <p>Loading profiles...</p>
    </div>

    <!-- End of Users Message -->
    <div v-else class="end-container">
      <p class="end-text">No more profiles to show!</p>
      <p class="end-subtext">Check back later for new people</p>
      <button @click="refreshUsers" class="refresh-btn">Refresh</button>
    </div>
  </div>
</template>

<script>
import { AuthService } from '@/auth.js';

export default {
  name: 'SwipePage',
  data() {
    return {
      users: [],
      currentIndex: 0,
      currentPictureIndex: 0,
      isLoading: true,
      isProcessing: false,
      showMatchNotification: false,
      lastMatchedUser: '',
      matchCount: 0,
      userId: null,
      userLocation: null
    };
  },
  computed: {
    currentUser() {
      return this.users[this.currentIndex] || null;
    },
    currentPicture() {
      if (!this.currentUser) return '';
      if (this.currentUser.pictures && this.currentUser.pictures.length > 0) {
        return this.currentUser.pictures[this.currentPictureIndex];
      }
      return this.currentUser.picture;
    }
  },
  methods: {
    async getUserLocation() {
      try {
        this.userId = AuthService.getUserId();
        if (!this.userId) return null;

        const response = await fetch(`http://localhost:3000/api/profile/${this.userId}`, {
          headers: {
            'Authorization': `Bearer ${this.userId}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.profile.Latitude && data.profile.Longitude) {
            return {
              latitude: parseFloat(data.profile.Latitude),
              longitude: parseFloat(data.profile.Longitude)
            };
          }
        }
      } catch (error) {
        console.error('Failed to get user location:', error);
      }
      return null;
    },

    calculateDistance(lat1, lon1, lat2, lon2) {
      const R = 6371; // Radius of the Earth in kilometers
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c; // Distance in kilometers
      return distance;
    },

    deg2rad(deg) {
      return deg * (Math.PI/180);
    },

    formatDistance(distance) {
      if (distance < 1) {
        return `${Math.round(distance * 1000)}m away`;
      } else if (distance < 10) {
        return `${distance.toFixed(1)}km away`;
      } else {
        return `${Math.round(distance)}km away`;
      }
    },

    async fetchUsers() {
      this.isLoading = true;
      try {
        // Get userId from AuthService instead of localStorage
        this.userId = AuthService.getUserId();
        if (!this.userId) {
          this.$router.push({ name: 'login' });
          return;
        }

        // Get user's location
        this.userLocation = await this.getUserLocation();

        const response = await fetch(`http://localhost:3000/api/users/swipe/${this.userId}`, {
          headers: {
            'Authorization': `Bearer ${this.userId}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        
        // Calculate distances if user location is available
        if (this.userLocation) {
          data.forEach(user => {
            if (user.latitude && user.longitude) {
              user.distance = this.calculateDistance(
                this.userLocation.latitude,
                this.userLocation.longitude,
                parseFloat(user.latitude),
                parseFloat(user.longitude)
              );
            }
          });
        }
        
        this.users = data;
        this.currentIndex = 0;
        this.currentPictureIndex = 0;
      } catch (error) {
        console.error('Failed to load users:', error);
      } finally {
        this.isLoading = false;
      }
    },
    
    async fetchMatchCount() {
      try {
        const response = await fetch(`http://localhost:3000/api/matches/${this.userId}`, {
          headers: {
            'Authorization': `Bearer ${this.userId}`
          }
        });
        
        if (response.ok) {
          const matches = await response.json();
          this.matchCount = matches.length;
        }
      } catch (error) {
        console.error('Failed to fetch match count:', error);
      }
    },
    
    async recordSwipe(liked) {
      if (!this.currentUser || this.isProcessing) return;
      
      this.isProcessing = true;
      try {
        const response = await fetch('http://localhost:3000/api/swipe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.userId}`
          },
          body: JSON.stringify({
            swiperId: this.userId,
            swipedId: this.currentUser.id,
            liked: liked
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to record swipe');
        }
        
        const result = await response.json();
        
        // Check if it's a match
        if (result.isMatch) {
          this.lastMatchedUser = this.currentUser.name;
          this.showMatchNotification = true;
          this.matchCount++;
          
          // Auto-hide notification after 3 seconds
          setTimeout(() => {
            this.showMatchNotification = false;
          }, 3000);
        }
        
        this.nextUser();
      } catch (error) {
        console.error('Failed to record swipe:', error);
      } finally {
        this.isProcessing = false;
      }
    },
    
    async like() {
      console.log('Liked', this.currentUser?.name);
      await this.recordSwipe(true);
    },
    
    async dislike() {
      console.log('Disliked', this.currentUser?.name);
      await this.recordSwipe(false);
    },
    
    nextUser() {
      this.currentIndex++;
      this.currentPictureIndex = 0;
      
      // If we've gone through all users, refresh the list
      if (this.currentIndex >= this.users.length) {
        this.fetchUsers();
      }
    },
    
    refreshUsers() {
      this.fetchUsers();
    },
    
    logout() {
      AuthService.logout();
      this.$router.push({ name: 'login' });
    },
    
    goToProfile() {
      this.$router.push({ name: 'profile' });
    },
    
    goToMatches() {
      this.$router.push({ name: 'matches' });
    }
  },
  
  mounted() {
    // Check authentication
    if (!AuthService.isLoggedIn()) {
      this.$router.push({ name: 'login' });
      return;
    }
    
    this.fetchUsers();
    this.fetchMatchCount();
  },
  
  beforeRouteEnter(to, from, next) {
    if (!AuthService.isLoggedIn()) {
      next({ name: 'login' });
    } else {
      next();
    }
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

/* Match Notification */
.match-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: linear-gradient(135deg, #dd1b45, #f54438);
  border-radius: 20px;
  padding: 2rem;
  z-index: 1000;
  box-shadow: 0 10px 40px rgba(221, 27, 69, 0.4);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.match-content {
  text-align: center;
  color: white;
}

.match-content h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.match-content p {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.close-match-btn {
  background: white;
  color: #dd1b45;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.close-match-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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

.picture-container {
  position: relative;
  margin-bottom: 15px;
}

.profile-pic {
  width: 100%;
  height: 280px; /* Reduced from 400px */
  object-fit: cover;
  border-radius: 16px;
}

.picture-dots {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dot.active {
  background: white;
  transform: scale(1.2);
}

.user-info {
  text-align: left;
}

.name-age {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
  gap: 10px;
}

.card h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #1F1F2E;
  font-size: 1.4rem;
  margin: 0;
  flex: 1;
}

.distance {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  background: #f8f9fa;
  padding: 4px 8px;
  border-radius: 12px;
  white-space: nowrap;
}

.distance svg {
  flex-shrink: 0;
}

.bio {
  color: #666;
  line-height: 1.5;
  font-size: 1rem;
  margin: 0;
}

/* Buttons */
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
  display: flex;
  align-items: center;
  gap: 8px;
}

.like-btn {
  background-color: #dd1b45;
  color: white;
}

.dislike-btn {
  background-color: #542254;
  color: white;
}

.like-btn:hover:not(:disabled) {
  background-color: #c41539;
  transform: translateY(-1px);
}

.dislike-btn:hover:not(:disabled) {
  background-color: #461d46;
  transform: translateY(-1px);
}

.like-btn:disabled,
.dislike-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Loading and End States */
.loading {
  margin-top: 100px;
  color: #542254;
  font-size: 18px;
}

.end-container {
  margin-top: 100px;
  text-align: center;
}

.end-text {
  color: #542254;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 10px;
}

.end-subtext {
  color: #666;
  font-size: 16px;
  margin-bottom: 20px;
}

.refresh-btn {
  background: linear-gradient(135deg, #dd1b45, #f54438);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(221, 27, 69, 0.3);
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
  
  .profile-pic {
    height: 250px; /* Reduced from 350px */
  }
  
  .name-age {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
  
  .distance {
    align-self: flex-start;
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
  
  .profile-pic {
    height: 220px; /* Reduced from 300px */
  }
  
  .card h2 {
    font-size: 1.2rem;
  }
}
</style>