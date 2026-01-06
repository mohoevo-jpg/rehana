<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24 animate-fade-in transition-colors duration-300">
    <!-- Header -->
    <div class="bg-white dark:bg-gray-800 p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 dark:border-gray-700 flex items-center gap-3 transition-colors duration-300">
      <button @click="router.back()" class="p-2 -mr-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
        <ArrowRight class="w-6 h-6" />
      </button>
      <h2 class="text-xl font-bold text-gray-900 dark:text-white">الشكاوي والمقترحات</h2>
    </div>

    <div class="p-4 max-w-2xl mx-auto space-y-6">
      <!-- Submission Form -->
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 transition-colors duration-300">
        <p class="text-gray-500 dark:text-gray-400 mb-6 text-sm">
          نحن نقدر رأيك! يرجى إرسال أي شكاوى أو مقترحات أو استفسارات لديك. سنقوم بمراجعتها والرد عليك في أقرب وقت ممكن.
        </p>

        <form @submit.prevent="submitComplaint" class="space-y-6">
          
          <!-- Type (Complaint / Suggestion) -->
          <div class="grid grid-cols-2 gap-3 p-1 bg-gray-100 dark:bg-gray-700/50 rounded-xl">
            <button 
              type="button" 
              @click="form.type = 'complaint'"
              :class="[
                'py-3 rounded-lg text-sm font-bold transition-all',
                form.type === 'complaint' 
                  ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
              ]"
            >
              شكوى
            </button>
            <button 
              type="button" 
              @click="form.type = 'suggestion'"
              :class="[
                'py-3 rounded-lg text-sm font-bold transition-all',
                form.type === 'suggestion' 
                  ? 'bg-white dark:bg-gray-600 text-primary-600 shadow-sm' 
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
              ]"
            >
              اقتراح
            </button>
          </div>

          <!-- Subject -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">الموضوع</label>
            <div class="relative">
              <select v-model="form.subject" class="w-full p-4 pl-10 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors dark:text-white appearance-none">
                <option value="complaint">شكوى عامة</option>
                <option value="suggestion">اقتراح تحسين</option>
                <option value="inquiry">استفسار</option>
                <option value="other">أخرى</option>
              </select>
              <ChevronDown class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <!-- Guest Info (Only if not logged in) -->
          <div v-if="!authStore.isAuthenticated" class="space-y-4 animate-fade-in-up">
            <div class="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl border border-yellow-100 dark:border-yellow-800/30">
              <p class="text-xs text-yellow-700 dark:text-yellow-400 mb-3 font-bold">
                يرجى تزويدنا بمعلومات الاتصال لنتمكن من الرد عليك
              </p>
              
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">الاسم</label>
                  <input type="text" v-model="form.guestName" class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="اسمك الكريم">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">رقم الهاتف (اختياري)</label>
                  <input type="tel" v-model="form.guestPhone" class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="07xxxxxxxxx">
                </div>
                <div>
                  <label class="block text-xs font-bold text-gray-600 dark:text-gray-400 mb-1">البريد الإلكتروني (اختياري)</label>
                  <input type="email" v-model="form.guestEmail" class="w-full p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-sm" placeholder="email@example.com">
                </div>
              </div>
            </div>
          </div>

          <!-- Message -->
          <div class="space-y-2">
            <label class="block text-sm font-bold text-gray-700 dark:text-gray-300">الرسالة</label>
            <textarea 
              v-model="form.message" 
              rows="5"
              placeholder="اكتب رسالتك هنا..." 
              class="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-colors dark:text-white resize-none"
              required
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-primary-600 text-white p-4 rounded-xl font-bold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="isLoading" class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span v-else>إرسال</span>
            <Send v-if="!isLoading" class="w-5 h-5" />
          </button>
        </form>
      </div>

      <!-- Previous Complaints (Only for Logged In Users) -->
      <div v-if="authStore.isAuthenticated && myComplaints.length > 0" class="space-y-4">
         <h3 class="font-bold text-gray-900 dark:text-white px-2">سجل مراسلاتي</h3>
         <div v-for="item in myComplaints" :key="item.id" class="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700">
            <div class="flex justify-between items-start mb-3">
              <div>
                <span :class="[
                  'text-xs font-bold px-2 py-1 rounded-md mb-2 inline-block',
                  item.type === 'suggestion' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                ]">
                  {{ item.type === 'suggestion' ? 'اقتراح' : 'شكوى' }}
                </span>
                <h4 class="font-bold text-gray-900 dark:text-white text-sm">{{ item.subject }}</h4>
              </div>
              <span class="text-xs text-gray-400">{{ new Date(item.createdAt).toLocaleDateString('ar-IQ') }}</span>
            </div>
            
            <p class="text-gray-600 dark:text-gray-300 text-sm bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg mb-4">
              {{ item.message }}
            </p>

            <!-- Replies -->
            <div v-if="item.replies && item.replies.length > 0" class="space-y-3 mt-4 border-t pt-4 border-gray-100 dark:border-gray-700">
               <div v-for="reply in item.replies" :key="reply.id" class="flex gap-3">
                 <div class="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 flex-shrink-0">
                   <User class="w-4 h-4" />
                 </div>
                 <div class="flex-1">
                   <div class="bg-primary-50 dark:bg-primary-900/20 p-3 rounded-lg rounded-tr-none">
                     <p class="text-xs font-bold text-primary-700 dark:text-primary-300 mb-1">الإدارة</p>
                     <p class="text-gray-700 dark:text-gray-300 text-sm">{{ reply.message }}</p>
                   </div>
                   <span class="text-[10px] text-gray-400 mt-1 block px-1">{{ new Date(reply.createdAt).toLocaleString('ar-IQ') }}</span>
                 </div>
               </div>
            </div>
            <div v-else class="text-center py-2">
              <span class="text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">بانتظار الرد...</span>
            </div>
         </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, ChevronDown, Send, User } from 'lucide-vue-next'
