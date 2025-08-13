<template>
  <div class="page-container">
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
          <button @click="goToMatches" class="nav-btn">Matches</button>
          <button @click="goToProfile" class="nav-btn">Profile</button>
          <button @click="logout" class="nav-btn logout-btn">Logout</button>
        </div>
      </div>
    </header>

    <!-- Main Chat Container -->
    <div class="chat-container">
      
      <!-- Conversations Sidebar -->
      <div class="conversations-sidebar" :class="{ 'mobile-hidden': selectedConversation && isMobile }">
        <div class="sidebar-header">
          <h2>Messages</h2>
          <span class="conversation-count">{{ conversations.length }}</span>
        </div>
        
        <div class="conversations-list">
          <div v-if="loadingConversations" class="loading-conversations">
            <div class="spinner"></div>
            <p>Loading conversations...</p>
          </div>
          
          <div v-else-if="conversations.length === 0" class="no-conversations">
            <svg width="48" height="48" fill="#DD1B45" opacity="0.3" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
            </svg>
            <p>No conversations yet</p>
            <small>Match with someone to start chatting!</small>
          </div>
          
          <template v-else>
            <div 
              v-for="conversation in conversations" 
              :key="conversation.conversationId"
              class="conversation-item"
              :class="{ active: selectedConversation?.conversationId === conversation.conversationId }"
              @click="selectConversation(conversation)"
            >
              <img :src="conversation.otherUser.picture" :alt="conversation.otherUser.name" class="conversation-avatar" />
              <div class="conversation-info">
                <div class="conversation-header">
                  <h4>{{ conversation.otherUser.name }}</h4>
                  <span class="conversation-time">{{ formatTime(conversation.lastMessageTime) }}</span>
                </div>
                <p class="last-message" v-if="conversation.lastMessage">
                  <span v-if="conversation.lastMessageSender === userId">You: </span>
                  {{ truncateMessage(conversation.lastMessage) }}
                </p>
                <p class="last-message no-messages" v-else>Start a conversation!</p>
              </div>
              <div v-if="conversation.unreadCount > 0" class="unread-badge">
                {{ conversation.unreadCount }}
              </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Chat Area -->
      <div class="chat-area" v-if="selectedConversation">
        <!-- Chat Header -->
        <div class="chat-header">
          <button v-if="isMobile" @click="selectedConversation = null" class="back-btn">
            <svg width="24" height="24" fill="#666" viewBox="0 0 24 24">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <img :src="selectedConversation.otherUser.picture" :alt="selectedConversation.otherUser.name" class="chat-header-avatar" />
          <div class="chat-header-info">
            <h3>{{ selectedConversation.otherUser.name }}</h3>
          </div>
          <!-- Report and Block buttons -->
          <div class="chat-header-actions">
            <button @click="openReportModal" class="header-action-btn report-btn" title="Report User">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.47 21h15.06c1.54 0 2.5-1.67 1.73-3L13.73 4.99c-.77-1.33-2.69-1.33-3.46 0L2.74 18c-.77 1.33.19 3 1.73 3zM12 14c-.55 0-1-.45-1-1v-2c0-.55.45-1 1-1s1 .45 1 1v2c0 .55-.45 1-1 1zm1 4h-2v-2h2v2z"/>
              </svg>
            </button>
            <button @click="openBlockModal" class="header-action-btn block-btn" title="Block User">
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Messages Area -->
        <div class="messages-area" ref="messagesContainer">
          <div v-if="loadingMessages" class="loading-messages">
            <div class="spinner"></div>
          </div>
          
          <div v-else-if="messages.length === 0" class="no-messages-yet">
            <img :src="selectedConversation.otherUser.picture" :alt="selectedConversation.otherUser.name" class="match-avatar" />
            <h3>You matched with {{ selectedConversation.otherUser.name }}!</h3>
            <p>Say hello and start a conversation 👋</p>
          </div>
          
          <div v-else class="messages-list">
            <div 
              v-for="(message, index) in messages" 
              :key="message.messageId"
              class="message-wrapper"
              :class="{ 'own-message': message.senderId === userId }"
            >
              <!-- Show date separator if it's a new day -->
              <div v-if="shouldShowDateSeparator(index)" class="date-separator">
                {{ formatDate(message.timestamp) }}
              </div>
              
              <div class="message">
                <div class="message-content">
                  {{ message.content }}
                </div>
                <span class="message-time">{{ formatMessageTime(message.timestamp) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Message Input -->
        <div class="message-input-container">
          <form @submit.prevent="sendMessage" class="message-form">
            <input 
              v-model="newMessage" 
              type="text" 
              placeholder="Type a message..." 
              class="message-input"
              :disabled="sendingMessage"
            />
            <button type="submit" class="send-btn" :disabled="!newMessage.trim() || sendingMessage">
              <svg width="24" height="24" fill="white" viewBox="0 0 24 24">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
              </svg>
            </button>
          </form>
        </div>
      </div>

      <!-- No Conversation Selected (Desktop) -->
      <div v-else-if="!isMobile" class="no-conversation-selected">
        <svg width="64" height="64" fill="#DD1B45" opacity="0.2" viewBox="0 0 24 24">
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
        </svg>
        <h2>Select a conversation</h2>
        <p>Choose a match from the left to start messaging</p>
      </div>
    </div>

    <!-- Action Modal (shared for Report and Block) -->
    <div v-if="showReportModal || showBlockModal" class="action-modal-overlay" @click="closeActionModal">
      <div class="action-modal" @click.stop>
        <div class="action-header">
          <h3>{{ modalTitle }}</h3>
          <button @click="closeActionModal" class="close-action-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        </div>
        <div class="action-content">
          <p>{{ modalDescription }}</p>
          <textarea
            v-if="showReportModal"
            v-model="reportReason"
            placeholder="Describe the issue (inappropriate behavior, fake profile, harassment, etc.)"
            class="action-textarea"
            rows="4"
          ></textarea>
          <div class="action-actions">
            <button @click="closeActionModal" class="cancel-action-btn">Cancel</button>
            <button
              @click="submitAction"
              class="submit-action-btn"
              :class="{ 'report-btn-style': showReportModal, 'block-btn-style': showBlockModal }"
              :disabled="(showReportModal && !reportReason.trim()) || isSubmittingAction"
            >
              {{ actionButtonText }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Report Success Notification -->
    <div v-if="showReportSuccess" class="success-notification">
      <div class="success-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#4CAF50">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        <h3>Report Submitted</h3>
        <p>Thank you for keeping our community safe. We'll review this report.</p>
      </div>
    </div>

    <!-- Block Success Notification -->
    <div v-if="showBlockSuccess" class="success-notification">
      <div class="success-content">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="#4CAF50">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        <h3>User Blocked</h3>
        <p>You have successfully blocked this user. They won't be able to contact you.</p>
      </div>
    </div>
  </div>
</template>

<script>
import { AuthService } from '@/auth.js';

export default {
  name: 'ConversationPage',
  data() {
    return {
      userId: null,
      conversations: [],
      selectedConversation: null,
      messages: [],
      newMessage: '',
      loadingConversations: true,
      loadingMessages: false,
      sendingMessage: false,
      isMobile: window.innerWidth < 768,
      refreshInterval: null,
      // Report and Block functionality
      showReportModal: false,
      showReportSuccess: false,
      showBlockModal: false,
      showBlockSuccess: false,
      reportReason: '',
      isSubmittingReport: false,
      isSubmittingBlock: false
    };
  },
  computed: {
    modalTitle() {
      if (this.showReportModal) {
        return `Report ${this.selectedConversation?.otherUser?.name}`;
      } else if (this.showBlockModal) {
        return `Block ${this.selectedConversation?.otherUser?.name}`;
      }
      return '';
    },
    modalDescription() {
      if (this.showReportModal) {
        return 'Please tell us why you\'re reporting this user:';
      } else if (this.showBlockModal) {
        return 'Are you sure you want to block this user? They won\'t be able to message you or see your profile.';
      }
      return '';
    },
    actionButtonText() {
      if (this.showReportModal) {
        return this.isSubmittingReport ? 'Reporting...' : 'Submit Report';
      } else if (this.showBlockModal) {
        return this.isSubmittingBlock ? 'Blocking...' : 'Block User';
      }
      return '';
    },
    isSubmittingAction() {
      return this.isSubmittingReport || this.isSubmittingBlock;
    }
  },
  methods: {
    async fetchConversations() {
      try {
        this.userId = AuthService.getUserId();
        if (!this.userId) {
          this.$router.push({ name: 'login' });
          return;
        }

        const response = await fetch(`http://localhost:3000/api/conversations/${this.userId}`, {
          headers: {
            'Authorization': `Bearer ${this.userId}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 401) {
          AuthService.logout();
          this.$router.push({ name: 'login' });
          return;
        }

        if (!response.ok) {
          throw new Error('Failed to fetch conversations');
        }

        const data = await response.json();
        this.conversations = data;
        
        // Auto-open conversation if specified in route params
        this.checkAndAutoOpenConversation();
        
      } catch (err) {
        console.error('Error fetching conversations:', err);
      } finally {
        this.loadingConversations = false;
      }
    },
    
    checkAndAutoOpenConversation() {
      // Check if we should auto-open a specific conversation
      if (this.$route.query.autoOpen === 'true' && this.$route.params.conversationId) {
        const conversationId = parseInt(this.$route.params.conversationId);
        console.log('Auto-opening conversation ID:', conversationId);
        
        // Find the conversation in the list
        const conversation = this.conversations.find(c => c.conversationId === conversationId);
        
        if (conversation) {
          console.log('Found conversation to auto-open:', conversation);
          this.$nextTick(() => {
            this.selectConversation(conversation);
          });
        } else {
          console.log('Conversation not found, available conversations:', this.conversations.map(c => c.conversationId));
        }
      }
    },
    
    async selectConversation(conversation) {
      this.selectedConversation = conversation;
      this.loadingMessages = true;
      
      try {
        const response = await fetch(
          `http://localhost:3000/api/conversations/${conversation.conversationId}/messages`,
          {
            headers: {
              'Authorization': `Bearer ${this.userId}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        this.messages = data;
        
        // Scroll to bottom after loading messages
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        
      } catch (err) {
        console.error('Error fetching messages:', err);
      } finally {
        this.loadingMessages = false;
      }
    },
    
    async sendMessage() {
      if (!this.newMessage.trim() || this.sendingMessage) return;
      
      this.sendingMessage = true;
      const messageContent = this.newMessage;
      this.newMessage = ''; // Clear input immediately for better UX
      
      try {
        const response = await fetch(
          `http://localhost:3000/api/conversations/${this.selectedConversation.conversationId}/messages`,
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.userId}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              senderId: this.userId,
              content: messageContent
            })
          }
        );

        if (!response.ok) {
          throw new Error('Failed to send message');
        }

        const result = await response.json();
        
        // Add the new message to the list
        this.messages.push(result.data);
        
        // Update last message in conversation list
        const convIndex = this.conversations.findIndex(
          c => c.conversationId === this.selectedConversation.conversationId
        );
        if (convIndex !== -1) {
          this.conversations[convIndex].lastMessage = messageContent;
          this.conversations[convIndex].lastMessageTime = result.data.timestamp;
          this.conversations[convIndex].lastMessageSender = this.userId;
          
          // Move conversation to top
          const updatedConv = this.conversations.splice(convIndex, 1)[0];
          this.conversations.unshift(updatedConv);
        }
        
        // Scroll to bottom
        this.$nextTick(() => {
          this.scrollToBottom();
        });
        
      } catch (err) {
        console.error('Error sending message:', err);
        this.newMessage = messageContent; // Restore message on error
        alert('Failed to send message. Please try again.');
      } finally {
        this.sendingMessage = false;
      }
    },
    
    scrollToBottom() {
      const container = this.$refs.messagesContainer;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    },
    
    truncateMessage(message) {
      if (!message) return '';
      if (message.length <= 50) return message;
      return message.substring(0, 50) + '...';
    },
    
    formatTime(timestamp) {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m`;
      if (diffHours < 24) return `${diffHours}h`;
      if (diffDays < 7) return `${diffDays}d`;
      
      return date.toLocaleDateString();
    },
    
    formatMessageTime(timestamp) {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    },
    
    formatDate(timestamp) {
      const date = new Date(timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      if (date.toDateString() === today.toDateString()) {
        return 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
      } else {
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    },
    
    shouldShowDateSeparator(index) {
      if (index === 0) return true;
      
      const currentMsg = this.messages[index];
      const prevMsg = this.messages[index - 1];
      
      const currentDate = new Date(currentMsg.timestamp).toDateString();
      const prevDate = new Date(prevMsg.timestamp).toDateString();
      
      return currentDate !== prevDate;
    },
    
    handleResize() {
      this.isMobile = window.innerWidth < 768;
    },
    
    // Auto-refresh messages every 5 seconds
    startAutoRefresh() {
      this.refreshInterval = setInterval(() => {
        if (this.selectedConversation) {
          this.refreshMessages();
        }
      }, 5000);
    },
    
    async refreshMessages() {
      if (!this.selectedConversation) return;
      
      try {
        const response = await fetch(
          `http://localhost:3000/api/conversations/${this.selectedConversation.conversationId}/messages`,
          {
            headers: {
              'Authorization': `Bearer ${this.userId}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          const oldLength = this.messages.length;
          this.messages = data;
          
          // Scroll to bottom if new messages were added
          if (data.length > oldLength) {
            this.$nextTick(() => {
              this.scrollToBottom();
            });
          }
        }
      } catch (err) {
        console.error('Error refreshing messages:', err);
      }
    },
    
    goToSwipe() {
      this.$router.push({ name: 'swipe' });
    },
    
    goToMatches() {
      this.$router.push({ name: 'matches' });
    },
    
    goToProfile() {
      this.$router.push({ name: 'profile' });
    },
    
    logout() {
      AuthService.logout();
      this.$router.push({ name: 'login' });
    },

    // Report and Block functionality methods
    openReportModal() {
      if (!this.selectedConversation) return;
      this.showReportModal = true;
      this.reportReason = '';
    },

    closeReportModal() {
      this.showReportModal = false;
      this.reportReason = '';
      this.isSubmittingReport = false;
    },

    async submitReport() {
      if (!this.reportReason.trim() || !this.selectedConversation || this.isSubmittingReport) return;
      
      this.isSubmittingReport = true;
      try {
        const response = await fetch('http://localhost:3000/api/report', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.userId}`
          },
          body: JSON.stringify({
            reporterID: this.userId,
            reportedID: this.selectedConversation.otherUser.id,
            reason: this.reportReason.trim()
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to submit report');
        }

        // Show success notification
        this.closeReportModal();
        this.showReportSuccess = true;
        
        // Auto-hide success notification after 3 seconds
        setTimeout(() => {
          this.showReportSuccess = false;
        }, 3000);

      } catch (error) {
        console.error('Failed to submit report:', error);
        alert('Failed to submit report: ' + error.message);
      } finally {
        this.isSubmittingReport = false;
      }
    },

    openBlockModal() {
      if (!this.selectedConversation) return;
      this.showBlockModal = true;
    },

    closeBlockModal() {
      this.showBlockModal = false;
      this.isSubmittingBlock = false;
    },

    async submitBlock() {
      if (!this.selectedConversation || this.isSubmittingBlock) return;
      
      this.isSubmittingBlock = true;
      try {
        const response = await fetch('http://localhost:3000/api/block', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.userId}`
          },
          body: JSON.stringify({
            blockerID: this.userId,
            blockedID: this.selectedConversation.otherUser.id,
            reason: 'User blocked from conversation'
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to block user');
        }

        // Show success notification
        this.closeBlockModal();
        this.showBlockSuccess = true;

        // Remove the conversation from the list
        this.conversations = this.conversations.filter(
          conv => conv.otherUser.id !== this.selectedConversation.otherUser.id
        );

        // Clear selected conversation
        this.selectedConversation = null;
        this.messages = [];

        // Auto-hide success notification after 3 seconds
        setTimeout(() => {
          this.showBlockSuccess = false;
        }, 3000);

      } catch (error) {
        console.error('Failed to block user:', error);
        alert('Failed to block user: ' + error.message);
      } finally {
        this.isSubmittingBlock = false;
      }
    },

    // Shared modal methods
    closeActionModal() {
      if (this.showReportModal) {
        this.closeReportModal();
      } else if (this.showBlockModal) {
        this.closeBlockModal();
      }
    },

    async submitAction() {
      if (this.showReportModal) {
        await this.submitReport();
      } else if (this.showBlockModal) {
        await this.submitBlock();
      }
    }
  },
  
  mounted() {
    // Check authentication
    if (!AuthService.isLoggedIn()) {
      this.$router.push({ name: 'login' });
      return;
    }
    
    this.fetchConversations();
    this.startAutoRefresh();
    window.addEventListener('resize', this.handleResize);
  },
  
  beforeDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    window.removeEventListener('resize', this.handleResize);
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Header */
.header {
  background: #542254;
  padding: 1rem 0;
  position: relative;
  z-index: 100;
  flex-shrink: 0;
}

.nav-container {
  max-width: 1400px;
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

/* Chat Container */
.chat-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  background: white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Conversations Sidebar */
.conversations-sidebar {
  width: 380px;
  border-right: 1px solid #e1e5e9;
  display: flex;
  flex-direction: column;
  background: white;
}

.sidebar-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.sidebar-header h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  font-size: 1.5rem;
  color: #1F1F2E;
}

.conversation-count {
  background: linear-gradient(135deg, #dd1b45, #f54438);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.conversations-list {
  flex: 1;
  overflow-y: auto;
}

.loading-conversations,
.no-conversations {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  text-align: center;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(221, 27, 69, 0.1);
  border-top-color: #dd1b45;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.conversation-item {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  cursor: pointer;
  transition: background 0.2s ease;
  position: relative;
}

.conversation-item:hover {
  background: #f8f9fa;
}

.conversation-item.active {
  background: linear-gradient(90deg, rgba(221, 27, 69, 0.1), transparent);
  border-left: 3px solid #dd1b45;
  padding-left: calc(1.5rem - 3px);
}

.conversation-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem;
}

.conversation-info {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
}

.conversation-info h4 {
  font-weight: 600;
  color: #1F1F2E;
  font-size: 1rem;
}

.conversation-time {
  font-size: 0.75rem;
  color: #999;
}

.last-message {
  color: #666;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.last-message.no-messages {
  color: #999;
  font-style: italic;
}

.unread-badge {
  position: absolute;
  right: 1.5rem;
  bottom: 1.5rem;
  background: #dd1b45;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Chat Area */
.chat-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e1e5e9;
  display: flex;
  align-items: center;
  gap: 1rem;
  background: white;
}

.chat-header-actions {
  margin-left: auto;
  display: flex;
  gap: 0.5rem;
}

.header-action-btn {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f9fa;
  color: #666;
}

.header-action-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-action-btn.report-btn:hover {
  background: #fff3cd;
  color: #856404;
}

.header-action-btn.block-btn:hover {
  background: #f8d7da;
  color: #721c24;
}

.back-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  margin-left: -0.5rem;
  border-radius: 50%;
  transition: background 0.2s ease;
}

.back-btn:hover {
  background: #f8f9fa;
}

.chat-header-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  object-fit: cover;
}

.chat-header-info h3 {
  font-weight: 600;
  color: #1F1F2E;
  font-size: 1.1rem;
  margin-bottom: 0.1rem;
}

/* Messages Area */
.messages-area {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
  background: #fafafa;
}

.loading-messages {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.no-messages-yet {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #666;
}

.match-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1.5rem;
  border: 4px solid rgba(221, 27, 69, 0.1);
}

.no-messages-yet h3 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #1F1F2E;
  margin-bottom: 0.5rem;
}

.messages-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.date-separator {
  text-align: center;
  color: #999;
  font-size: 0.85rem;
  margin: 1.5rem 0;
  position: relative;
}

.date-separator::before,
.date-separator::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 60px);
  height: 1px;
  background: #e1e5e9;
}

.date-separator::before {
  left: 0;
}

.date-separator::after {
  right: 0;
}

.message-wrapper {
  display: flex;
  margin-bottom: 0.5rem;
}

.message-wrapper.own-message {
  justify-content: flex-end;
}

.message {
  max-width: 70%;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.message-content {
  padding: 0.75rem 1rem;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.4;
}

.message-wrapper:not(.own-message) .message-content {
  background: white;
  color: #1F1F2E;
  border-bottom-left-radius: 4px;
}

.message-wrapper.own-message .message-content {
  background: linear-gradient(135deg, #dd1b45, #f54438);
  color: white;
  border-bottom-right-radius: 4px;
}

.message-time {
  font-size: 0.75rem;
  color: #999;
  padding: 0 0.5rem;
}

.message-wrapper.own-message .message-time {
  text-align: right;
}

/* Message Input */
.message-input-container {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e1e5e9;
  background: white;
}

.message-form {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.message-input {
  flex: 1;
  padding: 0.875rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.message-input:focus {
  border-color: #dd1b45;
}

.message-input:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.send-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #dd1b45, #f54438);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(221, 27, 69, 0.3);
}

.send-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(221, 27, 69, 0.4);
}

.send-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* No Conversation Selected */
.no-conversation-selected {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #666;
  text-align: center;
  padding: 2rem;
}

.no-conversation-selected h2 {
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #1F1F2E;
  margin: 1rem 0 0.5rem;
}

/* Action Modal Styles */
.action-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1500;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.action-modal {
  background: white;
  border-radius: 16px;
  padding: 0;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.action-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #eee;
  background: #f8f9fa;
}

.action-header h3 {
  color: #333;
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.close-action-btn {
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.close-action-btn:hover {
  background: #e9ecef;
  color: #333;
}

.action-content {
  padding: 2rem;
}

.action-content p {
  color: #555;
  margin-bottom: 1rem;
  font-size: 0.95rem;
}

.action-textarea {
  width: 100%;
  border: 2px solid #e9ecef;
  border-radius: 12px;
  padding: 1rem;
  font-size: 0.95rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  transition: border-color 0.2s ease;
  margin-bottom: 1.5rem;
}

.action-textarea:focus {
  outline: none;
  border-color: #dd1b45;
}

.action-textarea::placeholder {
  color: #999;
}

.action-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.cancel-action-btn {
  padding: 0.75rem 1.5rem;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  background: white;
  color: #6c757d;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-action-btn:hover {
  background: #f8f9fa;
  border-color: #adb5bd;
}

.submit-action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.submit-action-btn.report-btn-style {
  background: #dc3545;
}

.submit-action-btn.report-btn-style:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
}

.submit-action-btn.block-btn-style {
  background: #dc3545;
}

.submit-action-btn.block-btn-style:hover:not(:disabled) {
  background: #c82333;
  transform: translateY(-1px);
}

.submit-action-btn:disabled {
  background: #dee2e6;
  color: #6c757d;
  cursor: not-allowed;
  transform: none;
}

/* Success Notifications */
.success-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 16px;
  padding: 2rem;
  z-index: 1600;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  animation: successSlideIn 0.3s ease;
  text-align: center;
  max-width: 400px;
  width: 90%;
}

@keyframes successSlideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.success-content h3 {
  color: #333;
  margin: 1rem 0 0.5rem 0;
  font-size: 1.3rem;
}

.success-content p {
  color: #666;
  margin: 0;
  font-size: 0.95rem;
}
</style>