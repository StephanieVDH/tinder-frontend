<template>
  <div class="register-page">
    <header class="header">
      <div class="logo">
        <div class="logo-icon">
          <img src="@/assets/logo.png" alt="Flare Logo" width="32" height="32" />
        </div>
        <span class="logo-text">Flare</span>
      </div>
    </header>

    <div class="register-main">
      <div class="register-content">
        <h1 class="register-title">Create Account</h1>
        <div class="register-card">
          <form @submit.prevent="registerUser" enctype="multipart/form-data">
            <div class="form-grid">
              <div class="form-group">
                <label for="firstName">First Name</label>
                <input id="firstName" v-model="firstName" type="text" required />
              </div>

              <div class="form-group">
                <label for="dob">Date of Birth</label>
                <input id="dob" v-model="dob" type="date" required />
              </div>

              <div class="form-group">
                <label for="gender">Gender</label>
                <select id="gender" v-model="gender" required>
                  <option disabled value="">Select an option</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Other</option>
                </select>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input id="email" v-model="email" type="email" required />
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input id="password" v-model="password" type="password" minlength="8" required />
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input id="confirmPassword" v-model="confirmPassword" type="password" minlength="8" required />
              </div>

              <!-- profile picture section -->
              <div class="form-group full-width">
                <label for="profilePicture">Add Profile Picture</label>
                <div class="picture-upload-container">
                  <input
                    id="profilePicture"
                    type="file"
                    @change="handleProfilePicture"
                    accept="image/*"
                    class="file-input"
                  />
                  <label for="profilePicture" class="file-label">
                    <div class="upload-area">
                      <div v-if="!profilePicturePreview" class="upload-placeholder">
                        <div class="upload-icon">📷</div>
                        <span>Choose profile picture</span>
                      </div>
                      <div v-else class="image-preview">
                        <img :src="profilePicturePreview" alt="Profile preview" />
                        <div class="change-overlay">
                          <span>Change picture</span>
                        </div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <button type="submit" class="full-width btn-primary">Register</button>
            </div>
          </form>
          
        </div>
          <p class="login-link">
            Already have an account? 
            <router-link to="/login">Log in</router-link>
          </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegisterPage',

  data() {
    return {
      firstName: '',
      dob: '',
      gender: '',
      email: '',
      password: '',
      confirmPassword: '',
      profilePicture: null,
      profilePicturePreview: null
    };
  },

  methods: {
    handleProfilePicture(event) {
      const file = event.target.files[0];
      if (file) {
        this.profilePicture = file;
        
        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profilePicturePreview = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    },

    async registerUser() {
      // Client-side password match check
      if (this.password !== this.confirmPassword) {
        return alert("Passwords don't match.");
      }

      const formData = new FormData();
      formData.append('firstName', this.firstName);
      formData.append('dob', this.dob);
      formData.append('gender', this.gender);
      formData.append('email', this.email);
      formData.append('password', this.password);
      
      // Append single profile picture if selected
      if (this.profilePicture) {
        formData.append('pictures', this.profilePicture);
      }

      try {
        const response = await fetch('http://localhost:3000/api/register', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          let errorMessage = 'Registration failed.';
          const errorData = await response.json().catch(() => null);
          if (errorData && errorData.error) {
            errorMessage = errorData.error;
          }
          throw new Error(errorMessage);
        }

        const data = await response.json();
        alert(data.message);
        this.$router.push('/login');
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    }
  }
};
</script>

<style scoped>
.register-page {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #fef4e9;
}

/* Header */
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

.register-main {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 3rem;
  padding-bottom: 2rem;
}

.register-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.register-title {
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2.5rem;
  color: #dd1b45;
  font-family: 'Arial', sans-serif;
  font-size: 2.5rem;
  font-weight: bold;
}

.register-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 450px;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.4rem;
  color: #542254;
  font-weight: bold;
  font-family: 'Arial', sans-serif;
}

input,
select {
  padding: 0.7rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  color: #1f1f2e;
  font-family: 'Arial', sans-serif;
}

input:focus,
select:focus {
  outline: none;
  border-color: #fe741c;
  box-shadow: 0 0 0 3px rgba(254, 116, 28, 0.3);
}

/* Profile picture upload styles */
.picture-upload-container {
  position: relative;
}

.file-input {
  display: none;
}

.file-label {
  display: block;
  cursor: pointer;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #fe741c;
  background-color: #fef9f5;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: #666;
}

.upload-icon {
  font-size: 2rem;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 6px;
}

.change-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 6px;
}

.image-preview:hover .change-overlay {
  opacity: 1;
}

.login-link {
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.9rem;
  font-family: 'Arial', sans-serif;
}

.login-link a {
  color: #f54438;
  text-decoration: none;
  font-weight: bold;
}

.login-link a:hover {
  text-decoration: underline;
}

.btn-primary {
  background: linear-gradient(to right, #dd1b45, #fe741c);
  color: white;
  border: none;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.btn-primary:hover {
  opacity: 0.9;
}

.full-width {
  width: 100%;
}
</style>