import { useAuthStore } from '../store/auth'
import { useAppStore } from '../store/app'

const SERVER_URL = window.location.origin
// const SERVER_URL = 'http://localhost:3001'

const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const isLoading = ref(false)
const myComplaints = ref([])

const form = ref({
  type: 'complaint',
  subject: 'complaint',
  message: '',
  guestName: '',
  guestPhone: '',
  guestEmail: ''
})

const fetchMyComplaints = async () => {
  if (!authStore.isAuthenticated) return
  try {
    const res = await fetch(`${SERVER_URL}/api/complaints`) // In real app, this should be /api/my-complaints or filtered
    if (res.ok) {
      const all = await res.json()
      // Filter for current user only
      myComplaints.value = all.filter(c => c.userId === authStore.user.id).reverse()
    }
  } catch (error) {
    console.error('Failed to fetch complaints', error)
  }
}

onMounted(() => {
  fetchMyComplaints()
})

const submitComplaint = async () => {
  if (!form.value.message.trim()) return

  // Validation for Guest
  if (!authStore.isAuthenticated) {
    if (!form.value.guestName) {
      alert('يرجى إدخال الاسم')
      return
    }
    if (!form.value.guestPhone && !form.value.guestEmail) {
      alert('يرجى إدخال رقم الهاتف أو البريد الإلكتروني للتواصل')
      return
    }
  }

  isLoading.value = true
  try {
    const res = await fetch(`${SERVER_URL}/api/complaints`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: authStore.user?.id, // Will be undefined if guest, server handles it
        name: authStore.user?.name || form.value.guestName,
        phone: authStore.user?.phone || form.value.guestPhone,
        email: authStore.user?.email || form.value.guestEmail,
        subject: form.value.subject,
        message: form.value.message,
        type: form.value.type
      })
    })

    if (res.ok) {
      alert('تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.')
      // Reset form
      form.value.message = ''
      if (!authStore.isAuthenticated) {
        router.push('/')
      } else {
        fetchMyComplaints() // Refresh list
      }
    } else {
      alert('حدث خطأ أثناء الإرسال. يرجى المحاولة مرة أخرى.')
    }
  } catch (error) {
    console.error(error)
    alert('حدث خطأ في الاتصال')
  } finally {
    isLoading.value = false
  }
}
</script>
