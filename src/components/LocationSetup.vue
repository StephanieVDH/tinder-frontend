<template>
  <div class="location-setup-container">
    <header class="header">
      <router-link to="/" class="logo">
        <div class="logo-icon">
          <img src="@/assets/logo.png" alt="Flare Logo" width="32" height="32" />
        </div>
        <span class="logo-text">Flare</span>
      </router-link>
    </header>

    <section class="location-main">
      <div class="welcome-header">
        <h1>Welcome! 🎉</h1>
        <p>You're almost ready to start swiping!</p>
      </div>
      
      <div class="location-container">
        <div class="location-header">
          <div class="location-icon">📍</div>
          <h2>Set Your Location</h2>
          <p>We need your location to show you potential matches nearby</p>
          <div class="benefits">
            <div class="benefit">✨ Find matches in your area</div>
            <div class="benefit">🎯 Set your preferred distance</div>
            <div class="benefit">🔒 Your exact location stays private</div>
          </div>
        </div>

        <div v-if="statusMessage" class="status-message" :class="statusClass">
          {{ statusMessage }}
        </div>

        <div v-if="showLocationInstructions" class="location-instructions">
          <h4>How to Enable Location Access:</h4>
          <div class="browser-instructions">
            <div class="instruction-item">
              <strong>Chrome/Edge:</strong> Click the location icon (🔒) in the address bar → Set "Location" to "Allow" → Refresh page
            </div>
            <div class="instruction-item">
              <strong>Firefox:</strong> Click the shield icon → "Allow Location Access" → Refresh page
            </div>
            <div class="instruction-item">
              <strong>Safari:</strong> Safari menu → Preferences → Websites → Location → Set to "Allow"
            </div>
          </div>
          <p class="instruction-note">Or use manual input below as an alternative</p>
        </div>

        <div class="location-actions">
          <button 
            @click="getCurrentLocation" 
            class="location-button"
            :disabled="isLoading"
          >
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {{ isLoading ? 'Getting Location...' : 'Use My Location' }}
          </button>
          
          <button 
            @click="toggleManualInput" 
            class="location-button manual-button"
          >
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
            </svg>
            {{ showManualInput ? 'Cancel Manual Input' : 'Enter Manually' }}
          </button>
        </div>

        <div v-if="showManualInput" class="manual-input">
          <div class="input-group">
            <label for="latitude">Latitude:</label>
            <input 
              type="number" 
              id="latitude" 
              v-model="manualLatitude"
              step="any" 
              placeholder="e.g., 50.8503"
            >
          </div>
          <div class="input-group">
            <label for="longitude">Longitude:</label>
            <input 
              type="number" 
              id="longitude" 
              v-model="manualLongitude"
              step="any" 
              placeholder="e.g., 4.3517"
            >
          </div>
          <button @click="saveManualLocation" class="location-button">
            <svg class="icon" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            Save Location
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'LocationSetup',
  data() {
    return {
      statusMessage: '',
      statusClass: '',
      coordinates: null,
      isLoading: false,
      showManualInput: false,
      showLocationInstructions: false,
      manualLatitude: '',
      manualLongitude: ''
    };
  },
  computed: {
    userId() {
      return this.$route.params.userId || this.getCurrentUser()?.id;
    }
  },
  mounted() {
    this.checkGeolocationSupport();
  },
  methods: {
    checkGeolocationSupport() {
      if (!navigator.geolocation) {
        this.showStatus('Geolocation is not supported by this browser. Please use manual input.', 'error');
      }
    },

    getCurrentLocation() {
      if (!navigator.geolocation) {
        this.showStatus('Geolocation is not supported', 'error');
        return;
      }

      this.showStatus('Getting your location...', 'loading');
      this.isLoading = true;

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => this.onLocationSuccess(position),
        (error) => this.onLocationError(error),
        options
      );
    },

    onLocationSuccess(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const accuracy = position.coords.accuracy;

      this.showStatus(
        `Location found! Accuracy: ${Math.round(accuracy)} meters`, 
        'success'
      );
      
      this.saveLocationToProfile(latitude, longitude);
      this.isLoading = false;
    },

    onLocationError(error) {
      let message = 'Unable to get your location. ';
      let showInstructions = false;
      
      switch(error.code) {
        case error.PERMISSION_DENIED:
          message = 'Location access was denied. To enable location access:';
          showInstructions = true;
          break;
        case error.POSITION_UNAVAILABLE:
          message += 'Location information is unavailable. Please try manual input.';
          break;
        case error.TIMEOUT:
          message += 'Location request timed out. Please try again or use manual input.';
          break;
        default:
          message += 'An unknown error occurred. Please try manual input.';
          break;
      }

      this.showStatus(message, 'error');
      this.isLoading = false;
      
      if (showInstructions) {
        this.showLocationInstructions = true;
        // Auto-open manual input as fallback
        this.showManualInput = true;
      }
    },

    toggleManualInput() {
      this.showManualInput = !this.showManualInput;
    },

    saveManualLocation() {
      const latitude = parseFloat(this.manualLatitude);
      const longitude = parseFloat(this.manualLongitude);

      if (isNaN(latitude) || isNaN(longitude)) {
        this.showStatus('Please enter valid latitude and longitude values', 'error');
        return;
      }

      if (latitude < -90 || latitude > 90) {
        this.showStatus('Latitude must be between -90 and 90', 'error');
        return;
      }

      if (longitude < -180 || longitude > 180) {
        this.showStatus('Longitude must be between -180 and 180', 'error');
        return;
      }

      this.saveLocationToProfile(latitude, longitude);
      this.showStatus('Location saved successfully!', 'success');
      this.showManualInput = false;
    },

    showStatus(message, type) {
      this.statusMessage = message;
      this.statusClass = `status-${type}`;

      if (type === 'success') {
        setTimeout(() => {
          this.statusMessage = '';
        }, 3000);
      }
    },

    async saveLocationToProfile(latitude, longitude) {
      try {
        const response = await fetch(`http://localhost:3000/api/profile/${this.userId}/location`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude
          })
        });

        if (!response.ok) {
          throw new Error('Failed to save location');
        }

        const result = await response.json();
        console.log('Location saved:', result);
        
        // After successful save, proceed to main app
        setTimeout(() => {
          this.proceedToMainApp();
        }, 1500);
        
      } catch (error) {
        console.error('Error saving location:', error);
        this.showStatus('Failed to save location to profile', 'error');
      }
    },

    proceedToMainApp() {
      // Redirect to swipe page
      this.$router.push({ name: 'swipe' });
    },

    getCurrentUser() {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    }
  }
};
</script>

