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
          <button @click="$router.push({ name: 'swipe' })" class="nav-btn">Back to Swipe</button>
          <button @click="logout" class="nav-btn logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-content">
      <div class="profile-container">
        <!-- Profile Header -->
        <div class="profile-header">
          <div class="profile-picture-section">
            <div class="picture-upload-area" @click="$refs.fileInput.click()">
              <img v-if="profilePictureUrl" :src="profilePictureUrl" alt="Profile Picture" class="profile-image" />
              <div v-else class="placeholder-image">
                <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
                  <circle cx="32" cy="24" r="12" fill="#D7263D" opacity="0.3"/>
                  <path d="M32 40C20 40 12 46 12 52V56H52V52C52 46 44 40 32 40Z" fill="#D7263D" opacity="0.3"/>
                </svg>
                <span>Add Photo</span>
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
            v-for="tab in ['about', 'preferences']"
            :key="tab"
            @click="activeTab = tab" 
            :class="['tab-btn', { active: activeTab === tab }]"
          >
            {{ tab === 'about' ? 'About Me' : 'Preferences' }}
          </button>
        </div>

        <!-- About Me Tab -->
        <div v-if="activeTab === 'about'" class="tab-content">
          <form @submit.prevent="updateProfile" class="profile-form">
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
            <button type="submit" class="btn btn-primary">Save Profile</button>
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
                  <div class="gender-checkbox-grid">
                    <div v-for="gender in genders" :key="gender.ID" class="gender-checkbox-item">
                      <input 
                        type="checkbox"
                        :id="'gender-' + gender.ID"
                        :value="gender.ID"
                        v-model="preferences.selectedGenders"
                        class="gender-checkbox"
                      />
                      <label :for="'gender-' + gender.ID" class="gender-checkbox-label">
                        <span class="checkbox-indicator"></span>
                        <span class="gender-name">{{ gender.Name }}</span>
                      </label>
                    </div>
                  </div>
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
            <button type="submit" class="btn btn-secondary">Save Preferences</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '@/auth.js';

const API_BASE = 'http://localhost:3000/api';

