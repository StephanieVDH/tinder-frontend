<template>
  <div style="padding: 20px; background-color: #fef4e9;">
    <h1 style="color: #dd1b45;">Admin Dashboard</h1>
    <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
      <thead style="background-color: #dd1b45; color: white;">
        <tr>
          <th style="padding: 10px;">ID</th>
          <th style="padding: 10px;">Username</th>
          <th style="padding: 10px;">Email</th>
          <th style="padding: 10px;">Role</th>
          <th style="padding: 10px;">Active</th>
          <th style="padding: 10px;">Verified</th>
          <th style="padding: 10px;">Created At</th>
          <th style="padding: 10px;">Admin Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.ID" style="text-align: center; border-bottom: 1px solid #ccc;">
          <td style="padding: 10px;">{{ user.ID }}</td>
          <td style="padding: 10px;">{{ user.Username }}</td>
          <td style="padding: 10px;">{{ user.Email }}</td>
          <td style="padding: 10px;">{{ user.Role }}</td>
          <td style="padding: 10px;">{{ user.Active ? 'Yes' : 'No' }}</td>
          <td style="padding: 10px;">{{ user.Verified ? 'Yes' : 'No' }}</td>
          <td style="padding: 10px;">{{ formatDate(user.CreatedAt) }}</td>
          <td style="padding: 10px;">
            <div style="display: flex; gap: 8px; justify-content: center;">
              <button @click="toggleBan(user)" :style="banButtonStyle(user.Active)">
                {{ user.Active ? 'Ban' : 'Unban' }}
              </button>
              <button @click="toggleVerify(user)" :style="verifyButtonStyle(user.Verified)">
                {{ user.Verified ? 'Unverify' : 'Verify' }}
              </button>
              <button @click="confirmDelete(user)" :style="deleteButtonStyle()">
                Delete
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  data() {
    return {
      users: []
    };
  },
  created() {
    fetch('http://localhost:3000/api/admin/users')
      .then(res => res.json())
      .then(data => {
        this.users = data;
      })
      .catch(err => {
        console.error('Error fetching users:', err);
      });
  },
  methods: {
    formatDate(isoString) {
      const date = new Date(isoString);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    },
    toggleBan(user) {
      fetch(`http://localhost:3000/api/admin/users/${user.ID}/ban`, {
        method: 'PUT'
      })
        .then(res => res.json())
        .then(data => {
          user.Active = data.active;
        })
        .catch(err => {
          console.error('Ban error:', err);
        });
    },
    toggleVerify(user) {
      fetch(`http://localhost:3000/api/admin/users/${user.ID}/verify`, {
        method: 'PUT'
      })
        .then(res => res.json())
        .then(data => {
          user.Verified = data.verified;
        })
        .catch(err => {
          console.error('Verify error:', err);
        });
    },
    confirmDelete(user) {
      const confirmed = window.confirm(`Are you sure you want to delete user "${user.Username}"? This action cannot be undone.`);
      if (confirmed) {
        fetch(`http://localhost:3000/api/admin/users/${user.ID}`, {
          method: 'DELETE'
        })
          .then(res => res.json())
          .then(() => {
            this.users = this.users.filter(u => u.ID !== user.ID);
          })
          .catch(err => {
            console.error('Delete error:', err);
          });
      }
    },
    banButtonStyle(isActive) {
      return {
        backgroundColor: isActive ? '#dd1b45' : '#fe741c',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      };
    },
    verifyButtonStyle(isVerified) {
      return {
        backgroundColor: isVerified ? '#542254' : '#f54438',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      };
    },
    deleteButtonStyle() {
      return {
        backgroundColor: '#000000',
        color: 'white',
        padding: '5px 10px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      };
    }
  }
};
</script>

<style scoped>
table tr:nth-child(even) {
  background-color: #fef4e9;
}
table tr:hover {
  background-color: #fe741c;
  color: white;
}
</style>