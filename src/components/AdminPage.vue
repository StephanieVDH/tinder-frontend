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