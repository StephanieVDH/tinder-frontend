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
<button @click="goToSwipe" class="nav-btn">Swipe</button>
<button @click="goToProfile" class="nav-btn">Profile</button>
<button @click="logout" class="nav-btn logout-btn">Logout</button>
</div>
</div>
</header>
<!-- Main Content -->
<div class="main-content">
<div class="matches-container">
<!-- Page Title -->
<div class="page-header">
<h1 class="page-title">
<svg width="28" height="28" fill="#DD1B45" viewBox="0 0 24 24">
<path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.04L12,21.35Z"/>
</svg>
 Your Matches
</h1>
<p class="match-count">{{ matches.length }} {{ matches.length === 1 ? 'match' : 'matches' }}</p>
</div>
<!-- Matches Tabs -->
<div class="matches-tabs">
<button
 @click="activeTab = 'matches'"
 :class="['tab-btn', { active: activeTab === 'matches' }]"
>
 Matches ({{ matches.length }})
</button>
<button
 @click="activeTab = 'conversations'"
 :class="['tab-btn', { active: activeTab === 'conversations' }]"
>
 Conversations ({{ conversationsCount }})
</button>
</div>
<!-- Matches Grid -->
<div v-if="activeTab === 'matches' && matches.length > 0" class="matches-grid">
<div
v-for="match in matches"
 :key="match.matchId"
 :class="['match-card', { verified: match.user.verified }]"
 @click="openProfileModal(match)"
>
<div class="match-image-container">
<img :src="match.user.picture" :alt="match.user.name" class="match-image" />
<!-- Verification border overlay for verified users -->
<div v-if="match.user.verified" class="verification-border"></div>
<div v-if="isNewMatch(match.matchDate)" class="new-badge">NEW</div>
</div>
<div class="match-info">
<div class="match-name-age">
<div class="name-container">
<span class="match-name">{{ match.user.name }}</span>
<!-- Verification badge -->
<div v-if="match.user.verified" class="verification-badge">
<svg width="12" height="12" viewBox="0 0 24 24" fill="white">
<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
</svg>
</div>
</div>
<span class="match-age">{{ calculateAge(match.user.dateOfBirth) }}</span>
</div>
</div>
</div>
</div>
<!-- Conversations List -->
<div v-else-if="activeTab === 'conversations'" class="conversations-list">
<div v-if="conversationsCount > 0" class="conversations-preview">
<svg width="64" height="64" fill="#DD1B45" opacity="0.3" viewBox="0 0 24 24">
<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
</svg>
<h3>You have {{ conversationsCount }} active conversation{{ conversationsCount !== 1 ? 's' : '' }}!</h3>
<p>Go to the full conversations page to chat with your matches.</p>
<button @click="goToConversations" class="btn-primary">View Conversations</button>
</div>
<div v-else class="coming-soon">
<svg width="64" height="64" fill="#DD1B45" opacity="0.3" viewBox="0 0 24 24">
<path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
</svg>
<h3>No conversations yet</h3>
<p>Start chatting with your matches to begin conversations!</p>
</div>
</div>
<!-- No Matches State -->
<div v-else-if="activeTab === 'matches' && matches.length === 0" class="no-matches">
<div class="no-matches-content">
<svg width="80" height="80" fill="#DD1B45" opacity="0.2" viewBox="0 0 24 24">
<path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5 2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.04L12,21.35Z"/>
</svg>
<h2>No matches yet</h2>
<p>Keep swiping to find your perfect match!</p>
<button @click="goToSwipe" class="btn-primary">Start Swiping</button>
</div>
</div>
</div>
</div>
<!-- Enhanced Profile Modal with Multiple Pictures -->
<div v-if="showProfileModal" class="modal-overlay" @click="closeProfileModal">
<div class="profile-modal" @click.stop>
<button class="modal-close" @click="closeProfileModal">&times;</button>
<div class="profile-image-container">
<img :src="currentModalPicture" :alt="selectedMatch?.user?.name" class="profile-image" @click="nextModalPicture" />

