<template>
  <div class="flex h-full bg-white rounded-lg shadow-lg overflow-hidden">
    <!-- Sidebar -->
    <div class="w-64 border-l bg-gray-50 flex flex-col">
      <!-- Active User Info -->
      <div class="p-4 border-b bg-white">
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
            {{ currentUser?.name.charAt(0) }}
          </div>
          <div class="overflow-hidden">
            <h3 class="font-bold text-gray-900 truncate">{{ currentUser?.name }}</h3>
            <p class="text-xs text-green-600 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full bg-green-500"></span>
              متصل
            </p>
          </div>
        </div>
        <p class="text-xs text-gray-500">
          {{ branchesStore.branches.find(b => b.id === currentUser?.branchId)?.name || 'الفرع غير محدد' }}
        </p>
      </div>

      <!-- Channels List -->
      <div class="flex-1 overflow-y-auto p-2 space-y-4">
        <!-- General Channel -->
        <div>
          <button 
            @click="activeChannel = null"
            :class="[
              'w-full flex items-center gap-3 p-2 rounded-lg transition-colors',
              !activeChannel ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-100 text-gray-700'
            ]"
          >
            <div class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
              <Store class="w-4 h-4" />
            </div>
            <span class="font-medium text-sm">القناة العامة</span>
          </button>
        </div>

        <!-- Users -->
        <div>
          <h4 class="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">الموظفين</h4>
          <div class="space-y-1">
            <button 
              v-for="user in usersStore.users.filter(u => u.id !== currentUser?.id)" 
              :key="user.id"
              @click="activeChannel = user"
              :class="[
                'w-full flex items-center gap-3 p-2 rounded-lg transition-colors',
                activeChannel?.id === user.id ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-100 text-gray-700'
              ]"
            >
              <div class="relative">
                <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium text-xs">
                  {{ user.name.charAt(0) }}
                </div>
                <div class="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full"></div>
              </div>
              <span class="font-medium text-sm truncate">{{ user.name }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat Area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <div class="p-4 border-b bg-white flex justify-between items-center shadow-sm z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full flex items-center justify-center" 
               :class="activeChannel ? 'bg-indigo-100 text-indigo-600' : 'bg-primary-100 text-primary-600'">
            <component :is="activeChannel ? User : Store" class="w-5 h-5" />
          </div>
          <div>
            <h2 class="font-bold text-gray-900">{{ activeChannel ? activeChannel.name : 'القناة العامة' }}</h2>
            <p class="text-xs text-gray-500">
              {{ activeChannel ? 'متصل' : 'متصل: جميع الفروع' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Messages Area -->
      <div class="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50" ref="messagesContainer">
        <div v-if="messages.length === 0" class="text-center text-gray-400 mt-10">
          لا توجد رسائل بعد
        </div>
        <div 
          v-for="msg in messages" 
          :key="msg.id"
          :class="[
            'flex flex-col max-w-[70%]',
            msg.senderId === currentUser?.id ? 'self-end items-end' : 'self-start items-start'
          ]"
        >
          <span class="text-xs text-gray-500 mb-1 px-1">
            {{ msg.senderId === currentUser?.id ? 'أنت' : msg.senderName }}
          </span>
          <div 
            :class="[
              'p-3 rounded-2xl shadow-sm text-sm break-words',
              msg.senderId === currentUser?.id 
                ? 'bg-primary-600 text-white rounded-tl-none' 
                : 'bg-white text-gray-800 rounded-tr-none'
            ]"
          >
            <div v-if="msg.type === 'audio'" class="flex items-center gap-2 min-w-[240px]">
                <audio controls :src="msg.mediaUrl" class="w-full h-8"></audio>
            </div>
            <span v-else>{{ msg.text }}</span>
          </div>
          <span class="text-[10px] text-gray-400 mt-1 px-1">
            {{ formatTime(msg.timestamp) }}
          </span>
        </div>
      </div>

      <!-- Input Area -->
      <div class="p-4 bg-white border-t">
        <!-- Recording UI -->
        <div v-if="isRecording" class="flex items-center gap-4 bg-red-50 p-2 rounded-full px-4 border border-red-100">
            <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span class="text-red-600 font-mono flex-1 text-left" dir="ltr">{{ formatDuration(recordingDuration) }}</span>
            
            <button @click="cancelRecording" class="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors" title="إلغاء">
            <Trash2 class="w-5 h-5" />
            </button>
            
            <button @click="stopAndSend" class="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors shadow-sm" title="إرسال">
            <Send class="w-5 h-5" />
            </button>
        </div>

        <form v-else @submit.prevent="send" class="flex gap-2">
          <input 
            v-model="newMessage"
            type="text" 
            placeholder="اكتب رسالتك هنا..."
            class="flex-1 px-4 py-2 border rounded-full focus:ring-2 focus:ring-primary-500 focus:outline-none bg-gray-50"
          >
          
          <button 
            v-if="!newMessage.trim()"
            type="button"
            @click="startRecording"
            class="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors hover:text-primary-600"
            title="تسجيل صوتي"
          >
            <Mic class="w-5 h-5" />
          </button>

          <button 
            v-else
            type="submit"
            :disabled="!newMessage.trim()"
            class="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            <Send class="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue';
import { Send, Store, User, Building, Mic, Trash2 } from 'lucide-vue-next';
import { chatService } from '../services/chat';
import { useAuthStore } from '../store/auth';
import { useUsersStore } from '../store/users';
import { useBranchesStore } from '../store/branches';
import { formatTime } from '../utils/date';

const authStore = useAuthStore();
const usersStore = useUsersStore();
const branchesStore = useBranchesStore();

const allMessages = chatService.getMessages();
const newMessage = ref('');
const messagesContainer = ref(null);
const activeChannel = ref(null); // null = General, object = specific user

// Voice Recording State
const isRecording = ref(false);
const recordingDuration = ref(0);
const mediaRecorder = ref(null);
const audioChunks = ref([]);
let timerInterval = null;

const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];
    
    mediaRecorder.value.ondataavailable = (event) => {
      audioChunks.value.push(event.data);
    };

    mediaRecorder.value.start();
    isRecording.value = true;
    recordingDuration.value = 0;
    
    timerInterval = setInterval(() => {
      recordingDuration.value++;
    }, 1000);
    
  } catch (error) {
    console.error('Error accessing microphone:', error);
    alert('لا يمكن الوصول إلى الميكروفون. الرجاء التحقق من الصلاحيات.');
  }
};

