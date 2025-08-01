<template>
  <div class="register-page">
    <div class="register-card">
      <h1>Create Account</h1>
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
            <label for="city">City</label>
            <input id="city" v-model="city" type="text" required />
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
            <label for="phone">Phone Number</label>
            <input id="phone" v-model="phone" type="tel" />
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
</template>

<script>
export default {
  name: 'RegisterPage',

  data() {
    return {
      firstName: '',
      dob: '',
      city: '',
      gender: '',
      email: '',
      phone: '',
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
      formData.append('city', this.city);
      formData.append('gender', this.gender);
      formData.append('email', this.email);
      formData.append('phone', this.phone);
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
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  background: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
}

.register-card h1 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333333;
  font-size: 1.75rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.5rem;
  color: #555555;
  font-weight: 500;
}

input,
select {
  padding: 0.75rem;
  border: 1px solid #cccccc;
  border-radius: 6px;
  font-size: 1rem;
  color: #333333;
}

.btn-primary {
  background: linear-gradient(90deg, #ff5a5f 0%, #ff995e 100%);
  color: #ffffff;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: linear-gradient(90deg, #e04a55 0%, #e08454 100%);
}

.full-width {
  grid-column: 1 / -1;
}
</style>