<!-- Navigation arrows for multiple pictures -->
<button 
v-if="modalAllPictures.length > 1" 
@click="previousModalPicture" 
class="modal-picture-nav modal-prev-btn"
:disabled="modalPictureIndex === 0"
>
<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
<path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
</svg>
</button>

<button 
v-if="modalAllPictures.length > 1" 
@click="nextModalPicture" 
class="modal-picture-nav modal-next-btn"
:disabled="modalPictureIndex === modalAllPictures.length - 1"
>
<svg width="24" height="24" viewBox="0 0 24 24" fill="white">
<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
</svg>
</button>

<!-- Verification border overlay for verified users in modal -->
<div v-if="selectedMatch?.user?.verified" class="modal-verification-border"></div>

<!-- Picture dots indicator -->
<div class="modal-picture-dots" v-if="modalAllPictures.length > 1">
<span 
v-for="(pic, index) in modalAllPictures" 
:key="index"
:class="['modal-dot', { active: index === modalPictureIndex }]"
@click="goToModalPicture(index)"
></span>
</div>

<!-- Picture counter -->
<div v-if="modalAllPictures.length > 1" class="modal-picture-counter">
{{ modalPictureIndex + 1 }} / {{ modalAllPictures.length }}
</div>
</div>
<div class="profile-details">
<div class="profile-name-age">
<div class="modal-name-container">
<span class="profile-name">{{ selectedMatch?.user?.name }}</span>
<!-- Verification badge in modal -->
<div v-if="selectedMatch?.user?.verified" class="modal-verification-badge">
<svg width="16" height="16" viewBox="0 0 24 24" fill="white">
<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
</svg>
</div>
</div>
<span class="profile-age">{{ calculateAge(selectedMatch?.user?.dateOfBirth) }}</span>
</div>
<!-- Distance Information -->
<div class="profile-distance">
<svg width="16" height="16" fill="#666" viewBox="0 0 24 24">
<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
</svg>
<span>{{ calculateDistance(selectedMatch?.user) }}</span>
</div>
<div class="profile-bio">
 {{ selectedMatch?.user?.bio || 'No bio available' }}
</div>
<div class="profile-actions">
<button class="action-btn message-btn" @click="openConversation">
 💬 Send Message
</button>
</div>
</div>
</div>
</div>
</div>
</template>

<script>
import { AuthService } from '@/auth.js';

