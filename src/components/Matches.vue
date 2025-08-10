<template>
  <div class="page-container">
    <!-- Header Navigation -->
    <header class="header">
      <div class="nav-container">
        <div class="logo">
          <div class="logo-icon">
            <img src="@/assets/logo.png" alt="Flare Logo" class="logo-image" />
          </div>
          <span class="logo-text">Flare</span>
        </div>
        <div class="nav-actions">
          <button @click="goToSwipe" class="nav-btn">Swipe</button>
          <button @click="goToProfile" class="nav-btn">Profile</button>
          <button @click="logout" class="nav-btn logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-content">
      <div class="matches-container">
        
        <!-- Page Title -->
        <div class="page-header">
          <h1 class="page-title">
            <svg width="28" height="28" fill="#DD1B45" viewBox="0 0 24 24">
              <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.04L12,21.35Z"/>
            </svg>
            Your Matches
          </h1>
          <p class="match-count">{{ matches.length }} {{ matches.length === 1 ? 'match' : 'matches' }}</p>
        </div>

        <!-- Matches Tabs -->
        <div class="matches-tabs">
          <button 
            @click="activeTab = 'matches'" 
            :class="['tab-btn', { active: activeTab === 'matches' }]"
          >
            Matches ({{ matches.length }})
          </button>
          <button 
            @click="activeTab = 'conversations'" 
            :class="['tab-btn', { active: activeTab === 'conversations' }]"
          >
            Conversations ({{ conversationsCount }})
          </button>
        </div>

        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading your matches...</p>
        </div>

        <!-- Matches Grid -->
        <div v-else-if="activeTab === 'matches' && matches.length > 0" class="matches-grid">
          <div 
            v-for="match in matches" 
            :key="match.matchId"
            class="match-card"
            @click="openChat(match)"
          >
            <div class="match-image-container">
              <img :src="match.user.picture" :alt="match.user.name" class="match-image" />
              <div class="match-overlay">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                </svg>
                <span>Start Chat</span>
              </div>
              <div v-if="isNewMatch(match.matchDate)" class="new-badge">NEW</div>
            </div>
            <div class="match-info">
              <h3 class="match-name">{{ match.user.name }}</h3>
              <p class="match-bio">{{ truncateBio(match.user.bio) }}</p>
              <p class="match-date">Matched {{ formatDate(match.matchDate) }}</p>
            </div>
          </div>
        </div>

        <!-- Conversations List -->
        <div v-else-if="activeTab === 'conversations'" class="conversations-list">
          <div v-if="conversationsCount > 0" class="conversations-preview">
            <svg width="64" height="64" fill="#DD1B45" opacity="0.3" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
            <h3>You have {{ conversationsCount }} active conversation{{ conversationsCount !== 1 ? 's' : '' }}!</h3>
            <p>Go to the full conversations page to chat with your matches.</p>
            <button @click="goToConversations" class="btn-primary">View Conversations</button>
          </div>
          <div v-else class="coming-soon">
            <svg width="64" height="64" fill="#DD1B45" opacity="0.3" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
            <h3>No conversations yet</h3>
            <p>Start chatting with your matches to begin conversations!</p>
          </div>
        </div>

        <!-- No Matches State -->
        <div v-else-if="!isLoading && matches.length === 0" class="no-matches">
          <div class="no-matches-content">
            <svg width="80" height="80" fill="#DD1B45" opacity="0.2" viewBox="0 0 24 24">
              <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.04L12,21.35Z"/>
            </svg>
            <h2>No matches yet</h2>
            <p>Keep swiping to find your perfect match!</p>
            <button @click="goToSwipe" class="btn-primary">Start Swiping</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '@/auth.js';