const stopAndSend = () => {
  if (!mediaRecorder.value) return;

  mediaRecorder.value.onstop = () => {
    const mimeType = mediaRecorder.value.mimeType || 'audio/webm';
    const audioBlob = new Blob(audioChunks.value, { type: mimeType });
    const reader = new FileReader();
    reader.readAsDataURL(audioBlob);
    reader.onloadend = () => {
      const base64Audio = reader.result;
      const recipientId = activeChannel.value ? activeChannel.value.id : null;
      chatService.sendMessage('رسالة صوتية', recipientId, 'audio', base64Audio);
    };
    
    cleanupRecording();
  };

  mediaRecorder.value.stop();
};

const cancelRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state !== 'inactive') {
    mediaRecorder.value.stop();
  }
  cleanupRecording();
};

const cleanupRecording = () => {
  isRecording.value = false;
  recordingDuration.value = 0;
  clearInterval(timerInterval);
  if (mediaRecorder.value) {
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
    mediaRecorder.value = null;
  }
  audioChunks.value = [];
};

const currentUser = computed(() => authStore.currentUser);

// Filter messages based on active channel
const messages = computed(() => {
  if (!activeChannel.value) {
    // General channel: show messages with no recipient
    return allMessages.value.filter(m => !m.recipientId);
  } else {
    // Private channel: show messages between current user and selected recipient
    return allMessages.value.filter(m => 
      (m.senderId === currentUser.value.id && m.recipientId === activeChannel.value.id) ||
      (m.senderId === activeChannel.value.id && m.recipientId === currentUser.value.id)
    );
  }
});

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(() => {
  if (currentUser.value) {
    chatService.init(currentUser.value);
    scrollToBottom();
  }
});

watch(messages, () => {
  nextTick(() => scrollToBottom());
}, { deep: true });

// Scroll when switching channels
watch(activeChannel, () => {
  nextTick(() => scrollToBottom());
});

const send = () => {
  if (!newMessage.value.trim()) return;
  
  const recipientId = activeChannel.value ? activeChannel.value.id : null;
  chatService.sendMessage(newMessage.value, recipientId);
  newMessage.value = '';
};
</script>
