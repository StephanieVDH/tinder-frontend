<template>
  <div class="page-container">
  <header class="header">
    <div class="nav-container">
      <div class="logo">
        <div class="logo-icon">
          <img src="@/assets/logo.png" alt="Flare Logo" width="32" height="32" />
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

        <!-- Report Modal -->
    <div v-if="showReportModal" class="report-modal-overlay" @click="closeReportModal">
      <div class="report-modal" @click.stop>
        <div class="report-header">
          <h3>Report {{ userToReport?.name }}</h3>
          <button @click="closeReportModal" class="close-report-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="report-content">
          <p>Please tell us why you're reporting this user:</p>
          <textarea 
            v-model="reportReason" 
            placeholder="Describe the issue (inappropriate behavior, fake profile, harassment, etc.)"
            class="report-textarea"
            rows="4"
          ></textarea>
          <div class="report-actions">
            <button @click="closeReportModal" class="cancel-report-btn">Cancel</button>
            <button @click="submitReport" class="submit-report-btn" :disabled="!reportReason.trim() || isSubmittingReport">
              {{ isSubmittingReport ? 'Reporting...' : 'Submit Report' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Success Notification -->
    <div v-if="showReportSuccess" class="report-success-notification">
      <div class="report-success-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#4CAF50">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        <h3>Report Submitted</h3>
        <p>Thank you for keeping our community safe. We'll review this report.</p>
      </div>
    </div>

    <!-- Swipe Card -->
    <div class="card" v-if="currentUser" :class="{ 'verified': currentUser.verified }">
      <div class="picture-container">
        <img :src="currentPicture" alt="Profile Picture" class="profile-pic" @click="nextPicture" />
        
        <!-- Navigation arrows for multiple pictures -->
        <button 
          v-if="allPictures.length > 1" 
          @click="previousPicture" 
          class="picture-nav prev-btn"
          :disabled="currentPictureIndex === 0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
          </svg>
        </button>
        
        <button 
          v-if="allPictures.length > 1" 
          @click="nextPicture" 
          class="picture-nav next-btn"
          :disabled="currentPictureIndex === allPictures.length - 1"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
          </svg>
        </button>

        <!-- Report Button as Red Flag -->
        <button @click="openReportModal" class="report-btn" title="Report this user">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="red">
            <path d="M14 6l-1-2H6v16h2v-6h5l1 2h6V6h-6z"/>
          </svg>
        </button>
        
        <!-- Verification border overlay for verified users -->
        <div v-if="currentUser.verified" class="verification-border"></div>
        
        <!-- Picture dots indicator -->
        <div class="picture-dots" v-if="allPictures.length > 1">
          <span 
            v-for="(pic, index) in allPictures" 
            :key="index"
            :class="['dot', { active: index === currentPictureIndex }]"
            @click="goToPicture(index)"
          ></span>
        </div>
        
        <!-- Picture counter -->
        <div v-if="allPictures.length > 1" class="picture-counter">
          {{ currentPictureIndex + 1 }} / {{ allPictures.length }}
        </div>
      </div>
      
      <div class="user-info">
        <div class="name-age">
          <div class="name-container">
            <h2>{{ currentUser.name }}</h2>
            <!-- Verification badge -->
            <div v-if="currentUser.verified" class="verification-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <span class="age">, {{ currentUser.age }}</span>
          </div>
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
      userLocation: null,
      // Report functionality
      showReportModal: false,
      showReportSuccess: false,
      userToReport: null,
      reportReason: '',
      isSubmittingReport: false
    };
  },
  computed: {
    currentUser() {
      return this.users[this.currentIndex] || null;
    },
    allPictures() {
      if (!this.currentUser) return [];
      
      const pictures = [];
      
      // Add profile picture first (if exists)
      if (this.currentUser.picture) {
        pictures.push(this.currentUser.picture);
      }
      
      // Add additional pictures
      if (this.currentUser.additionalPictures && this.currentUser.additionalPictures.length > 0) {
        pictures.push(...this.currentUser.additionalPictures);
      }
      
      return pictures;
    },
    currentPicture() {
      if (this.allPictures.length === 0) return '';
      return this.allPictures[this.currentPictureIndex] || this.allPictures[0];
    }
  },
  watch: {
    currentIndex() {
      // Reset picture index when user changes
      this.currentPictureIndex = 0;
    }
  },
  methods: {
    // Picture navigation methods
    nextPicture() {
      if (this.currentPictureIndex < this.allPictures.length - 1) {
        this.currentPictureIndex++;
      }
    },
    
    previousPicture() {
      if (this.currentPictureIndex > 0) {
        this.currentPictureIndex--;
      }
    },
    
    goToPicture(index) {
      if (index >= 0 && index < this.allPictures.length) {
        this.currentPictureIndex = index;
      }
    },

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

    // Report functionality methods
    openReportModal() {
      if (!this.currentUser) return;
      this.userToReport = this.currentUser;
      this.showReportModal = true;
      this.reportReason = '';
    },

    closeReportModal() {
      this.showReportModal = false;
      this.userToReport = null;
      this.reportReason = '';
      this.isSubmittingReport = false;
    },

    async submitReport() {
      if (!this.reportReason.trim() || !this.userToReport || this.isSubmittingReport) return;
      
      this.isSubmittingReport = true;
      try {
        const response = await fetch('http://localhost:3000/api/reports', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.userId}`
          },
          body: JSON.stringify({
            reporterId: this.userId,
            reportedId: this.userToReport.id,
            reason: this.reportReason.trim()
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit report');
        }

        // Show success notification
        this.closeReportModal();
        this.showReportSuccess = true;
        
        // Auto-hide success notification after 3 seconds
        setTimeout(() => {
          this.showReportSuccess = false;
        }, 3000);

      } catch (error) {
        console.error('Failed to submit report:', error);
        alert('Failed to submit report: ' + error.message);
      } finally {
        this.isSubmittingReport = false;
      }
    },

    async fetchUserAdditionalPictures(userId) {
      try {
        const response = await fetch(`http://localhost:3000/api/pictures/${userId}`, {
          headers: {
            'Authorization': `Bearer ${this.userId}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return data.pictures.map(pic => pic.url);
        }
      } catch (error) {
        console.error('Failed to fetch additional pictures for user:', userId, error);
      }
      return [];
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

        // Fetch additional pictures for each user
        for (const user of data) {
          user.additionalPictures = await this.fetchUserAdditionalPictures(user.id);
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
    },
    
    logout() {
      AuthService.logout();
      this.$router.push({ name: 'home' });
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

/* Enhanced styling for verified users */
.card.verified {
  background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
  border: 2px solid #FFD700;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1);
}

.card.verified:hover {
  box-shadow: 0 6px 24px rgba(255, 215, 0, 0.3), 0 12px 48px rgba(0, 0, 0, 0.15);
  transform: translateY(-3px);
}

.picture-container {
  position: relative;
  margin-bottom: 15px;
}

.profile-pic {
  width: 100%;
  height: 280px;
  object-fit: cover;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.profile-pic:hover {
  transform: scale(1.02);
}

/* Picture Navigation Arrows */
.picture-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0;
  z-index: 10;
}

.picture-container:hover .picture-nav {
  opacity: 1;
}

.prev-btn {
  left: 10px;
}

.next-btn {
  right: 10px;
}

.picture-nav:hover:not(:disabled) {
  background: rgba(0, 0, 0, 0.8);
  transform: translateY(-50%) scale(1.1);
}

.picture-nav:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* Verification border overlay */
.verification-border {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px solid #FFD700;
  border-radius: 16px;
  box-shadow: inset 0 0 0 2px white, 0 0 15px rgba(255, 215, 0, 0.4);
  pointer-events: none;
}

.picture-dots {
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 20px;
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
  transform: scale(1.3);
}

.dot:hover {
  background: rgba(255, 255, 255, 0.8);
  transform: scale(1.1);
}

/* Picture Counter */
.picture-counter {
  position: absolute;
  top: 15px;
  left: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
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

.name-container {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.card h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #1F1F2E;
  font-size: 1.4rem;
  margin: 0;
}

/* Special styling for verified user names */
.card.verified h2 {
  color: #B8860B;
  font-weight: 700;
}

.age {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #1F1F2E;
  font-size: 1.4rem;
}

.card.verified .age {
  color: #B8860B;
}

/* Verification badge */
.verification-badge {
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
  flex-shrink: 0;
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

/* Report Modal Styles */
.report-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.report-modal {
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.report-header h3 {
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-report-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-report-btn:hover {
  background: #e9ecef;
  color: #333;
}

.report-content {
  padding: 2rem;
}

.report-content p {
  color: #555;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.report-textarea {
  width: 100%;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
}

.report-textarea:focus {
  outline: none;
  border-color: #dd1b45;
}

.report-textarea::placeholder {
  color: #999;
}

.report-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  justify-content: flex-end;
}

.cancel-report-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  background: white;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-report-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.submit-report-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  background: #dc3545;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-report-btn:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
}

.submit-report-btn:disabled {
  background: #dee2e6;
  color: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* Report Button */
.report-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(227, 190, 190, 0.6);
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
}

.report-btn:hover {
  background: rgba(220, 53, 69, 0.8);
  transform: scale(1.1);
}

/* Report Success Notification */
.report-success-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  padding: 2rem;
  z-index: 1600;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: successSlideIn 0.3s ease;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

@keyframes successSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.report-success-content h3 {
  color: #333;
  margin: 1rem 0 0.5rem 0;
  font-size: 1.3rem;
}

.report-success-content p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
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
</style>