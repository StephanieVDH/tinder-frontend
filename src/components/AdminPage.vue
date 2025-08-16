<template>
  <div class="admin-container">
    <div class="card">
      <div class="header-section">
        <h1>Admin Dashboard</h1>
        <button @click="logout" class="btn logout">Log Out</button>
      </div>
      <div class="stats-grid">
        <div class="stat-card" v-for="(stat, key) in stats" :key="key">
          <span class="stat-number">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <div class="card">
      <div class="tabs">
        <button @click="activeTab = 'users'" :class="['tab-btn', { active: activeTab === 'users' }]">
          👥 Users
        </button>
        <button @click="activeTab = 'reports'" :class="['tab-btn', { active: activeTab === 'reports' }]">
          🚨 Reports <span v-if="pendingReports > 0" class="notification-badge">{{ pendingReports }}</span>
        </button>
      </div>
    </div>

    <!-- Users Tab -->
    <div v-if="activeTab === 'users'">
      <!-- Search and Filters -->
      <div class="card">
        <div class="search-bar">
          <input v-model="searchQuery" type="text" placeholder="Search users..." class="input">
          <button class="btn primary">🔍</button>
        </div>
        <div class="filters">
          <select v-model="filterRole" class="input">
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="admin">Admins</option>
          </select>
          <select v-model="filterStatus" class="input">
            <option value="">All Status</option>
            <option value="active">Active Only</option>
            <option value="banned">Banned Only</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>
          <button @click="clearFilters" class="btn secondary">Clear</button>
        </div>
      </div>

      <!-- Users Table -->
      <div class="card">
        <div class="table-header">
          <h2>User Management</h2>
        </div>
        
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th @click="sortBy('ID')" class="sortable">ID {{ getSortIcon('ID') }}</th>
                <th @click="sortBy('Username')" class="sortable">Name {{ getSortIcon('Username') }}</th>
                <th @click="sortBy('Email')" class="sortable">Email {{ getSortIcon('Email') }}</th>
                <th>Status</th>
                <th style="text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.ID" class="user-row">
                <td><img :src="getUserAvatar(user.ID)" class="avatar"></td>
                <td>{{ user.ID }}</td>
                <td>
                  <div class="user-info">
                    {{ user.Username }}
                    <span v-if="user.Verified" class="verified-star">⭐️</span>
                  </div>
                </td>
                <td>{{ user.Email }}</td>
                <td><span :class="['badge', 'status', user.Active ? 'active' : 'banned']">{{ user.Active ? 'Active' : 'Banned' }}</span></td>
                <td>
                  <div class="actions">
                    <button @click="toggleBan(user)" :class="['action-btn', user.Active ? 'ban' : 'unban']" :title="user.Active ? 'Ban' : 'Unban'">{{ user.Active ? 'Ban' : 'Unban' }}</button>
                    <button @click="toggleVerify(user)" :class="['action-btn', user.Verified ? 'unverify' : 'verify']" :title="user.Verified ? 'Unverify' : 'Verify'">{{ user.Verified ? 'Unverify' : 'Verify' }}</button>
                    <button @click="viewUserDetails(user)" class="action-btn view" title="View">View</button>
                    <button @click="confirmDelete(user)" class="action-btn delete" title="Delete">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Reports Tab -->
    <div v-if="activeTab === 'reports'">
      <div class="card">
        <div class="table-header">
          <h2>User Reports</h2>
        </div>
        
        <div class="table-wrapper">
          <table class="table">
            <thead>
              <tr>
                <th>Reporter</th>
                <th>Reported User</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Date</th>
                <th style="text-align: center;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="report in reports" :key="report.reportId" class="user-row">
                <td>{{ report.reporterName }}</td>
                <td>{{ report.reportedName }}</td>
                <td>{{ report.Reason }}</td>
                <td><span :class="['badge', 'status', report.Status.toLowerCase()]">{{ report.Status }}</span></td>
                <td>{{ formatDate(report.DateCreated) }}</td>
                <td>
                  <div class="actions">
                    <button v-if="report.Status === 'Pending'" @click="updateReport(report.reportId, 'Reviewed')" class="action-btn verify">Review</button>
                    <button v-if="report.Status === 'Pending'" @click="updateReport(report.reportId, 'Dismissed')" class="action-btn unverify">Dismiss</button>
                    <button @click="deleteReport(report.reportId)" class="action-btn delete">Delete</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="selectedUser" class="modal" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>User Details</h3>
          <button @click="closeModal" class="close-btn">×</button>
        </div>
        <div class="user-detail">
          <img :src="getUserAvatar(selectedUser.ID)" class="detail-avatar">
          <div>
            <h4>{{ selectedUser.Username }}</h4>
            <p>{{ selectedUser.Email }}</p>
            <div class="badges">
              <span :class="['badge', 'role', selectedUser.Role]">{{ selectedUser.Role }}</span>
              <span :class="['badge', 'status', selectedUser.Active ? 'active' : 'banned']">{{ selectedUser.Active ? 'Active' : 'Banned' }}</span>
              <span v-if="selectedUser.Verified" class="verified-star">⭐️</span>
            </div>
          </div>
        </div>
        <div class="detail-grid">
          <div class="detail-item"><strong>ID:</strong> {{ selectedUser.ID }}</div>
          <div class="detail-item"><strong>Joined:</strong> {{ formatDate(selectedUser.CreatedAt) }}</div>
          <div class="detail-item"><strong>Role:</strong> {{ selectedUser.Role }}</div>
          <div class="detail-item"><strong>Status:</strong> {{ selectedUser.Active ? 'Active' : 'Banned' }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminPage',
  data() {
    return {
      users: [],
      reports: [],
      searchQuery: '',
      filterRole: '',
      filterStatus: '',
      sortField: 'ID',
      sortDirection: 'asc',
      selectedUser: null,
      userAvatars: {},
      activeTab: 'users'
    };
  },
  computed: {
    stats() {
      return {
        total: { value: this.users.length, label: 'Total Users' },
        active: { value: this.users.filter(u => u.Active).length, label: 'Active Users' },
        verified: { value: this.users.filter(u => u.Verified).length, label: 'Verified' },
        banned: { value: this.users.filter(u => !u.Active).length, label: 'Banned' }
      };
    },
    pendingReports() {
      return this.reports.filter(r => r.Status === 'Pending').length;
    },
    filteredUsers() {
      return this.users.filter(user => {
        const search = !this.searchQuery || 
          user.Username.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.Email.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.ID.toString().includes(this.searchQuery);
        const role = !this.filterRole || user.Role === this.filterRole;
        const status = !this.filterStatus || 
          (this.filterStatus === 'active' && user.Active) ||
          (this.filterStatus === 'banned' && !user.Active) ||
          (this.filterStatus === 'verified' && user.Verified) ||
          (this.filterStatus === 'unverified' && !user.Verified);
        return search && role && status;
      }).sort((a, b) => {
        let [aVal, bVal] = [a[this.sortField], b[this.sortField]];
        if (this.sortField === 'CreatedAt') [aVal, bVal] = [new Date(aVal), new Date(bVal)];
        return (aVal < bVal ? -1 : aVal > bVal ? 1 : 0) * (this.sortDirection === 'asc' ? 1 : -1);
      });
    }
  },
  created() { 
    this.fetchUsers();
    this.fetchReports();
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await fetch('http://localhost:3000/api/admin/users');
        this.users = await response.json();
        for (const user of this.users) await this.fetchUserAvatar(user.ID);
      } catch (err) { console.error('Error fetching users:', err); }
    },
    async fetchReports() {
      try {
        const response = await fetch('http://localhost:3000/api/admin/reports');
        this.reports = await response.json();
      } catch (err) { console.error('Error fetching reports:', err); }
    },
    async fetchUserAvatar(userId) {
      try {
        const response = await fetch(`http://localhost:3000/api/profile/${userId}`);
        const data = await response.json();
        if (data.profilePictureUrl) this.$set(this.userAvatars, userId, data.profilePictureUrl);
      } catch (err) { console.error('Avatar error:', err); }
    },
    getUserAvatar(userId) { return this.userAvatars[userId]; },
    formatDate(iso) { return new Date(iso).toLocaleDateString('en-GB'); },
    sortBy(field) {
      if (this.sortField === field) this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
      else { this.sortField = field; this.sortDirection = 'asc'; }
    },
    getSortIcon(field) { return this.sortField === field ? (this.sortDirection === 'asc' ? '↑' : '↓') : ''; },
    clearFilters() { this.searchQuery = this.filterRole = this.filterStatus = ''; },
    async toggleBan(user) {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${user.ID}/ban`, { method: 'PUT' });
        const data = await response.json();
        user.Active = data.active;
      } catch (err) { console.error('Ban error:', err); }
    },
    async toggleVerify(user) {
      try {
        const response = await fetch(`http://localhost:3000/api/admin/users/${user.ID}/verify`, { method: 'PUT' });
        const data = await response.json();
        user.Verified = data.verified;
      } catch (err) { console.error('Verify error:', err); }
    },
    confirmDelete(user) {
      if (confirm(`Delete user "${user.Username}"? This cannot be undone.`)) this.deleteUser(user);
    },
    async deleteUser(user) {
      try {
        await fetch(`http://localhost:3000/api/admin/users/${user.ID}`, { method: 'DELETE' });
        this.users = this.users.filter(u => u.ID !== user.ID);
      } catch (err) { console.error('Delete error:', err); }
    },
    async updateReport(reportId, status) {
      try {
        await fetch(`http://localhost:3000/api/admin/reports/${reportId}/status`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, adminId: 1 })
        });
        const report = this.reports.find(r => r.reportId === reportId);
        if (report) report.Status = status;
      } catch (err) { console.error('Update report error:', err); }
    },
    async deleteReport(reportId) {
      if (confirm('Delete this report?')) {
        try {
          await fetch(`http://localhost:3000/api/admin/reports/${reportId}`, { method: 'DELETE' });
          this.reports = this.reports.filter(r => r.reportId !== reportId);
        } catch (err) { console.error('Delete report error:', err); }
      }
    },
    viewUserDetails(user) { this.selectedUser = user; },
    closeModal() { this.selectedUser = null; },
    logout() {
      if (confirm('Are you sure you want to log out?')) {
        localStorage.clear();
        this.$router.push('/');
      }
    }
  }
};
</script>

