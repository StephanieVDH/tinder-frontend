<template>
  <div class="register-page">
        <div class="register-header">
      <div class="logo">🔥 Flare</div>
    </div>

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

          <div class="form-group full-width">
            <label for="pictures">Pictures</label>
            <input
              id="pictures"
              type="file"
              multiple
              @change="handleFiles"
              accept="image/*"
            />
          </div>

          <button type="submit" class="full-width btn-primary">Register</button>
        </div>
      </form>
    </div>
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
      pictures: []
    };
  },

  methods: {
    handleFiles(event) {
      this.pictures = Array.from(event.target.files);
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
      this.pictures.forEach(file => formData.append('pictures', file));

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

.register-header {
  background-color: #542254;
  color: white;
  padding: 1rem 2rem;
  font-size: 1.5rem;
  font-weight: bold;
}

.logo {
  display: inline-block;
}

.register-main {
  flex: 1;
  display: flex;
  justify-content: center; /* centers horizontally */
  align-items: flex-start; /* aligns near top */
  padding-top: 3rem;        /* space below header */
  padding-bottom: 2rem;
}

.register-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.register-title {
  text-align: center;
  margin-top: 2rem;
  margin-bottom: 2.5rem;  /* was 0.5rem */
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
  max-width: 420px;
}

.register-card h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #dd1b45;
  font-family: 'Arial', sans-serif;
  font-size: 2rem;
  font-weight: bold;
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