export default {
name: 'MatchesPage',
data() {
return {
activeTab: 'matches',
matches: [],
conversationsCount: 0,
userId: null,
showProfileModal: false,
selectedMatch: null,
currentUserLocation: null,
modalPictureIndex: 0
 };
 },
computed: {
modalAllPictures() {
if (!this.selectedMatch) return [];

const pictures = [];

// Add profile picture first (if exists)
if (this.selectedMatch.user.picture) {
pictures.push(this.selectedMatch.user.picture);
}

// Add additional pictures
if (this.selectedMatch.user.additionalPictures && this.selectedMatch.user.additionalPictures.length > 0) {
pictures.push(...this.selectedMatch.user.additionalPictures);
}

return pictures;
},
currentModalPicture() {
if (this.modalAllPictures.length === 0) return '';
return this.modalAllPictures[this.modalPictureIndex] || this.modalAllPictures[0];
}
},
methods: {
// Modal picture navigation methods
nextModalPicture() {
if (this.modalPictureIndex < this.modalAllPictures.length - 1) {
this.modalPictureIndex++;
}
},

previousModalPicture() {
if (this.modalPictureIndex > 0) {
this.modalPictureIndex--;
}
},

goToModalPicture(index) {
if (index >= 0 && index < this.modalAllPictures.length) {
this.modalPictureIndex = index;
}
},

async fetchUserAdditionalPictures(userId) {
try {
const response = await fetch(`http://localhost:3000/api/pictures/${userId}`, {
headers: {
'Authorization': `Bearer ${this.userId}`
}
});

if (response.ok) {
const data = await response.json();
return data.pictures.map(pic => pic.url);
}
} catch (error) {
console.error('Failed to fetch additional pictures for user:', userId, error);
}
return [];
},

async fetchMatches() {
try {
this.userId = AuthService.getUserId();
if (!this.userId) {
this.$router.push({ name: 'login' });
return;
 }

// First get current user's location
await this.getCurrentUserLocation();

// Fetch matches
const matchesResponse = await fetch(`http://localhost:3000/api/matches/${this.userId}`, {
headers: {
'Authorization': `Bearer ${this.userId}`,
'Content-Type': 'application/json'
 }
 });
if (matchesResponse.status === 401) {
AuthService.logout();
this.$router.push({ name: 'login' });
return;
 }
if (!matchesResponse.ok) {
throw new Error('Failed to fetch matches');
 }
const matchesData = await matchesResponse.json();

// Debug logging to see the structure of matches data
console.log('Matches data from API:', matchesData);

for (let match of matchesData) {
  match.user.additionalPictures = await this.fetchUserAdditionalPictures(match.user.id);
}
this.matches = matchesData;
// Fetch conversations count
try {
const conversationsResponse = await fetch(`http://localhost:3000/api/conversations/${this.userId}`, {
headers: {
'Authorization': `Bearer ${this.userId}`,
'Content-Type': 'application/json'
 }
 });
if (conversationsResponse.ok) {
const conversationsData = await conversationsResponse.json();
// Count conversations that have messages
this.conversationsCount = conversationsData.filter(c => c.hasMessages).length;
 }
 } catch (convErr) {
console.error('Error fetching conversations count:', convErr);
this.conversationsCount = 0;
 }
 } catch (err) {
console.error('Error fetching matches:', err);
 }
 },

async getCurrentUserLocation() {
try {
const response = await fetch(`http://localhost:3000/api/profile/${this.userId}`, {
headers: {
'Authorization': `Bearer ${this.userId}`,
'Content-Type': 'application/json'
 }
 });
if (response.ok) {
const data = await response.json();
this.currentUserLocation = {
latitude: data.profile.Latitude,
longitude: data.profile.Longitude
 };
 }
 } catch (err) {
console.error('Error fetching current user location:', err);
 }
 },

calculateDistance(user) {
// If no location data available for either user
if (!this.currentUserLocation || 
!this.currentUserLocation.latitude || 
!this.currentUserLocation.longitude ||
!user.latitude || 
!user.longitude) {
return 'Distance unavailable';
 }

// Haversine formula to calculate distance between two points
const R = 6371; // Earth's radius in kilometers
const dLat = this.toRadians(user.latitude - this.currentUserLocation.latitude);
const dLon = this.toRadians(user.longitude - this.currentUserLocation.longitude);
const lat1 = this.toRadians(this.currentUserLocation.latitude);
const lat2 = this.toRadians(user.latitude);

const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const distance = R * c;

// Round to 1 decimal place and return with unit
if (distance < 1) {
return `${Math.round(distance * 1000)} meters away`;
 } else if (distance < 10) {
return `${distance.toFixed(1)} km away`;
 } else {
return `${Math.round(distance)} km away`;
 }
 },

toRadians(degrees) {
return degrees * (Math.PI / 180);
 },

formatDate(dateString) {
const date = new Date(dateString);
const now = new Date();
const diffTime = Math.abs(now - date);
const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
const diffMinutes = Math.floor(diffTime / (1000 * 60));
if (diffMinutes < 60) {
return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
 } else if (diffHours < 24) {
return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
 } else if (diffDays < 7) {
return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
 } else if (diffDays < 30) {
const weeks = Math.floor(diffDays / 7);
return `${weeks} week${weeks !== 1 ? 's' : ''} ago`;
 } else {
return date.toLocaleDateString();
 }
 },
isNewMatch(dateString) {
const date = new Date(dateString);
const now = new Date();
const diffTime = Math.abs(now - date);
const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
return diffHours < 24; // Show "NEW" badge for matches less than 24 hours old
 },
calculateAge(dateOfBirth) {
if (!dateOfBirth) return 25; // Default age if not available
const birth = new Date(dateOfBirth);
const today = new Date();
let age = today.getFullYear() - birth.getFullYear();
const monthDiff = today.getMonth() - birth.getMonth();
if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
age--;
 }
return age;
 },
openProfileModal(match) {
this.selectedMatch = match;
this.modalPictureIndex = 0; // Reset picture index when opening modal
this.showProfileModal = true;
document.body.style.overflow = 'hidden'; // Prevent background scrolling
 },
closeProfileModal() {
this.showProfileModal = false;
this.selectedMatch = null;
this.modalPictureIndex = 0; // Reset picture index when closing modal
document.body.style.overflow = 'auto'; // Restore scrolling
 },
async openConversation() {
if (!this.selectedMatch) {
console.error('No selected match');
return;
}

// Debug logging to see the structure
console.log('Selected match:', this.selectedMatch);
console.log('Match ID:', this.selectedMatch.matchId);

// Extract the matchId and user data properly, handling Vue reactivity
const matchId = this.selectedMatch.matchId;
const userData = this.selectedMatch.user;
console.log('Extracted matchId:', matchId);
console.log('Extracted userData:', userData);

// Check if matchId exists and is valid
if (!matchId || matchId === null || matchId === undefined) {
console.error('Match ID is missing or invalid:', matchId);
alert('Unable to start conversation: Match ID is missing. Please try again.');
return;
}

// Check if user data exists
if (!userData || !userData.name) {
console.error('User data is missing or invalid:', userData);
alert('Unable to start conversation: User data is missing. Please try again.');
return;
}

try {
// Get or create conversation for this match
const response = await fetch(`http://localhost:3000/api/matches/${matchId}/conversation`, {
headers: {
'Authorization': `Bearer ${this.userId}`,
'Content-Type': 'application/json'
 }
 });
 
console.log('Conversation API response status:', response.status);

if (!response.ok) {
const errorText = await response.text();
console.error('API Error:', errorText);
throw new Error(`Failed to get conversation: ${response.status}`);
 }
 
const data = await response.json();
console.log('Conversation data:', data);

// Close modal and navigate to conversations page
this.closeProfileModal();
this.$router.push({
name: 'conversations',
params: { 
conversationId: data.conversationId 
},
query: {
matchId: matchId,
matchName: userData.name,
autoOpen: 'true'
 }
 });
 } catch (err) {
console.error('Error getting conversation:', err);
alert('Failed to start conversation. Please try again.');
 }
 },
goToSwipe() {
this.$router.push({ name: 'swipe' });
 },
goToProfile() {
this.$router.push({ name: 'profile' });
 },
goToConversations() {
this.$router.push({ name: 'conversations' });
 },
logout() {
AuthService.logout();
this.$router.push({ name: 'login' });
 }
 },
