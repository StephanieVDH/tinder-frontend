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
  background: linear-gradient(135deg, #3E065F 0%, #D7263D  100%);
}

.register-card {
  background: #FFFFFF;
  padding: 2.5rem;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(31, 31, 46, 0.2);
  width: 100%;
  max-width: 520px;
}

.register-card h1 {
  text-align: center;
  margin-bottom: 2rem;
  color: #3E065F;
  font-family: 'Poppins', sans-serif;
  font-size: 2rem;
  font-weight: bold;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 0.4rem;
  color: #1F1F2E;
  font-weight: 600;
  font-family: 'Inter', sans-serif;
}

input,
select {
  padding: 0.7rem;
  border: 1px solid #D7263D;
  border-radius: 8px;
  font-size: 1rem;
  color: #1F1F2E;
  font-family: 'Inter', sans-serif;
}

input:focus,
select:focus {
  outline: none;
  border-color: #FFB400;
  box-shadow: 0 0 0 3px rgba(255, 180, 0, 0.3);
}

.btn-primary {
  background: #D7263D ;
  color: #FFFFFF;
  border: none;
  padding: 0.8rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.btn-primary:hover {
  transform: scale(1.03);
  box-shadow: 0 4px 12px rgba(215, 38, 61, 0.3);
}

.full-width {
  grid-column: 1 / -1;
}
</style>


