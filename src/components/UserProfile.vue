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
          <button @click="goToSwipe" class="nav-btn">Back to Swipe</button>
          <button @click="logout" class="nav-btn logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-content">
      <div class="profile-container">
        
        <!-- Profile Header with Picture -->
        <div class="profile-header">
          <div class="profile-picture-section">
            <div class="picture-upload-area" @click="triggerFileInput">
              <img v-if="profilePictureUrl" :src="profilePictureUrl" alt="Profile Picture" class="profile-image" />
              <div v-else class="placeholder-image">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="24" r="12" fill="#D7263D" opacity="0.3"/>
                  <path d="M32 40C20 40 12 46 12 52V56H52V52C52 46 44 40 32 40Z" fill="#D7263D" opacity="0.3"/>
                </svg>
                <span>Add Photo</span>
              </div>
              <div class="upload-overlay">
                <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.1 3.89 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H19V9Z"/>
                </svg>
              </div>
            </div>
            <input type="file" ref="fileInput" @change="handleFileUpload" class="hidden-file-input" accept="image/*" />
          </div>
          
          <div class="profile-header-info">
            <h1 class="profile-name">{{ profile.Username || 'Your Name' }}</h1>
            <p class="profile-age">{{ calculateAge(profile.DateOfBirth) }} years old</p>
          </div>
        </div>

        <!-- Profile Tabs -->
        <div class="profile-tabs">
          <button 
            @click="activeTab = 'about'" 
            :class="['tab-btn', { active: activeTab === 'about' }]"
          >
            About Me
          </button>
          <button 
            @click="activeTab = 'preferences'" 
            :class="['tab-btn', { active: activeTab === 'preferences' }]"
          >
            Preferences
          </button>
        </div>

        <!-- About Me Tab -->
        <div v-if="activeTab === 'about'" class="tab-content">
          <form @submit.prevent="updateProfile" class="profile-form">
            
            <!-- Bio Section -->
            <div class="form-section bio-section">
              <h3 class="section-title">
                <svg width="20" height="20" fill="#DD1B45" viewBox="0 0 24 24">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z"/>
                </svg>
                Tell your story
              </h3>
              <textarea 
                v-model="profile.Bio" 
                class="bio-textarea" 
                placeholder="Share what makes you unique... your interests, passions, or what you're looking for!"
                maxlength="500"
              ></textarea>
              <div class="char-count">{{ (profile.Bio || '').length }}/500</div>
            </div>

            <!-- Personal Details -->
            <div class="form-section">
              <h3 class="section-title">
                <svg width="20" height="20" fill="#DD1B45" viewBox="0 0 24 24">
                  <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                </svg>
                Personal Details
              </h3>
              
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">Gender</label>
                  <select v-model="profile.GenderID" class="form-select gender-select">
                    <option value="" disabled>Select your gender</option>
                    <option v-for="gender in genders" :key="gender.ID" :value="gender.ID">
                      {{ gender.Name }}
                    </option>
                  </select>
                </div>

                <div class="form-group phone-group">
                  <label class="form-label">Phone Number</label>
                  <input v-model="profile.PhoneNumber" type="text" class="form-input" placeholder="+1 (555) 123-4567" />
                </div>
              </div>

              <div class="form-group email-group">
                <label class="form-label">Email</label>
                <input v-model="profile.Email" type="email" class="form-input readonly" readonly />
                <small class="form-hint">Email cannot be changed</small>
              </div>
            </div>

            <button type="submit" class="btn btn-primary">
              Save Profile
            </button>
          </form>
        </div>

        <!-- Preferences Tab -->
        <div v-if="activeTab === 'preferences'" class="tab-content">
          <form @submit.prevent="updatePreferences" class="preferences-form">
            
            <div class="form-section">
              <h3 class="section-title">
                <svg width="20" height="20" fill="#DD1B45" viewBox="0 0 24 24">
                  <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.04L12,21.35Z"/>
                </svg>
                Looking For
              </h3>
              
              <div class="preference-card">
                <div class="form-group">
                  <label class="form-label">Interested in</label>
                  <select v-model="preferences.GenderID" class="form-select">
                    <option value="" disabled>Who are you looking for?</option>
                    <option v-for="gender in genders" :key="gender.ID" :value="gender.ID">
                      {{ gender.Name }}
                    </option>
                  </select>
                </div>

                <div class="age-range-group">
                  <label class="form-label">Age Range</label>
                  <div class="range-inputs">
                    <div class="range-input">
                      <input v-model.number="preferences.MinAge" type="number" min="18" max="99" class="form-input" />
                      <span class="range-label">Min</span>
                    </div>
                    <div class="range-separator">to</div>
                    <div class="range-input">
                      <input v-model.number="preferences.MaxAge" type="number" min="18" max="99" class="form-input" />
                      <span class="range-label">Max</span>
                    </div>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Maximum Distance</label>
                  <div class="distance-input">
                    <input v-model.number="preferences.MaxDistance" type="range" min="1" max="100" class="distance-slider" />
                    <div class="distance-display">{{ preferences.MaxDistance }} km</div>
                  </div>
                </div>
              </div>
            </div>

            <button type="submit" class="btn btn-secondary">
              Save Preferences
            </button>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '@/auth.js';