mounted() {
// Check authentication before loading matches
if (!AuthService.isLoggedIn()) {
this.$router.push({ name: 'login' });
return;
 }
this.fetchMatches();
 },
beforeRouteEnter(to, from, next) {
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
.matches-container {
max-width: 1200px;
width: 100%;
}
/* Page Header */
.page-header {
background: white;
border-radius: 20px;
padding: 2rem;
margin-bottom: 2rem;
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}
.page-title {
display: flex;
align-items: center;
gap: 0.75rem;
font-family: 'Poppins', sans-serif;
font-weight: 700;
font-size: 2rem;
color: #1F1F2E;
margin-bottom: 0.5rem;
}
.match-count {
color: #666;
font-size: 1.1rem;
margin-left: 2.5rem;
}
/* Tabs */
.matches-tabs {
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
/* Matches Grid - Updated for smaller cards */
.matches-grid {
display: grid;
grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
gap: 15px;
}
.match-card {
background: white;
border-radius: 15px;
overflow: hidden;
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
cursor: pointer;
transition: all 0.3s ease;
position: relative;
}
.match-card:hover {
transform: translateY(-5px);
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
/* Enhanced styling for verified match cards */
.match-card.verified {
background: linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%);
border: 2px solid #FFD700;
box-shadow: 0 4px 16px rgba(255, 215, 0, 0.2), 0 8px 32px rgba(0, 0, 0, 0.1);
}
.match-card.verified:hover {
box-shadow: 0 6px 24px rgba(255, 215, 0, 0.3), 0 12px 48px rgba(0, 0, 0, 0.15);
transform: translateY(-6px);
}
.match-image-container {
position: relative;
width: 100%;
height: 180px;
overflow: hidden;
}
.match-image {
width: 100%;
height: 100%;
object-fit: cover;
transition: transform 0.3s ease;
}
.match-card:hover .match-image {
transform: scale(1.05);
}
/* Verification border overlay for match cards */
.verification-border {
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
border: 2px solid #FFD700;
box-shadow: inset 0 0 0 1px white, 0 0 10px rgba(255, 215, 0, 0.4);
pointer-events: none;
}
.new-badge {
position: absolute;
top: 10px;
right: 10px;
background: linear-gradient(135deg, #dd1b45, #f54438);
color: white;
padding: 0.25rem 0.5rem;
border-radius: 12px;
font-size: 0.7rem;
font-weight: 700;
box-shadow: 0 2px 8px rgba(221, 27, 69, 0.4);
}
.match-info {
padding: 15px;
text-align: center;
}
.match-name-age {
display: flex;
justify-content: center;
align-items: center;
gap: 8px;
flex-wrap: wrap;
}
.name-container {
display: flex;
align-items: center;
gap: 4px;
}
.match-name {
font-size: 1.1rem;
font-weight: bold;
color: #333;
}
/* Special styling for verified user names in match cards */
.match-card.verified .match-name {
color: #B8860B;
font-weight: 700;
}
.match-age {
font-size: 0.9rem;
color: #666;
background: #f1f2f6;
padding: 2px 8px;
border-radius: 12px;
}
.match-card.verified .match-age {
background: #FFF8DC;
color: #B8860B;
}
/* Verification badge for match cards */
.verification-badge {
width: 16px;
height: 16px;
background: linear-gradient(45deg, #FFD700, #FFA500);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
box-shadow: 0 0 6px rgba(255, 215, 0, 0.5);
flex-shrink: 0;
}

/* Modal Styles */
.modal-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background: rgba(0, 0, 0, 0.7);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
opacity: 1;
visibility: visible;
transition: all 0.3s ease;
}

.profile-modal {
background: white;
border-radius: 20px;
max-width: 600px;
width: 90%;
max-height: 90vh;
overflow-y: auto;
position: relative;
transform: scale(1);
transition: transform 0.3s ease;
}

.modal-close {
position: absolute;
top: 20px;
right: 20px;
background: rgba(255, 255, 255, 0.9);
border: none;
border-radius: 50%;
width: 40px;
height: 40px;
cursor: pointer;
font-size: 1.5rem;
color: #333;
z-index: 20;
transition: all 0.3s ease;
}

.modal-close:hover {
background: white;
transform: scale(1.1);
}

.profile-image-container {
position: relative;
height: 400px;
overflow: hidden;
border-radius: 20px 20px 0 0;
}

.profile-image {
width: 100%;
height: 100%;
object-fit: cover;
cursor: pointer;
transition: all 0.2s ease;
}

.profile-image:hover {
transform: scale(1.02);
}

/* Modal Picture Navigation Arrows */
.modal-picture-nav {
position: absolute;
top: 50%;
transform: translateY(-50%);
background: rgba(0, 0, 0, 0.6);
border: none;
border-radius: 50%;
width: 50px;
height: 50px;
display: flex;
align-items: center;
justify-content: center;
cursor: pointer;
transition: all 0.2s ease;
opacity: 0;
z-index: 15;
}

.profile-image-container:hover .modal-picture-nav {
opacity: 1;
}

.modal-prev-btn {
left: 15px;
}

.modal-next-btn {
right: 15px;
}

.modal-picture-nav:hover:not(:disabled) {
background: rgba(0, 0, 0, 0.8);
transform: translateY(-50%) scale(1.1);
}

.modal-picture-nav:disabled {
opacity: 0.3;
cursor: not-allowed;
}

/* Verification border overlay for modal */
.modal-verification-border {
position: absolute;
top: 0;
left: 0;
right: 0;
bottom: 0;
border: 3px solid #FFD700;
border-radius: 20px 20px 0 0;
box-shadow: inset 0 0 0 2px white, 0 0 15px rgba(255, 215, 0, 0.4);
pointer-events: none;
}

/* Modal Picture Dots */
.modal-picture-dots {
position: absolute;
bottom: 20px;
left: 50%;
transform: translateX(-50%);
display: flex;
gap: 10px;
background: rgba(0, 0, 0, 0.6);
padding: 10px 15px;
border-radius: 25px;
z-index: 15;
}

.modal-dot {
width: 10px;
height: 10px;
border-radius: 50%;
background: rgba(255, 255, 255, 0.5);
cursor: pointer;
transition: all 0.2s ease;
}

.modal-dot.active {
background: white;
transform: scale(1.4);
}

.modal-dot:hover {
background: rgba(255, 255, 255, 0.8);
transform: scale(1.2);
}

/* Modal Picture Counter */
.modal-picture-counter {
position: absolute;
top: 20px;
left: 20px;
background: rgba(0, 0, 0, 0.7);
color: white;
padding: 6px 12px;
border-radius: 15px;
font-size: 0.9rem;
font-weight: 500;
z-index: 15;
}

.profile-details {
padding: 30px;
}

.profile-name-age {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 15px;
gap: 10px;
}

.modal-name-container {
display: flex;
align-items: center;
gap: 8px;
}

.profile-name {
font-size: 2rem;
font-weight: bold;
color: #333;
}

.profile-age {
font-size: 1.5rem;
color: #666;
background: #f1f2f6;
padding: 5px 15px;
border-radius: 20px;
}

/* Verification badge for modal */
.modal-verification-badge {
width: 24px;
height: 24px;
background: linear-gradient(45deg, #FFD700, #FFA500);
border-radius: 50%;
display: flex;
align-items: center;
justify-content: center;
box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
flex-shrink: 0;
}

/* Distance information styling */
.profile-distance {
display: flex;
align-items: center;
gap: 8px;
margin-bottom: 20px;
padding: 12px 16px;
background: #f8f9fa;
border-radius: 12px;
border-left: 4px solid #007bff;
color: #666;
font-weight: 500;
}

.profile-bio {
color: #555;
font-size: 1rem;
line-height: 1.6;
margin-bottom: 25px;
padding: 20px;
background: #f8f9fa;
border-radius: 15px;
border-left: 4px solid #ff4757;
}

.profile-actions {
margin-top: 20px;
display: flex;
flex-direction: column;
gap: 10px;
}

.action-btn {
padding: 15px;
border: none;
border-radius: 10px;
font-size: 1rem;
font-weight: bold;
cursor: pointer;
transition: all 0.3s ease;
}

.message-btn {
background: #45b6fe;
color: white;
width: 100%;
}

.message-btn:hover {
background: #27a1ec;
transform: translateY(-2px);
}

/* Coming Soon / No Matches States */
.coming-soon,
.conversations-preview,
.no-matches {
background: white;
border-radius: 20px;
padding: 4rem 2rem;
text-align: center;
box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.coming-soon h3,
.conversations-preview h3,
.no-matches h2 {
font-family: 'Poppins', sans-serif;
font-weight: 600;
color: #1F1F2E;
margin: 1rem 0;
}

.coming-soon p,
.conversations-preview p,
.no-matches p {
color: #666;
margin-bottom: 2rem;
}

.btn-primary {
background: linear-gradient(135deg, #dd1b45, #f54438);
color: white;
border: none;
padding: 1rem 2rem;
border-radius: 12px;
font-weight: 600;
font-size: 1rem;
cursor: pointer;
transition: all 0.2s ease;
box-shadow: 0 4px 16px rgba(221, 27, 69, 0.3);
}

.btn-primary:hover {
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(221, 27, 69, 0.4);
}
</style>