export default {
  name: 'ProfilePage',
  data: () => ({
    activeTab: 'about',
    userId: null,
    profile: { Username: '', DateOfBirth: '', Email: '', PhoneNumber: '', Bio: '', GenderID: null },
    genders: [],
    profilePicture: null,
    profilePictureUrl: '',
    preferences: { selectedGenders: [], MinAge: 18, MaxAge: 99, MaxDistance: 50 }
  }),
  
  async mounted() {
    if (this.checkAuth()) await this.fetchProfile();
  },
  
  beforeRouteEnter(to, from, next) {
    AuthService.isLoggedIn() ? next() : next({ name: 'login' });
  },
  
  methods: {
    checkAuth() {
      if (!AuthService.isLoggedIn()) {
        this.$router.push({ name: 'login' });
        return false;
      }
      this.userId = AuthService.getUserId();
      if (!this.userId) {
        console.error('No user ID found');
        this.$router.push({ name: 'login' });
        return false;
      }
      return true;
    },
    
    async apiCall(endpoint, options = {}) {
      const config = {
        headers: {
          'Authorization': `Bearer ${this.userId}`,
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      };
      
      const response = await fetch(`${API_BASE}${endpoint}`, config);
      
      if (response.status === 401) {
        AuthService.logout();
        this.$router.push({ name: 'login' });
        throw new Error('Unauthorized');
      }
      
      return response.json();
    },
    
    async fetchProfile() {
      try {
        const [profileData, gendersData] = await Promise.all([
          this.apiCall(`/profile/${this.userId}`),
          this.apiCall('/genders')
        ]);
        
        this.profile = profileData.profile;
        this.profilePictureUrl = profileData.profilePictureUrl;
        this.genders = gendersData;
        
        await this.fetchPreferences();
      } catch (err) {
        if (err.message !== 'Unauthorized') {
          console.error('Error fetching profile:', err);
        }
      }
    },
    
    async fetchPreferences() {
      try {
        const data = await this.apiCall(`/preferences/${this.userId}`);
        if (data) {
          this.preferences = {
            selectedGenders: data.selectedGenders || [],
            MinAge: data.MinAge || 18,
            MaxAge: data.MaxAge || 99,
            MaxDistance: data.MaxDistance || 50
          };
        }
      } catch (err) {
        if (err.message !== 'Unauthorized') {
          console.error('Error fetching preferences:', err);
        }
      }
    },
    
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicture = file;
        const reader = new FileReader();
        reader.onload = (e) => this.profilePictureUrl = e.target.result;
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
    
    async updateProfile() {
      try {
        const formData = new FormData();
        formData.append('userId', this.userId);
        formData.append('Bio', this.profile.Bio || '');
        formData.append('GenderID', this.profile.GenderID || '');
        formData.append('PhoneNumber', this.profile.PhoneNumber || '');
        
        if (this.profilePicture) {
          formData.append('profilePicture', this.profilePicture);
        }

        await fetch(`${API_BASE}/profile/${this.userId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${this.userId}` },
          body: formData,
        });
        
        await this.fetchProfile();
      } catch (err) {
        if (err.message !== 'Unauthorized') {
          console.error('Error updating profile:', err);
          alert('Failed to update profile');
        }
      }
    },
    
    async updatePreferences() {
      try {
        await this.apiCall(`/preferences/${this.userId}`, {
          method: 'PUT',
          body: JSON.stringify({
            selectedGenders: this.preferences.selectedGenders,
            MinAge: this.preferences.MinAge,
            MaxAge: this.preferences.MaxAge,
            MaxDistance: this.preferences.MaxDistance,
            userId: this.userId
          })
        });
      } catch (err) {
        if (err.message !== 'Unauthorized') {
          console.error('Error updating preferences:', err);
          alert('Failed to update preferences');
        }
      }
    },
    
    logout() {
      AuthService.logout();
      console.log('Logged out');
      this.$router.push({ name: 'home' });
    }
  }
};
</script>

<style scoped>
/* Global Styles */
* { box-sizing: border-box; margin: 0; padding: 0; }

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

.phone-group {
  margin-bottom: 2rem;
}

.email-group {
  margin-top: 1rem;
}

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

/* Preferences */
.preference-card {
  background: linear-gradient(135deg, rgba(84, 34, 84, 0.05), rgba(221, 27, 69, 0.05));
  border-radius: 16px;
  padding: 1.5rem;
  border: 2px solid rgba(84, 34, 84, 0.1);
}

.gender-checkbox-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.gender-checkbox-item {
  position: relative;
}

.gender-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.gender-checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  font-weight: 500;
  color: #1F1F2E;
}

.gender-checkbox-label:hover {
  border-color: #dd1b45;
  background: rgba(221, 27, 69, 0.02);
}

.gender-checkbox:checked + .gender-checkbox-label {
  border-color: #dd1b45;
  background: linear-gradient(135deg, rgba(221, 27, 69, 0.1), rgba(254, 116, 28, 0.1));
  color: #dd1b45;
}

.checkbox-indicator {
  width: 20px;
  height: 20px;
  border: 2px solid #e1e5e9;
  border-radius: 4px;
  position: relative;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.gender-checkbox:checked + .gender-checkbox-label .checkbox-indicator {
  background: linear-gradient(135deg, #dd1b45, #f54438);
  border-color: #dd1b45;
}

.gender-checkbox:checked + .gender-checkbox-label .checkbox-indicator::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.gender-name {
  font-size: 0.95rem;
}

.age-range-group {
  margin: 3rem 0;
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 1rem; 
  margin-top: 1.5rem;
  max-width: 150px;
}

.range-input {
  flex: 1;
  position: relative;
  max-width: 150px;
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
</style>