<style scoped>
* { box-sizing: border-box; }

.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #fef4e9 0%, #fee2e2 50%, #fef4e9 100%);
  min-height: 100vh;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Cards */
.card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  margin-bottom: 25px;
  box-shadow: 0 8px 25px rgba(221, 27, 69, 0.1);
}

/* Typography */
h1, h2, h3 { color: #dd1b45; margin: 0; }
h1 { font-size: 2.5rem; }
h2 { font-size: 1.5rem; }

/* Tabs */
.tabs {
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #fed7d7;
  margin-bottom: 0;
  padding-bottom: 0;
}

.tab-btn {
  padding: 12px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #718096;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  position: relative;
}

.tab-btn.active {
  color: #dd1b45;
  border-bottom-color: #dd1b45;
}

.tab-btn:hover {
  color: #dd1b45;
  background: linear-gradient(135deg, #fef4e9 0%, #fed7d7 100%);
}

.notification-badge {
  background: #e53e3e;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: 8px;
  font-weight: bold;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: linear-gradient(135deg, #dd1b45 0%, #fe741c 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  transition: transform 0.2s;
}

.stat-card:hover { transform: translateY(-2px); }

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 5px;
}

.stat-label { font-size: 0.9rem; opacity: 0.9; }

/* Forms */
.search-bar, .filters { display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap; }
.search-bar .input { flex: 1; }

.input {
  padding: 12px 16px;
  border: 2px solid #fed7d7;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.input:focus {
  outline: none;
  border-color: #dd1b45;
  box-shadow: 0 0 0 3px rgba(221, 27, 69, 0.1);
}

/* Buttons */
.btn {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
  font-weight: 500;
}

.btn:hover { opacity: 0.9; transform: translateY(-1px); }
.btn.primary { background: linear-gradient(135deg, #dd1b45 0%, #fe741c 100%); color: white; }
.btn.secondary { background: #fe741c; color: white; }
.btn.logout { 
  background: #542254;
  color: white;
  box-shadow: 0 4px 12px rgba(74, 85, 104, 0.3);
}

.btn.logout:hover {
  background: #f54438;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(74, 85, 104, 0.4);
}

/* Table */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.table-wrapper { overflow-x: auto; }

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  background: linear-gradient(135deg, #fef4e9 0%, #fed7d7 100%);
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #dd1b45;
  border-bottom: 1px solid #fed7d7;
}

.table td {
  padding: 15px;
  border-bottom: 1px solid #fed7d7;
}

.sortable {
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
}

.sortable:hover { background: linear-gradient(135deg, #fed7d7 0%, #fbb6ce 100%); }

.user-row { transition: background 0.2s; }
.user-row:hover { background: linear-gradient(135deg, #fef4e9 0%, #fed7d7 30%); }

/* Avatar */
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fed7d7;
}

/* User Info */
.user-info { display: flex; align-items: center; gap: 8px; }

/* Badges */
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.badge.role.admin { background: linear-gradient(135deg, #dd1b45 0%, #fe741c 100%); }
.badge.role.user { background: linear-gradient(135deg, #fe741c 0%, #f6ad55 100%); }
.badge.status.active { background: linear-gradient(135deg, #48bb78 0%, #68d391 100%); }
.badge.status.banned { background: linear-gradient(135deg, #e53e3e 0%, #fc8181 100%); }
.badge.status.pending { background: linear-gradient(135deg, #e53e3e 0%, #fc8181 100%); }
.badge.status.reviewed { background: linear-gradient(135deg, #48bb78 0%, #68d391 100%); }
.badge.status.dismissed { background: linear-gradient(135deg, #718096 0%, #a0aec0 100%); }

/* Verified Star */
.verified-star {
  font-size: 16px;
  margin-left: 5px;
}

/* Actions */
.actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: right; }

.action-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s;
  white-space: nowrap;
  min-width: 60px;
}

.action-btn:hover { opacity: 0.8; transform: scale(1.05); }

.action-btn.ban { background: linear-gradient(135deg, #e53e3e 0%, #fc8181 100%); color: white; }
.action-btn.unban { background: linear-gradient(135deg, #48bb78 0%, #68d391 100%); color: white; }
.action-btn.verify { background: linear-gradient(135deg, #fe741c 0%, #f6ad55 100%); color: white; }
.action-btn.unverify { background: linear-gradient(135deg, #dd1b45 0%, #f56565 100%); color: white; }
.action-btn.view { background: linear-gradient(135deg, #718096 0%, #a0aec0 100%); color: white; }
.action-btn.delete { background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); color: white; }

/* Modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(221, 27, 69, 0.4);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 2px solid #fed7d7;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #dd1b45;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.close-btn:hover { background: #fed7d7; }

.user-detail {
  display: flex;
  gap: 20px;
  align-items: center;
  margin-bottom: 25px;
}

.detail-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #dd1b45;
}

.badges { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 10px; }

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.detail-item {
  padding: 15px;
  background: linear-gradient(135deg, #fef4e9 0%, #fed7d7 100%);
  border-radius: 8px;
  border-left: 4px solid #dd1b45;
  transition: transform 0.2s;
}

.detail-item:hover { transform: translateY(-1px); }
</style>