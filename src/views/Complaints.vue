<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">الشكاوي والمقترحات</h1>
    </div>

    <!-- Tabs -->
    <div class="bg-white shadow rounded-lg p-2">
      <div class="flex space-x-2 space-x-reverse border-b">
        <button 
          @click="activeTab = 'complaint'"
          :class="['px-4 py-2 font-medium transition-colors border-b-2', activeTab === 'complaint' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
        >
          الشكاوي ({{ complaintsCount }})
        </button>
        <button 
          @click="activeTab = 'suggestion'"
          :class="['px-4 py-2 font-medium transition-colors border-b-2', activeTab === 'suggestion' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
        >
          المقترحات ({{ suggestionsCount }})
        </button>
      </div>
      
      <div class="p-4">
        <!-- List -->
        <div v-if="filteredItems.length === 0" class="text-center py-10 text-gray-500">
           لا توجد {{ activeTab === 'complaint' ? 'شكاوي' : 'مقترحات' }} حالياً
        </div>
        
        <div v-else class="space-y-4">
           <div v-for="item in filteredItems" :key="item.id" class="border rounded-xl p-4 hover:shadow-md transition-shadow bg-gray-50">
             <div class="flex justify-between items-start mb-2">
                <div>
                   <h3 class="font-bold text-lg text-gray-900">{{ item.subject }}</h3>
                   <div class="text-sm text-gray-500 flex items-center gap-2">
                      <span class="font-bold">{{ item.name }}</span>
                      <span v-if="item.phone" class="bg-gray-200 px-2 rounded text-xs">{{ item.phone }}</span>
                      <span v-if="item.email" class="bg-gray-200 px-2 rounded text-xs">{{ item.email }}</span>
                      <span class="text-xs text-gray-400"> • {{ new Date(item.createdAt).toLocaleString('ar-IQ') }}</span>
                   </div>
                </div>
                <span :class="['px-2 py-1 rounded text-xs font-bold', item.status === 'replied' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700']">
                   {{ item.status === 'replied' ? 'تم الرد' : 'قيد الانتظار' }}
                </span>
             </div>
             
             <p class="text-gray-700 whitespace-pre-line mb-4">{{ item.message }}</p>
             
             <!-- Replies -->
             <div v-if="item.replies && item.replies.length > 0" class="border-t pt-3 mt-3 space-y-2">
                <div v-for="reply in item.replies" :key="reply.id" class="bg-white p-3 rounded-lg border">
                   <p class="text-xs font-bold text-primary-600 mb-1">رد الإدارة ({{ reply.by }})</p>
                   <p class="text-sm">{{ reply.message }}</p>
                </div>
             </div>
             
             <!-- Action Buttons -->
             <div class="flex gap-2 mt-4 border-t pt-3">
                <!-- If Registered User -->
                <button 
                  v-if="item.userId !== 'guest'" 
                  @click="openReplyModal(item)"
                  class="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-bold"
                >
                   <MessageCircle class="w-4 h-4" />
                   رد داخل التطبيق
                </button>
                
                <!-- If Guest (WhatsApp) -->
                <a 
                  v-if="item.phone"
                  :href="getWhatsAppLink(item)"
                  target="_blank"
                  class="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm font-bold"
                >
                   <MessageCircle class="w-4 h-4" />
                   رد عبر واتساب
                </a>
                
                <!-- If Guest (Email) -->
                <a 
                  v-if="item.email"
                  :href="`mailto:${item.email}?subject=رد على: ${item.subject}`"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm font-bold"
                >
                   <Mail class="w-4 h-4" />
                   رد عبر البريد
                </a>
             </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Reply Modal -->
    <AppModal :isOpen="showReplyModal" @close="showReplyModal = false" title="الرد على الشكوى">
      <div class="space-y-4">
        <div>
           <label class="block text-sm font-medium text-gray-700 mb-1">الرد</label>
           <textarea v-model="replyText" rows="4" class="w-full border rounded-lg p-2 focus:ring-2 focus:ring-primary-500 outline-none"></textarea>
        </div>
        <div class="flex justify-end gap-2">
           <button @click="showReplyModal = false" class="px-4 py-2 border rounded-lg hover:bg-gray-50">إلغاء</button>
           <button @click="submitReply" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">إرسال</button>
        </div>
      </div>
    </AppModal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { MessageCircle, Mail } from 'lucide-vue-next'
import AppModal from '../components/common/AppModal.vue'
import { useAuthStore } from '../store/auth'
import api from '../services/api'

const authStore = useAuthStore()

const activeTab = ref('complaint')
const complaints = ref([])
const showReplyModal = ref(false)
const selectedComplaint = ref(null)
const replyText = ref('')

const fetchComplaints = async () => {
  try {
    const res = await api.get('/complaints')
    complaints.value = res.data
  } catch (error) {
    console.error('Failed to fetch complaints', error)
  }
}

onMounted(() => {
  fetchComplaints()
  // Poll every 30 seconds
  setInterval(fetchComplaints, 30000)
})

const filteredItems = computed(() => {
  return complaints.value.filter(c => c.type === activeTab.value).reverse()
})

const complaintsCount = computed(() => complaints.value.filter(c => c.type === 'complaint').length)
const suggestionsCount = computed(() => complaints.value.filter(c => c.type === 'suggestion').length)

const openReplyModal = (item) => {
  selectedComplaint.value = item
  replyText.value = ''
  showReplyModal.value = true
}

const submitReply = async () => {
  if (!replyText.value.trim()) return

  try {
    const res = await api.post(`/complaints/${selectedComplaint.value.id}/reply`, {
      message: replyText.value,
      by: authStore.currentUser?.name || 'Admin'
    })

    // Update local state
    const updated = res.data
    const idx = complaints.value.findIndex(c => c.id === selectedComplaint.value.id)
    if (idx !== -1) {
       complaints.value[idx] = updated.complaint
    }
    showReplyModal.value = false
  } catch (error) {
    alert('Failed to send reply')
  }
}

const getWhatsAppLink = (item) => {
  let phone = item.phone.replace(/\D/g, '') // remove non-digits
  if (phone.startsWith('07')) phone = '964' + phone.substring(1) // Iraq format
  const text = encodeURIComponent(`مرحباً ${item.name}، بخصوص رسالتك حول "${item.subject}"...`)
  return `https://wa.me/${phone}?text=${text}`
}
</script>