<style scoped>
.location-setup-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: #2d2d2d;
  background-color: #fef4e9;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header matching your other pages */
.header {
  background: #542254;
  padding: 1rem 2rem;
  position: relative;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-left: 10rem;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
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

.location-main {
  margin-top: 2rem;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
}

.welcome-header {
  text-align: center;
  margin-bottom: 2rem;
  color: #542254;
}

.welcome-header h1 {
  font-family: 'Poppins', sans-serif;
  font-weight: 700;
  font-size: 2.5rem;
  color: #dd1b45;
  margin-bottom: 0.5rem;
}

.welcome-header p {
  font-size: 1.2rem;
  color: #542254;
  margin-bottom: 0;
}

.location-container {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
}

.location-header {
  margin-bottom: 2rem;
}

.location-header h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #542254;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
}

.location-header p {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1rem;
}

.location-icon {
  font-size: 3rem;
  color: #dd1b45;
  margin-bottom: 1rem;
}

.benefits {
  margin: 1.5rem 0;
  text-align: left;
  background: #fef4e9;
  padding: 1.5rem;
  border-radius: 10px;
  border: 1px solid rgba(221, 27, 69, 0.1);
}

.benefit {
  margin: 0.75rem 0;
  font-size: 0.95rem;
  color: #542254;
  font-weight: 500;
}

.location-button {
  background: linear-gradient(to right, #dd1b45, #fe741c);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin: 1rem 0.5rem;
  min-width: 150px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.location-button:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.location-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.manual-button {
  background: transparent;
  color: #dd1b45;
  border: 2px solid #dd1b45;
}

.manual-button:hover:not(:disabled) {
  background: #dd1b45;
  color: white;
  opacity: 1;
}

.status-message {
  margin: 1rem 0;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.status-loading {
  background: #e3f2fd;
  color: #1976d2;
  border-left: 4px solid #1976d2;
}

.status-success {
  background: #e8f5e8;
  color: #2e7d32;
  border-left: 4px solid #4caf50;
}

.status-error {
  background: #ffebee;
  color: #c62828;
  border-left: 4px solid #f44336;
}

.location-instructions {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: left;
}

.location-instructions h4 {
  margin: 0 0 1rem 0;
  color: #856404;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
}

.browser-instructions {
  margin: 1rem 0;
}

.instruction-item {
  margin: 0.75rem 0;
  padding: 0.5rem;
  background: white;
  border-radius: 4px;
  font-size: 0.9rem;
}

.instruction-note {
  margin: 1rem 0 0 0;
  font-style: italic;
  color: #856404;
  text-align: center;
}

.manual-input {
  margin-top: 1rem;
}

.input-group {
  margin: 1rem 0;
  text-align: left;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #542254;
}

.input-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-group input:focus {
  outline: none;
  border-color: #dd1b45;
}

.icon {
  width: 20px;
  height: 20px;
  fill: currentColor;
}
</style>