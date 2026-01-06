import { ref } from 'vue';

// Mock Chat Service using LocalStorage for demo purposes (works across tabs)
class ChatService {
  constructor() {
    this.messages = ref([]);
    this.currentUser = null;
    
    // Listen for storage events to sync across tabs
    window.addEventListener('storage', (e) => {
      if (e.key === 'chat_messages') {
        this.loadMessages();
      }
    });
  }

  init(user) {
    this.currentUser = user;
    this.loadMessages();
  }

  loadMessages() {
    const stored = localStorage.getItem('chat_messages');
    if (stored) {
      this.messages.value = JSON.parse(stored);
    }
  }

  sendMessage(text, recipientId = null, type = 'text', mediaUrl = null) {
    const msg = {
      id: Date.now(),
      text,
      type,
      mediaUrl,
      senderId: this.currentUser.id,
      senderName: this.currentUser.name,
      timestamp: new Date().toISOString(),
      recipientId: recipientId,
      branch: 'الفرع الرئيسي' // Mock
    };

    const newMessages = [...this.messages.value, msg];
    this.messages.value = newMessages;
    localStorage.setItem('chat_messages', JSON.stringify(newMessages));
  }

  getMessages() {
    return this.messages;
  }
}

export const chatService = new ChatService();