export default {
  name: 'MatchesPage',
  data() {
    return {
      activeTab: 'matches',
      matches: [],
      conversationsCount: 0,
      isLoading: true,
      userId: null
    };
  },
  methods: {
    async fetchMatches() {
      this.isLoading = true;
      try {
        this.userId = AuthService.getUserId();
        if (!this.userId) {
          this.$router.push({ name: 'login' });
          return;
        }

        // Fetch matches
        const matchesResponse = await fetch(`http://localhost:3000/api/matches/${this.userId}`, {
          headers: {
            'Authorization': `Bearer ${this.userId}`,
            'Content-Type': 'application/json'
          }
        });

        if (matchesResponse.status === 401) {
          AuthService.logout();
          this.$router.push({ name: 'login' });
          return;
        }

        if (!matchesResponse.ok) {
          throw new Error('Failed to fetch matches');
        }

        const matchesData = await matchesResponse.json();
        this.matches = matchesData;
        
        // Fetch conversations count
        try {
          const conversationsResponse = await fetch(`http://localhost:3000/api/conversations/${this.userId}`, {
            headers: {
              'Authorization': `Bearer ${this.userId}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (conversationsResponse.ok) {
            const conversationsData = await conversationsResponse.json();
            // Count conversations that have messages
            this.conversationsCount = conversationsData.filter(c => c.hasMessages).length;
          }
        } catch (convErr) {
          console.error('Error fetching conversations count:', convErr);
          this.conversationsCount = 0;
        }

      } catch (err) {
        console.error('Error fetching matches:', err);
      } finally {
        this.isLoading = false;
      }
    },
    
    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.floor(diffTime / (1000 * 60));

      if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      } else if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
      } else if (diffDays < 7) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
      } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
      } else {
        return date.toLocaleDateString();
      }
    },
    
    isNewMatch(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      return diffHours < 24; // Show "NEW" badge for matches less than 24 hours old
    },
    
    truncateBio(bio) {
      if (!bio) return 'No bio yet';
      if (bio.length <= 100) return bio;
      return bio.substring(0, 100) + '...';
    },
    
    async openChat(match) {
      try {
        // Get or create conversation for this match
        const response = await fetch(`http://localhost:3000/api/matches/${match.matchId}/conversation`, {
          headers: {
            'Authorization': `Bearer ${this.userId}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to get conversation');
        }

        const data = await response.json();
        
        // Navigate to conversations page and automatically select this conversation
        this.$router.push({ 
          name: 'conversations',
          query: { 
            conversationId: data.conversationId,
            matchId: match.matchId,
            matchName: match.user.name
          }
        });
      } catch (err) {
        console.error('Error getting conversation:', err);
        alert('Failed to start conversation. Please try again.');
      }
    },
    
    goToSwipe() {
      this.$router.push({ name: 'swipe' });
    },
    
    goToProfile() {
      this.$router.push({ name: 'profile' });
    },
    
    goToConversations() {
      this.$router.push({ name: 'conversations' });
    },
    
    logout() {
      AuthService.logout();
      this.$router.push({ name: 'login' });
    }
  },
  mounted() {
    // Check authentication before loading matches
    if (!AuthService.isLoggedIn()) {
      this.$router.push({ name: 'login' });
      return;
    }
    
    this.fetchMatches();
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
  background: #fef4e9;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
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

.logo-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
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

/* Main Content */
.main-content {
  padding: 2rem;
  display: flex;
  justify-content: center;
}

.matches-container {
  max-width: 1200px;
  width: 100%;
}

/* Page Header */
.page-header {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.page-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  color: #1F1F2E;
  margin-bottom: 0.5rem;
}

.match-count {
  color: #666;
  font-size: 1.1rem;
  margin-left: 2.5rem;
}

/* Tabs */
.matches-tabs {
  display: flex;
  background: white;
  border-radius: 16px;
  padding: 0.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #666;
}

.tab-btn.active {
  background: linear-gradient(135deg, #dd1b45, #f54438);
  color: white;
  box-shadow: 0 4px 12px rgba(221, 27, 69, 0.3);
}

/* Loading State */
.loading-container {
  text-align: center;
  padding: 4rem;
  color: #666;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  margin: 0 auto 1rem;
  border: 4px solid rgba(221, 27, 69, 0.1);
  border-top-color: #dd1b45;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Matches Grid */
.matches-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}

.match-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.match-image-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
}

.match-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.match-card:hover .match-image {
  transform: scale(1.05);
}

.match-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  color: white;
  gap: 0.5rem;
}

.match-card:hover .match-overlay {
  opacity: 1;
}

.new-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: linear-gradient(135deg, #dd1b45, #f54438);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(221, 27, 69, 0.4);
}

.match-info {
  padding: 1.5rem;
}

.match-name {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.25rem;
  color: #1F1F2E;
  margin-bottom: 0.5rem;
}

.match-bio {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 0.75rem;
  min-height: 3rem;
}

.match-date {
  color: #999;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Coming Soon / No Matches States */
.coming-soon,
.conversations-preview,
.no-matches {
  background: white;
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.coming-soon h3,
.conversations-preview h3,
.no-matches h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #1F1F2E;
  margin: 1rem 0;
}

.coming-soon p,
.conversations-preview p,
.no-matches p {
  color: #666;
  margin-bottom: 2rem;
}

.btn-primary {
  background: linear-gradient(135deg, #dd1b45, #f54438);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 16px rgba(221, 27, 69, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(221, 27, 69, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .matches-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }
  
  .match-image-container {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .matches-grid {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 1.25rem;
  }
}
</style>