export default {
  name: 'ProfilePage',
  data() {
    return {
      activeTab: 'about',
      userId: null,
      profile: {
        Username: '',
        DateOfBirth: '',
        Email: '',
        PhoneNumber: '',
        Bio: '',
        GenderID: null,
      },
      genders: [],
      profilePicture: null,
      profilePictureUrl: '',
      preferences: {
        GenderID: null,
        MinAge: 18,
        MaxAge: 99,
        MaxDistance: 50,
      },
    };
  },
  methods: {
    checkAuth() {
      // Check if user is logged in
      if (!AuthService.isLoggedIn()) {
        this.$router.push({ name: 'login' });
        return false;
      }
      
      // Get user ID from auth service
      this.userId = AuthService.getUserId();
      if (!this.userId) {
        console.error('No user ID found');
        this.$router.push({ name: 'login' });
        return false;
      }
      
      return true;
    },
    fetchProfile() {
      // Include user ID in the API call
      fetch(`http://localhost:3000/api/profile/${this.userId}`, {
        headers: {
          'Authorization': `Bearer ${this.userId}`, // Include auth header
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.status === 401) {
            // Unauthorized - redirect to login
            AuthService.logout();
            this.$router.push({ name: 'login' });
            throw new Error('Unauthorized');
          }
          return res.json();
        })
        .then(data => {
          this.profile = data.profile;
          this.profilePictureUrl = data.profilePictureUrl;
        })
        .catch(err => {
          if (err.message !== 'Unauthorized') {
            console.error('Error fetching profile:', err);
          }
        });

      // Fetch genders
      fetch('http://localhost:3000/api/genders', {
        headers: {
          'Authorization': `Bearer ${this.userId}`
        }
      })
        .then(res => res.json())
        .then(data => {
          this.genders = data;
        })
        .catch(err => console.error('Error fetching genders:', err));

      this.fetchPreferences();
    },
    fetchPreferences() {
      fetch(`http://localhost:3000/api/preferences/${this.userId}`, {
        headers: {
          'Authorization': `Bearer ${this.userId}`,
          'Content-Type': 'application/json'
        }
      })
        .then(res => {
          if (res.status === 401) {
            AuthService.logout();
            this.$router.push({ name: 'Login' });
            throw new Error('Unauthorized');
          }
          return res.json();
        })
        .then(data => {
          if (data) {
            this.preferences = data;
          }
        })
        .catch(err => {
          if (err.message !== 'Unauthorized') {
            console.error('Error fetching preferences:', err);
          }
        });
    },
    triggerFileInput() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicture = file;
        // Create preview URL
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profilePictureUrl = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },
    calculateAge(dateOfBirth) {
      if (!dateOfBirth) return '';
      const today = new Date();
      const birthDate = new Date(dateOfBirth);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    },
    updateProfile() {
      const formData = new FormData();
      // Include user ID
      formData.append('userId', this.userId);
      // Only include editable fields in the update
      formData.append('Bio', this.profile.Bio || '');
      formData.append('GenderID', this.profile.GenderID || '');
      formData.append('PhoneNumber', this.profile.PhoneNumber || '');
      
      if (this.profilePicture) {
        formData.append('profilePicture', this.profilePicture);
      }

      fetch(`http://localhost:3000/api/profile/${this.userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.userId}`
        },
        body: formData,
      })
        .then(res => {
          if (res.status === 401) {
            AuthService.logout();
            this.$router.push({ name: 'Login' });
            throw new Error('Unauthorized');
          }
          return res.json();
        })
        .then(() => {
          alert('Profile updated successfully');
          this.fetchProfile();
        })
        .catch(err => {
          if (err.message !== 'Unauthorized') {
            console.error('Error updating profile:', err);
            alert('Failed to update profile');
          }
        });
    },
    updatePreferences() {
      fetch(`http://localhost:3000/api/preferences/${this.userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.userId}`
        },
        body: JSON.stringify({
          ...this.preferences,
          userId: this.userId
        }),
      })
      .then(res => {
        if (res.status === 401) {
          AuthService.logout();
          this.$router.push({ name: 'Login' });
          throw new Error('Unauthorized');
        }
        return res.json();
      })
      .then(() => {
        alert('Preferences updated successfully');
      })
      .catch(err => {
        if (err.message !== 'Unauthorized') {
          console.error('Error updating preferences:', err);
          alert('Failed to update preferences');
        }
      });
    },
    goToSwipe() {
      this.$router.push({ name: 'swipe' });
    },
    logout() {
      // Use AuthService to logout
      AuthService.logout();
      console.log('Logged out');
      this.$router.push({ name: 'login' });
    },
  },
  mounted() {
    // Check authentication before loading profile
    if (this.checkAuth()) {
      this.fetchProfile();
    }
  },
  // Add navigation guard
  beforeRouteEnter(to, from, next) {
    // Check if user is authenticated before entering the route
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

/* Header (same as other pages) */
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

.profile-container {
  max-width: 800px;
  width: 100%;
}

/* Profile Header */
.profile-header {
  background: linear-gradient(135deg, #dd1b45 0%, #f54438 50%, #fe741c 100%);
  border-radius: 24px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(221, 27, 69, 0.2);
}

.profile-picture-section {
  position: relative;
}

.picture-upload-area {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  border: 4px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.picture-upload-area:hover {
  border-color: rgba(255, 255, 255, 0.6);
  transform: scale(1.05);
}

.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.upload-overlay {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #dd1b45;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid white;
}

.hidden-file-input {
  display: none;
}

.profile-header-info {
  color: white;
}

.profile-name {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.profile-age {
  font-size: 1.1rem;
  opacity: 0.9;
}

/* Profile Tabs */
.profile-tabs {
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

/* Tab Content */
.tab-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Form Sections */
.form-section {
  margin-bottom: 2rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.3rem;
  color: #1F1F2E;
  margin-bottom: 1.5rem;
}

.bio-section {
  background: linear-gradient(135deg, rgba(221, 27, 69, 0.05), rgba(255, 180, 0, 0.05));
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(221, 27, 69, 0.1);
}

.bio-textarea {
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  transition: border-color 0.2s ease;
  font-family: inherit;
}

.bio-textarea:focus {
  outline: none;
  border-color: #dd1b45;
}

.char-count {
  text-align: right;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

/* Specific spacing adjustments */
.phone-group {
  margin-bottom: 2rem;
}

.email-group {
  margin-top: 1rem;
}

/* Gender select styling */
.gender-select {
  padding: 1rem;
  font-size: 1.05rem;
  min-height: 52px;
}

.form-label {
  font-weight: 600;
  color: #1F1F2E;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-input, .form-select {
  padding: 0.875rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  font-size: 1rem;
  transition: border-color 0.2s ease;
  background: white;
}

.form-input:focus, .form-select:focus {
  outline: none;
  border-color: #dd1b45;
}

.form-input.readonly {
  background: #f8f9fa;
  color: #666;
  cursor: not-allowed;
}

.form-hint {
  font-size: 0.8rem;
  color: #666;
  margin-top: 0.25rem;
}

/* Preferences Specific */
.preference-card {
  background: linear-gradient(135deg, rgba(84, 34, 84, 0.05), rgba(221, 27, 69, 0.05));
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(84, 34, 84, 0.1);
}

.age-range-group {
  margin: 3rem 0;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 1rem; 
  margin-top: 1.5rem;
  max-width: 150px; /* Constrain width to keep inputs closer */
}

.range-input {
  flex: 1;
  position: relative;
  max-width: 150px; /* Limit individual input width */
}

.range-label {
  position: absolute;
  top: -1rem;
  left: 0.875rem;
  background: white;
  padding: 0 0.5rem;
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.range-separator {
  font-weight: 600;
  color: #666;
}

.distance-input {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.distance-slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #e1e5e9;
  outline: none;
  -webkit-appearance: none;
}

.distance-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dd1b45, #f54438);
  cursor: pointer;
}

.distance-display {
  background: linear-gradient(135deg, #dd1b45, #f54438);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  min-width: 80px;
  text-align: center;
}

/* Buttons */
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  margin-top: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #dd1b45, #f54438);
  color: white;
  box-shadow: 0 4px 16px rgba(221, 27, 69, 0.3);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(221, 27, 69, 0.4);
}

.btn-secondary {
  background: linear-gradient(135deg, #542254, #dd1b45);
  color: white;
  box-shadow: 0 4px 16px rgba(84, 34, 84, 0.3);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(84, 34, 84, 0.4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .profile-name {
    font-size: 1.5rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .range-inputs {
    flex-direction: column;
    gap: 1rem;
  }
  
  .range-separator {
    display: none;
  }
  
  .distance-input {
    flex-direction: column;
    align-items: stretch;
  }
}

@media (max-width: 480px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .tab-content {
    padding: 1.5rem;
  }
  
  .picture-upload-area {
    width: 100px;
    height: 100px;
  }
  
  .profile-name {
    font-size: 1.3rem;
  }
}
</style>